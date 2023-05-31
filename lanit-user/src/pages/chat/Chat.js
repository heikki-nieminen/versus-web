import {useState} from "react";
import {Box} from "@mui/material";

export const Chat = () => {

    const [messages, setMessages] = useState([{
        user: "Käyttäjä1",
        message: "Tässä on viesti",
        timestamp: "16:00"
    }])

    return(<Box>
        Work in progress
    </Box>)
}