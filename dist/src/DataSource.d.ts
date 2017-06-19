import { ImportPayload } from "./ImportPayload";
export interface DataSourceColumnInfo {
    index: number;
    required?: boolean;
    converter?: (x: string) => any;
}
export interface DataSourceHeadlineColumnInfo {
    regex: RegExp;
    required?: boolean;
    index?: number;
    found?: boolean;
    converter?: (x: string) => any;
}
export interface constructorof<T> {
    new (): T;
}
export declare abstract class DataSource<T extends ImportPayload> {
    protected payloadClass: constructorof<T>;
    protected _dynamicFields: any;
    constructor(ctor: constructorof<T>);
    protected abstract readHeadlines(): void;
    generatePayload(): IterableIterator<ImportPayload>;
    abstract close(): void;
    /**
      gets the static and dynamic mappings for the fields in T
      **/
    readonly fields: any;
    protected allRequiredFound(): boolean;
    open(ds: string, options?: any): void;
    static indexColumn(info: DataSourceColumnInfo): (target: any, propertyKey: string) => void;
    static regexColumn(info: DataSourceHeadlineColumnInfo): (target: any, propertyKey: string) => void;
}
