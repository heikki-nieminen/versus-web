import {Box, Button, Input, Modal, OutlinedInput, Paper, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {Form, Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {StateContext} from "../context/StateContext";


export const Login = (props) => {
    const [state, dispatch] = useContext(StateContext)
    const style = {
        position: 'relative',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px'
    }

    const navigate = useNavigate()
    const {address} = useParams()

    const {open, setOpen, setRegisterOpen} = props

    const handleClose = () => setOpen(false);
    const handleLoginClick = () => {
        handleClose()
    }
    const handleLogin = async () => {
        const username = document.getElementById("username").value
        const password = document.getElementById("password").value


        try {
            let result = await axios({
                method: 'post',
                url: state.apiServer + 'login',
                data: {
                    username: username,
                    password: password
                }
            })
            if(result.data.correct === true) {
                if(result.data.isAdmin){
                    localStorage.setItem('adminToken', result.data.token)
                    dispatch({"type": "LOGIN_ADMIN"})
                }
                else{
                    localStorage.setItem('userToken', result.data.token)
                    dispatch({"type": "LOGIN_USER"})
                }
                axios.defaults.headers.common['Authorization'] = `Token ${result.data.token}`
                handleClose()
                if(address){
                    navigate(`/${address}`)
                }
            }
        } catch (err) {
            console.log("VIRHE: ",err)
        }
    }

    const handleRegisterClick = () => {
        setOpen(false)
        setRegisterOpen(true)
    }

    return (
        <div>
            <Modal open={open}
                   onClose={handleClose}
                   aria-labelledby="modal-modal-title"
                   aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <form id={"login-form"}>
                        <OutlinedInput
                            id={"username"}
                            autoFocus={true}
                            required={true}
                            fullWidth={true}
                            sx={{mb:"1rem"}}
                            placeholder={"Käyttäjätunnus"}/>

                        <OutlinedInput
                            id={"password"}
                            type={"password"}
                            required={true}
                            fullWidth={true}
                            sx={{mb:"1rem"}}
                            placeholder={"Salasana"}/><br/>
                        <Typography
                            onClick={handleRegisterClick}
                            sx={{
                                cursor: "pointer",
                                textDecoration: "underline"}}>Puuttuuko käyttäjätunnus? Luo se tästä</Typography>
                        <Button
                            fullWidth={true}
                            type={"submit"}
                            variant={"contained"}
                            sx={{mt:"1rem"}}
                            onClick={(e)=> {
                                e.preventDefault()
                                handleLogin()
                            }}>
                            Kirjaudu
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}