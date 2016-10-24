# import.js

A general purpose importing framework. 

This Framework is modeled around the Workflow of importing data. 
The Steps are 
	* Prepare for Importing (Get up DB connections, prepare filesystem, etc.)
		* preprocess one row of data (change fields, replace text etc.)
		* import one row of data ( write stuff to the target datastore )
		* postprocess one row of data ( update dependant items, cleanup etc. )
	* finis the import 

# Classes

## ImportWorkflow
This Class represents the Aspect of importing. 
Mainly it represents the lifecycle of the import process as a whole. 


## Payload
This Class represents one piece of data. e.g. one row in a csv import.

## DataSource
This Class represents a file or a set of files to be imported. A XLS File or an CSV File.

### XLSDataSource
Concrete Implementation for a generic XLS Datasource

### CSVDataSource
Concrete Implementation for a generic CSV Datasource

# Annotations


# Example
```
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


```
