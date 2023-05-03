import {Box, Button, Paper, Typography} from "@mui/material";
import {ContentPaper} from "../../components/ContentPaper";
import {useLocation} from "react-router";
import {useContext, useEffect, useState} from "react";
import StateContext from "../../context/StateContext";
import {useSearchParams} from "react-router-dom";
import {SignUp} from "./SignUp";

export const Event = () => {
    const [event, setEvent] = useState()
    const [state, dispatch] = useContext(StateContext)
    const [isInitialized, setIsInitialized] = useState(false)
    const [openSignUp, setOpenSignUp] = useState(false)

    let [searchParams] = useSearchParams()

    const signUpHandler = () => {
        setOpenSignUp(true)
    }

    useEffect(() => {
        if (state.events) {
            setEvent(state.events.find(obj => obj.id === Number(searchParams.get('id'))))
            setIsInitialized(true)
        }
        try {

        } catch (err) {
            console.log(err)
        }
    }, [])

    return (<div>
        {isInitialized &&
            <Box my={4}>
                <Paper>
                    <Box name={"title"} pt={2}>
                        <Typography variant={"h4"} textAlign={"center"}>{event.name}</Typography>
                    </Box>
                    <Box name={"description"} m={3}>
                        <Typography variant={"p"} sx={{whiteSpace: "pre-line"}}>{event.description}</Typography>
                    </Box>
                    <Box ml={3} pb={2}>
                    <Button variant={"contained"} onClick={signUpHandler}>Ilmoittaudu</Button>
                    </Box>
                </Paper>
                <SignUp open={openSignUp} setOpen={setOpenSignUp}/>
            </Box>}
    </div>)
}