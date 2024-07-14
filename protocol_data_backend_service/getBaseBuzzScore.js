const { ethers,JsonRpcProvider } = require('ethers');

const RPC_URL = 'https://eth-sepolia.g.alchemy.com/v2/5s29dWKvXzHyrWXdEGzz0XqtM-SS_QWg';
const WALLET_ADDRESS = '0xA745Cc25C9E5BB2672D26B58785f6884eF50F2c6'; // Replace with the wallet address you want to check

// Initialize ethers.js provider with RPC URL
const provider = new JsonRpcProvider(RPC_URL);

async function fetchTransactionCount(walletAddress) {
  let txnCount = 0;
    try {
        // Get transaction count using ethers.js
        txnCount = await provider.getTransactionCount(WALLET_ADDRESS);

        console.log(`Total transaction count for address ${WALLET_ADDRESS}: ${txnCount}`);
    } catch (error) {
        console.error('Error fetching transaction count:', error);
    }
    return txnCount;
}



fetchTransactionCount(WALLET_ADDRESS);
