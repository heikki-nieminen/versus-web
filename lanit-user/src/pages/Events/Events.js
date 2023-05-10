import {useContext, useEffect, useState} from "react";
import {LoadingContext} from "../../context/LoadingContext";
import {Box, Button, Link, Paper, Tooltip, Typography} from "@mui/material";
import {eventsData} from "./mockdata";
import {ContentPaper} from "../../components/ContentPaper";
import {Link as RouterLink} from "react-router-dom"
import StateContext from "../../context/StateContext";
import axios from "axios";


export const Events = () => {
    const [events, setEvents] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [state, dispatch] = useContext(StateContext)
    const {loading, showLoading, hideLoading} = useContext(LoadingContext)

    useEffect(() => {
        const fetchData = async() => {
            try{
                const result = await axios({
                    method: 'get',
                    url: state.apiServer + 'get_events'
                })
                setEvents(result.data)
                dispatch({type: "SET_EVENTS", payload: result.data})
                console.log("Data saatiin: ",result)
                setIsLoaded(true)
            }catch(err){
                console.log("ERROR", err.message)
            }
        }
        fetchData()
    }, [])

    return (<div>
        {isLoaded && !loading ? <Box sx={{my: 4}}>
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
                                    <Typography variant={"h6"}>{event.participants}\{event.maxParticipants}</Typography>
                                </Link>
                            </Tooltip>
                            {state.isAdmin && <Box>
                                <Button variant={"contained"}>Muokkaa</Button>
                                <Button variant={"contained"} sx={{ml: 2}}>Poista</Button>
                            </Box>}
                        </Box>)
                })}
        {state.isAdmin &&
            <Button variant={"contained"} component={RouterLink} to={"/add-event"} sx={{m: 3}}>Lisää tapahtuma</Button>}
    </ContentPaper>
</Box>
:
    null
}
</div>)
}