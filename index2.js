const { nextISSTimesForMyLocation } = require('./iss_promised.js');
const { printPassTimes } = require('./index.js');
//call function and use .then method on its return value
//.then takes in callback which accepts and prints it

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });
  