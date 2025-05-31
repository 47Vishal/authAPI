
import { AppBar, Box, Toolbar, Typography, Button, Modal, } from '@mui/material'
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import SignIn from './pages/Auth/SignIn';
import { getToken, remove_Token } from '../services/LocalStoreService';
import { UnsetUserInfo } from '../features/userSlice';
import { useDispatch } from 'react-redux';
import { UnsetUserToken } from '../features/authSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgb(211, 230, 245)',
  border: '2px solid rgb(63, 85, 126)',
  borderRadius: '5%',
  boxShadow: 24,
  p: 3,
  m: 0,
  justifyContent: 'space-around',
  /* 
  for user friendly to all devices config
  #display: {xs: 'none', sm:'block'}
  */
};



const Navbar = () => {
  const  navigate = useNavigate(); 
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleLogOut= () =>{
    dispatch(UnsetUserInfo({name:'', email:''}))
    dispatch(UnsetUserToken({access_token : null }))
    remove_Token()
    console.log('Logout Clicked');
    navigate('/login')
  }
  const {access_token} = getToken()
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static' color='primary'>
          <Toolbar>
            <Typography variant='h8' component="div" sx={{ flexGrow: 1 }}>
              BlogPage
            </Typography>
            <Button sx={{ color: 'white' }} style={({ isActive }) => { return { backgroundColor: isActive ? '#0d47a1' : " " } }} component={NavLink} to='/' >Home</Button>
            <Button sx={{ color: 'white' }} style={({ isActive }) => { return { backgroundColor: isActive ? '#0d47a1' : " " } }} component={NavLink} to='/contact' >Contact</Button>
            
            <div>
              { access_token ? 
              <Button sx={{ color: 'white' }}  component={NavLink} onClick={handleLogOut}>Logout</Button>
              :
              <Button sx={{ color: 'white' }}  component={NavLink} onClick={handleOpen}>Sign IN</Button>
              }
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <SignIn handleClose={handleClose}/>

                </Box>
              </Modal>
            </div>
          </Toolbar>
        </AppBar>
      </Box>

    </>
  );
};
export default Navbar;



