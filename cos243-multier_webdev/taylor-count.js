function countOccurrences(target, source){
    let occurences = source.match(RegExp(target, "g"));
    return occurences ? occurences.length : 0;
}

const request = require('request')

request.get("https://www.taylor.edu", (error, httpResponse, body) => {
    if (error) {
            throw new Error("Request failed");
    }
    console.log(`The word 'taylor' occurs ${countOccurrences("taylor", body.toLowerCase())} times in the TU home page.`);
});

