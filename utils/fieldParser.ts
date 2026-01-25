import { IFieldNode } from '@/types';

/**
 * Recursively extract fields from JSON data
 */
export function extractFields(
    data: any,
    parentPath: string = '',
    parentLabel: string = ''
): IFieldNode[] {
    const fields: IFieldNode[] = [];

    if (data === null || data === undefined) {
        return fields;
    }

    if (Array.isArray(data)) {
        // Handle arrays
        if (data.length > 0) {
            const sampleItem = data[0];
            const arrayFields = extractFields(
                sampleItem,
                parentPath,
                parentLabel
            );
            return arrayFields.map((field) => ({
                ...field,
                isArray: true,
            }));
        }
        return [];
    }

    if (typeof data === 'object') {
        // Handle objects
        Object.keys(data).forEach((key) => {
            const value = data[key];
            const path = parentPath ? `${parentPath}.${key}` : key;
            const label = parentLabel ? `${parentLabel} > ${key}` : key;

            if (value === null || value === undefined) {
                fields.push({
                    path,
                    label,
                    value: null,
                    type: 'null',
                });
            } else if (Array.isArray(value)) {
                if (value.length > 0) {
                    const sampleItem = value[0];
                    if (typeof sampleItem === 'object' && sampleItem !== null) {
                        // Array of objects
                        const children = extractFields(sampleItem, path, label);
                        fields.push({
                            path,
                            label,
                            value: `Array[${value.length}]`,
                            type: 'array',
                            isArray: true,
                            children,
                        });
                    } else {
                        // Array of primitives
                        fields.push({
                            path,
                            label,
                            value: value,
                            type: 'array',
                            isArray: true,
                        });
                    }
                } else {
                    fields.push({
                        path,
                        label,
                        value: 'Array[0]',
                        type: 'array',
                        isArray: true,
                    });
                }
            } else if (typeof value === 'object') {
                // Nested object
                const children = extractFields(value, path, label);
                fields.push({
                    path,
                    label,
                    value: 'Object',
                    type: 'object',
                    children,
                });
            } else {
                // Primitive value
                fields.push({
                    path,
                    label,
                    value,
                    type: detectFieldType(value),
                });
            }
        });
    }

    return fields;
}

/**
 * Get value from nested object using dot notation path
 */
export function getFieldValue(data: any, path: string): any {
    const keys = path.split('.');
    let value = data;

    for (const key of keys) {
        if (value === null || value === undefined) {
            return undefined;
        }
        value = value[key];
    }

    return value;
}

/**
 * Auto-detect field type based on value
 */
export function detectFieldType(value: any): string {
    if (typeof value === 'number') {
        return 'number';
    }
    if (typeof value === 'boolean') {
        return 'boolean';
    }
    if (typeof value === 'string') {
        // Check if it's a date
        if (!isNaN(Date.parse(value)) && /^\d{4}-\d{2}-\d{2}/.test(value)) {
            return 'date';
        }
        // Check if it's a currency-like value
        if (/^\$?\d+\.?\d*$/.test(value)) {
            return 'currency';
        }
        // Check if it's a percentage
        if (/^\d+\.?\d*%$/.test(value)) {
            return 'percentage';
        }
        return 'string';
    }
    return 'unknown';
}

/**
 * Flatten field tree to get all leaf nodes
 */
export function flattenFields(fields: IFieldNode[]): IFieldNode[] {
    const result: IFieldNode[] = [];

    function traverse(nodes: IFieldNode[]) {
        nodes.forEach((node) => {
            if (node.children && node.children.length > 0) {
                traverse(node.children);
            } else {
                result.push(node);
            }
        });
    }

    traverse(fields);
    return result;
}

/**
 * Filter fields by search query
 */
export function filterFields(fields: IFieldNode[], query: string): IFieldNode[] {
    if (!query) return fields;

    const lowerQuery = query.toLowerCase();

    return fields.filter((field) => {
        const matchesLabel = field.label.toLowerCase().includes(lowerQuery);
        const matchesPath = field.path.toLowerCase().includes(lowerQuery);
        const hasMatchingChildren =
            field.children && filterFields(field.children, query).length > 0;

        return matchesLabel || matchesPath || hasMatchingChildren;
    });
}
