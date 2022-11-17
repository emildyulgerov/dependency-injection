import { Container } from './Container';
import { DataReader, OutputWriter, ReportConfig, Reporter } from './Reporter';
import { FileReader, FileWriter, loadConfig } from './services';


const container = new Container();
let reporterFactory: () => Reporter;

async function init() {
    const readerToken = container.token<DataReader>('reader');
    const writerToken = container.token<OutputWriter>('writer');
    const configToken = container.token<ReportConfig>('config');
    container.registerConstructor(readerToken, FileReader);
    container.registerConstructor(writerToken, FileWriter);
    container.registerInstance(configToken, await loadConfig(container.get(readerToken)));
    reporterFactory = container.decorate(Reporter, configToken, readerToken, writerToken);
}


async function start() {
    const reporter = reporterFactory();
    await reporter.load();
    await reporter.export();

    console.log('Finished');
}

init().then(start);