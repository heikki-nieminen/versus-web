import {Accordion, AccordionDetails, AccordionSummary, Box, Button, Tooltip, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useContext, useState} from "react";
import axios from "axios";
import {StateContext} from "../../context/StateContext";

export const Participant = (props) => {
    const {participant, i, eventId, hasPaid} = props
    const [expanded, setExpanded] = useState(false)
    const [state, dispatch] = useContext(StateContext)

    const setAsPaidHandler = async () => {
        try {
            const result = await axios({
                method: 'put',
                url: state.apiServer + 'set_paid',
                data: {
                    eventId: eventId,
                    userId: participant.userId
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Box key={i} pb={1} m={0}>
            <Accordion expanded={expanded} sx={{bgcolor:'background.default', m:0, p:0}} disableGutters={true}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>} onClick={() => setExpanded(!expanded)}
                aria-controls={"panel"+i}>
                    <Tooltip title={participant.name + " " + participant.lastname} placement={"top"}>
                        <Typography variant={"h6"}>{participant.username}</Typography>
                    </Tooltip>
                </AccordionSummary>
                <AccordionDetails sx={{ml:2, p:0}}>
                    <Box sx={{display: 'flex', flexDirection: 'column'}} textAlign={'left'}>
                    <Typography variant={"p"}>{participant.name} {participant.lastname}</Typography>
                    <Typography variant={"p"}>{participant.email}</Typography>
                        {!hasPaid && <Typography variant={"p"}>Ei ole maksanut</Typography>}
                    </Box>
                <Box sx={{display: 'flex', flexDirection: 'row'}} mt={1}>
                    <Button variant={"contained"}>Poista</Button>
                    <Button variant={"contained"} onClick={setAsPaidHandler}>Merkitse maksaneeksi</Button>
                </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}