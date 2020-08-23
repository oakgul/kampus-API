const mongoose = require('mongoose');
const slugify = require('slugify');

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

AnnounceSchema.pre('save', function(next) {
    if(!this.isModified('title')) {
        next();
    }
    this.slug = this.makeSlug();
    next();
});

AnnounceSchema.methods.makeSlug = function() {
    return slugify(this.title, {
        replacement: '-',  
        remove: /[*+~.()'"!:@]/g,
        lower: true      
      });
};

module.exports = mongoose.model('Announce', AnnounceSchema);