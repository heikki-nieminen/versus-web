import {Box, Paper, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import StateContext from "../context/StateContext";

export const VerifyEmail = () => {
    const {id} = useParams()
    const [verified, setVerified] = useState(false)
    const [state, dispatch] = useContext(StateContext)

    useEffect( ()=> {
        if(id){
            const verifyEmail = async(id)=>{
                try {
                    let result = await axios({
                        method: "get",
                        url: state.apiServer + 'verify-email/' + id
                    })
                    setVerified(true)
                } catch (err) {
                    console.log("Tapahtui virhe vahvistettaessa käyttäjää")
                }
            }
            console.log("Vahvistetaan sähköpostia")
            verifyEmail(id)
        }
    },[])

    if (!verified) {
        return (<div>
            <Box sx={{my: 4}}>
                <Paper>
                    <Typography variant={"h6"}>Sinun täytyy vahvistaa sähköposti kirjautuaksesi.</Typography>
                </Paper>
            </Box>
        </div>)
    } else {
        return (<div>
            <Box sx={{my: 4}}>
                <Paper>
                    <Typography variant={"h6"}>Sähköposti vahvistettu.</Typography>
                </Paper>
            </Box>
        </div>)
    }
}