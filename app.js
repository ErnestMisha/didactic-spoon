import express from 'express';
import createError from 'http-errors';
import logger from 'morgan';

import { router } from './routes.js';
import { sync as syncDB } from './models.js';

await syncDB();

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
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
