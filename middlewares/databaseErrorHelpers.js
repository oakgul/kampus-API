const User = require('../models/User');
const Announce = require('../models/Announce');
const Answer = require('../models/Answer');
const CustomError = require('../helpers/CustomError');
const asyncErrorWrapper = require('express-async-handler');

// Kullanıcının olup olmadığını kontrol et.
const checkUserExist = asyncErrorWrapper(async (req,res,next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if(!user) {
        return next(new CustomError('Bu id hiçbir kullanıcı ile eşleşmedi! Kullanıcı bulunamadı!',400));
    }
    next();
});

// Duyurunun olup olmadığını kontrol et.
const checkAnnounceExist = asyncErrorWrapper(async (req,res,next) => {
    const announce_id = req.params.id || req.params.announce_id;
    const announce = await Announce.findById(announce_id);

    if(!announce) {
        return next(new CustomError('Bu id hiçbir duyuru ile eşleşmedi! Duyuru bulunamadı!',400));
    }
    next();
});

const checkAnnounceAndAnswerExist = asyncErrorWrapper(async (req,res,next) => {
    const announce_id = req.params.announce_id;
    const answer_id = req.params.answer_id;

    const answer = await Answer.findOne({
        _id : answer_id,
        announce : announce_id
    });

    if(!answer) {
        return next(new CustomError('Bu id hiçbir cevap ile eşleşmedi! Soruyla ilişkili cevap bulunamadı!',400));
    }
    next();
});

module.exports = { 
    checkUserExist,
    checkAnnounceExist,
    checkAnnounceAndAnswerExist
};