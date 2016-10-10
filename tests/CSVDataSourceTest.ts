import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect } from 'chai';

import { CSVDataSource } from "../src/CSVDataSource";

@suite("A CSVDataSource")
class CSVDataSourceTest {
  @test("should parse the test csv file")
  parse_test_csv_file() {
    var cols = {
      "spalte_a": {
        index: 0
      },
      "spalte_b": {
        index: 1
      },

      "spalte_c": {
        index: 2,
        required: true
      }
    }
    let importer = new CSVDataSource("tests/CSVImporterTest.csv", cols);
    // payload mockup:
    // { spalte_a: 1, spalte_b: 2, spalte_c: 3}
    // { spalte_a: a, spalte_b: b, spalte_c: c}

  }

  @test("should throw an exception if it cant find the file")
  parse_demo_csv() {
    try {
      let importer = new CSVDataSource("../../tests/nonexistingfoo.csv", null);
    } catch (e) {
      if (e instanceof Error) {
        expect(e.message).to.equal("File not found: ../../tests/nonexistingfoo.csv");
      }
    }
  }

  @test("should parse the test csv file according to a col definition")
  parse_test_csv_file_rows() {
    var cols = {
      "spalte_a": {
        index: 0
      },
      "spalte_b": {
        index: 1
      },

      "spalte_c": {
        index: 2,
        required: true
      }
    }
    let importer = new CSVDataSource("tests/CSVImporterTest.csv", cols);
    var gen = importer.generatePayload();
    var first_row = gen.next().value;
    var second_row = gen.next().value;
    expect(first_row.spalte_a).to.equal("1");
    expect(first_row.spalte_b).to.equal("2");
    expect(first_row.spalte_c).to.equal("3");

    expect(second_row.spalte_a).to.equal("a");
    expect(second_row.spalte_b).to.equal("b");
    expect(second_row.spalte_c).to.equal("c");
  }
}
