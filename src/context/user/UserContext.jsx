/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';
import { SubjectCombinationContext } from '../subjectCombination/SubjectCombinationContext';
import axios from 'axios';
import { API_URL_BASE } from '../../assets/Proxy';

// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [loginStatus, setLoginStatus] = useState(true)
  const [pageUrl, setPageUrl] = useState(location.pathname)

  //  . . . . . . . . . 
  const getUser  = () => {
    setLoading(true)
    const token = localStorage.getItem('auth_cbt_token');
    axios.get(`${API_URL_BASE}/api/user`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
      setUser(response.data)
      setLoginStatus(true)
    })
    .catch(error => {
      setLoginStatus(false)
        console.error('Failed to fetch user data', error);
    }).finally(() => {
      setLoading(false)
    })
  }

  
  const logOut = async () => {
    setLoading(true)
    const token = localStorage.getItem('auth_cbt_token');
    if (token) {
      try {
        await axios.post(`${API_URL_BASE}/api/sign-out`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        localStorage.removeItem('auth_cbt_token');
        setUser(null)
        setLoading(false)
        setLoginStatus(false)
      } catch (error) {
        setUser(null)
        alert(error)
        console.error('Error logging out:', error);
        setLoading(false)
      }
    } else {
      console.error('No authorization');
      alert('No authorization')
      setLoading(false)
    }
  };

  // **********************
  const loginUser = (url, formData) => {
    setLoading(true)
      axios.post(url, formData)
        .then(response => {
          const token = response.data.user.token;
          localStorage.setItem('auth_cbt_token', token)
        
          setUser(response.data.user.user)
          setLoginStatus(true)
          setMessage('Sign in succesfull')
        })
        .catch(error => {
          alert(error.message)
          setMessage(error.response.data.message)
          setLoginStatus(false)
          setUser(null)
          console.error(error.response.data.message);
        }).finally(() => {
          setLoading(false)
        })
    }

    // **********************************
    const signUpUser = (url, formData) => {
        setLoading(true)
        axios.post(url, formData)
        .then(response => {
          const token = response.data.user.token;
            localStorage.setItem('auth_cbt_token', token)
            setUser(response.data.user.user)
            setLoginStatus(true)
            setMessage('Login in succesfull')
        })
        .catch(error => {
          console.error(error);
          alert('Registration failed');
          setUser(null)
          setLoginStatus(false)
        }).finally(() => {
          setLoading(false)
        })
    }

    // ******************************
    // ******************************
    const getUserProfile = (user_id) => {
      // GET USERS INFO AND PROFILE
      setLoading(true)
      const token = localStorage.getItem('auth_cbt_token');
      axios.get(`${API_URL_BASE}/api/get-profile/${user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setProfileData(response.data.profile);
        // console.log(response.data.profile)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to fetch user data', error);
      }).finally(() => {
        setLoading(false)
      })
    } 


    // ****************************
    // ****************************
    const handleProfileSubmit = (profileData) => {
      setLoading(true)
      const token = localStorage.getItem('auth_cbt_token');
      axios.post(`${API_URL_BASE}/api/update-profile`, profileData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        console.log(response.data.profile)
        setMessage('profile Updated')
      })
      .catch(error => {
        console.error('Failed to update profile', error);
      }).finally(() => {
        setLoading(false)
      })
    };
  



  return (
    <UserContext.Provider value={{
      user, 
      loading,
      message,
      profileData,
      loginStatus,
      pageUrl,
      setPageUrl,
      setLoading,
      setProfileData,
      setMessage,
      setUser, 
      getUser,
      logOut,
      loginUser,
      signUpUser,
      getUserProfile,
      handleProfileSubmit,
    }}>

      {children}
    </UserContext.Provider>
  );
};
