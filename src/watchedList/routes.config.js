const WatchListController = require('./controllers/watchedList.controller');

exports.routesConfig = function (app) {
    app.post('/addWatch/:address', [
        WatchListController.watchAccount
    ]);
    app.get('/getWatchList', [
        WatchListController.getWatchList
    ]);
};
