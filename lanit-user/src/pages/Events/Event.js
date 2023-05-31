import {Box, Button, Paper, Tooltip, Typography} from '@mui/material'
import {useContext, useEffect, useState} from 'react'
import StateContext from '../../context/StateContext'
import {useSearchParams} from 'react-router-dom'
import {SignUp} from './SignUp'
import axios from 'axios'
import {Participants} from './Participants'
import {ReSign} from './ReSign'
import {Payment} from './Payment'
import {EditEvent} from './EditEvent'

export const Event = () => {
    const [event, setEvent] = useState()
    const [state, dispatch] = useContext(StateContext)
    const [isInitialized, setIsInitialized] = useState(false)
    const [openSignUp, setOpenSignUp] = useState(false)
    const [openResign, setOpenResign] = useState(false)
    const [openPayment, setOpenPayment] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [signed, setSigned] = useState(false)
    const [hasPaid, setHasPaid] = useState(false)

    const [openParticipants, setOpenParticipants] = useState(false)

    let [searchParams] = useSearchParams()

    // TODO
    /*
    * Check if user has already signed to event.
    * Show address and other additional info if user has signed
    * Show payment info(button??) if user hasn't paid, but has signed
    * Add resign button for user, also confirmation for that
    *
    *
    *
    * */

    const signUpHandler = () => {
        setOpenSignUp(true)
    }

    const resignHandler = () => {
        setOpenResign(true)
    }

    const paymentHandler = () => {
        setOpenPayment(true)
    }

    useEffect(() => {
        try {
            if (state.events) {
                const tempEvent = state.events.find(obj => obj.id === Number(searchParams.get('id')))
                const checkIfSigned = async () => {
                    console.log('????')
                    setEvent(tempEvent)
                    try {
                        const result = await axios({
                            method: 'post',
                            url: state.apiServer + 'check_if_signed',
                            data: {
                                eventId: tempEvent.id
                            }
                        })
                        console.log('result: ', result.data.signed)
                        setSigned(result.data.signed)
                        setIsInitialized(true)
                    } catch (err) {
                        console.log(err)
                    }
                }
                const checkIfPaid = async () => {
                    try {
                        const result = await axios({
                            method: 'get',
                            url: state.apiServer + 'check_if_paid/' + tempEvent.id
                        })
                        console.log('result: ', result.data.paid)
                        setHasPaid(result.data.paid)
                        setIsInitialized(true)
                    } catch (err) {
                        console.log(err)
                    }
                }
                checkIfSigned()
                checkIfPaid()
            }
        } catch (err) {
            console.log(err)
        }
    }, [])

    const handleParticipantsButton = () => {
        setOpenParticipants(true)
    }

    const toLocalTime = (time) => {
        const date = new Date(time)
        return date.toLocaleString('fi-FI')
    }

    const addressHandler = async () => {
        try {
            await window.open('https://www.google.com/maps/search/?api=1&query=' + event.address, '_blank', 'noopener,noreferrer')
        } catch (err) {
            console.log(err)
        }
    }

    return (<div>
        {isInitialized &&
            <Box my={4}>
                <Paper>
                    <Box name={'title'} pt={2}>
                        <Typography variant={'h4'} textAlign={'center'}>{event.name}</Typography>
                    </Box>
                    <Box name={'description'} m={3}>
                        <Typography variant={'p'} sx={{whiteSpace: 'pre-line'}}>{event.description}</Typography>
                    </Box>
                    <Box name={'date'} ml={3} pb={2}>
                        <Typography
                            variant={'p'}>{toLocalTime(event.startTime)} - {toLocalTime(event.endTime)}</Typography>
                    </Box>
                    <Box name={'address'} ml={3} pb={2}>
                        <Tooltip title={'Avaa Google Mapsissa'} placement={'right'}>
                            <Typography variant={'p'} onClick={addressHandler}
                                        sx={{
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                            }}>{event.address}</Typography>
                        </Tooltip>
                    </Box>
                    {hasPaid && <Typography>Maksettu</Typography>}
                    <Box ml={3} pb={2}>
                        {!signed ? <Button variant={'contained'} onClick={signUpHandler}>Ilmoittaudu</Button> :
                            <Box sx={{display: 'flex', felxDirection: 'row', gap: 2}}>
                                <Button variant={'contained'} onClick={paymentHandler}>Maksa</Button>
                                <Button variant={'contained'} onClick={resignHandler}>Peru ilmoittautuminen</Button>
                                {state.isAdmin &&<>
                                    <Button variant={'contained'}
                                            onClick={handleParticipantsButton}>Osallistujat</Button>
                                    <Button variant={'contained'} onClick={()=> setOpenEdit(true)}>Muokkaa</Button></>}
                            </Box>}
                    </Box>
                </Paper>
                <SignUp open={openSignUp} setOpen={setOpenSignUp} eventId={event.id} setSigned={setSigned}/>
                <ReSign open={openResign} setOpen={setOpenResign} eventId={event.id} setSigned={setSigned}/>
                <Payment open={openPayment} setOpen={setOpenPayment} event={event}/>
                <Participants open={openParticipants} setOpen={setOpenParticipants} eventId={event.id}/>
                <EditEvent open={openEdit} setOpen={setOpenEdit} event={event}/>
            </Box>}
    </div>)
}