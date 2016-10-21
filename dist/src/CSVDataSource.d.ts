/// <reference types="node" />
/**
 Importer for CSV Files
 */
import { DataSource } from "./DataSource";
import { ImportPayload } from "./ImportPayload";
export interface constructorof<T> {
    new (): T;
}
export interface CSVDataSourceOptions {
    delimiter: string;
    hasHeadline: boolean;
    strictMode: boolean;
}
export interface CSVDataSourceColumnInfo {
    index: number;
    required?: boolean;
    converter?: (x: string) => any;
}
export interface CSVDataSourceHeadlineColumnInfo {
    regex: RegExp;
    required?: boolean;
    index?: number;
    found?: boolean;
    converter?: (x: string) => any;
}
export declare class CSVDataSource<T extends ImportPayload> extends DataSource {
    protected filename: string;
    private payloadClass;
    protected content: Buffer;
    protected options: any;
    private parsed;
    private _dynamicFields;
    constructor(ctor: constructorof<T>);
    open(filename: string, options?: CSVDataSourceOptions): void;
    protected parseCsv(): void;
    private allRequiredFound();
    generatePayload(): IterableIterator<T>;
    readonly fields: any;
    static indexColumn(info: CSVDataSourceColumnInfo): (target: any, propertyKey: string) => void;
    static regexColumn(info: CSVDataSourceHeadlineColumnInfo): (target: any, propertyKey: string) => void;
}
