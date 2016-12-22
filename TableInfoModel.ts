export interface TableInfo {
    tableName: string;
    columns: Array<Column>;
    primary: string;
    forginKey?: ForginKey;
}

export interface Column {
    key: string;
    type?: DataType; //当为外键的时候，数据类型与外键表数据一致
    presision?: number;
}

export enum DataType {
    string, number, datetime
}

export interface ForginKey {
    key: string;
    ref: ForginKeyRef;
}

export interface ForginKeyRef {
    table: string;
    key: string;
}