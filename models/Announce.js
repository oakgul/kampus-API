const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnounceSchema = new Schema({
    title : {
        type : String,
        required : [true, 'Lütfen bir duyuru başlığı yazınız!'],
        minlength : [5, 'Başlık çok kısa, lütfen en az 5 karakterlik başlık yazınız!']
    },
    content : {
        type : String,
        required : [true, 'Lütfen bir duyuru yazınız!'],
        minlength : [10, 'Duyuru çok kısa, lütfen en az 10 karakterlik açıklama yazınız!']
    },
    
    slug : String,

    createdAt : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : 'User'
    }
});

module.exports = mongoose.model('Announce', AnnounceSchema);