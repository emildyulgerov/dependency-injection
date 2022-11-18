import { Container, Token } from './Container';
import { Reporter } from './Reporter';
import { DataReader, DataWriter, FileReader, FileWriter, loadConfig, ReporterConfig } from './services';


const container = new Container();
let reporterToken: Token<Reporter> = Container.token('reporter');

async function init() {
    const readerToken = Container.token<DataReader>('reader');
    const writerToken = Container.token<DataWriter>('writer');
    const configToken = Container.token<ReporterConfig>('config');

    container.service(readerToken, FileReader);
    container.service(writerToken, FileWriter);
    container.service(configToken, await loadConfig(container.get(readerToken)));
    container.service(reporterToken, Reporter, configToken, readerToken, writerToken);
}

async function start() {
    const reporter = container.get(reporterToken);
    await reporter.load();
    await reporter.export();

    console.log('Finished');
}

init().then(start);