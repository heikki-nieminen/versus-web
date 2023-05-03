import React, {createContext, useState} from "react";
import {Loading} from "../pages/components/Loading";

export const LoadingContext = createContext()

export const LoadingProvider = ({children}) => {
    const [loading, setLoading] = useState(false)

    const showLoading = () =>{
        setLoading(true)
    }

    const hideLoading = () => {
        setLoading(false)
    }

    return(<LoadingContext.Provider value={{loading, showLoading, hideLoading}}>
        {loading ? <Loading/> : null}
        {children}
    </LoadingContext.Provider> )
}

