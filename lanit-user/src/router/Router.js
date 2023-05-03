import {Route, Routes} from 'react-router-dom';
import {AccessDenied} from '../pages/AccessDenied';
import {NotFound} from "../pages/NotFound";
import {Home} from "../pages/Home";
import {Events} from "../pages/Events/Events";
import {Event} from "../pages/Events/Event";
import {Info} from "../pages/Info";
import {AuthRoute} from "./AuthRoute";
import {LoadingContext, LoadingProvider} from "../context/LoadingContext";
import {useState, useEffect} from "react";
import {Loading} from "../pages/components/Loading";
import {VerifyEmail} from "../pages/VerifyEmail";

export const Router = () => {

    useEffect(() => {

    }, [])

    return (
        <div>
            <LoadingProvider>
                <Routes>
                    <Route path="*" element={<NotFound/>}/>
                    <Route path="/" element={<Home/>}/>
                    <Route path="info" element={<Info/>}/>
                    <Route element={<AuthRoute isProtected={true} isAdminRoute={false}/>}>
                        <Route path="events" element={<Events/>}/>
                        <Route path="event" element={<Event/>}/>
                    </Route>
                    <Route path="/verify-email" element={<VerifyEmail/>}/>
                    <Route path="/verify-email/:id" element={<VerifyEmail/>}/>
                    <Route path="/access-denied" element={<AccessDenied/>}/>
                </Routes>
            </LoadingProvider>
        </div>
    );
};
