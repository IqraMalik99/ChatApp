import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userLogout } from '../store/reducer.js';
import { persistor } from '../store/store.js'; 
function SignOut() {
  const navigate = useNavigate();
let dispatch = useDispatch();


  useEffect(() => {
    let signout = async () => {
      try {
          const response = await axios.post('http://localhost:3000/user/sign-out', {}, {
            withCredentials: true, // Include credentials (cookies) with the request
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log('Signed out successfully:', response.data);
  persistor.purge();
  dispatch(userLogout());
    } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        navigate("/")
      }
    }
    signout();
  }, [])
  return (
    <>
    </>
  )
}

export default SignOut
