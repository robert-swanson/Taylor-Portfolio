const { Model } = require("objection");

const Driver = require("./Driver");
const Ride = require("./Ride");

class Vehicle extends Model {
    static get tableName() {
        return 'vehicle'
    }

    static get relationMappings() {
        return {
            driver: {
                relation: Model.ManyToManyRelation,
                modelClass: Driver,
                join: {
                    from: 'vehicle.id',
                    through: {
                        from: 'authentication.vehicle_id',
                        to: 'authentication.driver_id'
                    },
                    to: 'driver.id'
                }
            },
            ride: {
                relation: Model.HasManyRelation,
                modelClass: Ride,
                join: {
                    from: 'vehicle.id',
                    to: 'ride.vehicle_id'
                }
            },
            vehicle_type: {
                relation: Model.BelongsToOneRelation,
                modelClass: Vehicle_Type,
                join: {
                    from: 'vehicle.vehicle_type_id',
                    to: 'vehicle_type.id'
                }
            },
        }
    }
}

class Vehicle_Type extends Model {
    static get tableName() {
        return 'vehicle_type'
    }

    static get relationMappings() {
        return {
            vehicle: {
                relation: Model.HasManyRelation,
                modelClass: Vehicle,
                join: {
                    from: 'vehicle_type.id',
                    to: 'vehicle.vehicle_type_id'
                }
            },
        }
    }
}

module.exports = {Vehicle, Vehicle_Type};