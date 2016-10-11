/// <reference types="node" />
declare module "src/ImportPayload" {
    /**
     * generic payload for importer
     */
    export abstract class ImportPayload {
        static setField(name: string, key: string, value: any): any;
        static addField(name: string): void;
        static getFields(): any;
    }
}
declare module "src/DataSource" {
    import { ImportPayload } from "src/ImportPayload";
    export class DataSource {
        generatePayload(): IterableIterator<ImportPayload>;
        close(): void;
        open(ds: string, options?: any): void;
    }
}
declare module "src/CSVDataSource" {
    /**
     Importer for CSV Files
     */
    import { DataSource } from "src/DataSource";
    import { ImportPayload } from "src/ImportPayload";
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
    export class CSVDataSource<T extends ImportPayload> extends DataSource {
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
}
declare module "src/ImportWorkflow" {
    export interface WorkflowEventHandler<T> {
        preprocess?(data: T): Promise<T>;
        import?(data: T): Promise<T>;
        postprocess?(data: T): Promise<T>;
    }
    export class ImportWorkflow<T> {
        private handlers;
        on(handler: WorkflowEventHandler<T>): void;
        off(handler: WorkflowEventHandler<T>): void;
        run(gen: IterableIterator<T>): Promise<T[]>;
    }
}
declare module "src/XLSDataSource" {
    import { CSVDataSource } from "src/CSVDataSource";
    import { ImportPayload } from "src/ImportPayload";
    export interface XLSDataSourceOptions {
        hasHeadline: boolean;
    }
    export class XLSDataSource<T extends ImportPayload> extends CSVDataSource<T> {
        open(filename: string, options?: XLSDataSourceOptions): void;
    }
}
declare module "tests/CSVDataSourceTest" {
}
declare module "tests/ImportWorkflowTest" {
}
declare module "tests/IntegrationTest" {
}
declare module "tests/XLSDataSourceTest" {
}
