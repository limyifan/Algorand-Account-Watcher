const mongoose = require('../../common/services/mongoose.service').mongoose;
const config = require('../../common/config/env.config.js');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// WatchedAccount model
const watchedSchema = new mongoose.Schema({
    address: {type: String, required: true},
    balance: Number || null,
});

const WatchedAccount = mongoose.model('WatchedAccount', watchedSchema);

/**
 * Gets list of all watched Algorand accounts.
 *
 * Fetches all accounts from the database and returns
 * an array containing the address and balance for
 * each watched account.
 *
 * @returns {Object[]} Array of watched accounts
 */
exports.getAllWatchedAccounts = async () => {
    let allWatchedAccounts = await WatchedAccount.find();
    let filteredWatchedAccounts = allWatchedAccounts.map(acc => {
        return {address: acc.address, balance: acc.balance}
    });
    return filteredWatchedAccounts;
}

/**
 * Adds a new Algorand account address to track.
 *
 * Checks if already watching the address. If not, saves
 * a new watched account entry to the database.
 *
 * @param {string} address - The Algorand account address
 * @returns {boolean} true if new account was added, false if already watching
 */
exports.addNewWatchAccount = async (address) => {
    // Check if account being watched
    let watched = await WatchedAccount.findOne({address});

    if (!watched) {
        // Create new watched account
        const t = await new WatchedAccount({
            address: address, balance: null
        }).save();
        return true
    }
    return false
}

/**
 * Periodically checks the state of watched Algorand accounts.
 * Fetches the latest balance for each watched account from the
 * Algorand API and compares against the stored balance.
 *
 * If the balance differs:
 * - Logs a notification with account details and balance change
 * - Updates the locally stored balance for that account
 */
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

/**
 * Logs a notification message to the console
 * with the current timestamp.
 *
 * @param {string} message - The notification message to log
 */
function logNotification(message) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}: ${message}`);
}