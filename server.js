const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./helpers/connectDatabase');
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




app.listen(PORT, () => {
    console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
});


