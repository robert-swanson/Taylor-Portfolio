const { Model } = require("objection");

const Ride = require("./Ride");

class Location extends Model {
    static get tableName() {
        return 'location'
    }
    static get relationMappings() {
        return {
            from_ride: {
                relation: Model.HasManyRelation,
                modelClass: Ride,
                join: {
                    from: 'location.id',
                    to: 'ride.from_location_id'
                }
            },
            to_ride: {
                relation: Model.HasManyRelation,
                modelClass: Ride,
                join: {
                    from: 'location.id',
                    to: 'ride.to_location_id'
                }
            },
            state_abbreviation: {
                relation: Model.BelongsToOneRelation,
                modelClass: State,
                join: {
                    from: 'location.state',
                    to: 'state.abbreviation'
                }
            },

        }
    }
}

class State extends Model {
    static get tableName() {
        return 'state'
    }
    static get relationMappings() {
        return {
            from_ride: {
                relation: Model.HasManyRelation,
                modelClass: Ride,
                join: {
                    from: 'state.abbreviation',
                    through: {
                        from: 'location.state',
                        to: 'location.id'
                    },
                    to: 'ride.from_location_id'
                }
            },
            to_ride: {
                relation: Model.HasManyRelation,
                modelClass: Ride,
                join: {
                    from: 'state.abbreviation',
                    through: {
                        from: 'location.state',
                        to: 'location.id'
                    },
                    to: 'ride.to_location_id'
                }
            },
            location: {
                relation: Model.HasManyRelation,
                modelClass: Location,
                join: {
                    from: 'location.state',
                    to: 'state.abbreviation'
                }
            }
        }
    }
}
module.exports = {Location, State};