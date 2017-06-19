/// <reference types="node" />
/**
 Importer for CSV Files
 */
import { DataSource, constructorof } from "./DataSource";
import { ImportPayload } from "./ImportPayload";
export interface CSVDataSourceOptions {
    delimiter: string;
    hasHeadline: boolean;
    strictMode: boolean;
}
export declare class CSVDataSource<T extends ImportPayload> extends DataSource<T> {
    protected filename: string;
    protected content: Buffer;
    protected options: any;
    private parsed;
    constructor(ctor: constructorof<T>);
    open(filename: string, options?: CSVDataSourceOptions): void;
    close(): void;
    protected readHeadlines(): void;
    protected parseCsv(): void;
    generatePayload(): IterableIterator<T>;
}
