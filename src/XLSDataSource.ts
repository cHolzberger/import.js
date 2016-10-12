import {CSVDataSource} from "./CSVDataSource"
import {ImportPayload} from "./ImportPayload";
var XLSX = require('xlsx');
import fs = require("fs");


export interface XLSDataSourceOptions {
    hasHeadline: boolean;
    strictMode: boolean;
    delimiter?: string;
}

export class XLSDataSource<T extends ImportPayload> extends CSVDataSource<T> {

    public open(filename: string, options: XLSDataSourceOptions = {hasHeadline: false, strictMode: false, delimiter: ","}): void {
        try {
            var stats = fs.statSync(filename);
        } catch (e) {
            throw new Error("File not found: " + filename);
        }

        if (!stats.isFile()) {
            throw new Error("File not found: " + filename);
        }

        this.filename = filename;
        var workbook = XLSX.readFile(filename);
        this.content = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
        if ( ! options.delimiter) options.delimiter = ",";
        this.options = options;

        this.parseCsv();
    }
}
