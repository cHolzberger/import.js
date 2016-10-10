/**
 * generic payload for importer
 */

 export abstract class ImportPayload {
  setField (name:string, key:string, value:any):any {
    var c:any = this.constructor;
    if ( ! c._fields[name]) {
      throw new Error("Unknown Field: " + name);
    }
    c._fields[name][key] = value;
  }

  addField(name:string) {
    var c:any = this.constructor;

    if ( ! c._fields) {
      c._fields={};
    }

    if ( ! c._fields[name]) {
      c._fields[name]={};
    }
  }

  get fields ( ):any {
    var c:any = this.constructor;
    return c._fields;
  }
}
