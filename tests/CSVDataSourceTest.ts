import {suite, test, slow, timeout, skip, only} from "mocha-typescript";
import {expect} from 'chai';

import { CSVDataSource } from "../src/CSVDataSource";
import { ImportPayload } from "../src/ImportPayload";

@suite("A CSVDataSource")
class CSVDataSourceTest {
    @test("should know about its fields")
    test_annotations () {
      class CSVCols extends ImportPayload {
        @CSVDataSource.column
        @CSVDataSource.index(0)
        spalte_a: string
      }
      let x = new CSVCols();
      console.dir(x);
      console.dir(x.constructor);
      console.log(x.fields.spalte_a);
    }

    @test("should parse the test csv file")
    parse_test_csv_file() {
      class CSVCols extends ImportPayload {
        @CSVDataSource.column
        @CSVDataSource.index(0)
        spalte_a: string
      }

        let importer = new CSVDataSource("tests/CSVImporterTest.csv",CSVCols);
        // payload mockup:
        // { spalte_a: 1, spalte_b: 2, spalte_c: 3}
        // { spalte_a: a, spalte_b: b, spalte_c: c}

    }

    @test("should throw an exception if it cant find the file")
    parse_demo_csv() {
      class CSVCols extends ImportPayload {
        @CSVDataSource.column
        @CSVDataSource.index(0)
        spalte_a: string
      }

        try {
            let importer = new CSVDataSource("../../tests/nonexistingfoo.csv", CSVCols);
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).to.equal("File not found: ../../tests/nonexistingfoo.csv");
            }
        }
    }

    @test("should parse the test csv file according to a col definition")
    parse_test_csv_file_rows() {
      class CSVCols extends ImportPayload {
        @CSVDataSource.column
        @CSVDataSource.index(0)
        spalte_a: string

        @CSVDataSource.column
        @CSVDataSource.index(1)
        spalte_b: string

        @CSVDataSource.column
        @CSVDataSource.index(2)
        spalte_c: string
      }

        let importer = new CSVDataSource("tests/CSVImporterTest.csv", CSVCols);
        let gen = importer.generatePayload();
        let first_row:CSVCols = <CSVCols>(gen.next().value);
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
      class CSVCols extends ImportPayload {
        @CSVDataSource.column
        @CSVDataSource.index(100)
        spalte_a: string
      }

        try {
            let importer = new CSVDataSource("tests/CSVImporterTest.csv",CSVCols);
            let gen = importer.generatePayload();
            gen.next();
        } catch (e) {
            if (e instanceof Error) {
                expect(e.message).to.equal("Not enough columns in the File: tests/CSVImporterTest.csv");
            }
        }
    }

    @test("should value escapes in csv files")
    parse_test_escapes() {
      class CSVCols extends ImportPayload {
        @CSVDataSource.column
        @CSVDataSource.index(0)
        a: string;

        @CSVDataSource.column
        @CSVDataSource.index(1)
        b: string;

        @CSVDataSource.column
        @CSVDataSource.index(2)
        c: string;
      }
            let importer = new CSVDataSource("tests/CSVImporterTestMean.csv", CSVCols);
            let gen = importer.generatePayload();
            var val = <CSVCols>gen.next().value;
            expect(val.c).to.equal("c;d")

    }
}
