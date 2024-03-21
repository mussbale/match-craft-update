import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import DashboardPage from '../Pages/DashboardPage';
import Navbar from '../navbar/navbar'; // Ensure this path is correct
import FriendsPopup from '../../Popup/FriendsPopup'; // Ensure this path is correct
import ViewProfile from '../../Popup/ViewProfile';

export default function Container() {
    // State and handler are now correctly defined inside the component
    const [showFriendsPopup, setShowFriendsPopup] = useState(false);
    const [friendsList, setFriendsList] = useState([]); // Assuming you want to manage friends list here

    const handleFriendsClick = () => {
        console.log("Friends button clicked!");
        setShowFriendsPopup(true);
    };

    return (
        <>
            <Navbar onFriendsClick={handleFriendsClick} />
            <FriendsPopup isVisible={showFriendsPopup} onClose={() => setShowFriendsPopup(false)} friendsList={friendsList} />
            <Routes>
                <Route path='/dashboard' element={<DashboardPage />} />
                <Route path='/profile/:userId' element={<ViewProfile />} />
            </Routes>
        </>
    );
}
