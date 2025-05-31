import React, { useEffect } from 'react'
import { Alert, Checkbox, Box, Typography, CircularProgress, Tab, Button, OutlinedInput, TextField, FormControl, InputLabel, InputAdornment, IconButton, Tabs, FormControlLabel, } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TabContext } from '@mui/lab';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import { useRegisterUserMutation } from '../../../services/userAuthAPI';
import { LocalStoreToken } from '../../../services/LocalStoreService'

const style_TabPanel = {
    mt: {
        xs: 1,    // margin-top for extra-small screens
        sm: 1,    // small screens
        md: 1,    // medium screens
        lg: 1,    // large screens
    },
    p: 0,
};
const TabPanel = (props) => {
    const { children, value, index } = props;
    return (
        <div role='tabpanel' hidden={value !== index}>
            {
                value === index && (
                    <Box>{children}</Box>
                )

            }
        </div>
    )
}
const SignIn = ({ handleClose }) => {
    // const [error, setError] = useState({
    //     status: false, msg: '', type: ''
    // }) frontend error display 
    const [value, setValue] = useState(0);
    const [server_error, setServerError] = useState({});
    const [server_msg, setServerMsg] = useState({})
    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            setServerError({});
            setServerMsg({});
        }
    }
    const Navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };


    useEffect(() => {
        if (server_msg.msg) {
            const timer = setTimeout(() => setServerMsg({}), 1000);
            return () => clearTimeout(timer);
        }
    }, [server_msg]);

    useEffect(() => {
        if (server_error.non_field_errors) {
            const timer = setTimeout(() => setServerError({}), 1000);
            return () => clearTimeout(timer);
        }
    }, [server_error]);
    const singUphandleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        const actualSigUupData = {
            First_name: data.get('First_name'),
            Last_Name: data.get('Last_Name'),
            email: data.get('SingUpEmail'),
            Username: data.get('Username'),
            password: data.get('SignUp_password'),
            confirm_password: data.get('Confirm_SignUp_password'),
            Term: data.get('term')
        };
        const res = await registerUser(actualSigUupData)
        if (res.error) {
            console.log(typeof (res.error.data.errors))
            console.log(res.error.data.errors)
            setServerError(res.error.data.errors)
        }
        else if (res.data) {
            // console.log(typeof(res.data))
            // console.log(res.data)
            // console.log(res.data.token)
            // LocalStoreToken(res.data.token)
            setTimeout(() => {
                setValue(1); // Switch to Login tab after delay
            }, 1000);

            form.reset();

            // ✅ Clear password visibility states (optional UX)
            setShowPassword(false);
            setShowConfirmPassword(false);
            setServerMsg({ msg: res.data.msg })

        }

    };

    return (
        <>
            <Box
                sx={{ '& > :not(style)': { m: 1, pr: 2, width: '100%', } }}
                autoComplete="off"
            >
                <TabContext lg={5} sm={7} xs={12}>
                    <Tabs value={value} textColor='secondary' indicatorColor='secondary' onChange={handleChange}>
                        <Tab label='Sign Up' sx={{ textTransform: 'none', fontWeight: 'bold' }}>Sign Up</Tab>
                        <Tab label='Login' sx={{ textTransform: 'none', fontWeight: 'bold' }}>Login</Tab>
                    </Tabs>
                    <TabPanel value={value} index={0} setTabValue={setValue}  >
                        <div p={0} >
                            <h2>Create your account</h2>
                            <p>Set your password for Blogpost to Sign Up</p>
                        </div>
                        <Box component='form'
                            noValidate id='singUphandleSubmit' onSubmit={singUphandleSubmit}>
                            <TextField sx={style_TabPanel} id="First_name" name='First_name' label="First Name" variant="outlined" required />
                            {server_error.First_name ? <Typography style={{ fontSize: 12, color: 'red' }}>{server_error.First_name[0]}</Typography> : ""}
                            <TextField sx={style_TabPanel} id="Last_Name" name="Last_Name" label="Last Name" variant="outlined" />
                            {server_error.Last_Name ? <Typography style={{ fontSize: 12, color: 'red' }}>{server_error.Last_Name[0]}</Typography> : ""}

                            <TextField sx={style_TabPanel} id="Username" name="Username" label="Username" variant="outlined" />
                            {server_error.Username ? <Typography style={{ fontSize: 12, color: 'red' }}>{server_error.Username[0]}</Typography> : ""}

                            <TextField sx={style_TabPanel} id="SingUpEmail" name="SingUpEmail" label="Email" variant="outlined" />
                            {server_error.email ? <Typography style={{ fontSize: 12, color: 'red' }}>{server_error.email[0]}</Typography> : ""}

                            <FormControl sx={style_TabPanel} variant="outlined">
                                <InputLabel htmlFor="SignUp_password">Password</InputLabel>
                                <OutlinedInput id="SignUp_password" name='SignUp_password'
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
                            {server_error.password ? <Typography style={{ fontSize: 12, color: 'red' }}>{server_error.password[0]}</Typography> : ""}

                            <FormControl sx={style_TabPanel} variant="outlined">
                                <InputLabel htmlFor="Confirm_SignUp_password">Confirm Password</InputLabel>
                                <OutlinedInput id="Confirm_SignUp_password" name='Confirm_SignUp_password'
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showConfirmPassword ? 'hide the password' : 'display the password'
                                                }
                                                onClick={handleClickShowConfirmPassword}


                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Confirm Password"
                                />
                            </FormControl>
                            {server_error.confirm_password ? <Typography style={{ fontSize: 12, color: 'red' }}>{server_error.confirm_password[0]}</Typography> : ""}

                            <FormControlLabel sx={style_TabPanel} control={<Checkbox value={true} name='term' id='term' />} label="I agree to term and condition" />
                            <div>{server_error.Term ? <span style={{ fontSize: 12, color: 'red' }}>{server_error.Term[0]}</span> : ""}</div>
                            {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ""}
                            {server_msg.msg ? <Alert style={{ fontSize: 12, color: 'green' }}>{server_msg.msg}</Alert> : ""}

                            <Box >
                                {isLoading ? <CircularProgress />
                                    :
                                    <Button sx={style_TabPanel} type='submit' variant='contained'>SignUp</Button>}
                            </Box>

                        </Box>
                    </TabPanel>
                    <TabPanel value={value} index={1}
                    >
                        <Login handleClose={handleClose} Navigate={Navigate} />
                    </TabPanel>

                </TabContext>
            </Box>
        </>
    )
}

export default SignIn