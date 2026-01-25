import { IWidgetConfig } from '@/types';

/**
 * Export dashboard configuration as JSON file
 */
export function exportConfig(widgets: IWidgetConfig[]): void {
    const config = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        widgets,
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finboard-config-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Import dashboard configuration from JSON file
 */
export function importConfig(file: File): Promise<IWidgetConfig[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const config = JSON.parse(content);

                // Validate config structure
                if (!config.widgets || !Array.isArray(config.widgets)) {
                    throw new Error('Invalid configuration file format');
                }

                // Validate each widget
                config.widgets.forEach((widget: any, index: number) => {
                    if (!widget.id || !widget.name || !widget.apiUrl) {
                        throw new Error(`Invalid widget at index ${index}`);
                    }
                });

                resolve(config.widgets);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
    });
}
