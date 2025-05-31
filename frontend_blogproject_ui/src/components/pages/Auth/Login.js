import React, { useEffect } from 'react'
import { Alert, Box, CircularProgress, Button, OutlinedInput, TextField, FormControl, InputLabel,  InputAdornment, IconButton, } from '@mui/material'
import { Visibility, VisibilityOff, } from '@mui/icons-material';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUserLogInMutation } from '../../../services/userAuthAPI';
import {getToken, LocalStoreToken} from '../../../services/LocalStoreService';
import { useDispatch } from 'react-redux';
import {  setUserToken } from '../../../features/authSlice'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const style_TabPanel = {
  mt: {
    xs: 1,    // margin-top for extra-small screens
    sm: 2,    // small screens
    md: 3,    // medium screens
    lg: 4,    // large screens
  },
  p: 0,
};
const Login = ({handleClose}) => {

  const Navigate = useNavigate();
  const [server_error, setServerError] =useState({});
  const [server_msg, setServerMsg] = useState({})
  const [UserLogIn, {isLoading}] = useUserLogInMutation();
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const handleClickShowSignInPassword = () => setShowSignInPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  
  const dispatch = useDispatch()
  const singInHandleSubmit = async(e) => {
    e.preventDefault();
    const SignIndata = new FormData(e.currentTarget);
    const actualSignData = {
      email: SignIndata.get('signInEmail'),
      password: SignIndata.get('Signin_password'),
    }
    const res = await UserLogIn(actualSignData)
    if (res.error) {
      // console.log(typeof(res.error.data.errors))
      // console.log(res.error.data.errors)
      setServerError(res.error.data.errors)
    }
    if(res.data) {
      // console.log(typeof(res.data))
      // console.log(res.data.token)
      
      LocalStoreToken(res.data)
      LocalStoreToken(res.data.token)
      setServerMsg({msg: res.data.msg})
      let {access_token} = getToken()
      dispatch(setUserToken({access_token : access_token}))
      if (typeof handleClose === 'function')
      handleClose();
      Navigate('/')
    }
         
    // if (actualSignData.email && actualSignData.signinPassword) {
    //   setError({ status: true, msg: "Login Success", type: 'success' })
    //   document.getElementById('SingInHandleSubmit').reset()
    //   // ✅ Call the passed-in function to close modal

    //   Navigate('/')
    //   console.log(actualSignData);
    //   if (typeof handleClose=== 'function')
    //   handleClose();
    // }
    // else {
    //   setError({ status: true, msg: "Login required all field", type: "error" })
    //   document.getElementById('SingInHandleSubmit').reset()
    // }
  };
  let {access_token} = getToken()
  useEffect(() =>{
      dispatch(setUserToken({access_token : access_token}))
  }, [access_token, dispatch]  // store this in array [access_token, dispatch]
)
  
  return (
    <>
      {/* This is Sign-in Form */}
      <Box id='SingInHandleSubmit' component='form' noValidate onSubmit={singInHandleSubmit}  sx={{ '& > :not(style)': { m: 1, pr: 2, width: '100%', } }}
                autoComplete="off">
        <TextField sx={style_TabPanel} id='signInEmail' name='signInEmail' label="Email" variant="outlined" />
        {server_error.email ? <span style={{ fontSize: 12, color: 'red' }}>{server_error.email[0]}</span> : ""}
        <FormControl sx={style_TabPanel} variant="outlined">
          <InputLabel htmlFor="Signin_password">Password</InputLabel>
          <OutlinedInput id="Signin_password" name='Signin_password'
            type={showSignInPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showSignInPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowSignInPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showSignInPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label=" Password"
          />
        </FormControl>
        {server_error.password ? <span style={{ fontSize: 12, color: 'red' , p: 1,}}>{server_error.password[0]}</span> : ""}
        {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ""}
        {server_msg.msg ? <Alert style={{ fontSize: 12, color: 'green' }}>{server_msg.msg[0]}</Alert>  : ""}
        
        <Box sx={style_TabPanel} >
          { isLoading ? <CircularProgress/>
          :
          <Button type='submit' variant='contained'>Login</Button>}
        </Box>
        <NavLink sx={style_TabPanel} onClick={handleClose} to='resetpin_link'>Forgot Password</NavLink>
      </Box>

    </>

  );
}

export default Login


