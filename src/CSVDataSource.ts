/**
 Importer for CSV Files
 */

import { DataSource, constructorof } from "./DataSource";
import { ImportPayload } from "./ImportPayload";
var parse = require('csv-parse/lib/sync');
var merge = require("merge-deep");

import fs = require("fs");

export interface CSVDataSourceOptions {
    delimiter: string,
    hasHeadline: boolean,
    strictMode: boolean
}



export class CSVDataSource<T extends ImportPayload> extends DataSource<T> {
    protected filename: string = "";
    protected content: Buffer;
    protected options: any;
    private parsed: any;

    constructor(ctor: constructorof<T>) {
        super(ctor);
    }

    public open(filename: string, options: CSVDataSourceOptions = {
        "delimiter": ";",
        hasHeadline: false,
        strictMode: false
    }): void {
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

    public close() {

    }

    protected readHeadlines() {
        var hl: any = this.parsed.shift();
        var c: any = this.payloadClass;
        var col: any = c.getFields();
        this._dynamicFields = {};

        hl.forEach((rowLabel: string, index: number) => {
            for (var colIdx in col) {
                if (!this._dynamicFields[colIdx]) {
                    this._dynamicFields[colIdx] = {};
                }
                var colInfo = col[colIdx];

                // if the col has previously been found
                if (this._dynamicFields[colIdx].found) continue;
                if (rowLabel.match(colInfo.regex)) {
                    this._dynamicFields[colIdx].index = index;
                    this._dynamicFields[colIdx].found = true;
                    break;
                }
            }
        });

        if (!this.allRequiredFound()) {
            throw new Error("Not all required fields found in xls");
        };
    }

    protected parseCsv() {
        this.parsed = parse(this.content, {
            delimiter: this.options.delimiter
        });

        if (this.options.hasHeadline) {
            this.readHeadlines();
        }
    }


    public *generatePayload(): IterableIterator<T> {
        // FIXME: do this the streaming way
        for (let oneLine of this.parsed) {
            let newObject: any = new this.payloadClass();
            let skip: boolean = false;
            for (let key in this.fields) {
                var idx = this.fields[key].index;
                if (oneLine[idx]) {
                    if (this.fields[key].converter) {
                        newObject[key] = this.fields[key].converter(oneLine[idx]);
                    } else {
                        newObject[key] = oneLine[idx];
                    }
                } else if (this.fields[key].required) {
                    if (this.options.strictMode) {
                        throw new Error("Not enough columns in the File: " + this.filename);
                    } else {
                        skip = true;
                        break; // ignore column
                    }
                }
            }
            if (!skip) {
                yield newObject;
            }
        }
    }



}
