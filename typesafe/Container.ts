interface Constructor<T> {
    new(...args: any[]): T
}

type ValueService = string | number | boolean | object;

type ServiceDescriptor<T> = {
    value: T,
    dependencies: Token<any>[]
}

// this exotic mapping is required, because apparently mapping tuples includes _all_ array props,
// but simply doesn't show them; this means the array props will be boxed as well, which makes
// the compiler think this is no longer an array
type MapToToken<T> = {
    [K in keyof T]: K extends keyof [] ? T[K] : Token<T[K]>
};

type MapConstructorDependencies<T extends Constructor<any>> = MapToToken<ConstructorParameters<T>>;
type MapFunctionDependencies<T extends (...args: any[]) => any> = MapToToken<Parameters<T>>;


export type Token<T> = {
    key: string,
    type: T
}

export class Container {
    private services: Map<Token<any>, ServiceDescriptor<any>> = new Map();

    static token<T>(key: string): Token<T> {
        return {
            key,
            type: {} as T
        }
    }

    service<F extends (...args: any[]) => any>(token: Token<F>, fn: F, ...dependencies: MapFunctionDependencies<F>)
    service<T extends ValueService>(token: Token<T>, value: T)
    service<T, C extends Constructor<T>>(token: Token<T>, ctor: C, ...dependencies: MapConstructorDependencies<C>)
    service<T, C extends Constructor<T>>(token: Token<T>, ValueOrCtor: T | C, ...dependencies: Token<any>[]) {
        this.services.set(token, {
            value: ValueOrCtor,
            dependencies
        });
    }

    get<T>(token: Token<T>): T {
        const descriptor = this.services.get(token);
        if (descriptor !== undefined) {
            const service = descriptor.value;
            // check if service is callable, if yes -> recursively map it's dependencies
            if (typeof service == 'function') {
                const deps = descriptor.dependencies;
                const resolved: any[] = [];
                for (let dep of deps) {
                    resolved.push(this.get(dep))
                }
                try {
                    // This will throw a TypeError if service is a class; we use it to transition into instantiating it
                    return service(...resolved);
                } catch (error) {
                    if (error instanceof TypeError && error.message.includes('constructor')) {
                        return new service(...resolved);
                    } else {
                        throw error;
                    }
                }

            } else {
                return service;
            }
        }
        throw new TypeError(`Service ${token.key} is not supported`);
    }
}
