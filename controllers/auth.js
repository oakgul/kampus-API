// User modelini burada kullarak kullanıcı kaydı yapacağız..
const User = require('../models/User');
const CustomError = require('../helpers/CustomError');
const asyncErrorWrapper = require('express-async-handler');
const { sendJwtToClient } = require('../helpers/tokenHelpers');
const { validateUserInput, comparePassword } = require('../helpers/inputHelpers');
const sendEmail = require('../helpers/sendEmail');

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
    const user = await User.findOne({email: resetEmail});

    // Email'e ait kullanıcı var mı?
    if(!user) {
        return next(new CustomError('Böyle bir kullanıcı bulunamadı!',400));
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    // gönderilen email içeriği - HTML
    const emailTemplate = `
        <h3>Reset Your Password</h3>
        <p> Bu <a href='${resetPasswordUrl}' target='_blank'> link </a> 1 saat içinde geçersiz olacaktır! </p>
    `;

    try {
        await sendEmail({
            from : process.env.SMTP_USER,
            to : resetEmail,
            subject : 'Reset Your Password',
            html : emailTemplate
        });
        
        return res
        .status(200)
        .json({
            success : true,
            message : 'Reset Password Token gönderildi!'
        });
    }    

    // mail gönderme işleminde hata olursa daha önce save ettiğimiz (User) token ve expire undefined yap
    catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // Bu bilgileri tekrardan kaydet
        await user.save();
        return next(new CustomError('Email gönderilemedi!',500));
    }
});

// Reset Password
const resetPassword = asyncErrorWrapper(async (req,res,next) => {
    const { resetPasswordToken } = req.query;
    const { password } = req.body;

    if(!resetPasswordToken) {
        return next(new CustomError('Lütfen bir reset password token alın!',400));
    }

    let user = await User.findOne({
        resetPasswordToken : resetPasswordToken,
        // Expire süresinin geçip geçmediğini kontrol etmek için mongoDB'nin $gt (great than - daha büyük) özelliğini kullan.
        // Date.now()'dan büyükse getir.
        resetPasswordExpire : {$gt : Date.now()}
    });

    if(!user) {
        return next(new CustomError('Geçersiz yada süresi geçmiş token!',400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res
        .status(200)
        .json({
            success : true,
            message : 'Reset password işlemi başarılı.'
        });
});

module.exports = {
    register,
    login,
    logout,
    getUser,
    imageUpload,
    forgotPassword,
    resetPassword
};