import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { TextField, Button, Card, CardContent, Typography, Container, Box, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import heroData from '../../../src/ref/HeroesData.json';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const LoginForm = () => {
  const [errors, setErrors] = useState({ login: {} });
  const [loginInput, setLoginInput] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const { saveLoggedInUser, setSkills, skills } = useContext(UserContext); 

  
  const fetchWinLoss = async (playerId) => {
    const response = await axios.get(`https://api.opendota.com/api/players/${playerId}/wl`);
    return response.data; // Adjust according to API response structure
  };
  
  // const fetchRank = async (playerId) => {
  //   const response = await axios.get(`https://api.opendota.com/api/ ${playerId}/ratings`);
  //   return response.data; // Adjust according to API response structure
  // };
  
  const fetchPlayerInfo = async (playerId) => {
    const response = await axios.get(`https://api.opendota.com/api/players/${playerId}`);
    return response.data; // Adjust according to API response structure
  };
  
  const fetchHeroes = async (playerId) => {
    const response = await axios.get(`https://api.opendota.com/api/players/${playerId}/heroes`);
    return response.data; // Adjust according to API response structure
  };
  
  const handleLoginInputChange = (e) => {
      const { name, value } = e.target;
      setLoginInput(prevInput => ({ ...prevInput, [name]: value }));
  };

  const validate = (loginObject) => {
      let isValid = true;
      let newErrors = {};

      if (!loginObject.username.trim()) {
          isValid = false;
          newErrors.username = "Username is required";
      }

      if (!loginObject.password.trim()) {
          isValid = false;
          newErrors.password = "Password is required";

      }

      setErrors(prevErrors => ({...prevErrors, login: newErrors}));
      return isValid;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const validationPassed = validate(loginInput);
  
    if (!validationPassed) {
      return; // Stop if validation fails
    }
  
    try {
      const loginResponse = await axios.post('http://localhost:8080/api/login', loginInput, { withCredentials: true });
      console.log(loginResponse.data);
      const  user  = loginResponse.data;
      saveLoggedInUser(user);
      const playerId = user.steamId;
    
      const winLoss = await fetchWinLoss(playerId);
      const playerInfo = await fetchPlayerInfo(playerId);
      const heroes = await fetchHeroes(playerId);

    
      const skillData = {
        id: 1,
        total_wins: winLoss.win, 
        total_loss: winLoss.lose, 
        solo_rank: playerInfo.solo_competitive_rank,
        favourite_heroes: "NA",
        part_rank: playerInfo.competitive_rank, 
        steam_pic: playerInfo.profile.avatarfull, 
        profile_url: playerInfo.profile.profileurl,
        userId: user.id
      };
      setSkills(skillData);
    
      const transformedHeroes = heroes.map(hero => {
        const heroNameObj = heroData.find(h => h.id === hero.hero_id);
        return {
          name: heroNameObj ? heroNameObj.localized_name : "Unknown Hero",
          winRate: hero.win,
          totalGames: hero.games,
        };
      });
    
      // Batch processing endpoint example
      const skillsResponse = await axios.post('http://localhost:8080/api/skills', skillData, { withCredentials: true });
      await axios.post('http://localhost:8080/api/heroes', transformedHeroes, { withCredentials: true });
      
      navigate('/matchcraft/dashboard');
    } catch (error) {
      console.error("An error occurred:", error.response || error.message);
      // Add more specific error handling here
    }
  }
    return (
        <ThemeProvider theme={darkTheme}>
          <Container component="main" maxWidth="xs">
            <Card sx={{ mt: 8, backgroundColor: '#333', borderRadius: 2, boxShadow: 3, p: 2 }}>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Sign in
                  </Typography>
                  <Box component="form" onSubmit={handleLoginSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      autoFocus
                      value={loginInput.username}
                      onChange={handleLoginInputChange}
                      error={!!errors.login?.username}
                      helperText={errors.login?.username}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={loginInput.password}
                      onChange={handleLoginInputChange}
                      error={!!errors.login?.password}
                      helperText={errors.login?.password}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign In
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate('/')}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Container>
        </ThemeProvider>
    );
};

export default LoginForm;
