import * as Bottle from 'bottlejs';
import { Reporter } from './Reporter';
import { FileReader, FileWriter, loadConfig } from './services';


const bottle = new Bottle();

async function init() {
    bottle.service('reader', FileReader);
    bottle.service('writer', FileWriter);
    bottle.service('config', loadConfig, 'reader');
    bottle.factory('Reporter', async function (container) {
        const config = await container.config;
        const reader = container.reader;
        const writer = container.writer;

        return new Reporter(config, reader, writer);
    })
}


async function start() {
    const reporter: Reporter = await bottle.container.Reporter;
    await reporter.load();
    await reporter.export();

    console.log('Finished');
}

init().then(start);