const {expressjwt: jwt} = require('express-jwt')
const bcrypt = require('bcrypt')

const getTokenFromHeaders = async (req) => {
    if(req.headers.authorization){
        return req.headers.authorization.split(" ")[1]
    }
    return null
}

const auth = {
    userAuth: jwt({
        secret: process.env.USERSECRET,
        algorithms: ["HS256"],
        getToken: getTokenFromHeaders
    }),
    adminAuth: jwt({
        secret: process.env.ADMINSECRET,
        algorithms: ["HS256"],
        getToken: getTokenFromHeaders
    })
}

const hashPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, Number(process.env.SALTROUNDS))
}

module.exports = {auth, hashPassword}