import * as Bottle from 'bottlejs';
import { Reporter } from './Reporter';
import { DataReader, DataWriter, FileReader, FileWriter, loadConfig, ReporterConfig } from './services';


const bottle = new Bottle();

async function init() {
    bottle.service('Reader', FileReader);
    bottle.service('Writer', FileWriter);

    const config = await loadConfig(bottle.container.Reader);

    
    bottle.decorator('config', function(service) {
        console.log('inside decorator');
        service.extended = false;
        return service;
    });

    const writer = new FileWriter();
    bottle.constant('MyWriter', writer);

    bottle.constant('config', config);

    bottle.service('Reporter', Reporter, 'config', 'Reader', 'Writer');
}

async function start() {
    const reporter = await bottle.container.Reporter;
    await reporter.load();
    await reporter.export();

    console.log('Finished');
}

init().then(start);