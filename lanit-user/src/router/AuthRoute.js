import { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { StateContext } from '../context/StateContext'
import { AccessDenied } from '../pages/AccessDenied'

export const AuthRoute = ({ isProtected, isAdminRoute, ...rest }) => {
    const [state, dispatch] = useContext(StateContext)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isVerifyingToken, setIsVerifyingToken] = useState(true)

    useEffect(() => {
        const verifyToken = async () => {
            let adminToken = localStorage.getItem('adminToken')
            let userToken = localStorage.getItem('userToken')
            let token
            if (isAdminRoute || adminToken) {
                token = adminToken
            } else {
                token = userToken
            }
            if (!token) {
                console.log("Tokenia ei löytynyt")
                setIsAuthenticated(false)
                setIsVerifyingToken(false)
                return false
            }
            console.log("token: ",token)
            try {
                const response = await axios({
                    method: 'get',
                    url: isAdminRoute ? state.apiServer + 'verifyAdminToken' : adminToken ? state.apiServer + 'verifyAdminToken' : state.apiServer + 'verifyUserToken',
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
        verifyToken()
    }, [])

    if (!isProtected) {
        console.log("Route isn't protected")
        return <Outlet />
    }

    if (isAuthenticated) {
        console.log("User is authenticated")
        return <Outlet />
    }

    if (!isVerifyingToken && !isAuthenticated) {
        console.log("User isn't authenticated")
        return <AccessDenied />
    }

    return null;
}
