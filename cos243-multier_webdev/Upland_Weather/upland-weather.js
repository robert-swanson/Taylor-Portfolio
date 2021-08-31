const request = require('request')
const moment = require('moment')

request.get({url:"https://api.openweathermap.org/data/2.5/weather",
    qs:{appid:"32843bad9e96bb36c7935458544b1628", id: "4927510", units: "imperial"}},
    callback = (error, response, body) => {
        if (error) { throw error }

        const time = moment().format("h:mm A")
        const temperature = JSON.parse(body).main.temp

        console.log(`At ${time}, it's ${temperature} degrees.`)
    }) 
