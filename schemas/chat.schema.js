const Sequelize = require("sequelize");

module.exports = {
    name: "Chat",
    define:{
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
        sessionId: {type: Sequelize.STRING, allowNull: false},
        userId: {type: Sequelize.STRING, allowNull: false},
        content: {type: Sequelize.TEXT, allowNull: false},
        aiId: {type: Sequelize.STRING, allowNull: false},
        isUser: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true} //to check if this is the content of user
    },
    options:{
        tableName: "chats",
        indexes: [
            {name: "index_sessionId", fields: ["sessionId", "userId", "aiId"]}
        ]
    }
}