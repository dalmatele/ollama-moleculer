class Database {
    constructor(model){
        this.model = model;
    }
    async create(item, transaction) {
        const result = await this.model.create(item, {
            transaction: transaction
        });
        return result.dataValues
    }
    async update(values, id, transaction){
        return await this.model.update(values, {
            where: {
                id: id
            },
            transaction: transaction,
            individualHooks: true
        });
    }
    async softDelete(id, transaction){
        return await this.model.update({status: false}, {
            where: {
                id: id
            },
            transaction: transaction
        });
    }
    async get(id){
        return await this.model.findOne({
            where: {
                id: id
            }
        })
    }
    async hardDelete(id, transaction){
        return await this.model.destroy({
            where: {
                id: id
            },
            transaction: transaction,
            individualHooks: true
        })
    }
    async bulkCreate(items, transaction, ignoreDuplicates = true){
        return await this.model.bulkCreate(items, {
            transaction: transaction,
            ignoreDuplicates: ignoreDuplicates
        });
    }
    async upsert(item, transaction){
        return await this.model.upsert(item, {
            transaction: transaction
        });
    }
}
module.exports = Database;