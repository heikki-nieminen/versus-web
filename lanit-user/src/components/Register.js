import {Box, Button, Input, Modal, OutlinedInput, Tooltip, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import StateContext from "../context/StateContext";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export const Register = (props) => {
    const [state, dispatch] = useContext(StateContext)
    const {open, setOpen, setLoginOpen} = props
    const navigate = useNavigate()
    const [userData, setUserData] = useState({
        username: "",
        password: "",
        passwordAgain: "",
        email: "",
        name: "",
        lastname: "",
        passwordOk: true,
        secondPasswordOk: true,
        emailOk: true
    })

    const okStyle = {
        mb: "1rem"
    }

    const notOkStyle = {
        mb: "1rem",
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        }
    }

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

    const handleClose = () => {
        setOpen(false)
    }

    const checkPassword = (password) => {
        const re = new RegExp("^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*)$")
        return !re.test(password)
    }

    const checkEmail = (email) => {
        const re = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
        return re.test(email)
    }

    const handleChange = (e) => {
        let changes = {}
        switch (e.target.name) {
            case "password": {
                checkPassword(e.target.value) ? changes.passwordOk = true : changes.passwordOk = false
            }
                break
            case "passwordAgain": {
                checkPassword(e.target.value) ? e.target.value === userData.password ? changes.secondPasswordOk = true :
                    changes.secondPasswordOk = false : changes.secondPasswordOk = false
            }
                break
            case "email": {
                checkEmail(e.target.value) ? changes.emailOk = true : changes.emailOk = false
            }
                break
            default:
                break
        }
        setUserData({...userData, ...changes, [e.target.name]: e.target.value})
    }
    const handleSubmit = async () => {
        const checkInput = Object.values(userData).every(value =>{
            return !!value;
        })
        if(checkInput){
            let result
            try{
                result = await axios({
                    method: 'post',
                    url: state.apiServer + 'register',
                    data: {
                        userInfo: userData
                    }
                })
            if(result){
                navigate('/verify-email')
                setOpen(false)
            }
            }catch(err){
                console.log("VIRHE: ",err)
            }
        }
        else{
            console.log("Jotain puuttuu")
        }
    }

    const handleLoginClick = () => {
        setOpen(false)
        setLoginOpen(true)
    }

    return (<div>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                <form id={"register-form"}>
                    <OutlinedInput
                        id={"username"}
                        name={"username"}
                        value={userData.username}
                        autoFocus={true}
                        required={true}
                        fullWidth={true}
                        size={"small"}
                        onChange={handleChange}
                        sx={{mb: "1rem"}}
                        placeholder={"Käyttäjätunnus"}/>
                    <Tooltip
                        title={userData.passwordOk ? "" : "Salasanan on oltava vähintään 8 merkkiä pitkä. Sen täytyy sisältää sekä isoja, että pieniä kirjaimia ja vähintään yhden numeron."}>
                        <OutlinedInput
                            id={"password"}
                            name={"password"}
                            type={"password"}
                            required={true}
                            fullWidth={true}
                            size={"small"}
                            onChange={handleChange}
                            sx={userData.passwordOk ? okStyle : notOkStyle}
                            placeholder={"Salasana"}/>
                    </Tooltip>
                    <Tooltip title={userData.secondPasswordOk ? "" : "Salasanat eivät täsmää."}>
                        <OutlinedInput
                            id={"password-again"}
                            name={"passwordAgain"}
                            type={"password"}
                            required={true}
                            fullWidth={true}
                            size={"small"}
                            onChange={handleChange}
                            sx={userData.secondPasswordOk ? okStyle : notOkStyle}
                            placeholder={"Salasana uudelleen"}/>
                    </Tooltip>
                    <Tooltip title={userData.emailOk ? "" : "Sähköposti ei ole kelvollinen."}>
                        <OutlinedInput
                            id={"email"}
                            name={"email"}
                            required={true}
                            fullWidth={true}
                            size={"small"}
                            onChange={handleChange}
                            sx={userData.emailOk ? okStyle : notOkStyle}
                            placeholder={"Sähköposti"}/>
                    </Tooltip>
                    <OutlinedInput
                        id={"name"}
                        name={"name"}
                        required={true}
                        fullWidth={true}
                        size={"small"}
                        onChange={handleChange}
                        sx={{mb: "1rem"}}
                        placeholder={"Etunimi"}/>
                    <OutlinedInput
                        id={"lastname"}
                        name={"lastname"}
                        required={true}
                        fullWidth={true}
                        size={"small"}
                        onChange={handleChange}
                        sx={{mb: "1rem"}}
                        placeholder={"Sukunimi"}/><br/>
                    <Typography
                        onClick={handleLoginClick}
                        sx={{
                            cursor: "pointer",
                            textDecoration: "underline"
                        }}>Löytyykö jo käyttäjätunnus? Kirjaudu tästä</Typography>
                    <Button
                        fullWidth={true}
                        type={"submit"}
                        variant={"contained"}
                        sx={{mt: "1rem"}}
                        onClick={(e) => {
                            e.preventDefault()
                            handleSubmit()
                        }}>
                        Rekisteröidy
                    </Button>
                </form>
            </Box>

        </Modal>
    </div>)
}