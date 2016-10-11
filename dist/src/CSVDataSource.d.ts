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
}
export interface CSVDataSourceColumnInfo {
    index: number;
    required?: boolean;
}
export interface CSVDataSourceHeadlineColumnInfo {
    regex: RegExp;
    required?: boolean;
    index?: number;
    found?: boolean;
}
export declare class CSVDataSource<T extends ImportPayload> extends DataSource {
    protected filename: string;
    private payloadClass;
    protected content: Buffer;
    protected options: any;
    private parsed;
    constructor(ctor: constructorof<T>);
    open(filename: string, options?: CSVDataSourceOptions): void;
    protected parseCsv(): void;
    generatePayload(): IterableIterator<T>;
    readonly fields: any;
    static indexColumn(info: CSVDataSourceColumnInfo): (target: any, propertyKey: string) => void;
    static regexColumn(info: CSVDataSourceHeadlineColumnInfo): (target: any, propertyKey: string) => void;
}
