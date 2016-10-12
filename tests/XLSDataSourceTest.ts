import {suite, test, slow, timeout, skip, only} from "mocha-typescript";
import {expect} from 'chai';

import {XLSDataSource} from "../src/XLSDataSource";
import {ImportPayload} from "../src/ImportPayload";

class XLSCols extends ImportPayload {
    @XLSDataSource.indexColumn({index: 0})
    spalte_a: string

    @XLSDataSource.indexColumn({index: 1})
    spalte_b: string

    @XLSDataSource.indexColumn({index: 2})
    spalte_c: string
}

class XLSHeadlineCols extends ImportPayload {
    @XLSDataSource.regexColumn({regex: /COLA/})
    spalte_a: string

    @XLSDataSource.regexColumn({regex: /COLB/})
    spalte_b: string

    @XLSDataSource.regexColumn({regex: /COLC/})
    spalte_c: string
}

@suite("A XLSDataSource")
class XLSDataSourceTest {
    @test("should know about its fields")
    test_annotations() {
        class XLSColsTest extends ImportPayload {
            @XLSDataSource.indexColumn({index: 0})
            spalte_a: string

            @XLSDataSource.indexColumn({index: 1})
            spalte_b: string

            @XLSDataSource.indexColumn({index: 2})
            spalte_c: string
        }
        let x = new XLSColsTest();
        expect(XLSColsTest.getFields().spalte_c.index).to.equal(2);
        expect(XLSColsTest.getFields().spalte_b.index).to.equal(1);
        expect(XLSColsTest.getFields().spalte_a.index).to.equal(0);

    }

    @test("should parse the test XLS file")
    parse_test_XLS_file() {
        let importer = new XLSDataSource(XLSCols);
        importer.open("tests/XLSImporterTest.xls");
        // payload mockup:
        // { spalte_a: 1, spalte_b: 2, spalte_c: 3}
        // { spalte_a: a, spalte_b: b, spalte_c: c}

    }

    @test("should throw an exception if it cant find the file")
    parse_demo_XLS() {
        try {
            let importer = new XLSDataSource(XLSCols);
            importer.open("../../tests/nonexistingfoo.xls");
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).to.equal("File not found: ../../tests/nonexistingfoo.xls");
            }
        }
    }

    @test("should parse the test XLS file according to a col definition")
    parse_test_XLS_file_rows() {
        let importer = new XLSDataSource(XLSCols);
        importer.open("tests/XLSImporterTest.xls");

        let gen = importer.generatePayload();
        let first_row: XLSCols = <XLSCols>(gen.next().value);
        let second_row = <XLSCols>(gen.next().value);

        expect(first_row.spalte_a).to.equal("1");
        expect(first_row.spalte_b).to.equal("2");
        expect(first_row.spalte_c).to.equal("3");

        expect(second_row.spalte_a).to.equal("a");
        expect(second_row.spalte_b).to.equal("b");
        expect(second_row.spalte_c).to.equal("c");
    }

    @test("should throw an error because the col definition accesses an index that does not exist in the XLS File")
    parse_test_XLS_file_rows_high_index() {
        class XLSColsXXL extends ImportPayload {
            @XLSDataSource.indexColumn({index: 100})
            spalte_a: string
        }

        try {
            let importer = new XLSDataSource(XLSColsXXL);
            importer.open("tests/XLSImporterTest.xls");

            let gen = importer.generatePayload();
            gen.next();
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).to.equal("Not enough columns in the File: tests/XLSImporterTest.xls");
            }
        }
    }

    @test("should honor value escapes in XLS files")
    parse_test_escapes() {
        let importer = new XLSDataSource(XLSCols);
        importer.open("tests/XLSImporterTestMean.xls");
        let gen = importer.generatePayload();
        var val = <XLSCols>gen.next().value;
        expect(val.spalte_c).to.equal("c;d")
    }

    @test("should identify the index of the headlines")
    parse_test_headlines() {
        let importer = new XLSDataSource(XLSHeadlineCols);
        importer.open("tests/XLSImporterTestHeadline.xls", {hasHeadline: true, strictMode: true});
        let gen = importer.generatePayload();
        var val = <XLSCols>gen.next().value;
        expect(importer.fields.spalte_a.index).to.equal(0);
        expect(importer.fields.spalte_b.index).to.equal(1);
        expect(importer.fields.spalte_c.index).to.equal(2);
    }

    @test("should return the correct values when searching for headlines")
    parse_test_headlines_data() {
        let importer = new XLSDataSource(XLSHeadlineCols);
        importer.open("tests/XLSImporterTestHeadline.xls", {hasHeadline: true, strictMode: true});
        let gen = importer.generatePayload();
        var val = <XLSCols>gen.next().value;
        expect(val.spalte_a).to.equal("1");
    }
}
