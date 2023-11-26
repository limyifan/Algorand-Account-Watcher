const WatchListController = require('./controllers/watchedList.controller');

exports.routesConfig = function (app) {

    /**
     * @route POST /addWatch/:address
     * @group Watch List
     * @param {string} address.path - Algorand account address
     * @returns {object} 200 - Success response
     * @returns {Error}  400 - Unexpected error
     */
    app.post('/addWatch/:address', [
        WatchListController.watchAccount
    ]);

    /**
     * @route GET /getWatchList
     * @group Watch List
     * @returns {Object[]} 200 - Success response with array of watched accounts
     * @returns {Error} 400 - Unexpected error
     */
    app.get('/getWatchList', [
        WatchListController.getWatchList
    ]);
};
