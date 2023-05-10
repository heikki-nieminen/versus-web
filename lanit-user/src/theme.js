import {red} from '@mui/material/colors';
import {createTheme} from '@mui/material/styles';

export const lightTheme = createTheme({

    palette: {
        mode: 'light', // set default mode to light
        primary: {
            main: '#002B5B',
        },
        secondary: {
            main: '#EA5455',
        },
        background: {
            default: '#F9F5EB',
            paper: '#E4DCCF',
        },
        text: {
            primary: '#333333',
            secondary: '#777777',
        },
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                input: {
                    WebkitBoxShadow: "0 0 0 100px #E4DCCF inset !important",
                    WebkitTextFillColor: "#333333"
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                input: {
                    WebkitBoxShadow: "0 0 0 100px #E4DCCF inset !important",
                    WebkitTextFillColor: "#333333"
                }
            }
        },
        MuiPaper: {
            defaultProps: {
                elevation: 8,
            }
        }
    },

})

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#62D2A2',
        },
        secondary: {
            main: '#9B50BA',
        },
        background: {
            default: '#121212',
            paper: '#1E1E1E',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#CCCCCC',

        },
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                input: {
                    WebkitBoxShadow: "0 0 0 100px #1E1E1E inset !important",
                    WebkitTextFillColor: "#FFFFFF"
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                input: {
                    WebkitBoxShadow: "0 0 0 100px #1E1E1E inset !important",
                    WebkitTextFillColor: "#FFFFFF"
                }
            },
        },
        MuiPaper: {
            defaultProps: {
                elevation: 8
            }
        },
    },

})

