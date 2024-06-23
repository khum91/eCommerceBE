import express from 'express';
import './db.config.js';
import route from '../routes/router.config.js'


const app = express();

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
    let status = error.status ?? 500
    let message = error.message ?? 'Server Error'
    let result=error.detail?? null

    res.status(status).json({
        result: result,
        meta: null,
        message: message
    })

});

export default app;