import {createContext, useReducer} from "react";
import {reducer} from "../reducer";

export const initialState = {
    apiServer: "http://localhost:3002/",
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