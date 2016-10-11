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

export interface CSVDataSourceOptions {
    delimiter: string,
    hasHeadline: boolean
}

export interface CSVDataSourceColumnInfo {
    index: number,
    required?: boolean
}

export interface CSVDataSourceHeadlineColumnInfo {
    regex: RegExp,
    required?: boolean
    index?: number,
    found?: boolean
}

export class CSVDataSource<T extends ImportPayload> extends DataSource {
    protected filename: string = "";
    private payloadClass: constructorof<T>;
    protected content: Buffer;
    protected options: any;
    private parsed: any;

    constructor(ctor: constructorof<T>) {
        super();
        this.payloadClass = ctor;
    }

    public open(filename: string, options: CSVDataSourceOptions = { "delimiter": ";", hasHeadline: false }): void {
        try {
            var stats = fs.statSync(filename);
        } catch (e) {
            throw new Error("File not found: " + filename);
        }

        if (!stats.isFile()) {
            throw new Error("File not found: " + filename);
        }

        this.filename = filename;
        this.content = fs.readFileSync(this.filename);
        this.options = options;

        this.parseCsv();
    }

    protected parseCsv () {
      this.parsed = parse(this.content, {
          delimiter: this.options.delimiter
      });

      if (this.options.hasHeadline) {
          var hl: any = this.parsed.shift();
          var c:any = this.payloadClass;
          var col:any = c.getFields();

          hl.forEach(function(rowLabel:string, index:number) {
              for (var colIdx in col) {
                  var colInfo = col[colIdx];
                  if (colInfo.found) continue;
                  if (rowLabel.match(colInfo.regex)) {
                      colInfo.index = index;
                      colInfo.found = true;
                      break;
                  }
              }
          });

          var allRequiredFound = true;
          for (var idx in col) {
              var item = col[idx];
              if (item.required) {
                  allRequiredFound = allRequiredFound && item.found;
                  if (!item.found) {
                      console.error("Not all required fields found in xls; Missing: " + idx);
                      return;
                  }
              }
          };
      }
    }

    public *generatePayload(): IterableIterator<T> {
        // FIXME: do this the streaming way
        yield* this.parsed.map((oneLine: string[]) => {
            let newObject: any = new this.payloadClass();
            for (let key in this.fields) {
                var idx = this.fields[key]['index'];
                if (oneLine[idx]) {
                    newObject[key] = oneLine[idx];
                } else {
                    throw new Error("Not enough columns in the File: " + this.filename);
                }

            }
            return newObject;
        });
    }

    get fields(): any {
        var c: any = this.payloadClass;
        return c._fields;
    }

    // decorators

    public static indexColumn(info: CSVDataSourceColumnInfo) {
        return function(target: any, propertyKey: string) {
            target.constructor.addField(propertyKey);
            target.constructor.setField(propertyKey, "index", info.index);
        }
    }

    public static regexColumn(info: CSVDataSourceHeadlineColumnInfo) {
        return function(target: any, propertyKey: string) {
            target.constructor.addField(propertyKey);
            target.constructor.setField(propertyKey, "regex", info.regex);
        }
    }
}
