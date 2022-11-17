type Constructor<T> =  new (...params: any[]) => T;
type Token<T> = {
    key: string,
    value: T
}



export class Container {
    private constructors: Map<Token<any>, Constructor<any>> = new Map();
    private instances: Map<Token<any>, any> = new Map();

    registerConstructor<T extends Constructor<V>, V>(token: Token<V>, ref: T) {
        this.constructors.set(token, ref);
    }

    registerInstance<T>(token: Token<T>, ref: T) {
        this.instances.set(token, ref);
    }

    get<T>(token: Token<T>): T {
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

    decorate<T>(dependant: Constructor<T>, ...tokens: Token<any>[]) {
        const loader: <T>(token: Token<T>) => T = this.get.bind(this);
        return function(): T {
            return new dependant(...tokens.map(t => loader(t)));
        }
    }

    token<T>(key: string): Token<T> {
        return {
            key,
            value: {} as T
        }
    }
}

