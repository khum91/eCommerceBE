import express from 'express';
import cors from 'cors';
import './db.config.js';
import route from '../routes/router.config.js'


const app = express();
app.use(cors());

app.use('/assets', express.static('./public/uploads'))

//Body Parse
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data

app.use(route);

//Route not found
app.use((req, res, next) => {
    next({ status: 404, message: 'path not found' });
});

//Error Handler Middleware
app.use((error, req, res, next) => {
    let status = error.status || 500
    let message = error.message || 'Server Error'
    let result = error.detail || null

    if (error.code && +error.code === 11000) {
        status = 422;
        message = "Validation Failed"
        let msg = {}
        Object.keys(error.keyPattern).map((field) => {
            msg[field] = `${field} should be unique`
        })
        result = msg;
    }

    res.status(status).json({
        result: result,
        meta: null,
        message: message
    })

});

export default app;