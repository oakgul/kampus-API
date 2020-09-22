const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./helpers/connectDatabase');
const customErrorHandler = require('./middlewares/customErrorHandler');
const path = require('path');
const cors =  require('cors');

const routers = require('./routers/index');

// Environment Variables
dotenv.config({
    path : './config.env'
});

// MongoDB Connection
connectDatabase();

const app = express();

// CORS setting
app.use(cors());

// req.body - consolda gözükmesi için (Eskiden bodyparser kullanıyorduk ama artık express ile geliyor)
app.use(express.json());

const PORT = process.env.PORT;

// Routers
app.use('/api', routers);

// Error Handler
app.use(customErrorHandler);

// Static Files - Public file
app.use(express.static(path.join(__dirname, "public")));


app.listen(PORT, () => {
    console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
});