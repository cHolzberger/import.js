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
    open(filename, options = {
            "delimiter": ";",
            hasHeadline: false,
            strictMode: false
        }) {
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
            this._dynamicFields = {};
            hl.forEach((rowLabel, index) => {
                for (var colIdx in col) {
                    if (!this._dynamicFields[colIdx]) {
                        this._dynamicFields[colIdx] = {};
                    }
                    var colInfo = col[colIdx];
                    // if the col has previously been found
                    if (this._dynamicFields[colIdx].found)
                        continue;
                    if (rowLabel.match(colInfo.regex)) {
                        this._dynamicFields[colIdx].index = index;
                        this._dynamicFields[colIdx].found = true;
                        break;
                    }
                }
            });
            if (!this.allRequiredFound()) {
                throw new Error("Not all required fields found in xls");
            }
            ;
        }
    }
    allRequiredFound() {
        var allRequiredFound = true;
        for (var idx in this.fields) {
            var item = this.fields[idx];
            if (item.required) {
                allRequiredFound = allRequiredFound && item.found;
                if (!item.found) {
                    console.error("Not all required fields found in xls; Missing: " + idx);
                    return;
                }
            }
        }
        return allRequiredFound;
    }
    *generatePayload() {
        // FIXME: do this the streaming way
        for (let oneLine of this.parsed) {
            let newObject = new this.payloadClass();
            let skip = false;
            for (let key in this.fields) {
                var idx = this.fields[key].index;
                if (oneLine[idx]) {
                    if (this.fields[key].converter) {
                        newObject[key] = this.fields[key].converter(oneLine[idx]);
                    }
                    else {
                        newObject[key] = oneLine[idx];
                    }
                }
                else if (this.fields[key].required) {
                    if (this.options.strictMode) {
                        throw new Error("Not enough columns in the File: " + this.filename);
                    }
                    else {
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
    /**
    gets the static and dynamic mappings for the fields in T
    **/
    get fields() {
        var c = this.payloadClass;
        return Object.assign({}, c._fields, this._dynamicFields);
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