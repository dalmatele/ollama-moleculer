const { generateError } = require("../common/utilities");
const config = require("../config/config");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {MoleculerError} = require("moleculer").Errors
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

module.exports = {
    name: "ai",
    version: 1,
    actions: {
        chat: {
            params: {},
            async handler(ctx){
                try{
                    const {prompt, model = "qwen2:7b" } = ctx.params;
                    if(!prompt){
                        return { error: "Missing prompt" };
                    }
                    const response = await axios.post(
                        `${OLLAMA_URL}/api/generate`,
                        {
                            model,
                            prompt,
                            stream: false
                        },
                        {
                            timeout: 120000
                        }
                    );
                    return {
                        success: true,
                        data: response.data.response
                    }
                }catch(error){
                    throw generateError(error);
                }
            }
        },
        login: {
            params: {
                username: "string",
                password: "string"
            },
            async handler(ctx){
                console.log(ctx.params);
                console.log(config)
                if(ctx.params.username === config.username && ctx.params.password === config.password){
                    const token = jwt.sign({
                            username: ctx.params.username
                        },
                        config.secretPassword,
                        {
                            expiresIn: config.token_lifetime
                        }
                    );
                    return {
                        token: token
                    }
                }else{
                    throw new MoleculerError("Invalid username or password", 400, "BAD_REQUEST");
                }
                
            }
        }
    }
}