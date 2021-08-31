// Load node packages
const moment = require("moment");
const request = require("request");

// Report the weather; `result` is the JSON object returned from OWM.
function reportWeather(result) {
	console.log(`On ${moment()}, it's ${result.main.temp} degrees.`);
}

// Report an error.
function reportError(error) {
	console.log(`Something went haywire: '${error}'`);
}

function requestPromisified(uri, qs) {
	return new Promise((resolve, reject) => {
		request.get({uri, qs}, callback = (err, resp, body) => {
			if(err){reject(err)};
			resolve(body);
		})
	})
}

function getTimeAndTempPromise(uri, qs) {
	requestPromisified(uri, qs)
		.then(content => reportWeather(JSON.parse(content)))
		.catch(err => {
			reportError(err);
			throw err;
		});
}

async function getTimeAndTempAsync(uri, qs) {
	try{
		await requestPromisified(uri, qs)
			.then(content => reportWeather(JSON.parse(content)))
	}catch(err){
		reportError(err);
		throw err
	}
}


 // Credentials to access Open Weather Map
const uri = "https://api.openweathermap.org/data/2.5/weather";
const qs = {
  id: "4927510",
  appid: "32843bad9e96bb36c7935458544b1628",
  units: "imperial"
};
// Invoke both versions of time-and-temp.
getTimeAndTempPromise(uri, qs);
getTimeAndTempAsync(uri, qs);
		
