// User modelini burada kullarak kullanıcı kaydı yapacağız..
const User = require('../models/User');
const CustomError = require('../helpers/CustomError');
const asyncErrorWrapper = require('express-async-handler');

const register = asyncErrorWrapper(async (req,res,next) => {

    // Front-end'den gelen req.body
    const {name,surname,email,password,gender,department} = req.body;

    // Kullanıcının oluşturulması
    const user = await User.create({
        name,
        surname,
        email,
        password,
        gender,
        department
    }); 

    res
        .status(200)
        .json({
            success : true,
            data : user
        });
});

module.exports = {
    register
}