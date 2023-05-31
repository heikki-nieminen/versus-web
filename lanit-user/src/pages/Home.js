import {useContext, useEffect} from "react";
import {StateContext} from "../context/StateContext";
import {Box, Card, Checkbox, Paper, TextField, Typography} from "@mui/material";
import {Login} from "@mui/icons-material";
import {LoadingContext} from "../context/LoadingContext";
import {ContentPaper} from "../components/ContentPaper";

export const Home = () => {

    const [state, dispatch] = useContext(StateContext)

    useEffect(()=>{

    },[])

    return(<div>
        <Box sx={{my: 4, height:"50vh"}}>
            <ContentPaper>
                <Typography id="title" variant="h2" component="h1" gutterBottom sx={{textAlign: 'center'}}>Versus Gaming  ry</Typography>
                <Typography id="content" component="p" ml={4}>Versus Gaming ry:n viralliset sivut. Täällä pystyt ilmoittautumaan tapahtuumin.</Typography>
            </ContentPaper>
        </Box>
    </div>)
}