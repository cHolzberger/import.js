/// <reference types="node" />
export interface WorkflowEventHandler<T> {
    startImport?(): void;
    finishImport?(data: T[]): void;
    preprocess?(data: T): Promise<T>;
    import?(data: T): Promise<T>;
    postprocess?(data: T): Promise<T>;
}
export declare abstract class LogEntry {
    reason: string;
}
export declare class SkipPayload extends LogEntry {
    reason: string;
    constructor(reason: string);
}
export declare class ImportWorkflow<T> {
    private handlers;
    private _log;
    on(handler: WorkflowEventHandler<T>): void;
    off(handler: WorkflowEventHandler<T>): void;
    readonly log: LogEntry[];
    run(gen: IterableIterator<T>): Promise<T[]>;
}
