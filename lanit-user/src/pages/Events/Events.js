import {useContext, useEffect, useState} from "react";
import {LoadingContext} from "../../context/LoadingContext";
import {Box, Button, Link, Tooltip, Typography} from "@mui/material";
import {ContentPaper} from "../../components/ContentPaper";
import {Link as RouterLink} from "react-router-dom"
import StateContext from "../../context/StateContext";
import axios from "axios";
import {EditEvent} from "./EditEvent";


export const Events = () => {
    const [events, setEvents] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [state, dispatch] = useContext(StateContext)
    const {loading, showLoading, hideLoading} = useContext(LoadingContext)
    const [editEvent, setEditEvent] = useState(false)
    const [eventToEdit, setEventToEdit] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios({
                    method: 'get',
                    url: state.apiServer + 'get_events'
                })
                setEvents(result.data)
                dispatch({type: "SET_EVENTS", payload: result.data})
                console.log("Data saatiin: ", result)
                setIsLoaded(true)
            } catch (err) {
                console.log("ERROR", err.message)
            }
        }
        fetchData()
    }, [])

    const handleDelete = async (e) => {
        try {
            const result = await axios({
                method: 'delete',
                url: state.apiServer + 'delete_event/' + e.target.id
            })
        } catch (err) {
            console.log("ERROR:", err.message)
        }
        console.log()
        const tempEvents = events.filter((event) => event.id !== Number(e.target.id))
        setEvents(tempEvents)
        dispatch({type: "SET_EVENTS", payload: tempEvents})
    }

    const handleEdit = (e) => {
        setEventToEdit(events.filter((event) => event.id === Number(e.target.id))[0])
        setEditEvent(true)

    }

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
                                <Button id={event.id} variant={"contained"} onClick={handleEdit}>Muokkaa</Button>
                                <Button id={event.id} variant={"contained"} sx={{ml: 2}}
                                        onClick={handleDelete}>Poista</Button>
                                {editEvent &&
                                <EditEvent event={eventToEdit} open={editEvent} setOpen={setEditEvent}/>}
                            </Box>}
                        </Box>)
                    })}
                    {state.isAdmin &&
                        <Button variant={"contained"} component={RouterLink} to={"/add-event"} sx={{m: 3}}>Lisää
                            tapahtuma</Button>}
                </ContentPaper>
            </Box>
            :
            null
        }
    </div>)
}