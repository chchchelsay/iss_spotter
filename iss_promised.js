const request = require('request-promise-native');

//promise version! uses API requests from the three below functions to return accurate flyover times
const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};


//request: get user's IP address from https://www.ipify.org/
//input: none
//returns promise of request for IP data returned as json string
const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};


//request: get user's lat/long coordinates using provided IP - from http://ipwho.is
//input: IP as JSON string
//returns promise of request for lat/lon
//eventually { latitude: '49.27670', longitude: '-123.13000' }

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}`);
};


//request: get upcoming ISS flyover times given lat/long coords from  https://iss-flyover.herokuapp.com
//input: object with lat/long keys
//returns promise of request for flyover times
//eventually an array of objects [ { risetime: 134564234, duration: 600 }, ... ]

const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  const url = `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return request(url);
};

module.exports = { nextISSTimesForMyLocation };
