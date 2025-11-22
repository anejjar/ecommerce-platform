const fs = require('fs');
const path = require('path');

const frPath = path.join(__dirname, 'messages/fr.json');

try {
    const content = fs.readFileSync(frPath, 'utf8');
    JSON.parse(content);
    console.log('Valid JSON');
} catch (error) {
    console.error('Invalid JSON:', error.message);
}
