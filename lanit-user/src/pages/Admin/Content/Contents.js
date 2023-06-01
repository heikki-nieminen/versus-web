import {useEffect, useState} from 'react'
import {Box, FormControl, InputLabel, MenuItem, Select} from '@mui/material'
import {Content} from './Content'
import axios from 'axios'
import StateContext from '../../../context/StateContext'
import {useContext} from 'react'

export const Contents = () => {
    const [contents, setContents] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [state, dispatch] = useContext(StateContext)
    const [content, setContent] = useState('')

    useEffect(() => {
        const getContents = async () => {
            try {
                const response = await axios({
                    method: 'get',
                    url: state.apiServer + 'get_contents'
                })
                setContents(response.data)
                setIsLoaded(true)
                console.log("Contents: ",response.data)
            } catch (err) {
                console.log(err.message)
            }
        }
        getContents()
    }, [])

    const handleContentChange = (e) => {
        // Select content from contents by key
        setContent(contents.find(content => content.key === e.target.value))
        console.log("Content: ",e.target.value)
    }

    return (
        <Box>
            {isLoaded &&
                <>
                <FormControl sx={{mt:2}} fullWidth={true}>
                    <InputLabel id={'content'} fullWidth={true}>Sisältö</InputLabel>
                    <Select
                        labelId={'content'}
                        id={'content'}
                        value={content}
                        label={'Sisältö'}
                        onChange={handleContentChange}>
                        <MenuItem value={''}>Ei sisältöä</MenuItem>
                        {contents.map((content) => <MenuItem key={content.key} value={content.key}>{content.key}</MenuItem>)}
                    </Select>
                </FormControl>
                <Content content={content}/>
                </>
            }
        </Box>
    )
}