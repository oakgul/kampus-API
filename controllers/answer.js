const Announce = require('../models/Announce');
const Answer = require('../models/Answer');
const CustomError = require('../helpers/CustomError');
const asyncErrorWrapper = require('express-async-handler');

const addNewAnswerToAnnounce = asyncErrorWrapper(async (req,res,next) => {
    const { announce_id } = req.params;
    const user_id = req.user.id;
    const information = req.body;

    const answer = await Answer.create({
        ...information,
        announce : announce_id,
        user : user_id
    });

    return res
        .status(200)
        .json({
            success : true,
            data : answer
        });
});

// Bir duyuruya ait tüm cevapları getir
const getAllAnswersByAnnounce = asyncErrorWrapper(async (req,res,next) => {
    const { announce_id } = req.params;

    // populate >> sadece id'sini değil bu id'ye ait diğer alanları da getir. Örn.content.
    const announce = await Announce.findById(announce_id).populate('answers');
    const answers = announce.answers;

    return res
        .status(200)
        .json({
            success : true,
            count : answers.length,
            data : answers
        });
});

module.exports = {
    addNewAnswerToAnnounce,
    getAllAnswersByAnnounce
};