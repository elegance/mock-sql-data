import * as fs from 'fs'
import Mock = require('mockjs');
import { argv } from 'yargs';
import { TableInfo , DataType} from './TableInfoModel';

let {s, d} = argv;

// if (!s) {
//     throw `param '-s' is required.`;
// }
// if (!fs.existsSync(s)) {
//     throw `'${s}' is not exist.`;
// }

// if (!d) {
//     d = './output.sql';
// }

let tableInfos: Array<TableInfo> = [
    {
        tableName: 'author',
        columns: [
            { key: 'id', type: DataType.number, presision: 0 },
            { key: 'name', type: DataType.string }
        ],
        primary: 'id'
    },
    {
        tableName: 'post',
        columns: [
            { key: 'id', type: DataType.number, presision: 0 },
            { key: 'authorId' },
            { key: 'title', type: DataType.string },
            { key: 'created', type: DataType.datetime },
            { key: 'content', type: DataType.string }
        ],
        primary: 'id',
        forginKey: {
            key: 'author_id',
            ref: {
                table: 'author',
                key: 'id'
            }
        }
    },
    {
        tableName: 'comment',
        columns: [
            { key: 'id', type: 'number', presision: 0 },
            { key: 'postId' },
            { key: 'created', type: 'datetime' },
            { key: 'content', type: 'string' }
        ],
        primary: 'id',
        forginKey: {
            key: 'postId',
            ref: {
                table: 'post',
                key: 'id'
            }
        }
    }
];

let tbs = tableInfos.find(v => v.tableName === 'comment');
console.log(typeof tbs)

// // 遍历集合
// tableInfos.forEach(table => {
//     genTableData(table, []);
// });

// // // 生成单个表数据
// function genTableData(tableInfo: TableInfo, finishTables: Array<string>) {
//     if (finishTables.indexOf(tableInfo.tableName) !== -1) {
//         return;
//     }

//     // 取 是否依赖关系表，
//     let forginKey = tableInfo.forginKey;

//     if(forginKey && finishTables.indexOf(forginKey.ref.table) === -1) { // 如果有依赖，并且依赖的table并未在finishTables中
//         let tbs = tableInfos.find(v => v.tableName === forginKey.ref.table);
//         // genTableData()
//     }
// }

// // let data = Mock.mock({
// //     'list|1-10': [{
// //         'id|+1': 1
// //     }]
// // });