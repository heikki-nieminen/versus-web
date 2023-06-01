import {useState} from 'react'
import {Box, Grid, Typography} from '@mui/material'
import {Roles} from './Roles'

export const Settings = () => {
    const [roles, setRoles] = useState([])

    return (
        <Grid container sx={{display: 'flex', flexDirection: 'row'}}>
                <Grid item xs={4} mb={2}>
                    <Roles/>
                </Grid>
        </Grid>
    )
}