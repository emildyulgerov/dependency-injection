import { readFile, writeFile } from 'fs/promises';
import { Reporter, ReportConfig, DataReader, OutputWriter, SourceTypes } from './Reporter';


class FileReader implements DataReader {
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

class FileWriter implements OutputWriter {
    async write(data: string): Promise<void> {
        await writeFile('./report.txt', data);
    }
}

async function loadConfig(reader: DataReader) {
    const configData = await reader.read('config');
    const config = JSON.parse(configData.toString()) as ReportConfig;

    return config;
}

async function start() {
    const reader = new FileReader();
    const writer = new FileWriter();
    const config = await loadConfig(reader);

    const reporter = new Reporter(config, reader, writer);
    await reporter.load();
    await reporter.export();
    
    console.log('Finished');
}

start();