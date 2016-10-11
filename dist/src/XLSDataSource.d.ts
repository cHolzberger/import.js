import { CSVDataSource } from "./CSVDataSource";
import { ImportPayload } from "./ImportPayload";
export interface XLSDataSourceOptions {
    hasHeadline: boolean;
}
export declare class XLSDataSource<T extends ImportPayload> extends CSVDataSource<T> {
    open(filename: string, options?: XLSDataSourceOptions): void;
}
