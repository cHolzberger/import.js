/**
 Importer for CSV Files
 */
"use strict";
const DataSource_1 = require("./DataSource");
var parse = require('csv-parse/lib/sync');
const fs = require("fs");
class CSVDataSource extends DataSource_1.DataSource {
    constructor(ctor) {
        super();
        this.filename = "";
        this.payloadClass = ctor;
    }
    open(filename, options = { "delimiter": ";", hasHeadline: false }) {
        try {
            var stats = fs.statSync(filename);
        }
        catch (e) {
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
    parseCsv() {
        this.parsed = parse(this.content, {
            delimiter: this.options.delimiter
        });
        if (this.options.hasHeadline) {
            var hl = this.parsed.shift();
            var c = this.payloadClass;
            var col = c.getFields();
            hl.forEach(function (rowLabel, index) {
                for (var colIdx in col) {
                    var colInfo = col[colIdx];
                    if (colInfo.found)
                        continue;
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
            ;
        }
    }
    *generatePayload() {
        // FIXME: do this the streaming way
        yield* this.parsed.map((oneLine) => {
            let newObject = new this.payloadClass();
            for (let key in this.fields) {
                var idx = this.fields[key]['index'];
                if (oneLine[idx]) {
                    if (this.fields[key].converter) {
                        newObject[key] = this.fields[key].converter(oneLine[idx]);
                    }
                    else {
                        newObject[key] = oneLine[idx];
                    }
                }
                else if (this.fields[key]['index'].required) {
                    throw new Error("Not enough columns in the File: " + this.filename);
                }
            }
            return newObject;
        });
    }
    get fields() {
        var c = this.payloadClass;
        return c._fields;
    }
    // decorators
    static indexColumn(info) {
        return function (target, propertyKey) {
            target.constructor.addField(propertyKey);
            target.constructor.setField(propertyKey, "index", info.index);
            target.constructor.setField(propertyKey, "converter", info.converter);
            target.constructor.setField(propertyKey, "required", info.required);
        };
    }
    static regexColumn(info) {
        return function (target, propertyKey) {
            target.constructor.addField(propertyKey);
            target.constructor.setField(propertyKey, "regex", info.regex);
            target.constructor.setField(propertyKey, "converter", info.converter);
            target.constructor.setField(propertyKey, "required", info.required);
        };
    }
}
exports.CSVDataSource = CSVDataSource;
//# sourceMappingURL=CSVDataSource.js.map