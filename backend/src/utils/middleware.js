const errorHandler = (err, req, res, next) => {
    console.log("Error: ",err)
    if('code' in err) {
        err.type = err.code
    }

    switch(err.type) {
        case 23505: {
            switch (err.constraint) {
                case 'email':
                    return res.status(422).send({error: "Email is already in use."})
                case 'username':
                    return res.status(422).send({error: "Username is already in use."})
            }
            break
        }
        case "invalid_token" : {
            switch (err.inner.message) {
                case "jwt expired": {
                    return res.status(401).send({error: "Token expired"})
                }
                case "invalid signature": {
                    return res.status(401).send({error: "Invalid token"})
                }
                default:
                    return res.status(401).send({error: "Unauthorized"})
            }
        }
        case "wrongUserOrPass" : {
            return res.status(401).send({error: "Wrong username or password"})
        }
        case "notVerified" : {
            return res.status(401).send({error: "Email not verified"})
        }
        default:
            return res.status(500).send({error: "Server error"}).end()
    }
}

module.exports = {errorHandler}