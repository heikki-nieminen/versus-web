import {useContext, useEffect, useState} from "react";
import {LoadingContext} from "../../context/LoadingContext";
import {Box, Button, Link, Paper, Tooltip, Typography} from "@mui/material";
import {eventsData} from "./mockdata";
import {ContentPaper} from "../../components/ContentPaper";
import {Link as RouterLink} from "react-router-dom"
import StateContext from "../../context/StateContext";


export const Events = () => {
    const [events, setEvents] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [state, dispatch] = useContext(StateContext)
    const {loading, showLoading, hideLoading} = useContext(LoadingContext)

    useEffect(() => {
        showLoading()
        try {
            setEvents(eventsData)
            dispatch({type: "SET_EVENTS", payload: eventsData})
        } catch (err) {

        }
        finally {
            setIsLoaded(true)
            hideLoading()
        }
    }, [])

    return (<div>
        {isLoaded && !loading ?
        <Box sx={{my: 4}}>
            <ContentPaper>
                {events.map((event) => {
                    return (<Box key={event.id} pl={3} pt={3}>
                            <Tooltip title={event.name} followCursor={true}>
                                <Link
                                    component={RouterLink}
                                    to={`/event?id=${event.id}`}
                                    sx={{
                                        textDecoration: "none",
                                        color: "inherit",
                                        cursor: "pointer",
                                        display: "inline-block"
                                    }}>
                                    <Typography key={event.name} variant={"h5"}>{event.name}</Typography>
                                    <Typography variant={"h6"}>{event.attendants}\{event.maxAttendants}</Typography>
                                </Link>
                            </Tooltip>
                        </Box>
                    )
                })}
            </ContentPaper>
        </Box>
            :
            null}
    </div>)
}