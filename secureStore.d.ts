export declare class SecureStore {
    private readonly serviceName;
    private readonly identifier;
    private static keytar;
    constructor(serviceName: string, identifier: string);
    set(value: string): Promise<void>;
    unset(): Promise<boolean>;
    get(): Promise<string | null>;
    static set(serviceName: string, identifier: string, value: string): Promise<void>;
    static unset(serviceName: string, identifier: string): Promise<boolean>;
    static get(serviceName: string, identifier: string): Promise<string | null>;
}
