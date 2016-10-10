/**
 Importer for CSV Files
 */

import {DataSource} from "./DataSource";
import {ImportPayload} from "./ImportPayload";
var parse = require('csv-parse/lib/sync');

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
        let content = fs.readFileSync(this.filename);
        var parsed: any = parse(content, {
                delimiter: ";"
            });

            yield* parsed.map((oneLine:string[]) => {
              let newObject:any = new this.payloadClass();
              for (let key in newObject.fields) {
                var idx = newObject.fields[key]['index'];
                  if (oneLine[idx]) {
                      newObject[key] = oneLine[idx];
                  } else {
                      throw new Error("Not enough columns in the File: " + this.filename);
                  }

              }
              return newObject;
            });
    }

  // decorators
  public static column(info: {index: number}) {
    return function (target: ImportPayload, propertyKey: string) {
      target.addField(propertyKey);
      target.setField(propertyKey,"index", info.index);

    }
  }
}
