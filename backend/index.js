import express from "express";
import cors from "cors";

import api from './api.js';

const app = express();

app.use(cors());

//routes
api(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
    res.status(404)
     .type('text')
     .send('Not Found');
});

// listener
const listener = app.listen(process.env.PORT || 3009, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});

export default app;