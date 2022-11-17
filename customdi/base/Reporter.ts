import { writeFile, readFile } from 'fs/promises';


interface Employee {
    firstName: string,
    lastName: string,
    status: 'full time' | 'hourly' | 'contractor',
    paymentHistory: number[]
};

export class Reporter {
    private employees: Employee[];
    private extended: boolean;
    private includeContractors: boolean;

    constructor(
    ) { }

    async load() {
        const configData = await readFile('./config.json');
        const config = JSON.parse(configData.toString());
        this.extended = config.extended;
        this.includeContractors = config.includeContractors;
        
        const data = await readFile('./employees.json');
        const employees = JSON.parse(data.toString()) as Employee[];
        this.employees = employees.filter(e => this.includeContractors || e.status != 'contractor')
    }

    async export() {
        const report = this.parse();
        await writeFile('./report.txt', report);
    }

    private parse() {
        const report = this.employees
            .map(e => {
                let result = `${e.firstName} ${e.lastName}`;
                if (this.extended) {
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