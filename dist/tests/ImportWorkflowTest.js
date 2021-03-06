"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
const ImportWorkflow_1 = require("../src/ImportWorkflow");
function* testGenerator() {
    yield "1";
    yield "2";
}
function* testGeneratorOneValue() {
    yield "1";
}
let CSVDataSourceTest = class CSVDataSourceTest {
    test_run_import() {
        var handler = { "import": (data) => { chai_1.expect(data).to.equal("1"); return Promise.resolve("new"); } };
        let worker = new ImportWorkflow_1.ImportWorkflow();
        worker.on(handler);
        worker.run(testGeneratorOneValue());
    }
    test_run_preprocess() {
        var handler = { "preprocess": (data) => { chai_1.expect(data).to.equal("1"); return Promise.resolve("new"); } };
        let worker = new ImportWorkflow_1.ImportWorkflow();
        worker.on(handler);
        worker.run(testGeneratorOneValue());
    }
    test_run_postprocess() {
        var handler = { "postprocess": (data) => { chai_1.expect(data).to.equal("1"); return Promise.resolve("new"); } };
        let worker = new ImportWorkflow_1.ImportWorkflow();
        worker.on(handler);
        worker.run(testGeneratorOneValue());
    }
    test_run_in_order() {
        var count = 0;
        var handler = {
            "preprocess": (data) => { chai_1.expect(count).to.equal(0); count++; return Promise.resolve("new"); },
            "import": (data) => { chai_1.expect(count).to.equal(1); count++; return Promise.resolve("new"); },
            "postprocess": (data) => { chai_1.expect(count).to.equal(2); return Promise.resolve("new"); }
        };
        let worker = new ImportWorkflow_1.ImportWorkflow();
        worker.on(handler);
        worker.run(testGeneratorOneValue());
    }
    test_change_data() {
        var count = 0;
        var handler = {
            "preprocess": (data) => { chai_1.expect(data).to.equal("1"); return Promise.resolve("preprocess"); },
            "import": (data) => { chai_1.expect(data).to.equal("preprocess"); return Promise.resolve("import"); },
            "postprocess": (data) => { chai_1.expect(data).to.equal("import"); return Promise.resolve("new"); }
        };
        let worker = new ImportWorkflow_1.ImportWorkflow();
        worker.on(handler);
        worker.run(testGeneratorOneValue());
    }
    test_times() {
        var count = 0;
        var handler = {
            "import": (data) => { count++; return Promise.resolve("whatever"); },
        };
        let worker = new ImportWorkflow_1.ImportWorkflow();
        worker.on(handler);
        worker.run(testGenerator()).then(() => {
            chai_1.expect(count).to.equal(2);
        });
    }
    test_start_import() {
        return __awaiter(this, void 0, void 0, function* () {
            var count = 0;
            var handler = {
                "startImport": () => { count++; return Promise.resolve(); },
            };
            let worker = new ImportWorkflow_1.ImportWorkflow();
            worker.on(handler);
            yield worker.run(testGenerator());
            chai_1.expect(count).to.equal(1);
        });
    }
    test_finish_import() {
        return __awaiter(this, void 0, void 0, function* () {
            var count = 0;
            var handler = {
                "finishImport": () => { count++; return Promise.resolve(); },
            };
            let worker = new ImportWorkflow_1.ImportWorkflow();
            worker.on(handler);
            yield worker.run(testGenerator());
            chai_1.expect(count).to.equal(1);
        });
    }
};
__decorate([
    mocha_typescript_1.test("should call import")
], CSVDataSourceTest.prototype, "test_run_import", null);
__decorate([
    mocha_typescript_1.test("should call preprocess")
], CSVDataSourceTest.prototype, "test_run_preprocess", null);
__decorate([
    mocha_typescript_1.test("should call postprocess")
], CSVDataSourceTest.prototype, "test_run_postprocess", null);
__decorate([
    mocha_typescript_1.test("should call preprocess, import, postprocess in the right order")
], CSVDataSourceTest.prototype, "test_run_in_order", null);
__decorate([
    mocha_typescript_1.test("should call change the data while running")
], CSVDataSourceTest.prototype, "test_change_data", null);
__decorate([
    mocha_typescript_1.test("should run 2 times for demo data")
], CSVDataSourceTest.prototype, "test_times", null);
__decorate([
    mocha_typescript_1.test("should call start prior to starting importing")
], CSVDataSourceTest.prototype, "test_start_import", null);
__decorate([
    mocha_typescript_1.test("should call finish after importing")
], CSVDataSourceTest.prototype, "test_finish_import", null);
CSVDataSourceTest = __decorate([
    mocha_typescript_1.suite("An ImportWorkflow")
], CSVDataSourceTest);
//# sourceMappingURL=ImportWorkflowTest.js.map