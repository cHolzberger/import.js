import { CSVDataSource } from "./CSVDataSource";
import { ImportPayload } from "./ImportPayload";
export interface XLSDataSourceOptions {
    hasHeadline: boolean;
    strictMode: boolean;
    delimiter?: string;
}
export declare class XLSDataSource<T extends ImportPayload> extends CSVDataSource<T> {
    open(filename: string, options?: XLSDataSourceOptions): void;
}
