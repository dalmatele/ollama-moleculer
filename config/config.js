const debug = require("debug")("init:warn");
const lodash = require("lodash");
let config = {
    secretPassword: process.env.SECRET_PASSWORD,
    token_lifetime: process.env.TOKEN_LIFETIME,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
}

let mappingConfig = {};
if(!process.env.NODE_ENV){
    process.env.NODE_ENV = "development";
}

try{
    mappingConfig = require(`./env/${process.env.NODE_ENV}.js`);
}catch(err){
    debug("Error: " + err.message);
}

/**
 * Replace the default values of config with the new one
 * @param {*} obj 
 * @param {*} objMap 
 * @returns 
 */
const replace = (obj = {}, objMap) => {
    lodash.map(objMap, (value, key) => {
        if (!lodash.isPlainObject(value)) {
        if (obj && obj[key] && value) {
            obj[key] = value;
        }
        } else {
        if (obj && obj[key] && objMap && objMap[key]) {
            obj[key] = replace(obj[key], objMap[key]);
        }
        }
    });
    return obj;
};

if(config && mappingConfig){
    config = replace(config, mappingConfig);
}

module.exports = config;
