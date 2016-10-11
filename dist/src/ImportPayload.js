/**
 * generic payload for importer
 */
"use strict";
class ImportPayload {
    static setField(name, key, value) {
        var c = this;
        if (!c._fields[name]) {
            throw new Error("Unknown Field: " + name);
        }
        c._fields[name][key] = value;
    }
    static addField(name) {
        var c = this;
        if (!c._fields) {
            c._fields = {};
        }
        if (!c._fields[name]) {
            c._fields[name] = {};
        }
    }
    static getFields() {
        var c = this;
        return c._fields;
    }
}
exports.ImportPayload = ImportPayload;
//# sourceMappingURL=ImportPayload.js.map