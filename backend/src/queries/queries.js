const db = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (userInfo) => {
    console.log("userInfo: ", userInfo)
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
        console.log("TÄSSÄ VIRHE??", err)
        return {error: true, message: err.error}
    }
    console.log("result???", result)
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
                    token = jwt.sign({
                        id: result.rows[0].id,
                        username: username,
                        email: result.rows[0].email,
                        name: result.rows[0].name,
                        lastname: result.rows[0].lastname
                    }, process.env.USERSECRET, {algorithm: "HS256", expiresIn: "30d"})
                    console.log("Palataan")
                    return ({error: false, data: token})
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
    (name, description, start_time, end_time, max_participants, address, account_number)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `
    const parameters = [event.name, event.description, event.startTime, event.endTime, event.maxParticipants, event.address, event.accountNumber]
    let result
    try {
        result = await db.query(queryString, parameters)
    } catch (err) {
        return {error: true, message: err.error}
    }
}

const listEvents = async () => {
    const queryString = `
    SELECT * FROM event
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
                maxParticipants: row.max_participants
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
    return {
        error: false
    }

}


module.exports = {registerUser, loginUser, verifyUser}
