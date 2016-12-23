import * as fs from 'fs'
import { Mock, Random } from 'mockjs';
import { argv } from 'yargs';
import { TableInfo } from './TableInfoModel';

let {s, d} = argv;

// if (!s) {
//     throw `param '-s' is required.`;
// }
// if (!fs.existsSync(s)) {
//     throw `'${s}' is not exist.`;
// }

if (!d) {
    d = './bin/output.sql';
}

let tableInfos: Array<TableInfo> = [
    {
        tableName: 'author',
        columns: [
            { key: 'id', mock: () => Random.increment(), idx: 0 },
            { key: 'name', mock: () => Random.cname(), idx: 1 }
        ],
        primary: 'id',
        mockNum: 1000
    },
    {
        tableName: 'post',
        columns: [
            { key: 'id', mock: () => Random.increment(), idx: 0 },
            { key: 'authorId', forgin: { table: 'author', key: 'id' }, idx: 1 },
            { key: 'title', mock: () => Random.title(), idx: 2 },
            { key: 'created', mock: () => Random.datetime(), idx: 3 },
            { key: 'content', mock: () => Random.paragraph(2, 5), idx: 4 }
        ],
        primary: 'id',
        mockNum: 1000
    },
    {
        tableName: 'comment',
        columns: [
            { key: 'id', mock: () => Random.increment(), idx: 0 },
            { key: 'postId', forgin: { table: 'post', key: 'id' }, idx: 1 },
            { key: 'created', mock: () => Random.datetime(), idx: 2 },
            { key: 'content', mock: () => Random.paragraph(2, 5), idx: 3 }
        ],
        primary: 'id',
        mockNum: 1000
    }
];

// 遍历集合
function genTableDatas() {
    let finishDatas = {};

    tableInfos.forEach(table => {
        genTableData(table, finishDatas);
    });
    return finishDatas;
}

// // 生成单个表数据
function genTableData(tableInfo: TableInfo, finishDatas: Object) {
    if (!finishDatas[tableInfo.tableName]) {
        finishDatas[tableInfo.tableName] = [];
    }
    let curData: Array<Object> = finishDatas[tableInfo.tableName];

    if (curData.length > 0) {
        return;
    }

    // 取 是否依赖关系表
    let forginTables: Array<string> = [];
    tableInfo.columns.filter(col => col.forgin).forEach(col => forginTables.push(col.forgin.table));

    // 遍历依赖表
    forginTables.forEach(tableName => {
        if (!finishDatas[tableName]) { //依赖表还未生成
            let tb = tableInfos.find(v => v.tableName === tableName);
            genTableData(tb, finishDatas); //递归先生成依赖表
        }
    });

    // 生成列数据
    for (let i = 0; i < tableInfo.mockNum; i++) {
        let data = tableInfo.columns.map((col) => {
            if (col.forgin) {
                let refDatas: Array<Object> = finishDatas[col.forgin.table];

                return refDatas[Random.integer(0, refDatas.length - 1)][getColumnIdx(col.forgin.table, col.forgin.key)];
            } else {
                return col.mock();
            }
        })
        curData.push(data);
    }
}

/**
 * 缓存 表中列的索引
 */
let cacheMap: Map<string, number> = new Map();

/**
 * 获取表列的索引
 */
function getColumnIdx(tableName: string, columnKey: string) {
    let cacheKey = tableName + '.' + columnKey;
    let v = cacheMap.get(cacheKey);

    if (typeof v !== 'number') {
        let refTb = tableInfos.find(v => v.tableName === tableName);
        v = refTb.columns.find(v => v.key === columnKey).idx;
        cacheMap.set(cacheKey, v);
    }
    return v;
}

// 生成表数据
console.time('genDatas');
let allData = genTableDatas();
console.timeEnd('genDatas');

Object.keys(allData).forEach(tableName => {
    let tb = tableInfos.find(v => v.tableName === tableName);
    let columStr = tb.columns.map(col => col.key).join(',');
    let sql = `insert into ${tableName}(${columStr}) values \n`;

    sql += allData[tableName].map(row => '(' + row.map(val => (typeof val !== 'number' ? '\'' + val + '\'' : val)).join(',') + ')').join(',\n') + ';\n\n';
    fs.appendFile(d, sql, (err) => {
        console.log(err);
    });
});
