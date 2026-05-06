const config = require("../config/config");
const Sequelize = require("sequelize");
const includeAll = require("include-all");
const lodash = require("lodash");
const debug = {
    info: require("debug")("init:info"),
    error: require("debug")("error")
};


let sequelize = new Sequelize(config.sql.database, config.sql.user, config.sql.password, config.sql.options);
let modelInfo = includeAll({
    dirname: require("path").resolve(__dirname, "../schemas"),
    filter: /(.+)\.schema\.js$/,
    excludeDirs: /^\.(git|svn)$/
}) || {};
let model = {};
model.Op = Sequelize.Op;
lodash.map(modelInfo, (item) => {
    if(item.options){
        if(!item.options.indexes){
            item.options.indexes = [];
        }
        let extendDataIndex = [
            {unique: true, name: "index_id", fields: ["id"]}
        ];
        item.options.indexes = lodash.union(item.options.indexes, extendDataIndex);
        item.options.paranoid = false;
        model[item.name] = sequelize.define(item.name, item.define, item.options);
    }
});

const syncData = () => {
    debug.info("Start sync database...");
    sequelize.sync({alter: true}).then(() => {
        debug.info("Success sync database");
        sequelize.close();
    }).catch(error => {
        debug.error("Sync database error", error);
        sequelize.close();        
        console.log(error);
    })
};

syncData();