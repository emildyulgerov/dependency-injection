type Constructor<T> = new (...args: any[]) => T;

type ConsumerDescriptor<T> = {
    consumer: Constructor<T>,
    dependencies: Token<any>[]
};

export type Token<T> = {
    key: string,
    type: T
};


export class Container {
    private services: Map<Token<any>, any> = new Map();
    private constructors: Map<Token<any>, Constructor<any>> = new Map();
    private values: Map<Token<any>, any> = new Map();
    private consumers: Map<Token<any>, ConsumerDescriptor<any>> = new Map();


    registerService<T>(token: Token<T>, service: any) {
        this.services.set(token, service);
    }

    registerConstructor<T>(token: Token<T>, ctor: Constructor<T>) {
        this.constructors.set(token, ctor);
    }

    registerValue<T>(token: Token<T>, value: T) {
        this.values.set(token, value);
    }

    get<T>(token: Token<T>): T {
        const ctor = this.constructors.get(token);
        if (typeof ctor == 'function') {
            return new ctor() as T;
        }
        const service = this.services.get(token);
        if (typeof service == 'function') {
            return service() as T;
        }
        if (this.values.has(token)) {
            return this.values.get(token) as T;
        }
        throw new TypeError(`Service ${token} is not supported`);
    }

    registerConsumer<T>(token: Token<T>, consumer: Constructor<T>, ...dependencies: Token<any>[]) {
        this.consumers.set(token, {
            consumer,
            dependencies
        });
    }

    getConsumer<T>(token: Token<T>): T {
        const consumer = this.consumers.get(token);
        if (consumer && typeof consumer.consumer == 'function') {
            const ctor = consumer.consumer;
            const dependencies = consumer.dependencies.map(d => this.get(d));

            return new ctor(...dependencies) as T;
        } else {
            throw new TypeError(`Consumer ${token} is not supported`);
        }
    }

    token<T>(key: string): Token<T> {
        return {
            key,
            type: {} as T
        };
    }
}