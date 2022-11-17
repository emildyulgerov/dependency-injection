export interface Employee {
    firstName: string,
    lastName: string,
    status: 'full time' | 'hourly' | 'contractor',
    paymentHistory: number[]
};