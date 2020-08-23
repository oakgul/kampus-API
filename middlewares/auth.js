const CustomError = require('../helpers/CustomError');
const asyncErrorWrapper = require('express-async-handler');
const User = require('../models/User');
const Announce = require('../models/Announce');
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
        return next(
            new CustomError("Bu route'a erişiminiz yok!", 401)
        );
    }

    req.user = {
        id : decoded.id,
        name : decoded.name
    }
    next();
    })
};

// Admin
const getAdminAccess = asyncErrorWrapper( async(req,res,next) => {
    const { id } = req.user;
    const user = await User.findById(id);

    // role admin ?
    if(user.role !== 'admin') {
        return next(new CustomError('Bu alana sadece adminler erişebilir!',403));
    }
    next();
});

// Duyuruyu sadece sahibi değiştirebilir.
const getAnnounceOwnerAccess = asyncErrorWrapper( async(req,res,next) => {
    const userId = req.user.id;
    const announceId = req.params.id;

    const announce = await Announce.findById(announceId);

    if (announce.user != userId) {
        return next(new CustomError('Duyuruyu sadece sahibi değiştirebilir!',403));
    }
    next();
});

module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getAnnounceOwnerAccess
};