"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataSource_1 = require("./DataSource");
var XLSX = require('xlsx');
const fs = require("fs");
class XLSDataSource extends DataSource_1.DataSource {
    _getRow(r) {
        var sheet_name = this.workbook.SheetNames[0];
        var sheet = this.workbook.Sheets[sheet_name];
        var range = XLSX.utils.decode_range(sheet['!ref']);
        var rows = range.e.r;
        var cols = range.e.c;
        if (r > rows) {
            return [];
        }
        var ret = [];
        for (var c = 0; c <= cols; c++) {
            var idx = XLSX.utils.encode_cell({ r, c });
            var col = sheet[idx];
            if (col && col.v) {
                ret.push(col.v.toString());
            }
            else {
                ret.push("##EMPTY##");
            }
        }
        return ret;
    }
    readHeadlines() {
        var hl = this._getRow(0);
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
    open(filename, options = { hasHeadline: false, strictMode: false, delimiter: "," }) {
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
        this.workbook = XLSX.readFile(filename, { cellNF: false, cellHTML: true, cellStyles: false });
        this.options = options;
        if (this.options.hasHeadline) {
            this.readHeadlines();
        }
    }
    *generatePayload() {
        var sheet_name = this.workbook.SheetNames[0];
        var sheet = this.workbook.Sheets[sheet_name];
        var range = XLSX.utils.decode_range(sheet['!ref']);
        var rows = range.e.r;
        var row_start = 0;
        //var cols = range.e.c;
        if (this.options.hasHeadline) {
            row_start = 1;
        }
        for (var r = row_start; r <= rows; r++) {
            let newObject = new this.payloadClass();
            let skip = false;
            for (let key in this.fields) {
                var col = this.fields[key].index;
                var idx = XLSX.utils.encode_cell({ r, c: col });
                var cell = sheet[idx];
                var value = null;
                if (cell) {
                    value = cell.h ? cell.h.toString() : cell.v.toString();
                }
                if (value) {
                    if (this.fields[key].converter) {
                        newObject[key] = this.fields[key].converter(value);
                    }
                    else {
                        newObject[key] = value;
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
    close() {
    }
}
exports.XLSDataSource = XLSDataSource;
//# sourceMappingURL=XLSDataSource.js.map