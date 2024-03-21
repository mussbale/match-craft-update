import React, { useState, useContext, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Slide, useTheme, Table, TableBody, TableCell, TableRow, TableContainer, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FriendsPopup = ({ isVisible, onClose }) => {
  const theme = useTheme();
  const [view, setView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [pendingFriends, setPendingFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  console.log(searchResults)

  useEffect(() => {
    if (!user?.id) return;

    const fetchPendingFriends = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8080/api/friends/pending/${user.id}`, { withCredentials: true });
        setPendingFriends(data || []);
      } catch (error) {
        console.error("Failed to fetch pending friend requests:", error);
      }
    };

    fetchPendingFriends();
    fetchFriends();
  }, [user]);

  const fetchFriends = async () => {
    try {
      // This is a placeholder URL and should be replaced with your actual API endpoint
      const { data } = await axios.get(`http://localhost:8080/api/friends/${user.id}`, { withCredentials: true });
      setFriends(data || []);
    } catch (error) {
      console.error("Failed to fetch friends list:", error);
    }
  };
  

  const handleSearch = async () => {
    const payload = isNaN(searchQuery) ? { username: searchQuery } : { steamId: Number(searchQuery) };
    try {
      const response = await axios.post('http://localhost:8080/api/search', payload, { withCredentials: true });
      setSearchResults(response.data ? response.data : null);
    } catch (error) {
      console.error('Failed to search for friends:', error);
      setSearchResults(null); // Set to null if an error occurs
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      await axios.post(`http://localhost:8080/api/friends/accept/${requestId}`, {}, { withCredentials: true });
      setPendingFriends(pendingFriends.filter(friend => friend.id !== requestId));
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    }
  };

  const rejectFriendRequest = async (requestId) => {
    try {
      await axios.post(`http://localhost:8080/api/friends/reject/${requestId}`, {}, { withCredentials: true });
      setPendingFriends(pendingFriends.filter(friend => friend.id !== requestId));
    } catch (error) {
      console.error("Failed to reject friend request:", error);
    }
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    maxWidth: '90%',
    bgcolor: '#121212',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={isVisible}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      TransitionComponent={Transition}
    >
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6" component="div" sx={{ mb: 2, textAlign: 'center' }}>
          {view === 'list' ? 'Friends List' : view === 'add' ? 'Add New Friend' : 'Pending Friend Requests'}
        </Typography>
        
        {/* Buttons to switch views */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="outlined" onClick={() => setView('list')}>View Friends</Button>
          <Button variant="outlined" onClick={() => setView('add')}>Add Friend</Button>
          <Button variant="outlined" onClick={() => setView('pending')}>Pending Requests</Button>
        </Box>
        {view === 'list' && friends.length > 0 && (
          <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Online Friends
            </Typography>
            {friends.map(friend => (
              <Typography key={friend.id} sx={{ mt: 1 }}>
                {friend.name}
              </Typography>
            ))}
          </>
        )}
        {view === 'add' && (
          <>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
              Search to Add Friend
            </Typography>
            <TextField
              fullWidth
              label="Search by name or SteamID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleSearch} sx={{ mb: 2 }}>Search</Button>
            {searchResults && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table aria-label="search result">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <img src={searchResults.steamPic} alt="Profile Picture" style={{ width: '50px', height: 'auto' }} />
                      </TableCell>
                      <TableCell onClick={() => { navigate(`/matchcraft/profile/${searchResults.id}`); onClose(); }} style={{ cursor: 'pointer' }}>

                        {searchResults.name}
                      </TableCell>
                      <TableCell>Online | Offline</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
        {view === 'pending' && pendingFriends.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Pending Friend Requests
              </Typography>
              {pendingFriends.length > 0 ? (
                pendingFriends.map((friend) => (
                  <Box key={friend.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                    <Typography>
                      {friend.name}
                    </Typography>
                    <Box>
                      <Button onClick={() => acceptFriendRequest(friend.id)} color="primary">Accept</Button>
                      <Button onClick={() => rejectFriendRequest(friend.id)} color="secondary">Reject</Button>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography>No pending requests</Typography>
              )}
            </>
          )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="contained" onClick={onClose} sx={{ mt: 2, display: 'block', ml: 'auto' }}>Close</Button>
        </Box>
      </Box>
        </Modal>
    
);
};

export default FriendsPopup;
