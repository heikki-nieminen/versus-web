import {Box, Tab, Tabs} from '@mui/material'
import {useState} from 'react'
import {ContentPaper} from '../../components/ContentPaper'
import {Users} from './Users/Users'
import {Contents} from './Content/Contents'
import {Settings} from './Settings/Settings'

export const Admin = () => {

    const [value, setValue] = useState(0)
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        <div>
            <Box>
                <Tabs value={value} onChange={handleChange} centered>
                    <Tab label="Käyttäjät" {...allyProps(0)}/>
                    <Tab label="Sisältö" {...allyProps(1)} />
                    <Tab label="Asetukset" {...allyProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}><Users /></TabPanel>
            <TabPanel value={value} index={1}><Contents /></TabPanel>
            <TabPanel value={value} index={2}><Settings /></TabPanel>
        </div>
    )
}

const TabPanel = (props) => {
    const {children, value, index, ...other} = props

    if (index === value) {
        return (
            <ContentPaper
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
                {...other}>
                {children}
            </ContentPaper>)
    } else {
        return null
    }
}

const allyProps = (index) => {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    }
}