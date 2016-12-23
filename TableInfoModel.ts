export interface TableInfo {
    tableName: string;
    columns: Array<Column>;
    primary?: string;

    mockNum?: number;  //生成数据的条数
}

export interface Column {
    key: string;
    idx: number; // 索引顺序，定义列顺序，节省空间，便于按顺序取值，类似proto 字段索引的作用
    mock?: Function;
    val?: any;
    forgin?: ForginKeyRef;
}

export interface ForginKeyRef {
    table: string;
    key: string;
}