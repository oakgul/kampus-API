const Announce = require('../models/Announce');
const Answer = require('../models/Answer');
const CustomError = require('../helpers/CustomError');
const asyncErrorWrapper = require('express-async-handler');
const { populate } = require('../models/Announce');

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

// Bir cevap getir
const getSingleAnswer = asyncErrorWrapper(async (req,res,next) => {
    const { answer_id } = req.params;        
    
    const answer = await Answer.findById(answer_id)
        // populate() answer ile birlikte gelmesini istediğimiz bilgileri getirir.
        // path >> hangi bilgi getirilsin?
        // select >> bütün alanlarını değil sadece title bilgisi gelsin
        .populate({
            path : 'announce',
            select : 'title'
        })
        // select >> name ve profile_image gelsin || boşluk bırakarak birden fazla bilgi yazabiliriz
        .populate({
            path : 'user',
            select : 'name profile_image'
        });

    return res
        .status(200)
        .json({
            success : true,
            data : answer
        });
});

// Cevabı güncelle
const editAnswer = asyncErrorWrapper(async (req,res,next) => {
    const { answer_id } = req.params;        
    const { content } = req.body;        
    
    let answer = await Answer.findById(answer_id);
    answer.content = content;

    await answer.save();

    return res
        .status(200)
        .json({
            success : true,
            data : answer
        });
});

// Cevabı sil - Bunu models kısmından hooks ile de yapabilirdik, farklı şekilde yapmak istedim.
const deleteAnswer = asyncErrorWrapper(async (req,res,next) => {
    const { answer_id } = req.params;       
    const { announce_id } = req.params;       
    
    // id'sine göre bul ve kaldır.
    await Answer.findByIdAndRemove(answer_id);

    // bu cevabın bulunduğu announce da bulunan cevaplar kısmından da silmemiz gerek.
    const announce = await Announce.findById(announce_id);
    // announce ait cevaplar içinden (array) answer_id'yi bul ve 1 değeri (bulunan) sil.
    announce.answers.splice(announce.answers.indexOf(answer_id), 1);

    await announce.save();

    return res
        .status(200)
        .json({
            success : true,
            message : 'Cevap silindi!'
        });
});

module.exports = {
    addNewAnswerToAnnounce,
    getAllAnswersByAnnounce,
    getSingleAnswer,
    editAnswer,
    deleteAnswer
};