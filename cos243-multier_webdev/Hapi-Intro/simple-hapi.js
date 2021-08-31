const knex = require('knex')({
    client: 'pg',
    connection: {           
        host: 'faraday.cse.taylor.edu',
        user: 'readonly',
        password: 'nerds4christ',
        database: 'dvdrental'
    }
});


const Hapi = require('@hapi/hapi');
const init = async () => {
	// Create a new Hapi server
	const server = Hapi.server({
		 host: 'localhost',
		 port: 3000
	});

	// Output endpoints at startup.
	await server.register({	plugin: require('blipp'),
							options: {showAuth: true}});

	// Log stuff.
	await server.register({	
		plugin: require('hapi-pino'),
		options: {
			prettyPrint: true
		}
	});

	server.route([ 
		{
			method: 'GET',
			path: '/',
			handler: (request, h) => {
				 return 'Hello, Hapi';
			} 
		},
		{
			method: 'GET',
			path: '/countries',
			handler: async (request, h) => {
				return await knex.select()
					.from('country')
					.then(countries => {
						return countries
					})
			}
		},
		{
			method: 'GET',
			path: '/countries/{country_id}',
			handler: async (request, h) => {
				return await knex.select()
					.from('country')
//					.where('country_id',request.params.country_id)
					.first()
					.then(countries => {
						return countries
					})
			}
		},
		{
			method: 'GET',
			path: '/films',
			handler: async (request, h) => {
				if (request.query.title){
					return await knex.select('film_id', 'title', 'rental_rate')
						.from('film')
						.where('title', 'like', request.query.title)
						.then(films => {
							return films
						})
				} else {
					return await knex.select('film_id', 'title', 'rental_rate')
						.from('film')
						.first()
						.then(films => {
							return films
						})
				}
			}
		}

	]);
	// Start the server.
	await server.start();
}
// Catch promises lacking a .catch.
process.on('unhandledRejection', err => {
	console.error(err);
	process.exit(1);
});
// Go!
init();
