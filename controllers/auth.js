// User modelini burada kullarak kullanıcı kaydı yapacağız..
const User = require('../models/User');
const CustomError = require('../helpers/CustomError');

const register = async (req,res,next) => {

    // POST DATA
    const name = 'Elif';
    const surname = 'Cebe';
    const email = 'elif@mail.com';
    const password = '123456';
    const gender = 'Kadın';
    const department = 'Kimya Teknolojileri'

    const user = await User.create({
        name,
        surname,
        email,
        password,
        gender,
        department

    }) 

    res
        .status(200)
        .json({
            success : true,
            data : user
        });
};

module.exports = {
    register
}