interface Employee {
    firstName: string,
    lastName: string,
    status: 'full time' | 'hourly' | 'contractor',
    paymentHistory: number[]
};

export type ReportConfig = {
    extended: boolean,
    includeContractors: boolean
}

export type SourceTypes = 'employees' | 'config';

export interface DataReader {
    read(name: SourceTypes): Promise<string>
}

export interface OutputWriter {
    write(data: string): Promise<void>
}

export class Reporter {
    private employees: Employee[];

    constructor(
        private config: ReportConfig,
        private reader: DataReader,
        private writer: OutputWriter
    ) { }

    async load() {
        const data = await this.reader.read('employees');
        const employees = JSON.parse(data.toString()) as Employee[];
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