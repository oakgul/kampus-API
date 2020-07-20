const { model } = require("../models/User");

const CustomError = require('../helpers/CustomError');

const customErrorHandler = (err,req,res,next) => {
    let customError = err;

    if(err.name === 'SyntaxError') {
        customError = new CustomError('Syntax hatası!', 400);
    }
    if(err.name === 'ValidationError') {
        customError = new CustomError(err.message, 400);
    }

    res
    .status(customError.status || 500)
    .json({
        success : false,
        message : customError.message
    });
};

module.exports = customErrorHandler;