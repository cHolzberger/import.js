/**
 * generic payload for importer
 */

export abstract class ImportPayload {
    static setField(name: string, key: string, value: any): any {
        var c: any = this;
        if (!c._fields[name]) {
            throw new Error("Unknown Field: " + name);
        }
        c._fields[name][key] = value;
    }

    static addField(name: string) {
        var c: any = this;

        if (!c._fields) {
            c._fields = {};
        }

        if (!c._fields[name]) {
            c._fields[name] = {};
        }
    }

    static getFields():any {
      var c: any = this;
      return c._fields;
    }

    
}
