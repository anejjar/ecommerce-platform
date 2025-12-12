/**
 * Normalizes block configuration data to ensure repeater fields are always arrays
 * This prevents "value.map is not a function" errors when loading existing blocks
 */
export function normalizeBlockConfig(config: any, schema: any): any {
    if (!config || !schema) return config;

    const normalized = { ...config };
    const schemaFields = schema.fields || [];

    // Recursively normalize repeater fields
    const normalizeRepeaterField = (field: any, value: any): any => {
        if (field.type === 'repeater' && field.fields) {
            // Ensure value is an array
            const arrayValue = Array.isArray(value) ? value : (value ? [value] : []);
            
            // Normalize each item in the repeater
            return arrayValue.map((item: any) => {
                const normalizedItem: any = {};
                field.fields.forEach((subField: any) => {
                    if (subField.type === 'repeater') {
                        // Handle nested repeaters
                        normalizedItem[subField.name] = normalizeRepeaterField(
                            subField,
                            item[subField.name]
                        );
                    } else {
                        normalizedItem[subField.name] = item[subField.name] ?? (subField.default ?? '');
                    }
                });
                return normalizedItem;
            });
        }
        return value;
    };

    // Normalize all fields in the config
    schemaFields.forEach((field: any) => {
        if (field.type === 'repeater') {
            normalized[field.name] = normalizeRepeaterField(field, normalized[field.name]);
        }
    });

    return normalized;
}







