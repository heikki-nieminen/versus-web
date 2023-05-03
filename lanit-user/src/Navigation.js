import {AppBar, Box, Button, IconButton, Menu, MenuItem, Switch, Toolbar, Tooltip, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import {StateContext} from "./context/StateContext";
import {Login} from "./components/Login";
import {Navigate, useNavigate, Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {Register} from "./components/Register";


export const Navigation = () => {
    const [anchorElNav, setAnchorElNav] = useState(null)
    const [anchorElUser, setAnchorElUser] = useState(null)
    const [loginOpen, setLoginOpen] = useState(false)
    const [registerOpen, setRegisterOpen] = useState(false)
    const [state, dispatch] = useContext(StateContext)
    const navigate = useNavigate()

    let pages = []

    useEffect(() => {

    }, [state.loggedIn])

    if (state.loggedIn) {
        pages = [
            {label: "Etusivu", link: '/'},
            {label: "Lanit", link: 'events'},
            {label: "Info", link: 'info'}
        ]
    } else {
        pages = [
            {label: "Etusivu", link: '/'},
            {label: "Info", link: 'info'}
        ]
    }
    const handleClick = (e) => {
        setAnchorElNav(e.currentTarget)
    }

    const handleClose = () => {
        setAnchorElNav(null)
    }

    const handleOpenUserMenu = (e) => {
        setAnchorElUser(e.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const handleLoginClick = (e) => {
        handleCloseUserMenu()
        setLoginOpen(true)
    }
    const handleRegisterClick = () => {
        handleCloseUserMenu()
        setRegisterOpen(true)
    }
    const handleLogoutClick = () => {
        handleCloseUserMenu()
        localStorage.removeItem('userToken')
        localStorage.removeItem('adminToken')
        dispatch({type: "LOGOUT"})
        navigate("/")
    }


    const handleDarkModeSwitch = () => {
        localStorage.setItem('darkMode', `${!state.darkMode}`)
        dispatch({type: "CHANGE_THEME"})
    }

    return (
        <div>
            <AppBar color={"primary"} position={"static"}>
                <Toolbar disableGutters>
                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size={"large"}
                            aria-label={"account"}
                            aria-controls={"menu-appbar"}
                            aria-haspopup={"true"}
                            onClick={handleClick}
                            color={"inherit"}>
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id={"menu-appbar"}
                            anchorEl={anchorElNav}
                            keepMounted
                            open={Boolean(anchorElNav)}
                            onClose={handleClose}
                            sx={{display: {xs: 'block', md: 'none'}}}>
                            {pages.map((page) => (<MenuItem key={page.label} onClick={handleClose}>
                                <Typography
                                    key={page.label}
                                    component={Link}
                                    to={page.link}
                                    textAlign={"center"}
                                    sx={{textDecoration: 'none', ":visited": {color: '#0077cc'}}}>
                                    {page.label}
                                </Typography>
                            </MenuItem>))}
                        </Menu>
                    </Box>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (

                            <Button
                                component={Link}
                                to={page.link}
                                key={page.label}
                                onClick={handleClose}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                    textDecoration: 'none',
                                    ":visited": {color: '#0077cc'}
                                }}>
                                {page.label}
                            </Button>

                        ))}
                    </Box>
                    {/*Dark Mode switch*/}
                    <Switch
                        aria-label={"Dark mode"}
                        checked={state.darkMode}
                        onChange={handleDarkModeSwitch}/>
                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title={"Käyttäjä"}>
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0, mx: 2}} color={"inherit"}>
                                <AccountCircleRoundedIcon/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id={"menu-appbar"}
                            anchorEl={anchorElUser}
                            keepMounted
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}>
                            {!state.loggedIn ?
                                <div>
                                    <MenuItem onClick={handleLoginClick}>Kirjaudu sisään</MenuItem>
                                    <MenuItem onClick={handleRegisterClick}>Rekisteröidy</MenuItem>
                                </div>
                                :
                                <div>
                                    <MenuItem>Omat tiedot</MenuItem>
                                    <MenuItem onClick={handleLogoutClick}> Kirjaudu ulos</MenuItem>

                                </div>
                            }
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Login open={loginOpen} setOpen={setLoginOpen} registerOpen={registerOpen}
                   setRegisterOpen={setRegisterOpen}/>
            <Register open={registerOpen} setOpen={setRegisterOpen} loginOpen={loginOpen} setLoginOpen={setLoginOpen}/>
        </div>
    )
}