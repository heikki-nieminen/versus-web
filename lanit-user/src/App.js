import {Navigation} from "./Navigation";
import {Home} from "./pages/Home";
import {createContext, useContext, useEffect, useReducer, useState} from "react";
import {Loading} from "./pages/components/Loading";
import {reducer} from "./reducer";
import {Context, ThemeContext} from "./context/StateContext";
import {StateContext} from "./context/StateContext";

import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import axios from "axios";
import {Routes, Route, Outlet, BrowserRouter} from "react-router-dom";
import {NotFound} from "./pages/NotFound";
import {AccessDenied} from "./pages/AccessDenied";
import {Events} from "./pages/Events/Events";
import {Router} from "./router/Router";
import theme, {darkTheme, lightTheme} from "./theme";


export const App = (props) => {
    const [isInitialized, setIsInitialized] = useState(true)
    const [state, dispatch] = useContext(StateContext)
    const [isLoggedIn, setIsLoggedIn] = useState(state.loggedIn)


    useEffect(() => {
        const checkUserToken = async () => {
            const token = localStorage.getItem('userToken')
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Token ${token}`
                let userData
                try {
                    userData = await axios({
                        method: "get",
                        url: state.apiServer + 'verifyUserToken'
                    })
                    if (userData) {
                        dispatch({type: "LOGIN_USER"})
                        dispatch({type: "SET_USERDATA", payload: {userInfo: {username: userData.data.username}}})
                    }
                } catch (err) {
                    localStorage.removeItem('userToken')
                }
            }
        }
        const checkAdminToken = async () => {
            const token = localStorage.getItem('adminToken')
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Token ${token}`
                let userData
                try {
                    userData = await axios({
                        method: "get",
                        url: state.apiServer + 'verifyAdminToken'
                    })
                    if (userData) {
                        dispatch({type: "LOGIN_ADMIN"})
                    }
                } catch (err) {
                    localStorage.removeItem('adminToken')
                }
            }
        }
        checkUserToken()
        checkAdminToken()
        setIsInitialized(true)

    }, [])

    return (
        <BrowserRouter>
            {isInitialized ?
                <Container>
                    <Navigation/>
                    <Container>
                        <Router/>
                    </Container>
                </Container>
                :
                <Loading/>
            }
        </BrowserRouter>
    )
}

export const ContextWrapper = () => {
    return (<>
            <Context>
                <DarkThemeProvider>
                    <CssBaseline/>
                    <App/>
                </DarkThemeProvider>
            </Context>
        </>
    )
}

const DarkThemeProvider = ({children}) => {
    const [state, dispatch] = useContext(StateContext)
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        if (!isInitialized) {
            const darkMode = localStorage.getItem('darkMode')
            if (darkMode === "true") {
                dispatch({type: "CHANGE_THEME"})
            }
            setIsInitialized(true)
        }
    }, [])

    let theme = lightTheme

    if (state.darkMode) {
        theme = darkTheme
    }

    return (<>{isInitialized ?
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
        :
        <></>
    }
    </>)
}

