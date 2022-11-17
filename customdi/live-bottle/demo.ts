import * as Bottle from 'bottlejs';


class Logger {
    log(msg: string) {
        console.log(msg);
    }
}

class Reporter {
    constructor(private logger: Logger) { }

    greet() {
        this.logger.log('hello from consumer!');
    }
}

const bottle = new Bottle();

bottle.service('Logger', Logger);
bottle.service('Reporter', Reporter, 'Logger');

const reporter = bottle.container.Reporter as Reporter;

reporter.greet();