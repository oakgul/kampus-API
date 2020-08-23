const User = require('../models/User');
const CustomError = require('../helpers/CustomError');
const asyncErrorWrapper = require('express-async-handler');

// Kullanıcının olup olmadığını kontrol et
const checkUserExist = asyncErrorWrapper(async (req,res,next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if(!user) {
        return next(new CustomError('Bu id hiçbir kullanıcı ile eşleşmedi! Kullanıcı bulunamadı!',400));
    }
    next();
});

module.exports = { checkUserExist };