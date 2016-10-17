/// <reference types="node" />
export interface WorkflowEventHandler<T> {
    preprocess?(data: T): Promise<T>;
    import?(data: T): Promise<T>;
    postprocess?(data: T): Promise<T>;
}
export declare class SkipPayload {
    reason: string;
    constructor(reason: string);
}
export declare class ImportWorkflow<T> {
    private handlers;
    on(handler: WorkflowEventHandler<T>): void;
    off(handler: WorkflowEventHandler<T>): void;
    run(gen: IterableIterator<T>): Promise<T[]>;
}
