

const request = require('request');

//adress details 
let address_details = {}
request('https://explorer-api-holesky.morphl2.io/api/v2/addresses/0x4b8a65c8ef37430edFaaD1B61Dba2D680f56FFd7', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    address_details = body;
    console.log("Address details \n", address_details) // Print the details.
  }
})


//basic stats
let address_stats = {}
let api_call_link = 'https://explorer-api-holesky.morphl2.io/api/v2/addresses/0x4b8a65c8ef37430edFaaD1B61Dba2D680f56FFd7/counters';
request(api_call_link, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      address_stats = body;
      console.log("Address stats", address_stats) // Print the details.
    }
  })

  //transaction_count
  let transaction_count = 0
  let transaction_api = ""
// console.log(get_address_info("0x4b8a65c8ef37430edFaaD1B61Dba2D680f56FFd7"));