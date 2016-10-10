/**
Importer for CSV Files
*/

import {DataSource} from "./DataSource";
import fs = require("fs");

export class CSVDataSource extends DataSource {

  constructor(filename:string) {
    super();
    try {
      var stats = fs.statSync(filename);
    } catch ( e ) {
      throw new Error("File not found: " + filename);
    }

    if ( ! stats.isFile() ) {
      throw new Error("File not found: " + filename);
    }
  }

}
