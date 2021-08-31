const { Model } = require("objection");

class Authentication extends Model {
    static get tableName() {
        return 'authentication'
    }
}

module.exports = Authentication;