/// <reference types="node" />
import { ImportPayload } from "./ImportPayload";
export declare class DataSource {
    generatePayload(): IterableIterator<ImportPayload>;
    close(): void;
    open(ds: string, options?: any): void;
}
