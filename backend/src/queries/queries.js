const db = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (userInfo) => {
    console.log('userInfo: ', userInfo)
    const queryString = `
    INSERT INTO public.user (username, password, email, name, lastname)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
    `
    const parameters = [userInfo.username, userInfo.password, userInfo.email, userInfo.name, userInfo.lastname]
    let result

    try {
        result = await db.query(queryString, parameters)
    } catch (err) {
        if (err.code === '23505') {
            return {error: true, code: 23505, constraint: err.constraint}
        }
        console.log('TÄSSÄ VIRHE??', err)
        return {error: true, message: err.error}
    }
    console.log('result???', result)
    return {error: false, data: result.rows[0].id}
}
const loginUser = async (username, password) => {
    const queryString = `
        SELECT * FROM public.user
        WHERE username = $1;
    `
    const parameters = [username]
    let result
    let token
    try {
        result = await db.query(queryString, parameters)
        console.log(result.rows)
        if (result.rowCount > 0) {
            const hashedPassword = result.rows[0].password
            const compare = await bcrypt.compare(password, hashedPassword)
            if (compare) {
                if (result.rows[0].email_verified) {
                    if (result.rows[0].is_admin) {
                        token = jwt.sign({
                            id: result.rows[0].id,
                            username: username,
                            email: result.rows[0].email,
                            name: result.rows[0].name,
                            lastname: result.rows[0].lastname
                        }, process.env.ADMINSECRET, {algorithm: 'HS256', expiresIn: '30d'})
                        return ({error: false, data: {token: token, isAdmin: true}})
                    } else {
                        token = jwt.sign({
                            id: result.rows[0].id,
                            username: username,
                            email: result.rows[0].email,
                            name: result.rows[0].name,
                            lastname: result.rows[0].lastname
                        }, process.env.USERSECRET, {algorithm: 'HS256', expiresIn: '30d'})
                        return ({error: false, data: {token: token, isAdmin: false}})
                    }
                } else {
                    return {notVerified: true}
                }
            }
            return {wrongUserOrPass: true}
        } else {
            return {wrongUserOrPass: true}
        }
    } catch (err) {
        return {error: true, message: err}
    }
}
const addEvent = async (event) => {
    const queryString = `
    INSERT INTO event
    (name, description, start_time, end_time, max_participants, address, account_number, account_name, fee, phone_number)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `
    const parameters = [event.eventName, event.description, event.startTime, event.endTime, event.maxParticipants, event.address, event.accountNumber, event.accountName, event.fee, event.phoneNumber]
    let result
    try {
        result = await db.query(queryString, parameters)
    } catch (err) {
        console.log('ERROR:', err.message)
        return {error: true, message: err.error}
    }
    return {
        error: false
    }
}
const listEvents = async () => {
    const queryString = `
    SELECT * FROM event
    ORDER BY id;
    `
    let result
    try {
        result = await db.query(queryString)
    } catch (err) {
        return {error: true, message: err.error}
    }
    return {
        error: false, data: result.rows.map((row) => (
            {
                id: Number(row.id),
                name: row.name,
                description: row.description,
                startTime: row.start_time,
                endTime: row.end_time,
                participants: row.participants,
                maxParticipants: row.max_participants,
                fee: row.fee,
                address: row.address,
                accountNumber: row.account_number,
                accountName: row.account_name,
                phoneNumber: row.phone_number,
            }))
    }
}
const verifyUser = async (userId) => {
    const queryString = `
    UPDATE public.user
    SET email_verified = $2
    WHERE id = $1;
    `
    const parameters = [userId, true]

    try {
        await db.query(queryString, parameters)
    } catch (err) {
        console.log(err)
        return {error: true, message: err.error}
    }
    return {error: false}

}
const signUpToEvent = async (eventId, userId) => {
    const queryString = `
    INSERT INTO event_user
    (event_id, user_id)
    VALUES ($1, $2);
    `
    const parameters = [eventId, userId]
    let result

    try {
        result = await db.query(queryString, parameters)
    } catch (err) {
        return {error: true, message: err.error}
    }
    return {error: false}
}
const getEventParticipants = async (eventId) => {
    const queryString = `
    SELECT participants 
    FROM event
    WHERE id=$1;
    `
    const parameters = [eventId]
    let result

    try {
        result = await db.query(queryString, parameters)
    } catch (err) {
        return {error: true, message: err.message}
    }

    return {error: false, data: result.rows[0]}
}
const setEventParticipants = async (eventId, participants) => {
    const queryString = `
    UPDATE event
    SET participants = $2
    WHERE id = $1;
    `
    const parameters = [eventId, participants]
    let result

    try {
        result = await db.query(queryString, parameters)
    } catch (err) {
        return {error: true, message: err.error}
    }
    return {error: false}
}
const checkIfAlreadySigned = async (eventId, userId) => {
    const queryString = `
    SELECT * 
    FROM event_user
    WHERE event_id = $1 AND user_id = $2;
    `
    const parameters = [eventId, userId]
    let result

    try {
        result = await db.query(queryString, parameters)
    } catch (err) {
        return {error: true, message: err.message}
    }

    return {error: false, data: result.rows.length > 0}
}
const deleteEvent = async (eventId) => {
    const queryString = `
    DELETE FROM event
    WHERE id=$1;
    `
    const parameters = [eventId]
    let result

    try {
        result = await db.query(queryString, parameters)
    } catch (err) {
        return {error: true, message: err.message}
    }
    return {error: false}
}

const getEventParticipantList = async (eventId) => {
    const queryString = `
    SELECT user_id, has_paid
    FROM event_user
    WHERE event_id = $1;
    `
    const parameters = [eventId]
    let result

    try {
        result = await db.query(queryString, parameters)
    } catch (err) {
        return {error: true, message: err.message}
    }
    return {error: false, data: result.rows}
}

const getUserData = async (userId) => {
    const queryString = `
    SELECT *
    FROM public.user
    WHERE id = $1;
    `
    const parameters = [userId]
    let result

    try {
        result = await db.query(queryString, parameters)
    } catch (err) {
        return {error: true, message: err.message}
    }
    return {error: false, data: result.rows[0]}
}

const removeUserFromEvent = async (eventId, userId) => {
    const queryString = `
    DELETE FROM event_user
    WHERE event_id = $1 AND user_id = $2;
    `
    const parameters = [eventId, userId]
    let result

    try {
        result = await db.query(queryString, parameters)
    } catch (err) {
        return {error: true, message: err.message}
    }
    return {error: false}
}

const hasUserPaid = async (eventId, userId) => {
    const queryString = `
    SELECT has_paid
    FROM event_user
    WHERE event_id = $1 AND user_id = $2;
    `
    const parameters = [eventId, userId]
    let result

    try {
        result = await db.query(queryString, parameters)
    } catch (err) {
        return {error: true, message: err.message}
    }
    return {error: false, data: result.rows[0]}
}

const markUserAsPaid = async (eventId, userId) => {
    const queryString = `
    UPDATE event_user
    SET has_paid = true
    WHERE event_id = $1 AND user_id = $2;
    `
    const parameters = [eventId, userId]
    let result

    try {
        result = await db.query(queryString, parameters)
    } catch (err) {
        return {error: true, message: err.message}
    }
    return {error: false}
}

const editEvent = async (eventInfo) => {
    const queryString = `
    UPDATE event
    SET name = $1, description = $2, start_time = $3, end_time = $4, max_participants = $5, fee = $6, address = $7, account_number = $8, account_name = $9, phone_number = $10
    WHERE id = $11;
    `
    const parameters = [eventInfo.name, eventInfo.description, eventInfo.startTime, eventInfo.endTime, eventInfo.maxParticipants, eventInfo.fee, eventInfo.address, eventInfo.accountNumber, eventInfo.accountName, eventInfo.phoneNumber, eventInfo.id]
    let result

    try {
        result = await db.query(queryString, parameters)
    } catch (err) {
        return {error: true, message: err.message}
    }
    return {error: false}
}

module.exports = {
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
    editEvent
}
