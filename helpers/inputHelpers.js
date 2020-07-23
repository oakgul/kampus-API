const bcrypt = require('bcryptjs');

// Login işlemi yaparken email ve password doğru bir şekilde gönderilip gönderilmediğini kontrol eder. Input control.
const validateUserInput = (email,password) => {
    
    // email ve password doğru gönderilmişse true döndür.
    return email && password; 
};

// login olurken req.body ile gelen hashlenmiş password'ü kontrol et.
const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};

module.exports = { 
    validateUserInput,
    comparePassword
};