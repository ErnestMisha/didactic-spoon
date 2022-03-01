import express from 'express';
import createError from 'http-errors';
import logger from 'morgan';

import { router } from './routes.js';
import { connect, close as closeConnection, init } from './models.js';

const app = express();
const port = process.env.PORT || 3000;

await connect();
init();

const server = app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});

app.use(logger('dev'));
app.use(express.json());

app.use('/', router);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500).end();
});

async function close() {
    await closeServer(server);
    await closeConnection();
}

process.on('SIGTERM', close);
process.on('SIGINT', close);
process.on('SIGHUP', close);


function closeServer(server) {
    return new Promise((resolve, reject) => {
        server.close((err) => {
            if(!err) {
                resolve("Server closed");
            }
            else {
                reject("Server isn't open");
            }
        });
    });
}
