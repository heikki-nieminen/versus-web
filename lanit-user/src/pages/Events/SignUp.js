import {Box, Button, Modal, Typography} from "@mui/material";
import {useContext} from "react";
import StateContext from "../../context/StateContext";
import axios from "axios";

export const SignUp = (props) => {
    const {open, setOpen, eventId} = props
    const [state, dispatch] = useContext(StateContext)
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
        display: 'inline-block'

    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleAcceptClick = async () => {
        try{
            const result = await axios({
                method: 'post',
                url: state.apiServer + 'signup_event',
                data: {eventId: eventId}
            })
        }catch (err){
            console.log("ERROR:",err)
        }
    }
    return (<div>
        <Modal open={open}
               onClose={handleClose}
               aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-description">
            <Box sx={style}>

            <Typography>
                Haluatko varmasti ilmoittautua laneille?
            </Typography>
                <Box sx={{display: "flex" ,flexDirection:"row"}}>
                    <Box sx={{width:"50%", mt:2, mr:1}}>
                        <Button fullWidth={true} variant={"contained"} onClick={handleAcceptClick}>Kyllä</Button>
                    </Box>
                    <Box sx={{width:"50%", mt:2, ml:1}}>
                        <Button fullWidth={true} variant={"contained"} onClick={handleClose}>Peruuta</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    </div>)
}