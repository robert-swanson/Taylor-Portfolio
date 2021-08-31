const { Model } = require("objection");

const Driver = require("./Driver");
const Location = require("./Location").Location;
const State = require("./Location").State;
const Passenger = require("./Passenger").Passenger;
const Vehicle = require("./Vehicle").Vehicle;

class Ride extends Model {
    static get tableName() {
        return 'ride'
    }

    static get relationMappings() {
        return {
            vehicle: {
                relation: Model.BelongsToOneRelation,
                modelClass: Vehicle,
                join: {
                    from: 'ride.vehicle_id',
                    to: 'vehicle.id'
                }
            },
            driver: {
                relation: Model.BelongsToOneRelation,
                modelClass: Driver,
                join: {
                    from: 'ride.driver_id',
                    to: 'driver.id'
                }
            },
            passenger: {
                relation: Model.ManyToManyRelation,
                modelClass: Passenger,
                join: {
                    from: 'ride.id',
                    through: {
                        from: 'passengers.ride_id',
                        to: 'passengers.passenger_id'
                    },
                    to: 'passenger.id'
                }
            },
            from_location: {
                relation: Model.BelongsToOneRelation,
                modelClass: Location,
                join: {
                    from: 'ride.from_location_id',
                    to: 'location.id'
                }
            },
            to_location: {
                relation: Model.BelongsToOneRelation,
                modelClass: Location,
                join: {
                    from: 'ride.to_location_id',
                    to: 'location.id'
                }
            },
            from_state: {
                relation: Model.BelongsToOneRelation,
                modelClass: State,
                join: {
                    from: 'ride.from_location_id',
                    through: {
                        from: 'location.id',
                        to: 'location.state'
                    },
                    to: 'state.abbreviation'
                }
            },
            to_state: {
                relation: Model.BelongsToOneRelation,
                modelClass: State,
                join: {
                    from: 'ride.to_location_id',
                    through: {
                        from: 'location.id',
                        to: 'location.state'
                    },
                    to: 'state.abbreviation'
                }
            },
        }
    }
}

module.exports = Ride;
