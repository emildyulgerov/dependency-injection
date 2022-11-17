import { Reporter } from './Reporter';


async function start() {
    const reporter = new Reporter();
    await reporter.load()
    await reporter.export();

    console.log('Finished');
}

start();