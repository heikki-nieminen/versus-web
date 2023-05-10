import {Box, Button, Grid, OutlinedInput, Paper, TextareaAutosize, TextField, Typography} from "@mui/material"
import {useContext, useState} from "react";
import {darkTheme} from "../../theme";
import {SetDateAndTime} from "./SetDateAndTime";
import axios from "axios";
import StateContext from "../../context/StateContext";
import {dateAndTimeToLocale} from "../../utils/dateAndTime";

export const AddEvent = () => {
    const [openSetTime, setOpenSetTime] = useState(false)
    const [startOrEndTime, setStartOrEndTime] = useState("")
    const [state, dispatch] = useContext(StateContext)

    const [eventInfo, setEventInfo] = useState({
        eventName: "",
        description: "",
        fee: "",
        address: "",
        startTime: "",
        endTime: "",
        maxParticipants: "",
        accountName: "",
        accountNumber: ""
    })

    const [startEndTime, setStartEndTime] = useState({})
    const [endTime, setEndTime] = useState("")

    const handleChange = (e) => {
        setEventInfo({...eventInfo, [e.target.name]: e.target.value})
        console.log(eventInfo)
    }

    const setTime = (startOrEnd, time) => {
        setStartEndTime({...startEndTime, [startOrEnd] : dateAndTimeToLocale(time)})
        setEventInfo({...eventInfo, [startOrEnd]: time})
    }

    const handleOpenSetTime = (e) => {
        setStartOrEndTime(e.target.name)
        setOpenSetTime(true)
    }

    const handleAddEvent = async () => {
        try {
            const result = await axios({
                method: "post",
                url: state.apiServer+'add_event',
                data: eventInfo
            })
            console.log(result)
        }catch (err){
            console.log("ERROR:",err.message)
        }
        console.log("Tapahtuma lisätty")
    }

    return (<div>
        <Box my={4}>
            <Paper>
                <Box pt={2}>
                    <Typography variant={"h3"} textAlign={"center"}>Lisää tapahtuma</Typography>
                </Box>
                <Box m={3} textAlign={"center"}>
                    <OutlinedInput
                        id={"event-name"}
                        name={"eventName"}
                        value={eventInfo.eventName}
                        fullWidth={true}
                        onChange={handleChange}
                        placeholder={"Tapahtuman nimi"}/>
                    <TextField
                        id={"description"}
                        name={"description"}
                        value={eventInfo.description}
                        fullWidth={true}
                        multiline={true}
                        sx={{bgcolor: 'background.paper'}}
                        onChange={handleChange}
                        placeholder={"Tapahtuman kuvaus"}/>
                    <Grid container flexDirection={"row"} alignItems={"flex-start"}>
                        <Grid item xs={2}>
                            <OutlinedInput
                                name={"maxParticipants"}
                                value={eventInfo.maxParticipants}
                                placeholder={"Osallistujamäärä"}
                                onChange={handleChange}/>
                        </Grid>
                        <Grid item xs={2}>
                            <OutlinedInput
                                id={"start-time"}
                                name={"startTime"}
                                value={startEndTime.startTime}
                                onClick={handleOpenSetTime}
                                onChange={handleChange}
                                placeholder={"Aloitus ajankohta"}/>
                        </Grid>
                        <Grid item xs={2}>
                            <OutlinedInput
                                id={"end-time"}
                                name={"endTime"}
                                value={startEndTime.endTime}
                                onClick={handleOpenSetTime}
                                onChange={handleChange}
                                placeholder={"Lopetus ajankohta"}/>
                        </Grid>
                        <Grid item xs={6}>
                            <OutlinedInput
                                xs={4}
                                id={"address"}
                                name={"address"}
                                value={eventInfo.address}
                                fullWidth={true}
                                placeholder={"Osoite"}
                                onChange={handleChange}/>
                        </Grid>
                    </Grid>
                    <Typography textAlign={"left"}>Maksutiedot</Typography>
                    <OutlinedInput
                        name={"fee"}
                        value={eventInfo.fee}
                        fullWidth={true}
                        placeholder={"Hinta"}
                        onChange={handleChange}/>
                    <OutlinedInput
                        name={"accountName"}
                        value={eventInfo.accountName}
                        fullWidth={true}
                        placeholder={"Nimi"}
                        onChange={handleChange}/>
                    <OutlinedInput
                        name={"accountNumber"}
                        value={eventInfo.accountNumber}
                        fullWidth={true}
                        placeholder={"Tilinumero"}
                        onChange={handleChange}/>
                    <Grid container flexDirection={"row"} alignItems={"flex-start"}>
                        <Button variant={"contained"} onClick={handleAddEvent}>Lisää tapahtuma</Button>
                        <Button variant={"contained"}>Peruuta</Button>
                    </Grid>
                </Box>
            </Paper>
        </Box>
        <SetDateAndTime openSetTime={openSetTime} setOpenSetTime={setOpenSetTime} startOrEndTime={startOrEndTime}
                        setTime={setTime}/>
    </div>)
}