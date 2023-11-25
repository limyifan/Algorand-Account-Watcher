const config = require('./src/common/config/env.config.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const watcher = require('./src/watchedList/models/watchedList.model');
const WatchedListRouter = require('./src/watchedList/routes.config');
const schedule = require('node-schedule');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.use(bodyParser.json());

WatchedListRouter.routesConfig(app);

// Run at 0 seconds past every minute mark
schedule.scheduleJob('0 * * * * *', watcher.checkAccountStates);

app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
