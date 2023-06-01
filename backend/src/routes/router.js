const router = require('express').Router()
const {auth} = require('../utils/authentication')
const {
    registerUser,
    loginUser,
    verifyUser,
    addEvent,
    listEvents,
    signUpToEvent,
    getEventParticipants,
    setEventParticipants,
    checkIfAlreadySigned,
    deleteEvent,
    getEventParticipantList,
    getUserData,
    removeUserFromEvent,
    hasUserPaid,
    markUserAsPaid,
    editEvent,
    listUsers,
    editUserRole,
    getRoles,
    addRole,
    deleteRole,
    editRole,
    getContents
} = require('../queries/queries')
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
        return next({type: 'wrongUserOrPass'})
    }
    if (loginUserResult?.notVerified) {
        return next({type: 'notVerified'})
    }

    return res.status(201).send({
        correct: true,
        token: loginUserResult.data.token,
        isAdmin: loginUserResult.data.isAdmin
    })
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
    console.log('registeUSerResult', registerUserResult)
    // Link to verification
    const link = `${process.env.HOST_ADDRESS}verify-email/${registerUserResult.data}`

    const sendVerificationEmailResult = await sendEmail(userInfo.email, 'Email verification', link)

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
    res.send('Testisivu')
})

router.post('/add_event/', auth.adminAuth, async (req, res, next) => {
    console.log('Adding new event:', req.body)
    console.log('PAYLOADSS: ', req.user)
    const addEventResult = await addEvent(req.body)
    if (addEventResult.error) {
        return next(addEventResult)
    }

    return res.status(200).send({status: 'ok'})
})

router.get('/get_events', auth.userAuth, async (req, res, next) => {
    const listEventsResult = await listEvents()
    if (listEventsResult.error) {
        return next(listEventsResult)
    }

    return res.status(200).send(listEventsResult.data).end()
})

router.get('/event/:id', auth.adminAuth, auth.userAuth, async (req, res, next) => {

})

router.get('/verify-email/:userId', async (req, res, next) => {
// Try to verify user with userId
    console.log('Trying to verify email')
    const verifyUserResult = await verifyUser(req.params.userId)
    if (verifyUserResult.error) {
        return next(verifyUserResult)
    }

    return res.status(200).send({verified: true}).end()
})

router.post('/signup_event', auth.userAuth, async (req, res, next) => {
    const checkIfAlreadySignedResult = await checkIfAlreadySigned(req.body.eventId, req.user.id)
    if (checkIfAlreadySignedResult.error) {
        return next(checkIfAlreadySignedResult)
    }

    const signUpToEventResult = await signUpToEvent(req.body.eventId, req.user.id)
    if (signUpToEventResult.error) {
        return next(signUpToEventResult)
    }

    const getEventParticipantsResult = await getEventParticipants(req.body.eventId)
    if (getEventParticipantsResult.error) {
        return next(getEventParticipantsResult)
    }

    const setEventParticipantsResult = await setEventParticipants(req.body.eventId, Number(getEventParticipantsResult.data.participants) + 1)
    if (setEventParticipantsResult.error) {
        return next(setEventParticipantsResult)
    }

    return res.status(200).send({signUpAccepted: true}).end()
})

router.delete('/delete_event/:eventId', auth.adminAuth, async (req, res, next) => {
    const deleteEventResult = await deleteEvent(req.params.eventId)
    if (deleteEventResult.error) {
        return next(deleteEventResult)
    }

    return res.status(200).end()
})

router.post('/check_if_signed', auth.userAuth, async (req, res, next) => {
    const checkIfAlreadySignedResult = await checkIfAlreadySigned(req.body.eventId, req.user.id)
    if (checkIfAlreadySignedResult.error) {
        return next(checkIfAlreadySignedResult)
    }

    return res.status(200).send({signed: checkIfAlreadySignedResult.data}).end()
})

router.get('/get_event_participantlist/:eventId', auth.adminAuth, async (req, res, next) => {
    const getEventParticipantListResult = await getEventParticipantList(req.params.eventId)
    if (getEventParticipantListResult.error) {
        return next(getEventParticipantListResult)
    }

    console.log('getEventParticipantListResult', getEventParticipantListResult)

    let participantList = []

    for (let i = 0; i < getEventParticipantListResult.data.length; i++) {
        let userData = await getUserData(getEventParticipantListResult.data[i].user_id)
        if (userData.error) {
            return next(userData)
        }
        participantList.push({
            userId: userData.data.id,
            username: userData.data.username,
            name: userData.data.name,
            lastname: userData.data.lastname,
            email: userData.data.email,
            hasPaid: getEventParticipantListResult.data[i].has_paid
        })
    }

    console.log('participantList', participantList)

    return res.status(200).send(participantList).end()
})

router.delete('/resign_from_event/:eventId', auth.userAuth, async (req, res, next) => {
    const checkIfAlreadySignedResult = await checkIfAlreadySigned(req.params.eventId, req.user.id)
    if (checkIfAlreadySignedResult.error) {
        return next(checkIfAlreadySignedResult)
    }

    const removeUserFromEventResult = await removeUserFromEvent(req.params.eventId, req.user.id)
    if (removeUserFromEventResult.error) {
        return next(removeUserFromEventResult)
    }

    const getEventParticipantsResult = await getEventParticipants(req.params.eventId)
    if (getEventParticipantsResult.error) {
        return next(getEventParticipantsResult)
    }

    const setEventParticipantsResult = await setEventParticipants(req.params.eventId, Number(getEventParticipantsResult.data.participants) - 1)
    if (setEventParticipantsResult.error) {
        return next(setEventParticipantsResult)
    }

    return res.status(200).end()
})

router.get('/check_if_paid/:eventId', auth.userAuth, async (req, res, next) => {
    const hasUserPaidResult = await hasUserPaid(req.params.eventId, req.user.id)
    if (hasUserPaidResult.error) {
        return next(hasUserPaidResult)
    }

    return res.status(200).send({hasPaid: hasUserPaidResult.data}).end()
})

router.put('/set_paid', auth.adminAuth, async (req, res, next) => {
    const markUserAsPaidResult = await markUserAsPaid(req.body.eventId, req.body.userId)
    console.log('markUserAsPaidResult', markUserAsPaidResult)
    if (markUserAsPaidResult.error) {
        return next(markUserAsPaidResult)
    }

    return res.status(200).end()
})

router.put('/edit_event', auth.adminAuth, async (req, res, next) => {
    const editEventResult = await editEvent(req.body)
    if (editEventResult.error) {
        return next(editEventResult)
    }

    return res.status(200).end()
})


// Role related routes
router.get('/get_roles', auth.adminAuth, async (req, res, next) => {
    const getRolesResult = await getRoles()
    if (getRolesResult.error) {
        return next(getRolesResult)
    }

    return res.status(200).send(getRolesResult.data).end()
})
router.post('/add_role', auth.adminAuth, async (req, res, next) => {
    const addRoleResult = await addRole(req.body.name)
    if (addRoleResult.error) {
        return next(addRoleResult)
    }

    return res.status(200).send(addRoleResult.data).end()
})
router.delete('/delete_role/:roleId', auth.adminAuth, async (req, res, next) => {
    const deleteRoleResult = await deleteRole(req.params.roleId)
    if (deleteRoleResult.error) {
        return next(deleteRoleResult)
    }

    return res.status(200).end()
})
router.put('/edit_role', auth.adminAuth, async (req, res, next) => {
    const editRoleResult = await editRole(req.body.roleId, req.body.roleName)
    if (editRoleResult.error) {
        return next(editRoleResult)
    }

    return res.status(200).end()
})

// Contents related routes
router.get('/get_contents', auth.adminAuth, async (req, res, next) => {
    const getContentsResult = await getContents()
    if (getContentsResult.error) {
        return next(getContentsResult)
    }

    return res.status(200).send(getContentsResult.data).end()
})
router.get('/get_content/:key', auth.adminAuth, async (req, res, next) => {

})
router.post('/add_content', auth.adminAuth, async (req, res, next) => {

})
router.delete('/delete_content/:key', auth.adminAuth, async (req, res, next) => {

})
router.put('/edit_content', auth.adminAuth, async (req, res, next) => {

})

// User related routes
router.get('/get_users', auth.adminAuth, async (req, res, next) => {
    const listUsersResult = await listUsers()
    if (listUsersResult.error) {
        return next(listUsersResult)
    }

    return res.status(200).send(listUsersResult.data).end()
})
router.put('/edit_user_role', auth.adminAuth, async (req, res, next) => {
    const editUserRoleResult = await editUserRole(req.body.userId, req.body.roleName)
    if (editUserRoleResult.error) {
        return next(editUserRoleResult)
    }

    return res.status(200).end()
})
router.delete('/delete_user/:userId', auth.adminAuth, async (req, res, next) => {

})

module.exports = router
