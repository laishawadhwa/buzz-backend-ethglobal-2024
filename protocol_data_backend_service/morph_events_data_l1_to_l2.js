const { ethers, formatUnits, JsonRpcProvider } = require('ethers');
const axios = require('axios');

// Initialize ethers provider
const provider = new JsonRpcProvider('https://rpc-quicknode-holesky.morphl2.io');

// Replace with the desired address to get the transaction count
const address = '0xA745Cc25C9E5BB2672D26B58785f6884eF50F2c6';

//0xA745Cc25C9E5BB2672D26B58785f6884eF50F2c6
// Smart contract address and ABI


//contract address for bridging on morph
const contractAddress = '0x5300000000000000000000000000000000000006'; 

const contractABI = [
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
          }
        ],
        "name": "FinalizeDepositETH",
        "type": "event"
      }
      
      
];

// Create contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider);

const chunkSize = 7000; // Define the chunk size to fetch logs in smaller ranges


function truncate (num, places) {
  return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
}

async function getTotalAmountBridged(callerAddress) {
    const startBlock = 3715000; // You can specify the start block if needed 3746760
    const endBlock = await provider.getBlockNumber();
    let events = [];

    let amount = 0;

    for (let i = startBlock; i <= endBlock; i += chunkSize) {
        const fromBlock = i;
        const toBlock = Math.min(i + chunkSize - 1, endBlock);

        const eventFilter = {
            address: contractAddress,
            fromBlock: fromBlock,
            toBlock: toBlock
        };

        const logs = await provider.getLogs(eventFilter);
        const iface = new ethers.Interface(contractABI);
        const parsedEvents = logs.map(log => {
            try {
        const event = iface.parseLog(log);
        const args = event.args;
        if(args[1] == callerAddress) {
            amount = amount + parseInt(args[2]);
        }
            } catch(error) {

            }})
    }
    amount = truncate(amount * Math.pow(10,-18), 3);
    console.log("Amount bridged is", amount);
    return amount;
}

// Function to get the count of total transactions for a given address
async function getTotalTransactionsCount(address) {
    const apiUrl = `https://explorer-api-holesky.morphl2.io/api/v2/addresses/${address}/counters`;

    let  txn_count = 0;
    try {
        const response = await axios.get(apiUrl);
        txn_count = response.data.transactions_count;
        console.log("Total Transactions: ", txn_count);
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
    return txn_count;
}

async function getTotalLiquiditySupplyData(address) {

  const apiUrl = `https://explorer-api-holesky.morphl2.io/api/v2/addresses/${address}/transactions?filter=to%20%7C%20from`;
  try {
    const response = await axios.get(apiUrl);
    const transactions = response.data.items;
    console.log(transactions);
} catch (error) {
    console.error('Error fetching transactions:', error);
}


}


async function getNFTCounts(address){
  const apiURL = `https://explorer-api-holesky.morphl2.io/api/v2/addresses/${address}/nft?type=ERC-721%2CERC-404%2CERC-1155'`
  let nft_count = 0;
  try {
    const response = await axios.get(apiURL);
    let nftList = response.data.items;
    if (nftList) {
      nft_count= Object.keys(nftList).length;
        console.log(`Total nfts for address ${address}:  ${nft_count}`);
        
    } else {
        console.log('No NFTs found or unexpected response format.');
    }
} catch (error) {
    console.error('Error fetching transactions:', error);
}

return nft_count;
}

// Replace with the desired address to filter by
const callerAddress = '0x4b8a65c8ef37430edFaaD1B61Dba2D680f56FFd7'; // L1 to L2 address
const address2 = `0xA745Cc25C9E5BB2672D26B58785f6884eF50F2c6`;

// Fetch and filter events by the specified caller address
// getTotalAmountBridged(address2).catch(console.error);
// getNFTCounts(address2).catch(console.error);
// getTotalTransactionsCount(address2).catch(console.error);


getTotalLiquiditySupplyData(address2);