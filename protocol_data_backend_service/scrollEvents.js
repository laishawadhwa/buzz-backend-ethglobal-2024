const axios = require('axios');

const API_URL = 'https://api-sepolia.scrollscan.com/api';
const API_KEY = 'KBF7XQWUU6BN1AKB197IGKCMGXNNHWA2BQ';  // Replace with your actual API key
const FROM_ADDRESS = '0x12Ad55cf646e372818590564a74b320dd5d2605a';

async function fetchBridgeTransactions(walletAddress) {
    try {
        const response = await axios.get(API_URL, {
            params: {
                module: 'account',
                action: 'txlistinternal',
                address: walletAddress,
                startblock: 0,
                endblock: 99999999,
                page: 1,
                offset: 10,
                sort: 'asc',
                apikey: API_KEY
            }
        });

        const transactions = response.data.result;
        // Filter transactions from the specified address
        const filteredTransactions = transactions.filter(tx => tx.from.toLowerCase() === FROM_ADDRESS.toLowerCase());

        // Calculate the total amount
        let totalAmount = filteredTransactions.reduce((acc, tx) => {
            return acc + parseFloat(tx.value);
        }, 0);
        // Convert Wei to Ether
        const totalAmountInEther = totalAmount / (10 ** 18); 
        console.log(`Total amount from address ${FROM_ADDRESS}: ${totalAmountInEther} ETH`);
        return totalAmountInEther;

    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

async function fetchTransactions(walletAddress) {
    try {
        const response = await axios.get(API_URL, {
            params: {
                module: 'account',
                action: 'txlist',
                address: walletAddress,
                startblock: 0,
                endblock: 99999999,
                page: 1,
                offset: 10,
                sort: 'asc',
                apikey: API_KEY
            }
        });

        const transactions = response.data.result;

        // Count the total number of transactions
        const totalTransactions = transactions.length;

        console.log(`Total number of transactions: ${totalTransactions}`);
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

fetchBridgeTransactions('0xA745Cc25C9E5BB2672D26B58785f6884eF50F2c6'); //We need to send the wallet address here
fetchTransactions('0xA745Cc25C9E5BB2672D26B58785f6884eF50F2c6');
