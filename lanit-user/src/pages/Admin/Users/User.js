import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    FormControl,
    Grid,
    InputLabel,
    MenuItem, Select,
    Typography
} from '@mui/material'
import {useEffect, useState} from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import axios from 'axios'
import {useContext} from 'react'
import StateContext from '../../../context/StateContext'

export const User = (props) => {
    const {user} = props
    const [expanded, setExpanded] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [roles, setRoles] = useState([])
    const [role, setRole] = useState(user.role)
    const [state, dispatch] = useContext(StateContext)

    useEffect(() => {
        const getRoles = async () => {
            try {
                const response = await axios({
                    method: 'get',
                    url: state.apiServer + 'get_roles'
                })
                setRoles(response.data)
                setIsLoaded(true)
            } catch (err) {
                console.log(err.message)
            }
        }
        getRoles()
    }, [])

    const updateRole = async (e) => {
        try {
            const response = await axios({
                method: 'put',
                url: state.apiServer + 'edit_user_role',
                data: {
                    userId: user.id,
                    roleName: e.target.value
                }
            })
            setRole(e.target.value)
            console.log(response.data)
        } catch (err) {
            console.log(err.message)
        }
    }

    return (
        <Grid item xs={12}>
            {isLoaded &&
                <Accordion expanded={expanded} onClick={() => setExpanded(!expanded)}>
                    <AccordionSummary expandIcon={<ArrowDropDownIcon/>}>
                        {user.username}
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant={'p'}>{user.name} {user.lastname}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant={'p'}>{user.email}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant={'p'}>{user.phone}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl sx={{mt:2}} fullWidth={true}>
                                    <InputLabel id={'role'} fullWidth={true}>Rooli</InputLabel>
                                    <Select
                                        labelId={'role'}
                                        id={'role'}
                                        value={role}
                                        label={'Rooli'}
                                        onChange={updateRole}>
                                        <MenuItem value={''}>Ei roolia</MenuItem>
                                        {roles.map((role) => <MenuItem key={role.id}
                                                                       value={role.name}>{role.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            }
        </Grid>
    )
}