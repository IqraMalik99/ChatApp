import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import Header from '../components/Header/Header.jsx';
import { useSocket } from '../socket.jsx';
import Friends from '../components/Friends.jsx';
import ChatArea from '../components/ChatArea.jsx';
import Profile from '../components/Profile.jsx';

function Chats() {
  let navigate = useNavigate();
  const socket = useSocket(); // Get the socket instance
  const user = useSelector((state) => state.user.login);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!socket) {
      console.error('Socket not initialized');
      return;
    }

    console.log('Socket connection initializing...');
    socket.on('connect', () => {
      console.log('Connected with socket ID:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      
    };
  }, [socket]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 overflow-hidden">
        <div className="border-l-2 border-white h-full hidden sm:block">
          {!user && (
            <div className="mt-3 ml-3 mb-1" onClick={() => navigate('/sign-up')}>
              <Button
                variant="outlined"
                sx={{
                  color: 'purple',
                  borderColor: 'purple',
                }}
              >
                Create an account
              </Button>
            </div>
          )}
          <Friends />
        </div>
        <div className="border-l-2 overflow-y-auto custom-scrollbar h-full ">
          <ChatArea />
        </div>
        <div className="border-l-2 border-white h-full hidden lg:block">
          <Profile />
        </div>
      </div>
    </div>
  );
}

export default Chats;
