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

// Logout - EXIT
const logout = asyncErrorWrapper(async (req,res,next) => {
    const { NODE_ENV } = process.env;

    return res
            .status(200)
            .cookie({
                httpOnly : true,
                expires : new Date(Date.now()),
                secure : NODE_ENV === 'development' ? false : true
            })
            .json({
                success : true,
                message : 'Çıkış Yaptınız!'
            });
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

// Profile image upload
const imageUpload = asyncErrorWrapper(async (req,res,next) => {

    // id'den kullanıcıyı bul ve yüklenen profil fotoğrafını veritabanında update et
    const user = await User.findByIdAndUpdate(req.user.id, {
        "profile_image" : req.savedProfileImage
    }, {
        // Güncellenmiş yeni kullanıcıyı göstermesi için, true yapmassak eski hali gözükür
        new : true,     
        runValidators : true
    });

    res
        .status(200)
        .json({
            success : true,
            message : 'Profil fotoğrafı yüklendi..',
            data : user
        });
});

// Forgot password
const forgotPassword = asyncErrorWrapper(async (req,res,next) => {
    const resetEmail = req.body.email;
    const user = User.findOne({email: resetEmail});

    // Email'e ait kullanıcı var mı?
    if(!User) {
        return next(new CustomError('Böyle bir kullanıcı bulunamadı!',400));
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    res
        .status(200)
        .json({
            success : true,
            message : 'Reset Password Token gönderildi!'
        })
});

module.exports = {
    register,
    login,
    logout,
    getUser,
    imageUpload,
    forgotPassword
};