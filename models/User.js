const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({

    name : {
        type : String,
        required : [true, "isim girilmesi zorunludur, lütfen bir isim yazınız!"]
    },
    surname : {
        type : String,
        required : [true, "Soyisim girilmesi zorunludur, lütfen bir soyisim yazınız!"]
    },
    email : {
        type : String,
        required : [true, "email girilmesi zorunludur, lütfen bir email yazınız!"],
        unique : true,
        match : [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Düzgün olmayan email adresi, lütfen email adresinizi kontrol edin!"
        ]
    },
    password : {
        type : String,
        required : [true, "Parola girilmesi zorunludur, lütfen bir parola yazınız!"],
        minlength : [6, "Parola en az 6 karakterden oluşmalıdır!"],
        select : false
    },
    gender : {
        type: String,
        required : [true, "Cinsiyet girilmesi zorunludur, lütfen cinsiyet yazınız!"],

    },
    department : {
        type : String,
        required : [true, "Bölüm girilmesi zorunludur, lütfen okuduğunuz bölümü yazınız!"],
        enum : ["Bilgisayar Programcılığı", "Kimya Teknolojileri", "Tıbbi Aromatik Bitkiler"]
    },
    role : {
        type : String,
        default : "student",
        enum : ["student", "teacher", "admin"]
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    title : {
        type : String
    },
    profile_image : {
        type : String,
        default : "default.jpg"
    },
    blocked : {
        type : Boolean,
        default : false
    }
    
});

// UserSchema Methods - JWT (Json Web Token)
UserSchema.methods.generateJwtFromUser = function() {

    const {JWT_SECRET_KEY, JWT_EXPIRE} = process.env; 

    const payload = {
        id : this.id,
        name : this.name
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn : JWT_EXPIRE
    });
    return token;
};

// Database'e kaydetmeden hemen önce bu kısım (pre) çalışır.
UserSchema.pre('save', function(next) {

    // Herhangi bir update işleminde password değişmemişse password tekrardan hash'lenmesin!
    if(!this.isModified('password')) {
        next();
    }

    // Parola hash'leme
    bcrypt.genSalt(10, (err, salt) => {
        if(err) next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) next(err);
            this.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model("User", UserSchema);