const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./helpers/connectDatabase');
const customErrorHandler = require('./middlewares/customErrorHandler');

const routers = require('./routers/index');

// Environment Variables
dotenv.config({
    path : './config.env'
});

// MongoDB Connection
connectDatabase();


const app = express();
const PORT = process.env.PORT;

// Routers
app.use('/api', routers);

// Error Handler
app.use(customErrorHandler);


app.listen(PORT, () => {
    console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
});


