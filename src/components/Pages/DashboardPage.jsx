import React, { useState, useEffect, useContext } from 'react';

import wall2 from '../../assets/wall2.png';
import UserContext from '../../context/UserContext';
import { RotatingTriangles } from 'react-loader-spinner'; // Ensure this import is correct
import '../../App.css'; // Assuming your CSS is here

export default function DashboardPage() {
    const { user } = useContext(UserContext);
    
    const [showProfile, setShowProfile] = useState(false);
    // Initialize isLoading state
    const [isLoading, setIsLoading] = useState(true);
    

    console.log('this is the user: ', user);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false); // Correctly defined now
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {isLoading ? (
                <RotatingTriangles
                    visible={true}
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="rotating-triangles-loading"
                    wrapperStyle={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                />
            ) : (
                <div style={{
                    backgroundImage: `url(${wall2})`,
                    backgroundSize: 'cover',
                    height: 'calc(100vh - 100px)',
                    backgroundPosition: 'center',
                }}>
                    <div style={{ textAlign: 'center', color: 'white', paddingTop: '20vh' }}>
                        <h1>Hello {user.name}! Welcome to MatchCraft</h1>
                    </div>
                    <button onClick={() => setShowProfile(!showProfile)} className="view-profile-trigger">
                    Find Match
                    </button>
                </div>
            )}
        </>
    );
}
