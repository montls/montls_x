var root_path = "/Users/montls/Desktop/app_test/myapp/"

module.exports = {
    extname:'json',
    rootPath:root_path,
    logList_path:root_path+ '/data/list.log',
    split_row:'\r\n',
    split_col:'\t\t',
    eachFileLimit:1000000 * 100//1M * 100
}