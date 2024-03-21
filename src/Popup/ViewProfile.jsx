import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../context/UserContext';
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    Grid,
    CssBaseline,
    ThemeProvider,
    createTheme,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Button
} from '@mui/material';
import { keyframes } from '@mui/system';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212', // Darker background
      paper: '#424242', // Dark paper elements
    },
    primary: {
      main: '#bb86fc', // A purple accent for primary actions
    },
    secondary: {
      main: '#03dac6', // A teal accent for secondary actions
    },
  },
  components: {
    // Style MUI components globally
    MuiButton: {
      styleOverrides: {
        root: {
          margin: '8px',
        },
      },
    },
  },
});

const ViewProfile = () => {
    const { userId } = useParams(); 
    console.log(userId)
    const { user } = useContext(UserContext);
    const effectiveUserId = userId ? userId : user.id;
    const [thisUserName, setThisUserName] = useState('');
    const [thisUserSkills, setThisUserSkills] = useState({
        id: 'loading...',
        total_wins: 'loading...', 
        total_loss: 'loading...', 
        solo_rank: 'loading...',
        favourite_heroes: 'loading...', // Placeholder if necessary
        part_rank: 'loading...', 
        steam_pic: 'loading...', 
        profile_url: 'loading...',
        userId: 'loading...' 
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.id) {
                try {
                    // Fetch user skills
                    const skillsResponse = await axios.get(`http://localhost:8080/api/skills/user/${userId}`, { withCredentials: true });
                    if (skillsResponse.data && skillsResponse.data.length > 0) {
                        setThisUserSkills({
                            id: skillsResponse.data[0].id,
                            total_wins: skillsResponse.data[0].total_wins,
                            total_loss: skillsResponse.data[0].total_loss,
                            solo_rank: skillsResponse.data[0].solo_rank,
                            favourite_heroes: skillsResponse.data[0].favourite_heroes,
                            part_rank: skillsResponse.data[0].part_rank,
                            steam_pic: skillsResponse.data[0].steam_pic,
                            profile_url: skillsResponse.data[0].profile_url,
                            userId: skillsResponse.data[0].userId
                        });
                    }

                    // Optionally, fetch additional user data if userId is provided
                    if (userId) {
                        const userResponse = await axios.get(`http://localhost:8080/api/user/${userId}`, { withCredentials: true });
                        console.log(userResponse.data); // Assuming userResponse.data is not an array, directly log or use the response
                        setThisUserName(userResponse.data.username); // Adjust according to actual response structure
                    }
                } catch (error) {
                    console.error("There was an error fetching the user data:", error);
                }
            }
        };

        fetchUserData();
    }, [user, userId]); // Add dependencies as needed

    if (!user) return <Typography variant="h6" color="error">No user data available.</Typography>;

    const rows = [
        { label: 'Name', value: thisUserName?thisUserName:user.name },
        { label: 'Total Wins', value: thisUserSkills?.total_wins || 'N/A' },
        { label: 'Total Losses', value: thisUserSkills?.total_loss || 'N/A' },
        {label: 'Favourite Heroes', value: thisUserSkills?.favourite_heroes || 'N/A'},
        { label: 'Solo Rank', value: thisUserSkills?.solo_rank || 'Not Yet' },
        { label: 'Party Rank', value: thisUserSkills?.part_rank || 'Not Yet' }
    ];
    
    const handleAddFriend = async() => {
        try{
            const addFriend= await axios.post(`http://localhost:8080/api/friends/${user.id}/${userId}`,{}, { withCredentials: true }); // Implement the actual add friend logic here
            console.log(addFriend)
        }catch(error){
            console.log('Error making friends')
        }   
    };
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Card sx={{ maxWidth: 600, m: 'auto', mt: 5, overflow: 'visible' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom textAlign="center">
                        View Profile
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <Avatar
                                alt={thisUserSkills?.name}
                                src={thisUserSkills?.steam_pic}
                                sx={{ width: 128, height: 128, mx: 'auto', animation: `${rotate} 20s linear infinite` }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="h6" component="div">
                                {thisUserSkills?.name}
                            </Typography>
                            {user.id !== thisUserSkills.userId && (
                                <Button variant="contained" color="primary" onClick={handleAddFriend}>
                                    Add Friend
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                            <TableContainer component={Paper} elevation={6} sx={{ mt: 2, mb: 2, backgroundColor: 'gray', '& .MuiTableCell-root': { color: 'common.white' } }}>
                                <Table aria-label="profile information">
                                    <TableBody>
                                        {rows.map((row, index) => (
                                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">{row.label}</TableCell>
                                                <TableCell align="right">{row.value}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};

export default ViewProfile;
