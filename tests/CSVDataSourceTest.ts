import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect } from 'chai';

import { CSVDataSource } from "../src/CSVDataSource";

@suite("A CSVDataSource")
class CSVDataSourceTest {
  @test ("should parse the test csv file")
  parse_test_csv_file() {
    let importer = new CSVDataSource("tests/CSVImporterTest.csv");
  }

  @test ("should throw an exception if it cant find the file")
  parse_demo_csv() {
    try {
      let importer = new CSVDataSource("../../tests/nonexistingfoo.csv");
    } catch ( e ) {
      if ( e instanceof Error ) {
        expect(e.message).to.equal("File not found: ../../tests/nonexistingfoo.csv" );
      }
    }

  }

}
