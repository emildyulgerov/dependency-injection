import { Container } from './Container';
import { Reporter } from './Reporter';
import { FileReader, FileWriter, loadConfig } from './services';


const container = new Container();
let reporterFactory: () => Reporter;

async function init() {
    container.registerConstructor('reader', FileReader);
    container.registerConstructor('writer', FileWriter);
    container.registerInstance('config', await loadConfig(container.get('reader')));
    reporterFactory = container.decorate(Reporter, 'config', 'reader', 'writer');
}


async function start() {
    const reporter = reporterFactory();
    await reporter.load();
    await reporter.export();

    console.log('Finished');
}

init().then(start);