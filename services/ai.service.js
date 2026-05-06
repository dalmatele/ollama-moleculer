const { generateError } = require("../common/utilities");
const config = require("../config/config");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {MoleculerError} = require("moleculer").Errors
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const Chat = require("../models/chat");

module.exports = {
    name: "ai",
    version: 1,
    actions: {
        chat: {
            params: {
                prompt: "string",
                userId: "string",
                sessionId: "string",
                aiId: "string"
            },
            timeout: 130000,
            async handler(ctx){
                try{
                    // const {prompt, model = "qwen2.5:7b" } = ctx.params;
                    const {prompt, model = "ai-concierge" } = ctx.params;
                    if(!prompt){
                        return { error: "Missing prompt" };
                    }
                    const ChatDB = new Chat();
                    
                    //get history chat of user
                    const histories = await ChatDB.getUserChatHistory(ctx.params.userId, ctx.params.sessionId, ctx.params.aiId);
                    const prompts = [];
                    for(let i = 0; i < histories.length; i++){
                        prompts.push({
                            role: histories[i].isUser ? "user" : "assistant",
                            content: histories[i].content
                        });
                    }
                    const response = await axios.post(
                        `${OLLAMA_URL}/api/chat`,
                        {
                            model,
                            messages: prompts,
                            stream: false
                        },
                        {
                            timeout: 120000
                        }
                    );
                    console.log(response.data)
                    const transaction = await sequelize.transaction();
                    try{
                        let item = {
                            userId: ctx.params.userId,
                            sessionId: ctx.params.sessionId,
                            aiId: ctx.params.aiId,
                            content: prompt,
                            isUser: true
                        }
                        await ChatDB.create(item, transaction);
                        item = {
                            userId: ctx.params.userId,
                            sessionId: ctx.params.sessionId,
                            aiId: ctx.params.aiId,
                            content: response.data.message.content,
                            isUser: false
                        }
                        await ChatDB.create(item, transaction);
                        await transaction.commit();
                    }catch(err){
                        await transaction.rollback();
                        throw generateError(err);
                    }
                    return {
                        success: true,
                        data: response.data.message.content
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