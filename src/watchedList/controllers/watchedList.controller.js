const WatchListModel = require('../models/watchedList.model');
const algosdk = require('algosdk');

exports.watchAccount = (req, res) => {
    const address = req.params.address
    console.log(address)
    // // Validate address
    if (!algosdk.isValidAddress(address)) {
        return res.status(400).send('Invalid address');
    }

    WatchListModel.addNewWatchAccount(address)
        .then((result) => {
            if (result)
                res.status(200).send("Account watched successfully");
            else
                res.status(400).send("Account already watched!");
        });
};
exports.getWatchList = (req, res) => {
    WatchListModel.getAllWatchedAccounts().then((result) => {
        if (result)
            res.status(200).send(result)
        else
            res.status(400).send("Failed to fetch watch list")
    })
};