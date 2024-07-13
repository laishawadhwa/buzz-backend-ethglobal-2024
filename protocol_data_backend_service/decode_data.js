// Import ethers.js
const { ethers } = require("ethers");

// Define the ABI for the event
const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      }
    ],
    "name": "WithdrawETH",
    "type": "event"
  }
];

// Create an Interface object
const iface = new ethers.Interface(abi);

// Example log data (replace with actual log data)
const log = {
  data: '0x00000000000000000000000000000000000000000000000000470de4df8200000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000007e3180000000000000000000000000000000000000000000000000000000000000000', // Log data
  topics: [
    '0x22b1de295ba82e3c7a822438f4741347553ea2d59af4e3b98febc5af9d77d0d0', // Event signature hash
    '0x00000000000000000000000022c2fb721a11912f730c57e139fa8214f377c224' // Indexed parameter 1 (from)
  ]
};

// Decode the log data
const event = iface.parseLog(log);

console.log(event);
