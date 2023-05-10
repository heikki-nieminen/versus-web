import {Box, Button, Modal} from "@mui/material";
import {DatePicker, TimeClock, TimePicker} from "@mui/x-date-pickers";
import {useState} from "react";
import {combineDateAndTime} from "../../utils/dateAndTime";

export const SetDateAndTime = (props) => {
    const {openSetTime, setOpenSetTime, startOrEndTime, setTime} = props
    const [dateAndTime, setDateAndTime] = useState({date: "", time: ""})
    const style = {
        position: 'relative',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px',
        display: 'inline-flex',
        flexDirection: 'column'

    }

    const handleClose = () => {
        setTime(startOrEndTime, combineDateAndTime(dateAndTime.date, dateAndTime.time))
        setDateAndTime({date:"", time: ""})
        setOpenSetTime(false)
    }

    const handleSetDate = (e) => {
        const date = e.$d
        //const date = e.$d.toLocaleDateString('fi-FI')
        setDateAndTime({...dateAndTime, date: date})
    }

    const handleSetTime = (e) => {
        const time = e.$d
        //const time = e.$d.toLocaleTimeString('fi-FI', {hour:"2-digit", minute:"2-digit"})
        setDateAndTime({...dateAndTime, time: time})
    }

    return (<div>
        <Modal
            open={openSetTime}
            onClose={handleClose}>
            <Box sx={style}>
                <DatePicker name={"date"} label={"Päivämäärä"} onChange={handleSetDate}/>
                <TimePicker name={"time"} label={"Kellonaika"} onChange={handleSetTime} ampm={false}/>
                <Button variant={"contained"} onClick={handleClose}>Ok</Button>
            </Box>
        </Modal>
    </div>)
}