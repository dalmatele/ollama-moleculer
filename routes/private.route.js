
const config = require("../config/config");
module.exports = {
    path: "/api/private",
    whitelist: [
        "v1.ai.chat"
    ],
    authentication: true, //check token
    authorization: true,//check role
    mappingPolicy: "all",
    aliases: {
        "POST chat": "v1.ai.chat"
    },
    bodyParsers: {
        json: {
            strict: false,
            limit: "5MB"//https://github.com/expressjs/body-parser#change-accepted-type-for-parsers
        },
        urlencoded: {
            extended: true,
            limit: "5MB"
        }
    }
}