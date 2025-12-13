const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PROJECT_ROOT = process.cwd();
const SCHEMA_PATH = path.join(PROJECT_ROOT, 'prisma', 'schema.prisma');
const MIGRATIONS_DIR = path.join(PROJECT_ROOT, 'prisma', 'migrations');
const BACKUP_DIR = path.join(PROJECT_ROOT, 'prisma', 'migrations_backup');
const LOG_FILE = path.join(PROJECT_ROOT, 'migration_debug.log');

// Initialize Log
fs.writeFileSync(LOG_FILE, 'Starting migration refactor...\n');
function log(msg) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

// Wrapper to fix scope and ensure restore
run();

function run() {
    let originalSchema = null;
    try {
        originalSchema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    } catch (e) {
        console.error('Could not read initial schema:', e);
        log('Could not read initial schema: ' + e.message);
        return;
    }

    try {
        executeRefactor(originalSchema);
    } catch (e) {
        log('Unhandled error in execution: ' + e.message);
        console.error('Unhandled error:', e);
    } finally {
        if (originalSchema) {
            log('Restoring schema to original state...');
            fs.writeFileSync(SCHEMA_PATH, originalSchema);
            try {
                log('Running prisma generate to verify restore...');
                execSync('npx prisma generate', {
                    cwd: PROJECT_ROOT,
                    stdio: 'pipe'
                });
                log('Prisma generate done.');
            } catch (e) {
                log('Prisma generate verify failed: ' + e.message);
                console.error('Prisma generate verify failed:', e.message);
            }
        }
    }
}

function executeRefactor(originalSchema) {
    log('Parsing schema...');
    const { header, enums, models } = parseSchema(originalSchema);
    log(`Found ${Object.keys(models).length} models and ${Object.keys(enums).length} enums.`);

    log('Building dependency graph...');
    const graph = buildDependencyGraph(models);

    log('Sorting models...');
    const sortedModelNames = topologicalSort(graph);
    log('Migration order: ' + sortedModelNames.join(', '));

    // Backup
    log('Checking existing migrations...');
    if (fs.existsSync(MIGRATIONS_DIR)) {
        log('Backing up migrations...');
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const specificBackup = path.join(BACKUP_DIR, `backup_${timestamp}`);
        fs.renameSync(MIGRATIONS_DIR, specificBackup);
        log(`Backed up to ${specificBackup}`);
    } else {
        log('No existing migrations directory found, skipping backup.');
    }

    // Reset DB
    log('Resetting database...');
    try {
        const resetSchema = header + '\n' + Object.values(enums).map(e => e.lines.join('\n')).join('\n\n');
        fs.writeFileSync(SCHEMA_PATH, resetSchema);

        log('Running prisma db push --force-reset...');
        const output = execSync('npx prisma db push --force-reset --skip-generate', {
            cwd: PROJECT_ROOT,
            stdio: 'pipe',
            env: { ...process.env, CI: 'true' }
        });
        log(output.toString());
        log('Database reset complete.');
    } catch (e) {
        log('Reset failed: ' + e.message);
        if (e.stdout) log('STDOUT: ' + e.stdout.toString());
        if (e.stderr) log('STDERR: ' + e.stderr.toString());
        throw e;
    }

    // Loop
    const total = sortedModelNames.length;
    for (let i = 0; i < total; i++) {
        const modelName = sortedModelNames[i];
        log(`[${i + 1}/${total}] Migrating table: ${modelName}`);

        const currentModels = sortedModelNames.slice(0, i + 1);
        const newSchemaContent = generateSchema(header, enums, models, currentModels);
        fs.writeFileSync(SCHEMA_PATH, newSchemaContent);

        try {
            const cmd = `npx prisma migrate dev --name create_${modelName.toLowerCase()}`;
            log(`Running: ${cmd}`);
            const output = execSync(cmd, {
                cwd: PROJECT_ROOT,
                env: { ...process.env, CI: 'true' },
                stdio: 'pipe'
            });
            log(output.toString());
        } catch (e) {
            log(`Migration failed for ${modelName}`);
            if (e.stdout) log('STDOUT block start:\n' + e.stdout.toString() + '\nSTDOUT block end');
            if (e.stderr) log('STDERR block start:\n' + e.stderr.toString() + '\nSTDERR block end');
            throw e;
        }
    }
    log('All migrations generated successfully.');
}

// --- Parsing Logic ---

function parseSchema(content) {
    const lines = content.split('\n');
    let enums = {};
    let models = {};
    let header = '';

    let buffer = [];
    let state = 'ROOT'; // ROOT, BLOCK
    let blockType = '';
    let blockName = '';

    for (const line of lines) {
        const trimmed = line.trim();

        // Strip comment for logic check
        let codePart = trimmed;
        // Naive comment stripping: assume // not in string
        const commentIdx = trimmed.indexOf('//');
        if (commentIdx >= 0) {
            codePart = trimmed.substring(0, commentIdx).trim();
        }

        const firstWord = codePart.split(/\s+/)[0];

        if (state === 'ROOT') {
            if (firstWord === 'model') {
                state = 'BLOCK';
                blockType = 'model';
                blockName = codePart.split(/\s+/)[1];
                buffer = [line];
            } else if (firstWord === 'enum') {
                state = 'BLOCK';
                blockType = 'enum';
                blockName = codePart.split(/\s+/)[1];
                buffer = [line];
            } else {
                header += line + '\n';
            }
        } else {
            // In BLOCK
            buffer.push(line);
            // Check for block end: exact match '}' in code part
            if (codePart === '}') {
                if (blockType === 'model') {
                    models[blockName] = { name: blockName, lines: buffer };
                } else {
                    enums[blockName] = { name: blockName, lines: buffer };
                }
                state = 'ROOT';
                buffer = [];
            }
        }
    }
    return { header, enums, models };
}


function buildDependencyGraph(models) {
    const graph = {};
    Object.keys(models).forEach(name => {
        graph[name] = new Set();
    });

    Object.values(models).forEach(model => {
        const name = model.name;
        const lines = model.lines;

        lines.forEach(line => {
            // Strip comments
            let trimmed = line.trim();
            const cIdx = trimmed.indexOf('//');
            if (cIdx >= 0) trimmed = trimmed.substring(0, cIdx).trim();

            // Look for @relation(..., fields: [...])
            if (trimmed.includes('@relation') && trimmed.includes('fields:')) {
                const parts = trimmed.split(/\s+/);
                if (parts.length >= 2) {
                    let targetModel = parts[1];
                    targetModel = targetModel.replace('?', '').replace('[]', '');

                    if (models[targetModel] && targetModel !== name) {
                        graph[name].add(targetModel);
                    }
                }
            }
        });
    });
    return graph;
}

function topologicalSort(graph) {
    const sorted = [];
    const visited = new Set();
    const temp = new Set();

    const visit = (node) => {
        if (temp.has(node)) {
            log(`Cycle detected involving ${node}. Loop broken.`); // Use log function if in scope? No, scope issue.
            console.warn(`Cycle detected involving ${node}. Loop broken.`);
            return;
        }
        if (visited.has(node)) return;

        temp.add(node);

        const deps = graph[node] || [];
        for (const dep of deps) {
            visit(dep);
        }

        temp.delete(node);
        visited.add(node);
        sorted.push(node);
    };

    Object.keys(graph).forEach(node => {
        if (!visited.has(node)) {
            visit(node);
        }
    });

    return sorted;
}


function generateSchema(header, enums, models, activeModelsList) {
    let content = header + '\n';

    // Add all enums (always safe)
    Object.values(enums).forEach(e => {
        content += e.lines.join('\n') + '\n\n';
    });

    // Add active models
    const activeSet = new Set(activeModelsList);

    activeModelsList.forEach(modelName => {
        const originalLines = models[modelName].lines;
        const filteredLines = originalLines.filter(line => {
            let trimmed = line.trim();
            const cIdx = trimmed.indexOf('//');
            if (cIdx >= 0) trimmed = trimmed.substring(0, cIdx).trim();

            if (trimmed === '' || trimmed === '}' || trimmed.startsWith('model ') || trimmed.startsWith('@@')) return true;

            // Regex to find field definition: name Type ...
            const parts = trimmed.split(/\s+/);
            if (parts.length < 2) return true; // Valid line?

            let type = parts[1];
            type = type.replace('?', '').replace('[]', '');

            // If type is a Model
            if (models[type]) {
                // Check if this model is active
                if (!activeSet.has(type)) {
                    // Dependency not yet in schema.
                    return false;
                }
            }
            return true;
        });

        content += filteredLines.join('\n') + '\n\n';
    });

    return content;
}
