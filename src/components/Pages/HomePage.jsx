import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();
    return (
    <>
        <div>HomePage</div>
        <button onClick={()=>navigate('/login')}>Login</button>
        <button onClick={()=>navigate('/signup')}>Sign up</button>
    </>
  )
}
