import {Box, Button, Grid, Typography} from '@mui/material'
import {useEffect} from 'react'
import axios from 'axios'
import {useContext} from 'react'
import StateContext from '../../../context/StateContext'
import {useState} from 'react'
import {ContentPaper} from '../../../components/ContentPaper'
import {User} from './User'


export const Users = () => {
    const [state, dispatch] = useContext(StateContext)
    const [users, setUsers] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios({
                    method: 'get',
                    url: state.apiServer + 'get_users'
                })
                setUsers(response.data)
                setIsLoaded(true)
                console.log(response.data)
            } catch (err) {
                console.log(err.message)
            }
        }
        getUsers()
    }, [])

    return (<Box>
            {isLoaded &&
                (
                    <ContentPaper>
                        <Grid container>
                            {users.map((user) => <User key={user.id} user={user}/>)}
                        </Grid>
                    </ContentPaper>
                )}
        < /Box>
    )
}