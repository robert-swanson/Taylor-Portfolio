// Knex
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "faraday.cse.taylor.edu", // PostgreSQL server
    user: "robert_swanson", // Your user name
    password: "majomiqa", // Your password
    database: "robert_swanson" // Your database name
  }
});

// Objection
const objection = require("objection");
objection.Model.knex(knex);

// Models
const Account = require("./models/Account");
const Authentication = require("./models/Authentication");
const Driver = require("./models/Driver");
const Location = require("./models/Location").Location;
const State = require("./models/Location").State;
const Passenger = require("./models/Passenger").Passenger;
const Passengers = require("./models/Passenger").Passengers;
const Ride = require("./models/Ride");
const Vehicle = require("./models/Vehicle").Vehicle;
const Vehicle_Type = require("./models/Vehicle").Vehicle_Type;

// Hapi
const Joi = require("@hapi/joi"); // Input validation
const Hapi = require("@hapi/hapi"); // Server

const server = Hapi.server({
  host: "localhost",
  port: 3000,
  routes: {
    cors: true
  }
});

async function init() {
  // Show routes at startup.
  await server.register(require("blipp"));

  // Output logging information.
  await server.register({
    plugin: require("hapi-pino"),
    options: {
      prettyPrint: true
    }
  });

  // Configure static file service.
  await server.register(require("@hapi/inert"));

  // Configure routes.
  server.route([
    //Driver
    {
      method: "POST",
      path: "/driver",
      config: {
        description: "Add new driver",
        validate: {
          payload: Joi.object({
            first_name: Joi.string().min(1).required(),
            last_name: Joi.string().min(1).required(),
            phone: Joi.number().min(10).required(),
            license_number: Joi.string().required()
          })
        }
      },
      handler: async (request, h) => {
        const newDriver = await Driver.query().insert(
          // first_name: request.payload.firstName,
          // last_name: request.payload.lastName,
          // phone: request.payload.phone,
          // license_number: request.payload.license_number
          request.payload
        );

        if (newDriver) {
          return {
            ok: true,
            msge: `Added driver '${request.payload.first_name} ${request.payload.last_name}'`
          };
        } else {
          return {
            ok: false,
            msge: `Couldn't add driver '${request.payload.first_name} ${request.payload.last_name}'`
          };
        }
      }
    },
    {
      method: 'GET',
      path: '/driver',
      config: {
        description: 'Retrieve all drivers'
      },
      handler: async (request, h) => {
        return await Driver.query();
      }
    },
    {
      method: 'GET',
      path: '/driver/{driver_id}',
      config: {
        description: 'Retireve one driver',
        validate: {
          params: Joi.object({
             driver_id: Joi.number().integer()
          })
        }
      },
      handler: async (request,h) => {
        return await Driver.query()
          .where('id', request.params.driver_id)
      }
    },
    {
      method: 'PATCH',
      path: '/driver/{driver_id}',
      config: {
        description: 'Update a driver',
        validate: {
          params: Joi.object({
            driver_id: Joi.number().integer()
          }),
          payload: Joi.object({
            first_name: Joi.string().min(1),
            last_name: Joi.string().min(1),
            phone: Joi.string().min(10),
            license_number: Joi.string()
          })
        }
      },
      handler: async (request, h) => {
        let update = await Driver.query()
          .update(request.payload)
          .where('id', request.params.driver_id);
        return {updated: update};
      }
    },



    //Authentication
    {
      method: 'POST',
      path: '/authentication',
      config: {
        description: 'Create a driver/vehicle Authentication',
        validate: {
          payload: Joi.object({
            driver_id: Joi.number().integer().required(),
            vehicle_id: Joi.number().integer().required()
          })
        }
      },
      handler: async (request, h) => {
        let authentication = await Authentication.query().insert(request.payload);
        return authentication;
      }
    },
    {
      method: 'GET',
      path: '/authentication',
      config: {
        description: 'Retrieve all driver/vehicle authentications'
      },
      handler: async (request, h) => {
        return await Authentication.query();
      }
    },
    {                                // redundant with GET /driver/{driver_id}
      method: 'GET',
      path: '/authentication/driver/{driver_id}',
      config: {
        description: 'Retireve one driver',
        validate: {
          params: Joi.object({
            driver_id: Joi.number().integer()
          })
        }
      },
      handler: async (request,h) => {
        return await Authentication.query()
          .select('vehicle_id')
          .where('driver_id', request.params.driver_id)
      }
    },
    // {                                // redundant with GET /vehicle/{vehicle_id}
    //   method: 'GET',
    //   path: '/driver/authentication/vehicle/{vehicle_id}',
    //   config: {
    //     description: 'Retireve one vehicle',
    //     validate: {
    //       params: Joi.object({
    //         vehicle_id: Joi.number().integer()
    //       })
    //     }
    //   },
    //   handler: async (request,h) => {
    //     return await Authentication.query()
    //       .where('id', request.params.vehicle_id)
    //   }
    // },
    {
      method: 'DELETE',
      path: '/authentication/driver/{driver_id}',
      config: {
        description: "Delete all driver authentications",
        validate: {
          params: Joi.object({
            driver_id: Joi.number().integer()
          })
        }
      },
      handler: async (request, h) => {
        let rowsDeleted = await Authentication.query()
          .delete()
          .where('driver_id', request.params.driver_id);
        if(rowsDeleted == 1) {
          return {deleted: rowsDeleted};
        } else {
          return Boom.notFound(`Query returned '${rowsDeleted}' rows`);
        }
      }
    },
    {
      method: 'DELETE',
      path: '/authentication/vehicle/{vehicle_id}',
      config: {
        description: "Delete all vehicle authentications",
        validate: {
          params: Joi.object({
            vehicle_id: Joi.number().integer()
          })
        }
      },
      handler: async (request, h) => {
        let rowsDeleted = await Authentication.query()
          .delete()
          .where('vehicle_id', request.params.vehicle_id);
        if(rowsDeleted == 1) {
          return {deleted: rowsDeleted};
        } else {
          return Boom.notFound(`Query returned '${rowsDeleted}' rows`);
        }
      }
    },
    {
      method: 'DELETE',
      path: '/authentication/driver_vehicle/{driver_id}/{vehicle_id}',
      config: {
        description: "Delete a driver/vehicle authentication",
        validate: {
          params: Joi.object({
            driver_id: Joi.number().integer(),
            vehicle_id: Joi.number().integer()
          })
        }
      },
      handler: async (request, h) => {
        let rowsDeleted = await Authentication.query()
          .delete()
          .where('driver_id', request.params.driver_id)
          .where('vehicle_id',request.params.vehicle_id);
        if(rowsDeleted == 1) {
          return {deleted: rowsDeleted};
        } else {
          return Boom.notFound(`Query returned '${rowsDeleted}' rows`);
        }
      }
    },




    //Passenger
    {
      method: 'POST',
      path: '/passenger',
      config: {
        description: 'Create Passenger',
        validate: {
          payload: Joi.object({
            first_name: Joi.string().min(1).required(),
            last_name: Joi.string().min(1).required(),
            phone: Joi.string().min(10).required()
          })
        }
      },
      handler: async (request, h) => {
        let previous = await Passenger.query()
          .where('first_name', request.payload.first_name)
          .where('last_name', request.payload.last_name)
          .first();
        if (previous) {
          return {
            ok: false,
            msge: 'Passenger already exists'
          }
        } else {
          return await Passenger.query().insert(request.payload);
        }
      }
    },
    {
      method: 'GET',
      path: '/passenger',
      config: {
        description: 'Retrieve all passengers'
      },
      handler: async (request, h) => {
        return await Passenger.query();
      }
    },
    {
      method: 'GET',
      path: '/passenger/{passenger_id}',
      config: {
        description: 'Retireve one passenger',
        validate: {
          // params: Joi.object({
          //   passenger_id: Joi.number().integer()
          // })
        }
      },
      handler: async (request,h) => {
        return await Passenger.query()
          .where('id', request.params.passenger_id)
      }
    },
    {
      method: 'PATCH',
      path: '/passenger/{passenger_id}',
      config: {
        description: 'Update a passenger',
        validate: {
          params: Joi.object({
            passenger_id: Joi.number().integer()
          }),
          payload: Joi.object({
            first_name: Joi.string().min(1),
            last_name: Joi.string().min(1),
            phone: Joi.string().min(10)
          })
        }
      },
      handler: async (request, h) => {
        let update = await Passenger.query()
          .update(request.payload)
          .where('id', request.params.passenger_id);
        return {updated: update};
      }
    },




    //Passengers
    {
      method: 'POST',
      path: '/ride/passenger',
      config: {
        description: 'Add Passengers to a ride',
        validate: {
          payload: Joi.object({
            passenger_id: Joi.number().integer(),
            ride_id: Joi.number().integer()
          })
        }
      },
      handler: async (request, h) => {
        let passengers = await Passengers.query().insert(request.payload).returning('*');
        return passengers;
      }
    },
    {
      method: 'GET',
      path: '/ride/{ride_id}/passenger',
      config: {
        description: 'Retrieve all passengers in a ride',
        validate: {
          params: Joi.object({
            ride_id: Joi.number().integer()
          })
        }
      },
      handler: async (request, h) => {
        return await Passengers.query()
            .where('ride_id', request.params.ride_id);
      }
    },
    // {    // why not just do /passenger/{passenger_id} right after doing /ride/{ride_id}/passengers
    //   method: 'GET',
    //   path: '/ride/{ride_id}/passenger/{passenger_id}',
    //   config: {
    //     description: 'Retireve one passenger in a ride',
    //     validate: {
    //       params: Joi.object({
    //         passenger_id: Joi.number().integer()
    //       })
    //     }
    //   },
    //   handler: async (request,h) => {
    //     return await Passengers.query()
    //       .where('id', request.params.passenger_id)
    //   }
    // },
    // {    // this is done in the ride section
    //   method: 'GET',
    //   path: '/ride/{ride_id}',
    //   config: {
    //     description: 'Retireve one ride',
    //     validate: {
    //       params: Joi.object({
    //         ride_id: Joi.number().integer()
    //       })
    //     }
    //   },
    //   handler: async (request,h) => {
    //     return await Passengers.query()
    //       .where('id', request.params.ride_id)
    //   }
    // },
    {
      method: 'DELETE',
      path: '/ride/{ride_id}/passenger/{passenger_id}',
      config: {
        description: "Remove a passenger from a ride",
        validate: {
          params: Joi.object({
            ride_id: Joi.number().integer().min(0),
            passenger_id: Joi.number().integer()
          })
        }
      },
      handler: async (request, h) => {
        let rowsDeleted = await Passengers.query()
          .delete()
          .where('passenger_id', request.params.passenger_id)
          .where('ride_id', request.params.ride_id);
        if(rowsDeleted == 1) {
          return {deleted: rowsDeleted};
        } else {
          return Boom.notFound(`Query returned '${rowsDeleted}' rows`);
        }
      }
    },
    {
      method: 'GET',
      path: '/passenger/{passenger_id}/ride',
      config: {
        description: "Gets all rides a passenger is in",
        validate: {
          params: Joi.object({
            passenger_id: Joi.number().integer()
          })
        }
      },
      handler: async (request, h) => {
        return await Passengers.query()
          .where('passenger_id', request.params.passenger_id);
      }
    },
    {
      method: 'GET',
      path: '/driver/{driver_id}/ride',
      config: {
        description: "Gets all rides a driver is in",
        validate: {
          params: Joi.object({
            driver_id: Joi.number().integer()
          })
        }
      },
      handler: async (request, h) => {
        return await Passengers.query()
          .where('passenger_id', request.params.driver_id);
      }
    },
    {
      method: 'DELETE',
      path: '/ride/{ride_id}',
      config: {
        description: "Delete a ride",
        validate: {
          params: Joi.object({
            ride_id: Joi.number().integer().min(0)
          })
        }
      },
      handler: async (request, h) => {
        let rowsDeleted = await Passengers.query()
          .delete()
          .where('ride_id', request.params.ride_id);
        if(rowsDeleted == 1) {
          return {deleted: rowsDeleted};
        } else {
          return Boom.notFound(`Query returned ''${rowsDeleted}' rows`);
        }
      }
    },




    //Vehicle
    {
      method: 'POST',
      path: '/vehicle',
      config: {
        description: 'Create Vehicle',
        // validate: {
        //   payload: Joi.object({
        //     color: Joi.string().min(1).required(),
        //     vehicle_type_id: Joi.number().integer().required(),
        //     license_state: Joi.string().min(2).max(2).required(),
        //     license_number: Joi.string().required()
        //   })
        // }
      },
      handler: async (request, h) => {
        let vehicle = await Vehicle.query().insert(request.payload);
        return vehicle;
      }
    },
    {
      method: 'GET',
      path: '/vehicle',
      config: {
        description: 'Retrieve all vehicles'
      },
      handler: async (request, h) => {
        return await Vehicle.query().eager("vehicle_type");
      }
    },
    {
      method: 'GET',
      path: '/vehicle/{vehicle_id}',
      config: {
        description: 'Retireve a vehicle',
        validate: {
          params: Joi.object({
            vehicle_id: Joi.number().integer()
          })
        }
      },
      handler: async (request,h) => {
        return await Vehicle.query()
          .where('id', request.params.vehicle_id)
      }
    },
    {
      method: 'PATCH',
      path: '/vehicle/{vehicle_id}',
      config: {
        description: 'Update a vehicle',
        validate: {
          params: Joi.object({
            vehicle_id: Joi.number().integer()
          }),
          // payload: Joi.object({
            // color: Joi.string().min(1),
            // vehicle_type_id: Joi.number().integer(),
            // license_state: Joi.string().min(2).max(2),
            // license_number: Joi.string()
          // })
        }
      },
      handler: async (request, h) => {
        let update = await Vehicle.query()
          .update(request.payload)
          .where('id', request.params.vehicle_id);
        return {updated: update};
      }
    },




    //Ride
    {
      method: 'POST',
      path: '/ride',
      config: {
        description: 'Create Ride',
        validate: {
          payload: Joi.object({
            driver_id: Joi.number().integer().required(),
            date: Joi.date().required(),
            // time: Joi.date().required(),
            distance: Joi.number().required(),
            fuel_price: Joi.number().required(),
            fee: Joi.number().required(),
            vehicle_id: Joi.number().integer().required(),
            available_seats: Joi.number().integer().required(),
            from_location_id: Joi.number().integer().required(),
            to_location_id: Joi.number().integer().required()
          })
        }
      },
      handler: async (request, h) => {
        let ride = await Ride.query().insert(request.payload);
        return ride;
      }
    },
    {
      method: 'GET',
      path: '/ride',
      config: {
        description: 'Retrieve all rides'
      },
      handler: async (request, h) => {
        return await Ride.query().eager('[to_location,from_location,passenger]');
      }
    },
    {
      method: 'GET',
      path: '/ride/{ride_id}',
      config: {
        description: 'Retireve one ride',
        validate: {
          params: Joi.object({
            ride_id: Joi.number().integer()
          })
        }
      },
      handler: async (request,h) => {
        return await  Ride.query()
          .where('id', request.params.ride_id)
      }
    },
    {
      method: 'PATCH',
      path: '/ride/{ride_id}',
      config: {
        description: 'Update a ride',
        validate: {
          params: Joi.object({
            ride_id: Joi.number().integer()
          }),
          payload: Joi.object({
            driver_id: Joi.number().integer().allow(null),
            date: Joi.date(),
            distance: Joi.number(),
            fuel_price: Joi.number(),
            fee: Joi.number(),
            vehicle_id: Joi.number().integer(),
            available_seats: Joi.number().integer(),
            from_location_id: Joi.number().integer(),
            to_location_id: Joi.number().integer()
          })
        }
      },
      handler: async (request, h) => {
        let update = await Ride.query()
          .update(request.payload)
          .where('id', request.params.ride_id);
        return {updated: update};
      }
    },




    //Vehicle Type
    {
      method: 'POST',
      path: '/vehicle_type',
      config: {
        description: 'Create Vehicle Type',
        validate: {
          payload: Joi.object({
            type: Joi.string().min(1).required(),
            make: Joi.string().min(1).required(),
            model: Joi.string().min(1).required(),
            mpg: Joi.number().required(),
            total_seats: Joi.number().integer().required()
          })
        }
      },
      handler: async (request, h) => {
        let vehicle_type = await Vehicle_Type.query().insert(request.payload);
        return vehicle_type;
      }
    },
    {
      method: 'GET',
      path: '/vehicle_type',
      config: {
        description: 'Retrieve all  vehicle types'
      },
      handler: async (request, h) => {
        return await Vehicle_Type.query();
      }
    },
    {
      method: 'GET',
      path: '/vehicle_type/{vehicle_type_id}',
      config: {
        description: 'Retireve one vehicle type',
        validate: {
          params: Joi.object({
            vehicle_type_id: Joi.number().integer()
          })
        }
      },
      handler: async (request,h) => {
        return await  Vehicle_Type.query()
          .where('id', request.params.vehicle_type_id)
      }
    },
    {
      method: 'PATCH',
      path: '/vehicle_type/{vehicle_type_id}',
      config: {
        description: 'Update a vehicle type',
        validate: {
          params: Joi.object({
            vehicle_type_id: Joi.number().integer()
          }),
          payload: Joi.object({
            type: Joi.string().min(1),
            make: Joi.string().min(1),
            model: Joi.string().min(1),
            mpg: Joi.number().integer(),
            total_seats: Joi.number().integer()
          })
        }
      },
      handler: async (request, h) => {
        let update = await Vehicle_Type.query()
          .update(request.payload)
          .where('id', request.params.vehicle_type_id);
        return {updated: update};
      }
    },




    //Location
    {
      method: 'POST',
      path: '/location',
      config: {
        description: 'Create Location',
        validate: {
          payload: Joi.object({
            name: Joi.string().min(1).required(),
            address: Joi.string().min(1).required(),
            city: Joi.string().min(1).required(),
            state: Joi.string().min(1).required(),
            zip_code: Joi.number().integer().required()
          })
        }
      },
      handler: async (request, h) => {
        let location = await Location.query().insert(request.payload);
        return location;
      }
    },

    {
      method: 'GET',
      path: '/location/{location_id}',
      config: {
        description: 'Retireve a location',
        validate: {
          params: Joi.object({
            location_id: Joi.number().integer()
          })
        }
      },
      handler: async (request,h) => {
        return await  Location.query()
          .where('id', request.params.location_id)
      }
    },
    {
      method: 'PATCH',
      path: '/location/{location_id}',
      config: {
        description: 'Update a location',
        validate: {
          params: Joi.object({
            location_id: Joi.number().integer()
          }),
          payload: Joi.object({
            name: Joi.string().min(1),
            address: Joi.string().min(1),
            city: Joi.string().min(1),
            state: Joi.string().min(1),
            zip_code: Joi.number().integer()
          })
        }
      },
      handler: async (request, h) => {
        let update = await Location.query()
          .update(request.payload)
          .where('id', request.params.location_id);
        return {updated: update};
      }
    },
// -----------Implemented above, not below----------------------
/*
  {
    method: "GET",
    path: "/accounts",
    config: {
      description: "Retrieve all accounts"
    },
    handler: (request, h) => {
      return Account.query();
    }
  },

  {
    method: "DELETE",
    path: "/accounts/{id}",
    config: {
      description: "Delete an account"
    },
    handler: (request, h) => {
      return Account.query()
        .deleteById(request.params.id)
        .then(rowsDeleted => {
          if (rowsDeleted === 1) {
            return {
              ok: true,
              msge: `Deleted account with ID '${request.params.id}'`
            };
          } else {
            return {
              ok: false,
              msge: `Couldn't delete account with ID '${request.params.id}'`
            };
          }
        });
    }
  }
  */
]);

// Start the server.
  await server.start();
}

  process.on("unhandledRejection", err => {
  server.logger().error(err);
  process.exit(1);
});

// Go!
init();
