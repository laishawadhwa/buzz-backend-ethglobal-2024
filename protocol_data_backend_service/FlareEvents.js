const { ethers, JsonRpcProvider } = require('ethers');
const axios = require('axios');
// Initialize ethers provider
const provider = new JsonRpcProvider('https://rpc.ankr.com/flare_coston2/7c66d8fb2d926f141f7fd511165a470c2ff3495f699afa835a4fd7f2f3bfb976');
// Replace with the desired address to get the transaction count
const address = '0xA745Cc25C9E5BB2672D26B58785f6884eF50F2c6';

//0xA745Cc25C9E5BB2672D26B58785f6884eF50F2c6
// Smart contract address and ABI
const contractAddress = '0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273';

const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "dst",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Deposit",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "priorVotePower",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "newVotePower",
                "type": "uint256"
            }
        ],
        "name": "Delegate",
        "type": "event"
    }
];

// Create contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider);

const chunkSize = 2000; // Define the chunk size to fetch logs in smaller ranges

async function fetchAndFilterEvents(callerAddress) {
    const startBlock = 9801000; // You can specify the start block if needed
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
        if(args[0] == callerAddress) {
            amount = amount + parseInt(args[1]);
        }
            } catch(error) {

            }})
    }
    console.log("Amount wrapped is", amount);
    return amount;
}

// Function to get the count of total transactions for a given address
async function getTotalTransactions(address) {
    const apiUrl = `https://coston2-explorer.flare.network/api?module=account&action=txlist&address=${address}`;

    try {
        const response = await axios.get(apiUrl);
        const transactions = response.data.result;

        if (transactions && Array.isArray(transactions)) {
            console.log(`Total transactions for address ${address}: ${transactions.length}`);
        } else {
            console.log('No transactions found or unexpected response format.');
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}


async function getTotalTokenCount(address){
    const apiUrl = `https://coston2-explorer.flare.network/api?module=account&action=tokenlist&address=${address}`;
    let nonZeroBalanceTokensCount = 0
    try {
        const response = await axios.get(apiUrl);
        const items = response.data.result;

        if (items) {
             nonZeroBalanceTokensCount = items.filter(item => {
                return item.balance && item.balance !== '0';
            }).length;

            console.log(`Total tokens with non-zero balance for address ${address}: ${nonZeroBalanceTokensCount}`);
        }  else {
            console.log('No transactions found or unexpected response format.');
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }

    return nonZeroBalanceTokensCount;
}

// Replace with the desired address to filter by
const callerAddress = '0xA745Cc25C9E5BB2672D26B58785f6884eF50F2c6';

// Fetch and filter events by the specified caller address
fetchAndFilterEvents(callerAddress).catch(console.error);
// Execute the function
getTotalTransactions(address);
//getTotal token count
getTotalTokenCount(callerAddress);