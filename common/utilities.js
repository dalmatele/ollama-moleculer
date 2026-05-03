const {MoleculerError} = require("moleculer").Errors;

let self = module.exports = {
    generateError(error) {
        console.log(error);
        return new MoleculerError(error.message ? error.message : "Internal error", error.code ? error.code : 500, error.type ? error.type : "INTERNAL_ERROR");
    }
}