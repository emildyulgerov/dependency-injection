import { readFile, writeFile } from 'fs/promises';
import { DataReader, OutputWriter, ReportConfig, SourceTypes } from "./Reporter";

export class FileReader implements DataReader {
    async read(name: SourceTypes): Promise<string> {
        switch (name) {
            case 'employees':
                return (await readFile('./employees.json')).toString();
            case 'config':
                return (await readFile('./config.json')).toString();
            default:
                throw new TypeError('Unsupported source');
        }
    }
}

export class FileWriter implements OutputWriter {
    async write(data: string): Promise<void> {
        await writeFile('./report.txt', data);
    }
}

export async function loadConfig(reader: DataReader) {
    const configData = await reader.read('config');
    const config = JSON.parse(configData.toString()) as ReportConfig;

    return config;
}