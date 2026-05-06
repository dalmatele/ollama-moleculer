const Database = require("./Database");
class Chat extends Database {
    model = model.Chat;
    async getUserChatHistory(userId, sessionId, aiId){
        return await this.model.findAll({
            where: {
                userId: userId,
                sessionId: sessionId,
                aiId: aiId
            },
            order: [["createdAt", "ASC"]],
            limit: 20           
        });
    }
}
module.exports = Chat;