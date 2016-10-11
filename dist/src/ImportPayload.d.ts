/**
 * generic payload for importer
 */
export declare abstract class ImportPayload {
    static setField(name: string, key: string, value: any): any;
    static addField(name: string): void;
    static getFields(): any;
}
