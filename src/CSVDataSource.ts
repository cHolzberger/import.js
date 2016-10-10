/**
 Importer for CSV Files
 */

import {DataSource} from "./DataSource";
import {ImportPayload} from "./ImportPayload";

import fs = require("fs");

export interface constructorof<T> {
    new (): T;
}

export class CSVDataSource<T extends ImportPayload> extends DataSource {
    private filename: string = "";
    private payloadClass: constructorof<T>;

    constructor(filename: string,ctor: constructorof<T>) {
        super();
        try {
            var stats = fs.statSync(filename);
        } catch (e) {
            throw new Error("File not found: " + filename);
        }

        if (!stats.isFile()) {
            throw new Error("File not found: " + filename);
        }
        this.payloadClass = ctor;
        this.filename = filename;
    }

    public *generatePayload(): IterableIterator<T> {
        let lines = fs.readFileSync(this.filename).toString().split("\n");

        for (let i = 0; i < lines.length; i++) {
            let newObject:any = new this.payloadClass();

            let oneLine = lines[i].split(";");

            for (let key in newObject.fields) {
                if (oneLine[newObject.fields[key]['index']]) {
                    newObject[key] = oneLine[newObject.fields[key]['index']];
                } else {
                    throw new Error("Not enough columns in the File: " + this.filename);
                }
            }

            yield newObject;
        }
    }

  // decorators
  public static column(target: ImportPayload, propertyKey: string) {
  }

  public static index(i:number) {
    return function(target: ImportPayload, propertyKey: string) {
        target.setField(propertyKey,"index", i);
    }
  }

}
