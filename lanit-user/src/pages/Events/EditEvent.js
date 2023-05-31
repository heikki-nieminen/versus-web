import {useContext, useState} from 'react'
import {Box, Button, Grid, Modal, OutlinedInput, Paper, TextField, Typography} from '@mui/material'
import StateContext from '../../context/StateContext'
import axios from 'axios'

export const EditEvent = (props) => {
    const {event, open, setOpen} = props

    // Import axios, TextField
    // Don't use normal html tags if possible. Use Material UI components instead.
    const [eventInfo, setEventInfo] = useState({...event})
    const [openSetTime, setOpenSetTime] = useState(false)
    const [startOrEndTime, setStartOrEndTime] = useState('')
    const [startEndTime, setStartEndTime] = useState({})
    const [endTime, setEndTime] = useState('')
    const [state, dispatch] = useContext(StateContext)

    const handleChange = (e) => {
        setEventInfo({...eventInfo, [e.target.name]: e.target.value})
        console.log(eventInfo)
    }

    const handleSaveEvent = async () => {
        try {
            const result = await axios({
                method: 'put',
                url: state.apiServer + 'edit_event',
                data: eventInfo
            })
            console.log(result)
        } catch (err) {
            console.log('ERROR:', err.message)
        }
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpenSetTime = (e) => {
        setStartOrEndTime(e.target.name)
        setOpenSetTime(true)
    }

    return (
        <Modal open={open}
               onClose={handleClose}
               aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-description">
            <Box my={4}>
                <Paper>
                    <Box sx={{p: 2}}>
                        <Typography variant={'h3'} textAlign={'center'}>Muokkaa tapahtumaa</Typography>
                    </Box>
                    <Box m={3} textAlign={'center'}>
                        <OutlinedInput
                            id={'event-name'}
                            name={'eventName'}
                            value={eventInfo.name}
                            fullWidth={true}
                            onChange={handleChange}
                            placeholder={'Tapahtuman nimi'}/>
                        <TextField
                            id={'description'}
                            name={'description'}
                            value={eventInfo.description}
                            fullWidth={true}
                            multiline={true}
                            sx={{bgcolor: 'background.paper'}}
                            onChange={handleChange}
                            placeholder={'Tapahtuman kuvaus'}/>
                        <Grid container={true} flexDirection={'row'} alignItems={'flex-start'}>
                            <Grid item xs={2}>
                                <OutlinedInput
                                    name={'maxParticipants'}
                                    value={eventInfo.maxParticipants}
                                    placeholder={'Osallistujamäärä'}
                                    onChange={handleChange}/>
                            </Grid>
                            <Grid item xs={2}>
                                <OutlinedInput
                                    id={'start-time'}
                                    name={'startTime'}
                                    value={eventInfo.startTime}
                                    onClick={handleOpenSetTime}
                                    onChange={handleChange}
                                    placeholder={'Aloitus ajankohta'}/>
                            </Grid>
                            <Grid item xs={2}>
                                <OutlinedInput
                                    id={'end-time'}
                                    name={'endTime'}
                                    value={eventInfo.endTime}
                                    onClick={handleOpenSetTime}
                                    onChange={handleChange}
                                    placeholder={'Lopetus ajankohta'}/>
                            </Grid>
                            <Grid item xs={6}>
                                <OutlinedInput
                                    xs={4}
                                    id={'address'}
                                    name={'address'}
                                    value={eventInfo.address}
                                    fullWidth={true}
                                    onChange={handleChange}
                                    placeholder={'Tapahtuman osoite'}/>
                            </Grid>
                        </Grid>
                        <Typography textAlign={'left'}>Maksutiedot</Typography>
                        <OutlinedInput
                            name={'fee'}
                            value={eventInfo.fee}
                            fullWidth={true}
                            onChange={handleChange}
                            placeholder={'Tapahtuman hinta'}/>
                        <OutlinedInput
                            name={'accountName'}
                            value={eventInfo.accountName}
                            fullWidth={true}
                            placeholder={'Tilin omistaja'}
                            onChange={handleChange}/>
                        <OutlinedInput
                            name={'accountNumber'}
                            value={eventInfo.accountNumber}
                            fullWidth={true}
                            placeholder={'Tilin numero'}
                            onChange={handleChange}/>
                        <OutlinedInput
                            name={'phoneNumber'}
                            value={eventInfo.phoneNumber}
                            fullWidth={true}
                            placeholder={'Puhelinnumero'}
                            onChange={handleChange}/>
                        <Grid container={true} flexDirection={'row'} alignItems={'flex-start'}>
                            <Button variant={'contained'} color={'primary'} onClick={handleSaveEvent}>Tallenna</Button>
                            <Button variant={'contained'} color={'secondary'} onClick={handleClose}>Peruuta</Button>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Modal>)
}