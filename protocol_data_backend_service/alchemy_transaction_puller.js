// importing axios for making requests
const axios = require("axios");

// Wallet address
const address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

// Alchemy URL --> Replace with your API key at the end
const baseURL = `https://eth-mainnet.g.alchemy.com/v2/5s29dWKvXzHyrWXdEGzz0XqtM-SS_QWg`;

// Data for making the request to query token balances
const data = JSON.stringify({
  jsonrpc: "2.0",
  method: "alchemy_getTokenBalances",
  headers: {
    "Content-Type": "application/json",
  },
  params: [`${address}`],
  id: 42,
});

// config object for making a request with axios
const config = {
  method: "post",
  url: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  data: data,
};

async function main() {
  // fetching the token balances
  let response = await axios(config);
  response = response["data"];

  // Getting balances from the response
  const balances = response["result"];

  // Remove tokens with zero balance
  const nonZeroBalances = await balances.tokenBalances.filter((token) => {
    return token.tokenBalance !== "0";
  });

  console.log(`Token balances of ${address}: \n`);

  // Counter for SNo of final output
  let i = 1;

  // Loop through all tokens with non-zero balance
  for (let token of nonZeroBalances) {
    // Get balance of token
    let balance = token.tokenBalance;

    // options for making a request to get the token metadata
    const options = {
      method: "POST",
      url: baseURL,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      data: {
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getTokenMetadata",
        params: [token.contractAddress],
      },
    };

    // getting the token metadata
    const metadata = await axios.request(options);

    // Compute token balance in human-readable format
    balance = balance / Math.pow(10, metadata["data"]["result"].decimals);
    balance = balance.toFixed(2);

    // Print name, balance, and symbol of token
    console.log(
      `${i++}. ${metadata["data"]["result"].name}: ${balance} ${
        metadata["data"]["result"].symbol
      }`
    );
  }
}

main();