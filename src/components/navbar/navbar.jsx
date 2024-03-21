// Navbar.js
import React, {useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import logo from '../../assets/logo.png'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';

export default function Navbar({ onFriendsClick }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  console.log('this is user id:'+ user.id)
  return (
    <AppBar position="sticky" style={{ backgroundColor: 'rgb(36,36,36)', boxShadow: '0 10px 10px rgba(0,0,0,.5)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters style={{ justifyContent: 'center' }}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ width: '100px', height: '100px', cursor: 'pointer', margin: '10px 0' }}
            onClick={() => window.location.href = '/matchcraft/dashboard'}
          />
        </Toolbar>
        <Toolbar disableGutters style={{ justifyContent: 'center' }}>
        <Button
            color="inherit"
            onClick={onFriendsClick} // Ensure this is correctly handled
            sx={{
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Friends
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate(`/matchcraft/profile/${user.id}`)}
            sx={{
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                // For additional effects, adjust here
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Profile
          </Button>
          <Button
            color="inherit"
            href="#preferences"
            sx={{
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                // Customize as needed
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Preferences
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
