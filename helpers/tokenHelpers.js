const sendJwtToClient = (user,res) => {

    // Generate JWT
    const token = user.generateJwtFromUser();

    const { JWT_COOKIE, NODE_ENV } = process.env;

    return res
        .status(200)
        .cookie('access_token', token, {
            httpOnly : true,
            expires : new Date(Date.now() + parseInt(JWT_COOKIE) * 1000),
            secure : NODE_ENV === 'development' ? false : true
        })
        .json({
            success : true,
            access_token : token,
            data : {
                name : user.name,
                email : user.email
            }
        });
};

// Token'ın gödnerilip gönderilmediğini kontrol eder
const isTokenIncluded = req => {
    return (
        req.headers.authorization && req.headers.authorization.startsWith('Bearer:')
    );
};

// Token'ı Bearer: den ayırarak almak
const getAccessTokenFromHeader = req => {
    const authorization = req.headers.authorization;
    // authorization'ı split ederek (parçalarına ayırarak - boşluk bıraktığımız için " " bunu kullandık)
    // Bearer: "access_token" - 1. indekste olduğu için >> [1]
    const access_token = authorization.split(" ")[1];
    return access_token;
};

module.exports = {
    sendJwtToClient,
    isTokenIncluded,
    getAccessTokenFromHeader
};