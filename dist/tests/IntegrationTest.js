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
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require('chai');
const ImportWorkflow_1 = require("../src/ImportWorkflow");
const CSVDataSource_1 = require("../src/CSVDataSource");
const ImportPayload_1 = require("../src/ImportPayload");
class CSVCols extends ImportPayload_1.ImportPayload {
}
__decorate([
    CSVDataSource_1.CSVDataSource.indexColumn({ index: 0 })
], CSVCols.prototype, "spalte_a", void 0);
__decorate([
    CSVDataSource_1.CSVDataSource.indexColumn({ index: 1 })
], CSVCols.prototype, "spalte_b", void 0);
__decorate([
    CSVDataSource_1.CSVDataSource.indexColumn({ index: 2 })
], CSVCols.prototype, "spalte_c", void 0);
let CSVDataSourceTest = class CSVDataSourceTest {
    test_integration() {
        return __awaiter(this, void 0, void 0, function* () {
            let importer = new CSVDataSource_1.CSVDataSource(CSVCols);
            importer.open("tests/CSVImporterTestMean.csv");
            let gen = importer.generatePayload();
            var handler = {
                "import": (data) => {
                    chai_1.expect(data.spalte_a).to.equal("a");
                    data.spalte_a = "new value";
                    return Promise.resolve(data);
                }
            };
            let worker = new ImportWorkflow_1.ImportWorkflow();
            worker.on(handler);
            var results = yield worker.run(importer.generatePayload());
        });
    }
    test_integration_modify() {
        return __awaiter(this, void 0, void 0, function* () {
            let importer = new CSVDataSource_1.CSVDataSource(CSVCols);
            importer.open("tests/CSVImporterTestMean.csv");
            var handler = {
                "import": (data) => {
                    data.spalte_a = "new value";
                    return Promise.resolve(data);
                }
            };
            let worker = new ImportWorkflow_1.ImportWorkflow();
            worker.on(handler);
            var results = yield worker.run(importer.generatePayload());
            chai_1.expect(results[0].spalte_a).to.equal("new value");
        });
    }
    test_integration_skip() {
        return __awaiter(this, void 0, void 0, function* () {
            let importer = new CSVDataSource_1.CSVDataSource(CSVCols);
            importer.open("tests/CSVImporterTest.csv");
            var handler = {
                "import": (data) => {
                    if (data.spalte_a == "1") {
                        throw new ImportWorkflow_1.SkipPayload("Test");
                    }
                    return Promise.resolve(data);
                }
            };
            let worker = new ImportWorkflow_1.ImportWorkflow();
            worker.on(handler);
            var results = yield worker.run(importer.generatePayload());
            chai_1.expect(results[0].spalte_a).to.equal("a");
        });
    }
};
__decorate([
    mocha_typescript_1.test("should flow through data")
], CSVDataSourceTest.prototype, "test_integration", null);
__decorate([
    mocha_typescript_1.test("should modify results while running")
], CSVDataSourceTest.prototype, "test_integration_modify", null);
__decorate([
    mocha_typescript_1.test("should ignore results when SkipPayload is thrown")
], CSVDataSourceTest.prototype, "test_integration_skip", null);
CSVDataSourceTest = __decorate([
    mocha_typescript_1.suite("CSVDataSource and ImportWorkflow")
], CSVDataSourceTest);
//# sourceMappingURL=IntegrationTest.js.map