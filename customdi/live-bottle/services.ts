import { readFile, writeFile } from 'fs/promises';
import { Employee } from './Employee';

export type ReporterConfig = {
    extended: boolean,
    includeContractors: boolean
}

export type ResourceType = 'employees' | 'config';

export interface DataReader {
    read(resourceName: 'employees'): Promise<Employee[]>;
    read(resourceName: 'config'): Promise<ReporterConfig>;
    read(resourceName: ResourceType): Promise<Employee[] | ReporterConfig>;
}

export interface DataWriter {
    write(data: string): Promise<void>;
}

export class FileReader implements DataReader {
    async read(resourceName: 'employees'): Promise<Employee[]>
    async read(resourceName: 'config'): Promise<ReporterConfig>
    async read(resourceName: ResourceType): Promise<Employee[] | ReporterConfig> {
        switch (resourceName) {
            case 'config':
                const configData = await readFile('./config.json');
                const config = JSON.parse(configData.toString());
                return config as ReporterConfig;
            case 'employees':
                const data = await readFile('./employees.json');
                const employees = JSON.parse(data.toString());
                return employees as Employee[];
            default:
                throw new TypeError(`Resouce ${resourceName} is not supported`);
        }
    }
}

export class FileWriter implements DataWriter {
    async write(data: string): Promise<void> {
        await writeFile(`./report_${Date.now()}.txt`, data);
    }
}

export async function loadConfig(reader: DataReader) {
    return await reader.read('config');
}