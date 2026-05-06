const Sequelize = require("sequelize");
const config = require("../config/config");
const includeAll = require("include-all");
const lodash = require("lodash");

let dbConnection = {};
module.exports = dbConnection;
global.model = null;
global.sequelize = null;

dbConnection.init = () => {
    if(global.model === null){
        global.model = {};
        model.Op = Sequelize.Op;
        global.sequelize = new Sequelize(config.sql.database, config.sql.user, config.sql.password, config.sql.options);
        let modelInfo =  includeAll({
            dirname: require("path").resolve(__dirname, "../schemas"),
            filter: /(.+)\.schema\.js$/,
            excludeDirs: /^\.(git|svn)$/
        }) || {};
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
                model[item.name] = global.sequelize.define(item.name, item.define, item.options);
            }
        });        
        //relationship definition
        

    }
}