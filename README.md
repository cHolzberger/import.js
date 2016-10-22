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
## Payload
## DataSource

## XLSDataSource
## CSVDataSource

# Annotations

# Example 
