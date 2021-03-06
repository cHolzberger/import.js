"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class LogEntry {
}
exports.LogEntry = LogEntry;
class SkipPayload extends LogEntry {
    constructor(reason) {
        super();
        this.reason = reason;
    }
}
exports.SkipPayload = SkipPayload;
class ImportWorkflow {
    constructor() {
        this.handlers = [];
        this._log = [];
    }
    on(handler) {
        this.handlers.push(handler);
    }
    off(handler) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }
    get log() {
        return this._log;
    }
    run(gen) {
        return __awaiter(this, void 0, void 0, function* () {
            var results = [];
            for (i = 0; i < this.handlers.length; i++) {
                let handler = this.handlers[i];
                handler.startImport ? yield handler.startImport() : false;
            }
            while (true) {
                var value = gen.next();
                var i = 0;
                if (value.done) {
                    break;
                }
                var payload = value.value;
                try {
                    // preprocess
                    for (i = 0; i < this.handlers.length; i++) {
                        let handler = this.handlers[i];
                        payload = handler.preprocess ? yield handler.preprocess(payload) : payload;
                    }
                    // import
                    for (i = 0; i < this.handlers.length; i++) {
                        let handler = this.handlers[i];
                        payload = handler.import ? yield handler.import(payload) : payload;
                    }
                    // postprocess
                    for (i = 0; i < this.handlers.length; i++) {
                        let handler = this.handlers[i];
                        payload = handler.postprocess ? yield handler.postprocess(payload) : payload;
                    }
                    results.push(payload);
                }
                catch (e) {
                    if (e instanceof LogEntry) {
                        console.info("Skipped a payload: " + e.reason);
                        this._log.push(e);
                    }
                    else {
                        console.log("Fatal error");
                        console.dir(e);
                        throw (e);
                    }
                }
            }
            for (i = 0; i < this.handlers.length; i++) {
                let handler = this.handlers[i];
                handler.finishImport ? yield handler.finishImport(results) : false;
            }
            return results;
        });
    }
}
exports.ImportWorkflow = ImportWorkflow;
//# sourceMappingURL=ImportWorkflow.js.map