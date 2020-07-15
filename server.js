const express = require('express');
const dotenv = require('dotenv');

// Environment Variables
dotenv.config({
    path : './config.env'
});

const app = express();
const PORT = process.env.PORT;


app.get('/api/login', (req,res) => {
    res.send('Merhaba API - Login page');
})

app.listen(PORT, () => {
    console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
});


