import { container } from './container';
import { Reporter } from './Reporter';


async function start() {
    const reporter = new Reporter(await container.loadConfig(), container.reader, container.writer);
    await reporter.load();
    await reporter.export();
    
    console.log('Finished');
}

start();