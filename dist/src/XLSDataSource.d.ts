import { DataSource } from "./DataSource";
import { ImportPayload } from "./ImportPayload";
export interface XLSDataSourceOptions {
    hasHeadline: boolean;
    strictMode: boolean;
    delimiter?: string;
}
export declare class XLSDataSource<T extends ImportPayload> extends DataSource<T> {
    private filename;
    private workbook;
    private options;
    private _getRow(r);
    protected readHeadlines(): void;
    open(filename: string, options?: XLSDataSourceOptions): void;
    generatePayload(): IterableIterator<T>;
    close(): void;
}
