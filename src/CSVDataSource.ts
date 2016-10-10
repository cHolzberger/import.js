/**
 Importer for CSV Files
 */

import {DataSource} from "./DataSource";
import {ImportPayload} from "./ImportPayload";

import fs = require("fs");

export class CSVDataSource extends DataSource {
    private filename: string = "";
    private cols: any = {};

    constructor(filename: string, cols: any) {
        super();
        try {
            var stats = fs.statSync(filename);
        } catch (e) {
            throw new Error("File not found: " + filename);
        }

        if (!stats.isFile()) {
            throw new Error("File not found: " + filename);
        }

        this.filename = filename;
        this.cols = cols;
    }

    public *generatePayload(): IterableIterator<ImportPayload> {
        let lines = fs.readFileSync(this.filename).toString().split("\n");

        for (let i = 0; i < lines.length; i++) {
            let newObject: any = {};

            let oneLine = lines[i].split(";");

            for (let key in this.cols) {
                if (oneLine[this.cols[key]['index']]) {
                    newObject[key] = oneLine[this.cols[key]['index']];
                } else {
                    throw new Error("Not enough columns in the File: " + this.filename);
                }
            }

            yield newObject;
        }
    }

  // decorators
  public static index(index:number) {
    return index;
  }

}
