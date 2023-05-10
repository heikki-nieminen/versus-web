const router = require('express').Router()
const {auth} = require('../utils/authentication')
const {registerUser, loginUser, verifyUser, addEvent, listEvents} = require("../queries/queries");
const {hashPassword} = require('../utils/authentication')
const {sendEmail} = require('../utils/email')


router.post('/login', async (req, res, next) => {
    const {username, password} = req.body

    const loginUserResult = await loginUser(username, password)
    console.log(loginUserResult)
    if (loginUserResult?.error) {
        return next(loginUserResult)
    }
    if (loginUserResult?.wrongUserOrPass) {
        return next({type: "wrongUserOrPass"})
    }
    if (loginUserResult?.notVerified) {
        return next({type: "notVerified"})
    }

    return res.status(201).send({correct: true, token: loginUserResult.data.token, isAdmin: loginUserResult.data.isAdmin})
})
router.post('/register', async (req, res, next) => {
    let userInfo = req.body.userInfo
    const hashedPassword = await hashPassword(userInfo.password)
    userInfo.password = hashedPassword


    const registerUserResult = await registerUser(userInfo)
    if (registerUserResult.error) {
        return next(registerUserResult)
    }

    // Send verification email
    console.log("registeUSerResult", registerUserResult)
    // Link to verification
    const link = `${process.env.HOST_ADDRESS}verify-email/${registerUserResult.data}`

    const sendVerificationEmailResult = await sendEmail(userInfo.email, "Email verification", link)

    res.status(200).end()

})

router.get('/verifyUserToken', auth.userAuth, async (req, res, next) => {
    res.status(200).end()
})

router.get('/verifyAdminToken', auth.adminAuth, async (req, res, next) => {
    res.status(200).end()
})

router.get('/', auth.userAuth, async (req, res) => {
    res.status(200).end()
})

router.get('/testi', async (req, res) => {
    res.send("Testisivu")
})

router.post('/add_event/', auth.adminAuth, async (req, res, next) => {
    console.log("Adding new event:",req.body)
    const addEventResult = await addEvent(req.body)
    if(addEventResult.error){return next(addEventResult)}

    return res.status(200).send({status: "ok"})
})

router.get('/get_events', auth.userAuth, async (req, res, next) => {
    const listEventsResult = await listEvents()
    if(listEventsResult.error){ return next(listEventsResult)}

    return res.status(200).send(listEventsResult.data).end()
})

router.get('/event/:id', auth.adminAuth ,auth.userAuth, async (req, res, next) => {

})

router.get('/verify-email/:userId', async (req, res, next) => {
// Try to verify user with userId
    console.log("Trying to verify email")
    const verifyUserResult = await verifyUser(req.params.userId)
    if(verifyUserResult.error){return next(verifyUserResult)}

    return res.status(200).send({verified: true}).end()
})

module.exports = router