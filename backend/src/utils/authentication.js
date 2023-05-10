const {expressjwt} = require('express-jwt')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {verifyUser} = require("../queries/queries");

const getTokenFromHeaders = async (req) => {
    if (req.headers.authorization) {
        return req.headers.authorization.split(" ")[1]
    }
    return null
}

const checkUserAndAdmin = async (req, res, next) => {
    try {
        const token = await getTokenFromHeaders(req)
        let user = null
        let admin = null
        try {
            user = jwt.verify(token, process.env.USERSECRET)
        } catch (err) {

        }
        try {
            admin = jwt.verify(token, process.env.ADMINSECRET)
        } catch (err) {

        }
        console.log("users:", user)
        console.log("admin:", admin)
        if (user || admin) {
            req.user = user || admin
            next()
        } else {
            return res.status(403).json({error: 'Access denied'});
        }
    } catch (err) {
        return res.status(401).json({error: 'Unauthorized'});
    }
}

const auth = {
    userAuth: checkUserAndAdmin,
    adminAuth: expressjwt({
        secret: process.env.ADMINSECRET,
        algorithms: ["HS256"],
        getToken: getTokenFromHeaders
    })
}

const hashPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, Number(process.env.SALTROUNDS))
}

module.exports = {auth, hashPassword}