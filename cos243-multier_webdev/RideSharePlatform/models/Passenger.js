const { Model } = require("objection");

const Ride = require("./Ride");

class Passengers extends Model {
    static get tableName() {
        return 'passengers'
    }
}

class Passenger extends Model {
    static get tableName() {
        return 'passenger'
    }
    static get relationMappings() {
        return {
            ride: {
                relation: Model.ManyToManyRelation,
                modelClass: Ride,
                join: {
                    from: 'passenger.id',
                    through: {
                        from: 'passengers.passenger_id',
                        to: 'passengers.ride_id'
                    },
                    to: 'ride.id'
                }
            }
        }
    }
}  

module.exports = {Passengers, Passenger};