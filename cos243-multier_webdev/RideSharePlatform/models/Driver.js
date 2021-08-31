const { Model } = require("objection");

const Vehicle = require("./Vehicle").Vehicle;
const Ride = require("./Ride");

class Driver extends Model {
    static get tableName() {
        return 'driver'
    }

    static get relationMappings() {
        return {
            vehicle: {
                relation: Model.ManyToManyRelation,
                modelClass: Vehicle,
                join: {
                    from: 'driver.id',
                    through: {
                        from: 'authentication.driver_id',
                        to: 'authentication.vehicle_id'
                    },
                    to: 'vehicle.id'
                }
            },
            ride: {
                relation: Model.HasManyRelation,
                modelClass: Ride,
                join: {
                    from: 'driver.id',
                    to: 'ride.id'
                }
            },
        }
    }
}

module.exports = Driver;