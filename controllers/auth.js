// User modelini burada kullarak kullanıcı kaydı yapacağız..
const User = require('../models/User');
const CustomError = require('../helpers/CustomError');
const asyncErrorWrapper = require('express-async-handler');
const { sendJwtToClient } = require('../helpers/tokenHelpers');
const { validateUserInput, comparePassword } = require('../helpers/inputHelpers');

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
    
    sendJwtToClient(user,res);
});

const login = asyncErrorWrapper(async (req,res,next) => {

    const { email, password } = req.body;
    if(!validateUserInput(email,password)) {
        return next(new CustomError('Lütfen Input alanlarını kontrol ediniz!',400));
    }

    // User modelini oluştururken password alanı için "select:false" yapmıştık (Güvenlik için)
    // ama burada password'e ihtiyacımız olduğu için select kullanarak password'un de gönderilmesini istiyoruz
    const user = await User.findOne({email}).select('+password');
    
    // hashlenmiş ve normal password eşleşiyor mu?
    if(!comparePassword(password, user.password)) {
        return next(new CustomError('Şifre Yanlış! Lütfen yazdığınız şifreyi kontrol edin!',400));
    }

    sendJwtToClient(user,res);
});

const getUser = (req,res,next) => {
    res.json({
        success : true,
        data : {
            id : req.user.id,
            name : req.user.name
        }
    });
};

module.exports = {
    register,
    getUser,
    login
};