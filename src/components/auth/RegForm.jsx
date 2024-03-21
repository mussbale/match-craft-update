import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../context/UserContext';
import {
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Avatar,
  InputAdornment
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import GamepadIcon from '@mui/icons-material/Gamepad';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

const RegForm = () => {
  const navigate = useNavigate();
  const { saveLoggedInUser } = useContext(UserContext);
  const [regInput, setRegInput] = useState({
    name: '',
    username: '',
    email: '',
    steamId: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleRegistrationInputChange = e => {
    const { name, value } = e.target;
    setRegInput({ ...regInput, [name]: value });
  };

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};

    if (!regInput.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      formIsValid = false;
      newErrors.email = 'Email is not valid';
    }

    if (regInput.password.length < 8) {
      formIsValid = false;
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleRegSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/signup', regInput, { withCredentials: true });
      saveLoggedInUser(response.data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ ...errors, global: 'Failed to register. Please try again.' });
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="sm">
        <Card sx={{ mt: 8, backgroundColor: '#333', borderRadius: 2, boxShadow: 3, p: 3 }}>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Registration
              </Typography>
            </Box>
            <form onSubmit={handleRegSubmit}>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    variant="outlined"
                    value={regInput.name}
                    onChange={handleRegistrationInputChange}
                    error={!!errors.name}
                    helperText={errors.name || ' '}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    variant="outlined"
                    value={regInput.username}
                    onChange={handleRegistrationInputChange}
                    error={!!errors.username}
                    helperText={errors.username || ' '}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    variant="outlined"
                    value={regInput.email}
                    onChange={handleRegistrationInputChange}
                    error={!!errors.email}
                    helperText={errors.email || ' '}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Steam ID"
                    name="steamId"
                    variant="outlined"
                    value={regInput.steamId}
                    onChange={handleRegistrationInputChange}
                    error={!!errors.steamId}
                    helperText={errors.steamId || ' '}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GamepadIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    variant="outlined"
                    value={regInput.password}
                    onChange={handleRegistrationInputChange}
                    error={!!errors.password}
                    helperText={errors.password || ' '}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Register
              </Button>
              <Button fullWidth variant="outlined" onClick={() => navigate('/')} sx={{ mt: 1 }}>
                Cancel
              </Button>
              {errors.global && (
                <Typography color="error" textAlign="center">
                  {errors.global}
                </Typography>
              )}
            </form>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default RegForm;
