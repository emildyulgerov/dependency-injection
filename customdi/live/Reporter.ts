import { ReporterConfig, DataReader, DataWriter } from './services';
import { Employee } from './Employee';


export class Reporter {
    private employees: Employee[];


    constructor(
        private config: ReporterConfig,
        private reader: DataReader,
        private writer: DataWriter
    ) { }

    async load() {
        const employees = await this.reader.read('employees');
        this.employees = employees.filter(e => this.config.includeContractors || e.status != 'contractor')
    }

    async export() {
        const report = this.parse();
        await this.writer.write(report);
    }

    private parse() {
        const report = this.employees
            .map(e => {
                let result = `${e.firstName} ${e.lastName}`;
                if (this.config.extended) {
                    result += ` (${e.status})\n`;
                    result += e.paymentHistory.map(p => ' - ' + p).join('\n');
                } else {
                    result += ' - ';
                    result += e.paymentHistory.reduce((a, c) => a + c, 0);
                }
                return result;
            })
            .join('\n');

        return report;
    }
}