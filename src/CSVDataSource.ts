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
    hasHeadline: boolean,
    strictMode: boolean
}

export interface CSVDataSourceColumnInfo {
    index: number,
    required?: boolean,
    converter?: (x: string) => any;
}

export interface CSVDataSourceHeadlineColumnInfo {
    regex: RegExp,
    required?: boolean
    index?: number,
    found?: boolean,
    converter?: (x: string) => any;
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

    protected parseCsv() {
        this.parsed = parse(this.content, {
            delimiter: this.options.delimiter
        });

        if (this.options.hasHeadline) {
            var hl: any = this.parsed.shift();
            var c: any = this.payloadClass;
            var col: any = c.getFields();

            hl.forEach(function (rowLabel: string, index: number) {
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
            }

        }
    }

    public *generatePayload(): IterableIterator<T> {
        // FIXME: do this the streaming way
        for ( let oneLine of this.parsed) {
            let newObject: any = new this.payloadClass();
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
                        continue; // ignore column
                    }
                }
            }
            yield newObject;
        }
    }

    get fields(): any {
        var c: any = this.payloadClass;
        return c._fields;
    }

    // decorators

    public static indexColumn(info: CSVDataSourceColumnInfo) {
        return function (target: any, propertyKey: string) {
            target.constructor.addField(propertyKey);
            target.constructor.setField(propertyKey, "index", info.index);
            target.constructor.setField(propertyKey, "converter", info.converter);
            target.constructor.setField(propertyKey, "required", info.required);

        }
    }

    public static regexColumn(info: CSVDataSourceHeadlineColumnInfo) {
        return function (target: any, propertyKey: string) {
            target.constructor.addField(propertyKey);
            target.constructor.setField(propertyKey, "regex", info.regex);
            target.constructor.setField(propertyKey, "converter", info.converter);
            target.constructor.setField(propertyKey, "required", info.required);
        }
    }
}
