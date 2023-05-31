import {createContext, useReducer} from "react";
import {reducer} from "../reducer";

let api = "https://lanit.versus-gaming.eu/api/"
if(process.env.NODE_ENV === 'development') {
    api = "http://localhost:3002/"
}

export const initialState = {
    apiServer: api,
    selectedEvent: "",
    loggedIn: false,
    testidata: "testidata",
    isLoading: false,
    darkMode: false,
    isAdmin: false
}

export const Context = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <StateContext.Provider value={[state, dispatch]}>
            {children}
        </StateContext.Provider>
    )
}
export const StateContext = createContext(initialState)
export const ThemeContext = createContext(null)

export default StateContext