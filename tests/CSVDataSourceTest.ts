import {suite, test, slow, timeout, skip, only} from "mocha-typescript";
import {expect} from 'chai';

import { CSVDataSource } from "../src/CSVDataSource";
import { ImportPayload } from "../src/ImportPayload";

class CSVCols extends ImportPayload {
    @CSVDataSource.indexColumn({ index: 0 })
    spalte_a: string

    @CSVDataSource.indexColumn({ index: 1 })
    spalte_b: string

    @CSVDataSource.indexColumn({ index: 2 })
    spalte_c: string
}

class CSVHeadlineCols extends ImportPayload {
    @CSVDataSource.regexColumn({ regex: /COLA/ })
    spalte_a: string

    @CSVDataSource.regexColumn({ regex: /COLB/ })
    spalte_b: string

    @CSVDataSource.regexColumn({ regex: /COLC/ })
    spalte_c: string
}

class CSVHeadlineColsNumber extends ImportPayload {
    @CSVDataSource.indexColumn({index: 0,  converter: parseInt })
    spalte_a: number
}

@suite("A CSVDataSource")
class CSVDataSourceTest {
    @test("should know about its fields")
    test_annotations() {
        class CSVColsTest extends ImportPayload {
            @CSVDataSource.indexColumn({ index: 0 })
            spalte_a: string

            @CSVDataSource.indexColumn({ index: 1 })
            spalte_b: string

            @CSVDataSource.indexColumn({ index: 2 })
            spalte_c: string
        }
        let x = new CSVColsTest();
        expect(CSVColsTest.getFields().spalte_c.index).to.equal(2);
        expect(CSVColsTest.getFields().spalte_b.index).to.equal(1);
        expect(CSVColsTest.getFields().spalte_a.index).to.equal(0);

    }

    @test("should parse the test csv file")
    parse_test_csv_file() {
        let importer = new CSVDataSource(CSVCols);
        importer.open("tests/CSVImporterTest.csv");
        // payload mockup:
        // { spalte_a: 1, spalte_b: 2, spalte_c: 3}
        // { spalte_a: a, spalte_b: b, spalte_c: c}

    }

    @test("should throw an exception if it cant find the file")
    parse_demo_csv() {
        try {
            let importer = new CSVDataSource(CSVCols);
            importer.open("../../tests/nonexistingfoo.csv");
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).to.equal("File not found: ../../tests/nonexistingfoo.csv");
            }
        }
    }

    @test("should parse the test csv file according to a col definition")
    parse_test_csv_file_rows() {
        let importer = new CSVDataSource(CSVCols);
        importer.open("tests/CSVImporterTest.csv");

        let gen = importer.generatePayload();
        let first_row: CSVCols = <CSVCols>(gen.next().value);
        let second_row = <CSVCols>(gen.next().value);

        expect(first_row.spalte_a).to.equal("1");
        expect(first_row.spalte_b).to.equal("2");
        expect(first_row.spalte_c).to.equal("3");

        expect(second_row.spalte_a).to.equal("a");
        expect(second_row.spalte_b).to.equal("b");
        expect(second_row.spalte_c).to.equal("c");
    }

    @test("should throw an error because the col definition accesses an index that does not exist in the CSV File")
    parse_test_csv_file_rows_high_index() {
        class CSVColsXXL extends ImportPayload {
            @CSVDataSource.indexColumn({ index: 100 })
            spalte_a: string
        }

        try {
            let importer = new CSVDataSource(CSVColsXXL);
            importer.open("tests/CSVImporterTest.csv");

            let gen = importer.generatePayload();
            gen.next();
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).to.equal("Not enough columns in the File: tests/CSVImporterTest.csv");
            }
        }
    }

    @test("should honor value escapes in csv files")
    parse_test_escapes() {
        let importer = new CSVDataSource(CSVCols);
        importer.open("tests/CSVImporterTestMean.csv");
        let gen = importer.generatePayload();
        var val = <CSVCols>gen.next().value;
        expect(val.spalte_c).to.equal("c;d")
    }

    @test("should identify the index of the headlines")
    parse_test_headlines() {
        let importer = new CSVDataSource(CSVHeadlineCols);
        importer.open("tests/CSVImporterTestHeadline.csv", {delimiter: ";", hasHeadline: true});
        let gen = importer.generatePayload();
        var val = <CSVCols>gen.next().value;
        expect(importer.fields.spalte_a.index).to.equal(0);
        expect(importer.fields.spalte_b.index).to.equal(1);
        expect(importer.fields.spalte_c.index).to.equal(2);
    }

    @test("should convert types according to definition")
    parse_test_converter() {
        let importer = new CSVDataSource(CSVHeadlineColsNumber);
        importer.open("tests/CSVImporterTestNumber.csv");
        let gen = importer.generatePayload();
        var val = <CSVHeadlineColsNumber>gen.next().value;
        expect(val.spalte_a).to.equal(1);
    }


    @test("should return the correct values when searching for headlines")
    parse_test_headlines_data() {
        let importer = new CSVDataSource(CSVHeadlineCols);
        importer.open("tests/CSVImporterTestHeadline.csv", {delimiter: ";", hasHeadline: true});
        let gen = importer.generatePayload();
        var val = <CSVCols>gen.next().value;
        expect(val.spalte_a).to.equal("1");
    }
}
