const config = require("../config/config");
module.exports = {
    path: "/api/public",
    whitelist: [
        "v1.ai.login"
    ],
    authorization: false,
    aliases: {
        "POST /user/login": "v1.ai.login", //employee login
    },
    bodyParsers: {
        json: {
            strict: false,
            limit: "5MB"
        },
        urlencoded: {
            extended: true,
            limit: "5MB"
        }
    },
    logging: true,
    async onAfterCall(ctx, route, req, res, data){
        let resp = {
            data: data
        };
        return resp;
    },
    //https://moleculer.services/docs/0.12/moleculer-web.html#Calling-options
    async onBeforeCall(ctx, route, req, res){
    }
}