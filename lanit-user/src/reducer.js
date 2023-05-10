import theme from "./theme";

export const reducer = (state, action) => {
    let deepCopy = JSON.parse(JSON.stringify(state))
    switch (action.type) {
        case "INIT": {
            console.log("Datan alustus käynnissä")
            break
        }
        case "LOGIN_USER": {
            deepCopy.loggedIn = true
            return deepCopy
        }
        case "LOGIN_ADMIN": {
            console.log("Logging in as admin")
            deepCopy.loggedIn = true
            deepCopy.isAdmin = true
            return deepCopy
        }
        case "LOGOUT": {
            deepCopy.loggedIn = false
            deepCopy.isAdmin = false
            return deepCopy
        }
        case "SET_USERDATA": {
            const userInfo = action.payload.userInfo
            deepCopy.username = userInfo.username
            return deepCopy
        }
        case "CHANGE_THEME":  {
            deepCopy.darkMode = !deepCopy.darkMode
            return deepCopy
        }
        case "SET_EVENTS": {
            deepCopy.events = action.payload
            return deepCopy
        }
        default:
            return state
    }
}