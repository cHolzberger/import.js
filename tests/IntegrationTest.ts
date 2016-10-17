import {suite, test, slow, timeout, skip, only} from "mocha-typescript";
import {expect} from 'chai';

import {LogEntry, SkipPayload, ImportWorkflow, WorkflowEventHandler} from "../src/ImportWorkflow";
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
@suite("CSVDataSource and ImportWorkflow")
class CSVDataSourceTest {
    @test("should flow through data")
    async test_integration () {
        let importer = new CSVDataSource(CSVCols);
        importer.open("tests/CSVImporterTestMean.csv");
        let gen = importer.generatePayload();

        var handler:WorkflowEventHandler<CSVCols> = {
            "import": (data):Promise<CSVCols> => {
                expect(data.spalte_a).to.equal("a");
                data.spalte_a= "new value";
                return Promise.resolve(data);
            }
        };
        let worker:ImportWorkflow<CSVCols> = new ImportWorkflow<CSVCols>();
        worker.on(handler);
        var results:CSVCols[] = await worker.run(importer.generatePayload());
    }

    @test("should modify results while running")
    async test_integration_modify () {
        let importer = new CSVDataSource(CSVCols);
        importer.open("tests/CSVImporterTestMean.csv");

        var handler:WorkflowEventHandler<CSVCols> = {
            "import": (data):Promise<CSVCols> => {
                data.spalte_a= "new value";
                return Promise.resolve(data);
            }
        };
        let worker:ImportWorkflow<CSVCols> = new ImportWorkflow<CSVCols>();
        worker.on(handler);
        var results:CSVCols[] = await worker.run(importer.generatePayload());
        expect(results[0].spalte_a).to.equal("new value");
    }

    @test("should ignore results when SkipPayload is thrown")
    async test_integration_skip () {
        let importer = new CSVDataSource(CSVCols);
        importer.open("tests/CSVImporterTest.csv");

        var handler:WorkflowEventHandler<CSVCols> = {
            "import": (data):Promise<CSVCols> => {
              if ( data.spalte_a == "1") {
                throw new SkipPayload("Test");
              }
              return Promise.resolve(data);
            }
        };
        let worker:ImportWorkflow<CSVCols> = new ImportWorkflow<CSVCols>();
        worker.on(handler);
        var results:CSVCols[] = await worker.run(importer.generatePayload());
        expect(results[0].spalte_a).to.equal("a");
    }

    @test("should ignore results when SkipPayload is thrown and log the reason")
    async test_integration_skip_log () {
        let importer = new CSVDataSource(CSVCols);
        importer.open("tests/CSVImporterTest.csv");

        var handler:WorkflowEventHandler<CSVCols> = {
            "import": (data):Promise<CSVCols> => {
              if ( data.spalte_a == "1") {
                throw new SkipPayload("Test");
              }
              return Promise.resolve(data);
            }
        };
        let worker:ImportWorkflow<CSVCols> = new ImportWorkflow<CSVCols>();
        worker.on(handler);
        var results:CSVCols[] = await worker.run(importer.generatePayload());

        expect(worker.log[0].reason).to.equal("Test");
    }
}
