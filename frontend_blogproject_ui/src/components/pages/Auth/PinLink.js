import React, { useState } from 'react'
import { Alert, Box, Button, TextField,} from '@mui/material'
import { useNavigate,  } from 'react-router-dom';
import { useSendEmailLinkUserPasswordMutation } from '../../../services/userAuthAPI';

const style_TabPanel = {
    mt: {
        xs: 1,    // margin-top for extra-small screens
        sm: 2,    // small screens
        md: 3,    // medium screens
        lg: 4,    // large screens
    },
    p: 0,
};

const PinLink = () => {
    const [server_error, setServerError] = useState({})
    const [server_msg, setServerMsg] = useState({})
    const [email_link] = useSendEmailLinkUserPasswordMutation();
    const EmailPinSubmit = async (e) => {
        e.preventDefault();
        const Pin_Setdata = new FormData(e.currentTarget);
        const actualPinSetData = {
            email: Pin_Setdata.get('signInEmail'),
        }
        const res = await email_link( actualPinSetData )
        if (res.error) {
            setServerError(res.error.data.errors)
            setServerMsg({})
            //setServerMsg({})  this mean 
        }
        if (res.data) {
            setServerMsg(res.data.msg)
            setServerError({})
            document.getElementById('EmailPinSubmit').reset();
        }
    };
    return (
        <>
            <Box id='EmailPinSubmit' component='form' noValidate onSubmit={EmailPinSubmit}>
                {server_error.email ? <Alert style={{ fontSize: 12, color: 'red' }}>{server_error.email[0]}</Alert>  : ""}
                {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ""}
                
                <TextField sx={style_TabPanel} id='signInEmail' name='signInEmail' label="Email" variant="outlined" />
                <Box sx={style_TabPanel} textAlign=''>
                    <Button type='submit' variant='contained'>Login</Button>
                </Box>
            </Box>
        </>
    )
};

export default PinLink