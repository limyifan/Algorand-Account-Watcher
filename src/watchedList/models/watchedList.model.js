const mongoose = require('../../common/services/mongoose.service').mongoose;
const config = require('../../common/config/env.config.js');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// WatchedAccount model
const watchedSchema = new mongoose.Schema({
    address: {type: String, required: true},
    balance: Number || null,
});

const WatchedAccount = mongoose.model('WatchedAccount', watchedSchema);

exports.getAllWatchedAccounts = async () => {
    let allWatchedAccounts = await WatchedAccount.find();
    let filteredWatchedAccounts = allWatchedAccounts.map(acc => {
        return {address: acc.address, balance: acc.balance}
    });
    return filteredWatchedAccounts;
}

exports.addNewWatchAccount = async (address) => {
    // Check if account being watched
    let watched = await WatchedAccount.findOne({address});

    if (!watched) {
        // Create new watched account
        const t = await new WatchedAccount({
            address: address, balance: null
        }).save();
        console.log("saved" + t)
        return true
    }
    return false
}
// Check states
exports.checkAccountStates = async () => {

    // Get watched accounts
    const watcherList = await WatchedAccount.find();
    //loop through each address to check states
    for (const watcherAccount of watcherList) {
        try {
            // Query Algorand node API to get account information
            const response = await fetch(`${config.algonodeApiEndpoint}/v2/accounts/${watcherAccount.address}`)
            const accountInfo = await response.json();

            //skip the loop if the account information doesn't exist
            if (!accountInfo.address || !accountInfo.amount) {
                logNotification("no account information found for " + watcherAccount.address)
                continue
            }

            // For simplicity, assume a change in balance indicates a state change
            let previousState = watcherAccount.balance;
            if (accountInfo.amount !== previousState) {
                // Log notification for state change
                logNotification(`Account: ${watcherAccount.address} - Balance changed from ${previousState} to ${accountInfo.amount}`);

                // Update the previous state with the current balance for future comparisons
                return await WatchedAccount.findOneAndUpdate({address: accountInfo.address}, {balance: accountInfo.amount}, {useFindAndModify: false});
            }

        } catch (error) {
            console.error(`Error checking account ${watcherAccount}:`, error);
        }
    }

}

function logNotification(message) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}: ${message}`);
}