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

// Tüm duyuruları getir.
const getAllAnnounce = asyncErrorWrapper(async (req,res,next) => {
    const announces = await Announce.find();

    return res
        .status(200)
        .json({
            success : true,
            data : announces
        });
});

const getSingleAnnounce = asyncErrorWrapper(async (req,res,next) => {
    const { id } = req.params;

    const announce = await Announce.findById(id);

    return res
        .status(200)
        .json({
            success : true,
            data : announce
        });
});

module.exports = {
    shareNewAnnounce,
    getAllAnnounce,
    getSingleAnnounce
}