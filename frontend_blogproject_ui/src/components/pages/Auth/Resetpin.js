
import { Alert, Box, Button, OutlinedInput,  FormControl, InputLabel, InputAdornment, IconButton, } from '@mui/material'
import {  Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useResetUserPasswordMutation, } from '../../../services/userAuthAPI';

const style_TabPanel = {
    mt: {
        xs: 1,    // margin-top for extra-small screens
        sm: 2,    // small screens
        md: 3,    // medium screens
        lg: 4,    // large screens
    },
    p: 0,
};

const ResetPin = () => {
    const [server_error, setServerError] = useState({})
    const [server_msg, setServerMsg] = useState({})
    const { uid, token } = useParams()
    const [ResetUserPassword] = useResetUserPasswordMutation()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const Navigate = useNavigate()
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };



    const ResetpinSubmit = async (e) => {
        e.preventDefault();
        const PinSetdata = new FormData(e.currentTarget);
        const actualPinResetData = {
            password: PinSetdata.get('setpUp_password'), 
            confirm_password: PinSetdata.get('Confirm_setpUp_password'),
        }  
        const res = await ResetUserPassword({ actualData: actualPinResetData, uid: uid, token: token })
        if (res.error) {
            setServerError(res.error.data.errors)
            setServerMsg({})
            //setServerMsg({})  this mean 
        }
        if (res.data) {
            setServerMsg({msg: res.data.msg})
            setServerError({})
            document.getElementById('ResetpinSubmit').reset();
            setTimeout(() => {
                Navigate("/login")
            }, 3000)
        }
    };
    return (
        <>
            {/* This is Sign-in Form */}


            <Box id='ResetpinSubmit' component='form' noValidate onSubmit={ResetpinSubmit}>
                        
                <FormControl sx={style_TabPanel} variant="outlined">
                    <InputLabel htmlFor="setpUp_password">Password</InputLabel>
                    <OutlinedInput id="setpUp_password" name='setpUp_password'
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>
                {server_error.password ? <span style={{ fontSize: 12, color: 'red' , p: 1,}}>{server_error.password[0]}</span> : ""}

                <FormControl sx={style_TabPanel} variant="outlined">
                    <InputLabel htmlFor="Confirm_setpUp_password">Confirm Password</InputLabel>
                    <OutlinedInput id="Confirm_setpUp_password" name='Confirm_setpUp_password'
                        type={showConfirmPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showConfirmPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowConfirmPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Confirm Password"
                    />
                </FormControl>
                {server_error.confirm_password ? <span style={{ fontSize: 12, color: 'red' , p: 1,}}>{server_error.confirm_password[0]}</span> : ""}
                {server_error.non_field_errors?.[0] && (
                    <Alert severity="error">{server_error.non_field_errors[0]}</Alert>
                )}
                <Box sx={style_TabPanel} textAlign=''>
                    <Button type='submit' variant='contained'>Confirm</Button>
                </Box>
            </Box>
        </>
    )
}
export default ResetPin