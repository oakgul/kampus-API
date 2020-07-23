// Login işlemi yaparken email ve password doğru bir şekilde gönderilip gönderilmediğini kontrol eder.
const validateUserInput = (email,password) => {
    
    // email ve password doğru gönderilmişse true döndür
    return email && password; 
};

module.exports = validateUserInput;