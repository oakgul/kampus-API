const mongoose = require('mongoose');
const Announce = require('./Announce');

const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    content : {
        type : String,
        required : [true, 'Yorum alanının doldurulması zorunludur! Lütfen bir şey yazın!'],
        minlength : [3, 'Yazı çok kısa, en az 3 karakterden oluşmalıdır. Daha açıklayıcı yazın!']
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    // Cevabın yazıldığı duyuru bilgileri
    announce : {
        type : mongoose.Schema.ObjectId,
        ref : Announce,
        required : true
    }
});

AnswerSchema.pre('save', async function(next) {
    if(!this.isModified('user')) return next();

    try {
        const announce = await Announce.findById(this.announce);

        announce.answers.push(this._id);

        await announce.save();
        next();
    }
    catch (err) {
        return next(err);
    }
});

module.exports = mongoose.model('Answer', AnswerSchema);