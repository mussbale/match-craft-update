import { useEffect, useState } from 'react'
import {Routes, Route, Navigate, useParams} from 'react-router-dom'
import axios from 'axios'
import UserContext from './context/UserContext'
import LoginPage from './components/auth/LoginPage'
import RegistrationPage from './components/auth/RegistrationPage'
import HomePage from './components/Pages/HomePage'
import DashboardPage from './components/Pages/DashboardPage'
import ViewProfile from './Popup/ViewProfile'
import Container from './components/container/Container'


function App() {
  const [skills, setSkills] = useState({});
  // if the user is already stored in local storage then pull that info down into state
  const storedUser = JSON.parse(localStorage.getItem('user'))

  // const storedScoresAndPredictions = JSON.parse(localStorage.getItem('scoresAndPredictions'))

  // state to store info on our user
  const [user, setUser] = useState(storedUser)
  


    // save the logged in user to state
    const saveLoggedInUser = userData => {

      const userObj = {...userData, password: ""}
      setUser(userObj)
    }


    useEffect(() => {
      // save user every time a change is made to the user state in the dom
      if(user){
        localStorage.setItem('user', JSON.stringify(user))
      }
    }, [user])


    return (
      <>
        <UserContext.Provider value={{user, setUser, skills, setSkills, saveLoggedInUser }}>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/signup' element={<RegistrationPage/>}/>
            <Route path='/matchcraft/*' element={<Container/>}/>
            {/* <Route path='/ViewProfile' element={<ViewProfile/>}/> */}
          </Routes>
        </UserContext.Provider>
      </>
    )
  }

  export default App;
