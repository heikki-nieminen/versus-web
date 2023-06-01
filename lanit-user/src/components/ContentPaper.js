import {Paper} from "@mui/material";

export const ContentPaper = ({children, props}) => {
    return(<Paper sx={{height:"80vh"}} {...props}>
        {children}
    </Paper>)
}