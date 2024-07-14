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
  let supplied_amount = 0;
    
  try {
    const response = await axios.get(apiUrl);
    const transactions = response.data.items;

    transactions.forEach(txns => {

      
    
      if (txns.method === 'addLiquidity' || txns.method === 'addLiquidityETH') {
        let tokenData = {};
        
        if (txns.method === 'addLiquidity') {
          // Extract tokenA and tokenB addresses and their respective values
          const tokenA = txns.decoded_input.parameters.find(param => param.name === 'tokenA');
          const tokenB = txns.decoded_input.parameters.find(param => param.name === 'tokenB');
          let amountADesired = txns.decoded_input.parameters.find(param => param.name === 'amountADesired').value ; 
          let amountBDesired = txns.decoded_input.parameters.find(param => param.name === 'amountBDesired').value ; 
          
          amountADesired = amountADesired * Math.pow(10,-18);
          amountBDesired = amountBDesired * Math.pow(10,-18);

          if (tokenA && tokenB && amountADesired && amountBDesired) {

            tokenData[tokenA.value] = amountADesired;
            tokenData[tokenB.value] = amountBDesired;

            // USDT
            if (tokenA.value == "0x9E12AD42c4E4d2acFBADE01a96446e48e6764B98"){
              amountADesired = amountADesired * 0.00032
            }

            //UNI
            else if (tokenA.value == "0x340Bad9627Cb72d1c4cC92c7F53c4995454130Ae"){
              amountADesired = amountADesired * 0.0026

            }

            if (tokenB.value == "0x9E12AD42c4E4d2acFBADE01a96446e48e6764B98"){
              amountBDesired = amountADesired * 0.00032
            }

            //UNI
            else if (tokenB.value == "0x340Bad9627Cb72d1c4cC92c7F53c4995454130Ae"){
              amountBDesired = amountBDesired * 0.0026

            }

            supplied_amount = supplied_amount + amountADesired + amountBDesired;
            supplied_amount = truncate(supplied_amount, 3);
            
            // console.log("supplied amount now add liquidity ", supplied_amount);
            
          }
          
        } else if (txns.method === 'addLiquidityETH') {
          // Extract token address and values for amountTokenMin and amountETHMin
          const token = txns.decoded_input.parameters.find(param => param.name === 'token');
          let amountTokenMin = txns.decoded_input.parameters.find(param => param.name === 'amountTokenMin').value;
          let amountETHMin = txns.decoded_input.parameters.find(param => param.name === 'amountETHMin').value;

          amountTokenMin = amountTokenMin * Math.pow(10,-18);
          amountETHMin = amountETHMin * Math.pow(10,-18);
    
          if (token && amountTokenMin && amountETHMin) {
            tokenData[token.value] = {
              amountTokenMin: amountTokenMin,
              amountETHMin: amountETHMin
            };

            // USDT
            if (token.value == "0x9E12AD42c4E4d2acFBADE01a96446e48e6764B98"){
              amountTokenMin = amountTokenMin * 0.00032
            }

            //UNI
            else if (token.value == "0x340Bad9627Cb72d1c4cC92c7F53c4995454130Ae"){
              amountTokenMin = amountTokenMin * 0.0026

            }

      

            
            supplied_amount = supplied_amount + amountTokenMin + amountETHMin;
            supplied_amount = truncate(supplied_amount, 3);

            // console.log("supplied amount now add liquidity eth ", supplied_amount);
          }
        }
      }
      
  })

  console.log("Total amount ", supplied_amount);
} 

catch (error) {
    console.error('Error fetching transactions:', error);
}

return supplied_amount;

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


async function getTokenCount(address) {


  const apiURL = `https://explorer-api-holesky.morphl2.io/api/v2/addresses/${address}/tokens?type=ERC-20%2CERC-1155`;
  
  const uniqueTokens = new Set();
  try {
    const response = await axios.get(apiURL);
    let tokens_list = response.data.items;
    if (tokens_list) {
      // Create a Set to store unique token addresses
      

      tokens_list.forEach(item => {
        // Only add the token address to the Set if the value is non-zero
        if (item.value !== "0") {
          uniqueTokens.add(item.token.address);
        }
      });
        
    } else {
        console.log('No tokens found or unexpected response format.');
    }
} catch (error) {
    console.error('Error fetching transactions:', error);
}

  
  return uniqueTokens.size;
}



// Replace with the desired address to filter by
const callerAddress = '0x4b8a65c8ef37430edFaaD1B61Dba2D680f56FFd7'; // L1 to L2 address
const address2 = `0xA745Cc25C9E5BB2672D26B58785f6884eF50F2c6`;

// Fetch and filter events by the specified caller address
// getTotalAmountBridged(address2).catch(console.error);
// getNFTCounts(address2).catch(console.error);
// getTotalTransactionsCount(address2).catch(console.error);
// getTotalLiquiditySupplyData(address2);
console.log(getTokenCount(address2));