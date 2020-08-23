const Announce = require('../models/Announce');
const CustomError = require('../helpers/CustomError');
const asyncErrorWrapper = require('express-async-handler');

// Yeni duyuru yayınla.
const shareNewAnnounce = asyncErrorWrapper(async (req,res,next) => {
    const information = req.body;

    const announce = await Announce.create({
        ...information,
        user : req.user.id
    });

    return res
        .status(200)
        .json({
            success : true,
            data : announce
        });
});

// Tüm duyurular
const getAllAnnounce = asyncErrorWrapper(async (req,res,next) => {
    const announces = await Announce.find();

    return res
        .status(200)
        .json({
            success : true,
            data : announces
        });
});

module.exports = {
    shareNewAnnounce,
    getAllAnnounce
}