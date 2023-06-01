import {useEffect, useState} from 'react'
import {initialState as state} from '../../../context/StateContext'
import axios from 'axios'
import {Box, Button, Modal, Paper, TextField, Typography} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export const Roles = () => {
    const [roles, setRoles] = useState([])
    const [role, setRole] = useState('')
    const [isLoaded, setIsLoaded] = useState(false)
    const [open, setOpen] = useState(false)

    const handleDelete = async (id) => {
        try {
            const response = await axios({
                method: 'delete',
                url: state.apiServer + 'delete_role/' + id,
            })
            setRoles(roles.filter(role => role.id !== id))
            console.log(response.data)
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        const getRoles = async () => {
            try {
                const response = await axios({
                    method: 'get',
                    url: state.apiServer + 'get_roles'
                })
                setRoles(response.data)
                setIsLoaded(true)
                console.log(response.data)
            } catch (err) {
                console.log(err.message)
            }
        }
        getRoles()
    }, [])

    return (
        <Box sx={{textAlign: 'center'}}>
            <Typography variant={'h6'} sx={{mb: 2}}>Käyttäjäroolit</Typography>
            {isLoaded &&
                (roles.map((role) => <Box key={role.id}>{role.name} <DeleteIcon onClick={()=>handleDelete(role.id)} sx={{cursor: 'pointer'}}/> </Box>))}
            <Button variant={'contained'} sx={{mt: 2}} onClick={()=> setOpen(true)} >Lisää rooli</Button>
            <AddRole open={open} setOpen={setOpen} roles={roles} setRoles={setRoles}/>
        </Box>
    )
}

export const AddRole = (props) => {
    const{open, setOpen, roles, setRoles} = props
    const [role, setRole] = useState('')

    const handleAdd = async () => {
        try {
            const response = await axios({
                method: 'post',
                url: state.apiServer + 'add_role',
                data: {
                    name: role
                }
            })
            setRoles([...roles, {id: response.data, name: role}])
            setOpen(false)
            console.log(response.data)
        } catch (err) {
            console.log(err.message)
        }
    }

    return(
        <Modal open={open} onClose={()=>setOpen(false)} sx={{mt: 10}}>
            <Paper sx={{p: 2, width: 300, margin: 'auto'}}>
            <Box sx={{textAlign: 'center'}}>
                <Typography variant={'h6'} sx={{mb: 2}}>Lisää rooli</Typography>
                <TextField label={'Roolin nimi'} onChange={(e)=>setRole(e.target.value)} value={role}/>
                <Button variant={'contained'} sx={{mt: 2}} onClick={handleAdd}>Lisää rooli</Button>
            </Box>
            </Paper>
        </Modal>
    )
}