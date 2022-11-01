const request = require('request');

//big picture function using fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes
//multiple API requests
//takes in callback with error or results
//returns a callback (with error if any, fly-over times as an array)
// eg [ { risetime: <number>, duration: <number> }, ... ]
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

//FETCHMYIP makes a single API request to find the user's I[ address
//takes in a callback (if error)
//returns a callback (with error if any, and IP address in string format)
//eg. "ip":"24.37.137.170"
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

//FETCHCOORDSBYIP makes a single API request to find the user's lat/long coordinates with a given IP address
//takes in a callback (if error) and the IP string
//returns a callback (with error if any, lat/long in an object)
// eg { latitude: '49.27670', longitude: '-123.13000' }
const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }
    const { latitude, longitude } = parsedBody;

    callback(null, {latitude, longitude});
  });
};

//FETCHISSFLYOVERTIMES makes a single API request to find upcoming ISS flyover times given lat/long coords
//takes in a callback (if error) and an object with lat/lng keys
//returns a callback (with error if any, flyover times as an array of objects)
// eg [ { risetime: 134564234, duration: 600 }, ... ]
const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

//exports main function nextISSTimesForMyLocation to index.js
module.exports = { nextISSTimesForMyLocation };
