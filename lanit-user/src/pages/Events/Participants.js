import {Box, Modal, Paper, Tooltip, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import StateContext from "../../context/StateContext";
import axios from "axios";
import {Participant} from "./Participant";


const style = {
    position: 'relative',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,

    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px'
}

export const Participants = (props) => {
    const [participants, setParticipants] = useState([])
    const [state, dispatch] = useContext(StateContext)
    const {open, setOpen, eventId} = props
    const [openParticipant, setOpenParticipant] = useState(false)

    useEffect(() => {
        const getParticipants = async () => {
            try {
                const result = await axios({
                    method: 'get',
                    url: state.apiServer + 'get_event_participantlist/' + eventId
                })
                setParticipants(result.data)
                console.log("result.data: ", result.data)
            } catch (err) {
                console.log(err)
            }
        }
        getParticipants()
    }, [])

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Modal open={open}
               onClose={handleClose}
               aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-description">
            <Box my={4} sx={{width: 600, position:'relative', left: '50%', transform: 'translate(-50%, 0)'}}>
                <Paper sx={{}}>
                        <Typography variant={"h3"} textAlign={"center"}>Tapahtuman osallistujat</Typography>
                    <Box m={3} textAlign={"center"}>
                        {participants.map((participant, i) => <Participant key={i} participant={participant} eventId={eventId} hasPaid={participant.hasPaid}/>)}
                    </Box>
                </Paper>
            </Box>

        </Modal>
    )
}