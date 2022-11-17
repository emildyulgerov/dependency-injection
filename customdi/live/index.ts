import { Container, Token } from './Container';
import { Reporter } from './Reporter';
import { DataReader, DataWriter, FileReader, FileWriter, loadConfig, ReporterConfig } from './services';


const container = new Container();
let reporterToken: Token<Reporter> = null;

async function init() {
    const readerToken = container.token<DataReader>('reader');
    const writerToken = container.token<DataWriter>('writer');
    const configToken = container.token<ReporterConfig>('config');
    reporterToken = container.token<Reporter>('reporter');

    container.registerConstructor(readerToken, FileReader);
    container.registerConstructor(writerToken, FileWriter);
    container.registerValue(configToken, await loadConfig(container.get(readerToken)));
    container.registerConsumer(reporterToken, Reporter, configToken, readerToken, writerToken);
}

async function start() {
    const reporter = container.getConsumer(reporterToken);
    await reporter.load();
    await reporter.export();

    console.log('Finished');
}

init().then(start);