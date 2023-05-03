import {useContext, useEffect, useState} from "react";
import {LoadingContext} from "../context/LoadingContext";

export const Info = () =>{
    const {loading, showLoading, hideLoading} = useContext(LoadingContext)


    useEffect(()=>{

    },[])

    return (
        <div>
            Info
        </div>
    );
}