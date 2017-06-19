"use strict";
/*
 * Data Source for Importer
 *
 * maps input data to objects of strings
 */
Object.defineProperty(exports, "__esModule", { value: true });
var merge = require("merge-deep");
class DataSource {
    constructor(ctor) {
        this.payloadClass = ctor;
    }
    *generatePayload() {
        yield null;
        return false;
    }
    ;
    /**
      gets the static and dynamic mappings for the fields in T
      **/
    get fields() {
        var c = this.payloadClass;
        return merge(this._dynamicFields, c._fields);
    }
    allRequiredFound() {
        var allRequiredFound = true;
        for (var idx in this.fields) {
            var item = this.fields[idx];
            if (item.required) {
                allRequiredFound = allRequiredFound && item.found;
                if (!item.found) {
                    console.error("Not all required fields found in DataSource; Missing: " + idx);
                    return;
                }
            }
        }
        return allRequiredFound;
    }
    open(ds, options = {}) {
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
exports.DataSource = DataSource;
//# sourceMappingURL=DataSource.js.map