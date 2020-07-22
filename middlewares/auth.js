const CustomError = require('../helpers/CustomError');
const jwt = require('jsonwebtoken');
const { isTokenIncluded, getAccessTokenFromHeader } = require('../helpers/tokenHelpers');

const getAccessToRoute = (req,res,next) => {

    const { JWT_SECRET_KEY } = process.env;

    // Eğer token'ı yoksa - 401 (Unauthorized)
    if(!isTokenIncluded(req)) {
        return next(
            new CustomError("Bu route'a erişiminiz yok!", 401)
        );
    }


const accessToken = getAccessTokenFromHeader(req);

jwt.verify(accessToken, JWT_SECRET_KEY, (err,decoded) => {
    if(err) {
        return next(new CustomError("Bu route'a erişiminiz yok!", 401));
    }
    console.log(decoded);
    next();

    })
};

module.exports = {
    getAccessToRoute
};