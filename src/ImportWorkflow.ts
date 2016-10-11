/**
 * Main Import Workflow
 *
 * -> Data injected
 * 1. preprocess Data
 * 3. Import Data
 * 4. postprocess Data
 * <- import done
 */
import {ImportPayload} from "./ImportPayload";

export interface WorkflowEventHandler<T> {
    preprocess?(data: T): T;
    import?(data: T): T;
    postprocess?(data: T): T;
}

export class ImportWorkflow<T>  {
    private handlers: WorkflowEventHandler<T>[] = [];

    public on(handler: WorkflowEventHandler<T>) {
        this.handlers.push(handler);
    }

    public off(handler: WorkflowEventHandler<T>) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public run(gen: IterableIterator<T>) {
        while (true) {
            var value = gen.next();
            if (value.done) {
              break;
            }

            var payload: ImportPayload = value.value;
            // preprocess
            payload = this.handlers.reduce((value: T, handler: WorkflowEventHandler<T>): ImportPayload => {
                return handler.preprocess ? handler.preprocess(value) : value;
            }, payload);

            // import
            payload = this.handlers.reduce((value: T, handler: WorkflowEventHandler<T>): ImportPayload => {
                return handler.import ? handler.import(value) : value;
            }, payload);

            // postprocess
            payload = this.handlers.reduce((value: T, handler: WorkflowEventHandler<T>): ImportPayload => {
                return handler.postprocess ? handler.postprocess(value) : value;
            }, payload);
         }
    }
}
