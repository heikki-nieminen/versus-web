import { LinearProgress} from "@mui/material"

export const Loading = () => {
    return (<LinearProgress
                color={"secondary"}
                sx={{width: '100%', height: '2vh'}}/>)
}
