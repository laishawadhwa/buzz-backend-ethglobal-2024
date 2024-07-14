

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


function extractTokenData(apiResponse) {
  // Check if the method is addLiquidity or addLiquidityETH
  if (apiResponse.method === 'addLiquidity' || apiResponse.method === 'addLiquidityETH') {
    let tokenData = {};
    let amouunt_

    if (apiResponse.method === 'addLiquidity') {
      // Extract tokenA and tokenB addresses and their respective values
      const tokenA = apiResponse.decoded_input.parameters.find(param => param.name === 'tokenA');
      const tokenB = apiResponse.decoded_input.parameters.find(param => param.name === 'tokenB');
      const amountADesired = apiResponse.decoded_input.parameters.find(param => param.name === 'amountADesired');
      const amountBDesired = apiResponse.decoded_input.parameters.find(param => param.name === 'amountBDesired');

      if (tokenA && tokenB && amountADesired && amountBDesired) {
        tokenData[tokenA.value] = amountADesired.value;
        tokenData[tokenB.value] = amountBDesired.value;
      }
    } else if (apiResponse.method === 'addLiquidityETH') {
      // Extract token address and values for amountTokenMin and amountETHMin
      const token = apiResponse.decoded_input.parameters.find(param => param.name === 'token');
      const amountTokenMin = apiResponse.decoded_input.parameters.find(param => param.name === 'amountTokenMin');
      const amountETHMin = apiResponse.decoded_input.parameters.find(param => param.name === 'amountETHMin');

      if (token && amountTokenMin && amountETHMin) {
        tokenData[token.value] = {
          amountTokenMin: amountTokenMin.value,
          amountETHMin: amountETHMin.value
        };
      }
    }
  }

  return null;
}

// Example usage:
const apiResponse = {
  "timestamp": "2024-07-13T17:43:21.000000Z",
  "fee": {
    "type": "actual",
    "value": "330370002780800"
  },
  "gas_limit": "166067",
  "block": 3757831,
  "status": "error",
  "method": "addLiquidityETH",
  "batch_index": 151107,
  "confirmations": 5540,
  "type": 0,
  "exchange_rate": "3077.97",
  "to": {
    "hash": "0x07968156ADF895922406523887E5C157623c38Db",
    "implementation_name": null,
    "is_contract": true,
    "is_verified": true,
    "name": "UniswapV2Router02",
    "private_tags": [],
    "public_tags": [],
    "watchlist_names": []
  },
  "tx_burnt_fee": null,
  "max_fee_per_gas": null,
  "result": "execution reverted",
  "hash": "0x084262d3579e4c42fc7170baab1136ddb392e50f7aa5629ae5a4da0b1fb3284f",
  "gas_price": "2000000000",
  "priority_fee": null,
  "base_fee_per_gas": null,
  "from": {
    "hash": "0xA745Cc25C9E5BB2672D26B58785f6884eF50F2c6",
    "implementation_name": null,
    "is_contract": false,
    "is_verified": false,
    "name": null,
    "private_tags": [],
    "public_tags": [],
    "watchlist_names": []
  },
  "token_transfers": null,
  "tx_types": [
    "coin_transfer",
    "contract_call"
  ],
  "gas_used": "165185",
  "created_contract": null,
  "position": 5,
  "nonce": 3,
  "has_error_in_internal_txs": true,
  "actions": [],
  "l1_fee": "2780800",
  "decoded_input": {
    "method_call": "addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline)",
    "method_id": "f305d719",
    "parameters": [
      {
        "name": "token",
        "type": "address",
        "value": "0x9e12ad42c4e4d2acfbade01a96446e48e6764b98"
      },
      {
        "name": "amountTokenDesired",
        "type": "uint256",
        "value": "1200000000000000000"
      },
      {
        "name": "amountTokenMin",
        "type": "uint256",
        "value": "1188000000000000000"
      },
      {
        "name": "amountETHMin",
        "type": "uint256",
        "value": "88419651346376351"
      },
      {
        "name": "to",
        "type": "address",
        "value": "0xa745cc25c9e5bb2672d26b58785f6884ef50f2c6"
      },
      {
        "name": "deadline",
        "type": "uint256",
        "value": "1720892644"
      }
    ]
  },
  "token_transfers_overflow": null,
  "raw_input": "0xf305d7190000000000000000000000009e12ad42c4e4d2acfbade01a96446e48e6764b9800000000000000000000000000000000000000000000000010a741a462780000000000000000000000000000000000000000000000000000107c9fb4a92a0000000000000000000000000000000000000000000000000000013a213455aa269f000000000000000000000000a745cc25c9e5bb2672d26b58785f6884ef50f2c6000000000000000000000000000000000000000000000000000000006692bce4",
  "value": "89312779137753890",
  "max_priority_fee_per_gas": null,
  "revert_reason": {
    "raw": ""
  },
  "confirmation_duration": [
    0,
    1333
  ],
  "tx_tag": null
};

const result = extractTokenData(apiResponse);
console.log(result);
