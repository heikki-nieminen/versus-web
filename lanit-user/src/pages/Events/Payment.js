import {Box, Button, Modal, Typography} from "@mui/material";
import {copyToClipboard} from "../../utils/copyToClipboard";

export const Payment = (props) => {
    const style = {
        position: 'relative',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px',
        display: 'inline-block',
        g: 2
    }

    const {open, setOpen, event} = props

    const handleCopyClick = async (text) => {
        await copyToClipboard(text)
    }


    return (
        <Modal open={open}
               onClose={() => setOpen(false)}
               aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-description">
            <Box sx={style} py={2}>
                <Typography variant={'h3'}>
                    Maksutiedot
                </Typography>
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    <Typography variant={'h5'}>
                        Hinta:  {event.fee}€
                    </Typography>
                </Box>
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    <Typography variant={'h5'}>
                        Nimi:  {event.accountName}
                    </Typography>
                    <Button onClick={()=> handleCopyClick(event.accountName)}>Kopioi</Button>
                </Box>
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    <Typography variant={'h5'}>
                        Tilinumero:  {event.accountNumber}
                    </Typography>
                    <Button onClick={()=> handleCopyClick(event.accountNumber)} >Kopioi</Button>
                </Box>
                <Typography variant={'h5'}>
                    Viesti:  Lanimaksu
                    <Button onClick={()=> handleCopyClick("Lanimaksu")}>Kopioi</Button>
                </Typography>
                <Typography variant={'h5'} sx={{mt: 2}}>
                    Mobilepay/Siirto:  {event.phoneNumber}
                </Typography>
            </Box>
        </Modal>
    )
}