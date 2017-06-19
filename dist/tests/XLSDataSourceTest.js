"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
const XLSDataSource_1 = require("../src/XLSDataSource");
const ImportPayload_1 = require("../src/ImportPayload");
class XLSCols extends ImportPayload_1.ImportPayload {
}
__decorate([
    XLSDataSource_1.XLSDataSource.indexColumn({ index: 0 })
], XLSCols.prototype, "spalte_a", void 0);
__decorate([
    XLSDataSource_1.XLSDataSource.indexColumn({ index: 1 })
], XLSCols.prototype, "spalte_b", void 0);
__decorate([
    XLSDataSource_1.XLSDataSource.indexColumn({ index: 2 })
], XLSCols.prototype, "spalte_c", void 0);
class XLSHeadlineCols extends ImportPayload_1.ImportPayload {
}
__decorate([
    XLSDataSource_1.XLSDataSource.regexColumn({ regex: /COLA/ })
], XLSHeadlineCols.prototype, "spalte_a", void 0);
__decorate([
    XLSDataSource_1.XLSDataSource.regexColumn({ regex: /COLB/ })
], XLSHeadlineCols.prototype, "spalte_b", void 0);
__decorate([
    XLSDataSource_1.XLSDataSource.regexColumn({ regex: /COLC/ })
], XLSHeadlineCols.prototype, "spalte_c", void 0);
let XLSDataSourceTest = class XLSDataSourceTest {
    test_annotations() {
        class XLSColsTest extends ImportPayload_1.ImportPayload {
        }
        __decorate([
            XLSDataSource_1.XLSDataSource.indexColumn({ index: 0 })
        ], XLSColsTest.prototype, "spalte_a", void 0);
        __decorate([
            XLSDataSource_1.XLSDataSource.indexColumn({ index: 1 })
        ], XLSColsTest.prototype, "spalte_b", void 0);
        __decorate([
            XLSDataSource_1.XLSDataSource.indexColumn({ index: 2 })
        ], XLSColsTest.prototype, "spalte_c", void 0);
        let x = new XLSColsTest();
        chai_1.expect(XLSColsTest.getFields().spalte_c.index).to.equal(2);
        chai_1.expect(XLSColsTest.getFields().spalte_b.index).to.equal(1);
        chai_1.expect(XLSColsTest.getFields().spalte_a.index).to.equal(0);
    }
    parse_test_XLS_file() {
        let importer = new XLSDataSource_1.XLSDataSource(XLSCols);
        importer.open("tests/XLSImporterTest.xls");
        // payload mockup:
        // { spalte_a: 1, spalte_b: 2, spalte_c: 3}
        // { spalte_a: a, spalte_b: b, spalte_c: c}
    }
    parse_demo_XLS() {
        try {
            let importer = new XLSDataSource_1.XLSDataSource(XLSCols);
            importer.open("../../tests/nonexistingfoo.xls");
        }
        catch (e) {
            if (e instanceof Error) {
                chai_1.expect(e.message).to.equal("File not found: ../../tests/nonexistingfoo.xls");
            }
        }
    }
    parse_test_XLS_file_rows() {
        let importer = new XLSDataSource_1.XLSDataSource(XLSCols);
        importer.open("tests/XLSImporterTest.xls");
        let gen = importer.generatePayload();
        let first_row = (gen.next().value);
        let second_row = (gen.next().value);
        chai_1.expect(first_row.spalte_a).to.equal("1");
        chai_1.expect(first_row.spalte_b).to.equal("2");
        chai_1.expect(first_row.spalte_c).to.equal("3");
        chai_1.expect(second_row.spalte_a).to.equal("a");
        chai_1.expect(second_row.spalte_b).to.equal("b");
        chai_1.expect(second_row.spalte_c).to.equal("c");
    }
    parse_test_XLS_file_rows_high_index() {
        class XLSColsXXL extends ImportPayload_1.ImportPayload {
        }
        __decorate([
            XLSDataSource_1.XLSDataSource.indexColumn({ index: 100 })
        ], XLSColsXXL.prototype, "spalte_a", void 0);
        try {
            let importer = new XLSDataSource_1.XLSDataSource(XLSColsXXL);
            importer.open("tests/XLSImporterTest.xls");
            let gen = importer.generatePayload();
            gen.next();
        }
        catch (e) {
            if (e instanceof Error) {
                chai_1.expect(e.message).to.equal("Not enough columns in the File: tests/XLSImporterTest.xls");
            }
        }
    }
    parse_test_escapes() {
        let importer = new XLSDataSource_1.XLSDataSource(XLSCols);
        importer.open("tests/XLSImporterTestMean.xls");
        let gen = importer.generatePayload();
        var val = gen.next().value;
        chai_1.expect(val.spalte_c).to.equal("c;d");
    }
    parse_test_headlines() {
        let importer = new XLSDataSource_1.XLSDataSource(XLSHeadlineCols);
        importer.open("tests/XLSImporterTestHeadline.xls", { hasHeadline: true, strictMode: true });
        let gen = importer.generatePayload();
        var val = gen.next().value;
        chai_1.expect(importer.fields.spalte_a.index).to.equal(0);
        chai_1.expect(importer.fields.spalte_b.index).to.equal(1);
        chai_1.expect(importer.fields.spalte_c.index).to.equal(2);
    }
    parse_test_richtext() {
        let importer = new XLSDataSource_1.XLSDataSource(XLSCols);
        importer.open("tests/XLSImporterRT.xlsx", { hasHeadline: false, strictMode: true });
        let gen = importer.generatePayload();
        var val = gen.next().value;
        val = gen.next().value;
        chai_1.expect(val.spalte_b).to.equal('b long text <span style="font-size:12;">whatever</span><span style="font-size:12;"><b> bold</b></span>');
    }
    parse_test_headlines_data() {
        let importer = new XLSDataSource_1.XLSDataSource(XLSHeadlineCols);
        importer.open("tests/XLSImporterTestHeadline.xls", { hasHeadline: true, strictMode: true });
        let gen = importer.generatePayload();
        var val = gen.next().value;
        chai_1.expect(val.spalte_a).to.equal("1");
    }
};
__decorate([
    mocha_typescript_1.test("should know about its fields")
], XLSDataSourceTest.prototype, "test_annotations", null);
__decorate([
    mocha_typescript_1.test("should parse the test XLS file")
], XLSDataSourceTest.prototype, "parse_test_XLS_file", null);
__decorate([
    mocha_typescript_1.test("should throw an exception if it cant find the file")
], XLSDataSourceTest.prototype, "parse_demo_XLS", null);
__decorate([
    mocha_typescript_1.test("should parse the test XLS file according to a col definition")
], XLSDataSourceTest.prototype, "parse_test_XLS_file_rows", null);
__decorate([
    mocha_typescript_1.test("should throw an error because the col definition accesses an index that does not exist in the XLS File")
], XLSDataSourceTest.prototype, "parse_test_XLS_file_rows_high_index", null);
__decorate([
    mocha_typescript_1.test("should honor value escapes in XLS files")
], XLSDataSourceTest.prototype, "parse_test_escapes", null);
__decorate([
    mocha_typescript_1.test("should identify the index of the headlines")
], XLSDataSourceTest.prototype, "parse_test_headlines", null);
__decorate([
    mocha_typescript_1.test("should load richtext as html")
], XLSDataSourceTest.prototype, "parse_test_richtext", null);
__decorate([
    mocha_typescript_1.test("should return the correct values when searching for headlines")
], XLSDataSourceTest.prototype, "parse_test_headlines_data", null);
XLSDataSourceTest = __decorate([
    mocha_typescript_1.suite("A XLSDataSource")
], XLSDataSourceTest);
//# sourceMappingURL=XLSDataSourceTest.js.map