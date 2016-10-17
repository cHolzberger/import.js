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
    preprocess?(data: T): Promise<T>;
    import?(data: T): Promise<T>;
    postprocess?(data: T): Promise<T>;
}

export abstract class LogEntry {
    reason: string;
}

export class SkipPayload extends LogEntry {
    reason: string;
    constructor(reason: string) {
        super();
        this.reason = reason;
    }
}



export class ImportWorkflow<T> {
    private handlers: WorkflowEventHandler<T>[] = [];
    private _log: LogEntry[] = [];

    public on(handler: WorkflowEventHandler<T>) {
        this.handlers.push(handler);
    }

    public off(handler: WorkflowEventHandler<T>) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public get log(): LogEntry[] {
        return this._log;
    }

    public async run(gen: IterableIterator<T>): Promise<T[]> {
        var results: T[] = [];
        while (true) {
            var value = gen.next();
            var i = 0;
            if (value.done) {
                break;
            }

            var payload: T = value.value;
            try {
                // preprocess
                for (i = 0; i < this.handlers.length; i++) {
                    let handler = this.handlers[i];
                    payload = handler.preprocess ? await handler.preprocess(payload) : payload;
                }


                // import
                for (i = 0; i < this.handlers.length; i++) {
                    let handler = this.handlers[i];

                    payload = handler.import ? await handler.import(payload) : payload;
                }

                // postprocess
                for (i = 0; i < this.handlers.length; i++) {
                    let handler = this.handlers[i];

                    payload = handler.postprocess ? await handler.postprocess(payload) : payload;
                }
                results.push(payload);
            } catch (e) {
                if (e instanceof LogEntry) {
                    console.info("Skipped a payload: " + e.reason);
                    this._log.push(e);
                } else {
                    throw e;
                }
            }

        }
        return results;
    }
}
