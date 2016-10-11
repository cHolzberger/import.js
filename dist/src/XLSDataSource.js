"use strict";
const CSVDataSource_1 = require("./CSVDataSource");
var XLSX = require('xlsx');
const fs = require("fs");
class XLSDataSource extends CSVDataSource_1.CSVDataSource {
    open(filename, options = { hasHeadline: false }) {
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
        var workbook = XLSX.readFile(filename);
        this.content = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
        this.options = options;
        this.parseCsv();
    }
}
exports.XLSDataSource = XLSDataSource;
//# sourceMappingURL=XLSDataSource.js.map