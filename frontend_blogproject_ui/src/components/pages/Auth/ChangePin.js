import { Alert, Box,  Button, TextField, } from '@mui/material'
import { useState } from 'react';
import { useChangeUserPasswordMutation } from '../../../services/userAuthAPI';
import { getToken, } from '../../../services/LocalStoreService';
const style_TabPanel = {
    mt: {
        xs: 1,    // margin-top for extra-small screens
        sm: 2,    // small screens
        md: 3,    // medium screens
        lg: 4,    // large screens
    },
    p: 0,
};
function ChangePin() {
    const [server_error, setServerError] = useState({});
    const [server_msg, setServerMsg] = useState({});
    const [changeUserPassword] = useChangeUserPasswordMutation()
    const {access_token} = getToken();
    const ChangePinSubmit = async (event) => {
        event.preventDefault();
        const PinSetformData = new FormData(event.currentTarget);
        const actualPinChangeData = {
            password: PinSetformData.get('ChangePin'),
            confirm_password: PinSetformData.get('Comfirm_ChangePin'),
        }
        try {
        const res = await changeUserPassword({ actualPinChangeData, access_token})
        if (res.error) {
            setServerError(res.error.data.errors)
            console.log(setServerError(res.error.data.errors))
            setServerMsg({});
            //setServerMsg({})  this mean 
            }
        if(res.data) {
            setServerMsg(res.data.msg)
            setServerError({})
            document.getElementById('ChangePinForm').reset();
        }
         } catch (err) {
            console.error("Change Pin Error:", err);
            setServerError({ non_field_errors: ['Unexpected error occurred.'] });
    
         }
    };
    return (
        <>
            <Box id='ChangePinForm' component='form' noValidate onSubmit={ChangePinSubmit}>
            {server_error.non_field_errors ? <Alert style={{ fontSize: 12, color: 'red' }}>{server_error.non_field_errors[0]}</Alert>  : ""}
            {server_msg.msg ? <Alert style={{ fontSize: 12, color: 'green' }}>{server_msg.msg[0]}</Alert>  : ""}
                <TextField sx={style_TabPanel} id='ChangePin' type="password" name='ChangePin' label=" Password" variant="outlined" />
            {server_error.password ? <Alert style={{ fontSize: 12, color: 'red' }}>{server_error.password[0]}</Alert>  : ""}
                
                <TextField sx={style_TabPanel} id='Comfirm_ChangePin' type="password" name='Comfirm_ChangePin' label=" Confirm Password" variant="outlined" />
            {server_error.confirm_password ? <Alert style={{ fontSize: 12, color: 'red' }}>{server_error.confirm_password[0]}</Alert>  : ""}
                <Box sx={style_TabPanel} textAlign=''>
                    <Button type='submit' variant='contained'>Change Pin</Button>
                </Box>
            </Box>
        </>

    )
}

export default ChangePin