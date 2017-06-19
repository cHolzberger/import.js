/*
 * Data Source for Importer
 *
 * maps input data to objects of strings
 */

import { ImportPayload } from "./ImportPayload";
var merge = require("merge-deep");


export interface DataSourceColumnInfo {
    index: number,
    required?: boolean,
    converter?: (x: string) => any;
}

export interface DataSourceHeadlineColumnInfo {
    regex: RegExp,
    required?: boolean
    index?: number,
    found?: boolean,
    converter?: (x: string) => any;
}

export interface constructorof<T> {
  new (): T;
}

export abstract class DataSource<T extends ImportPayload>  {
  protected payloadClass: constructorof<T>;
  protected _dynamicFields:any;

  constructor(ctor: constructorof<T>) {
    this.payloadClass = ctor;
  }

  protected abstract readHeadlines(): void;


  public *generatePayload(): IterableIterator<ImportPayload> {
    yield null;

    return false;
  };

  public abstract close():void;

  /**
    gets the static and dynamic mappings for the fields in T
    **/
  get fields(): any {
    var c: any = this.payloadClass;
    return merge(this._dynamicFields, c._fields);
  }


  protected allRequiredFound(): boolean {
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

  public open(ds: string, options: any = {}): void {

  }

    // decorators

    public static indexColumn(info: DataSourceColumnInfo) {
        return function (target: any, propertyKey: string) {
            target.constructor.addField(propertyKey);
            target.constructor.setField(propertyKey, "index", info.index);
            target.constructor.setField(propertyKey, "converter", info.converter);
            target.constructor.setField(propertyKey, "required", info.required);

        }
    }

    public static regexColumn(info: DataSourceHeadlineColumnInfo) {
        return function (target: any, propertyKey: string) {
            target.constructor.addField(propertyKey);
            target.constructor.setField(propertyKey, "regex", info.regex);
            target.constructor.setField(propertyKey, "converter", info.converter);
            target.constructor.setField(propertyKey, "required", info.required);
        }
    }
}
