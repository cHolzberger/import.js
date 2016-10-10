/*
 * Data Source for Importer
 *
 * maps input data to objects of strings
 */

import {ImportPayload} from "./ImportPayload";

export class DataSource {
  public *generatePayload():IterableIterator<ImportPayload> {
    yield null;

    return false;
  };
}
