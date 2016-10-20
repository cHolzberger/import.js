import {suite, test, slow, timeout, skip, only} from "mocha-typescript";
import {expect} from 'chai';

import {ImportWorkflow, WorkflowEventHandler} from "../src/ImportWorkflow";


function* testGenerator():IterableIterator<string> {
  yield "1";
  yield "2";
}


function* testGeneratorOneValue():IterableIterator<string> {
  yield "1";
}

@suite("An ImportWorkflow")
class CSVDataSourceTest {
    @test("should call import")
    test_run_import() {
      var handler:WorkflowEventHandler<string> = {"import": (data:string):Promise<string> => { expect(data).to.equal("1"); return Promise.resolve("new")}};

      let worker:ImportWorkflow<string> = new ImportWorkflow<string>();
      worker.on(handler);
      worker.run(testGeneratorOneValue());

    }

    @test("should call preprocess")
    test_run_preprocess() {
      var handler:WorkflowEventHandler<string> = {"preprocess": (data:string):Promise<string> => { expect(data).to.equal("1"); return Promise.resolve("new")}};

      let worker:ImportWorkflow<string> = new ImportWorkflow<string>();
      worker.on(handler);
      worker.run(testGeneratorOneValue());

    }

    @test("should call postprocess")
    test_run_postprocess() {
      var handler:WorkflowEventHandler<string> = {"postprocess": (data:string):Promise<string> => { expect(data).to.equal("1"); return Promise.resolve("new")}};

      let worker:ImportWorkflow<string> = new ImportWorkflow<string>();
      worker.on(handler);
      worker.run(testGeneratorOneValue());

    }

    @test("should call preprocess, import, postprocess in the right order")
    test_run_in_order() {
      var count = 0;

      var handler:WorkflowEventHandler<string> = {
        "preprocess": (data:string):Promise<string> => { expect(count).to.equal(0); count++; return Promise.resolve("new")},
        "import": (data:string):Promise<string> => { expect(count).to.equal(1); count++; return Promise.resolve("new")},
        "postprocess": (data:string):Promise<string> => { expect(count).to.equal(2); return Promise.resolve("new")}
      };

      let worker:ImportWorkflow<string> = new ImportWorkflow<string>();
      worker.on(handler);
      worker.run(testGeneratorOneValue());

    }

    @test("should call change the data while running")
    test_change_data() {
      var count = 0;

      var handler:WorkflowEventHandler<string> = {
        "preprocess": (data:string):Promise<string> => { expect(data).to.equal("1"); return Promise.resolve("preprocess")},
        "import": (data:string):Promise<string> => { expect(data).to.equal("preprocess"); return Promise.resolve("import")},
        "postprocess": (data:string):Promise<string> => { expect(data).to.equal("import"); return Promise.resolve("new")}
      };

      let worker:ImportWorkflow<string> = new ImportWorkflow<string>();
      worker.on(handler);
      worker.run(testGeneratorOneValue());
    }

    @test("should run 2 times for demo data")
    test_times() {
      var count = 0;

      var handler:WorkflowEventHandler<string> = {
        "import": (data:string):Promise<string> => { count++; return Promise.resolve("whatever");},
      };

      let worker:ImportWorkflow<string> = new ImportWorkflow<string>();
      worker.on(handler);
      worker.run(testGenerator()).then(() => {
            expect(count).to.equal(2);
      });
    }

    @test("should call start prior to starting importing")
    async test_start_import() {
      var count = 0;

      var handler:WorkflowEventHandler<string> = {
        "startImport": ():Promise<any> => { count++; return Promise.resolve()},
      };

      let worker:ImportWorkflow<string> = new ImportWorkflow<string>();
      worker.on(handler);

      await worker.run(testGenerator());
      expect(count).to.equal(1);
    }

    @test("should call finish after importing")
    async test_finish_import() {
      var count = 0;

      var handler:WorkflowEventHandler<string> = {
        "finishImport": ():Promise<any> => { count++; return Promise.resolve()},
      };

      let worker:ImportWorkflow<string> = new ImportWorkflow<string>();
      worker.on(handler);

      await worker.run(testGenerator());
      expect(count).to.equal(1);

    }
}
