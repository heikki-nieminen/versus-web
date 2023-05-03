import {Paper} from "@mui/material";

export const ContentPaper = ({children}) => {
    return(<Paper sx={{height:"80vh"}}>
        {children}
    </Paper>)
}