type Constructor<T> =  new (...params: any[]) => T;


export class Container {
    private constructors: Map<string, Constructor<any>> = new Map();
    private instances: Map<string, any> = new Map();

    registerConstructor<T extends Constructor<any>>(token: string, ref: T) {
        this.constructors.set(token, ref);
    }

    registerInstance<T>(token: string, ref: T) {
        this.instances.set(token, ref);
    }

    get<T>(token: string): T {
        const constructor = this.constructors.get(token);
        if (constructor) {
            return new constructor() as T;
        }
        const instance = this.instances.get(token);
        if (instance) {
            return instance as T;
        }
        throw new TypeError(`Service ${token} not registered`);
    }

    decorate<T>(dependant: Constructor<T>, ...tokens: string[]) {
        const loader = this.get.bind(this);
        return function(): T {
            return new dependant(...tokens.map(t => loader(t)));
        }
    }
}

