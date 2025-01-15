import React, { useEffect } from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import AddFriend from './AddFriend.jsx';
import GroupDialouge from './GroupDialouge.jsx';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginIcon from '@mui/icons-material/Login';
import { Button } from '@mui/material';
import Search from './Search.jsx';
import Notification from './Notification.jsx';
import axios from 'axios';

function Header() {
    const navigate = useNavigate();
    const Userstate = useSelector((state) => state.user.currentUser);
    const logged = useSelector((state) => state.user.login);
// useEffect(()=>{
//   let fetcher= async()=>{
//     let res = await axios.post(`http://localhost:3000/user/getToken/${Userstate.id}`,{}, { withCredentials: true });
//     console.log("responce from token",res);
//   }
//   fetcher();
// },[])
  
    return (
      <nav className="w-screen h-16 flex justify-between items-center bg-purple-300 px-4 sticky top-0 z-10">
        <div className="font-extrabold text-xl text-yellow-50 text-outline-purple">
          Whisperia
        </div>
        <div className="lg:w-1/4 sm:w-1/2 w-3/4 flex sm:gap-4 justify-around items-center pl-7 gap-1">
          <Search />
          <AddFriend />
          <GroupDialouge />
          <Notification/>
          {logged ? (
            <Tooltip title="Logout">
              <span onClick={() => navigate('/sign-out')}>
                <LogoutIcon sx={{ fontSize: 30 }} className="text-white" />
              </span>
            </Tooltip>
          ) : (
            <Tooltip title="Log In">
              <span onClick={() => navigate('/sign-in')}>
                <LoginIcon sx={{ fontSize: 30 }} className="text-white" />
              </span>
            </Tooltip>
          )}
        </div>
      </nav>
    );
  }
  
export default Header;