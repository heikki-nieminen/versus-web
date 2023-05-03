import { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { StateContext } from '../context/StateContext'
import { AccessDenied } from '../pages/AccessDenied'

export const AuthRoute = ({ isProtected, isAdminRoute, ...rest }) => {
    const [state, dispatch] = useContext(StateContext)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isVerifyingToken, setIsVerifyingToken] = useState(true)


    const verifyToken = async () => {
        let token
        if (isAdminRoute) {
            token = localStorage.getItem('adminToken')
        } else {
            token = localStorage.getItem('userToken')
        }
        if (!token) {
            setIsAuthenticated(false)
            setIsVerifyingToken(false)
            return
        }
        try {
            const response = await axios({
                method: 'get',
                url: isAdminRoute ? state.apiServer + 'verifyAdminToken' : state.apiServer + 'verifyUserToken',
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            setIsAuthenticated(true)
        } catch (err) {
            setIsAuthenticated(false)
        }
        setIsVerifyingToken(false)
    }

    useEffect(() => {
        verifyToken()
    }, [isAdminRoute, state.apiServer])

    useEffect(() => {
        setIsAuthenticated(state.loggedIn)
    }, [state.loggedIn])

    if (!isProtected) {
        return <Outlet />
    }

    if (isAuthenticated) {
        return <Outlet />
    }

    if (!isVerifyingToken && !isAuthenticated) {
        return <AccessDenied />
    }

    return null;
}
