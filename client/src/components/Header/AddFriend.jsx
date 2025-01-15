import React, { useEffect, useState } from 'react';
import { Button, TextField, Dialog, DialogContent, DialogTitle, DialogContentText, Autocomplete, Tooltip, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';
import { useSocket } from '../../socket';
import Friends from '../Friends';
import { useSelector } from 'react-redux';

export default function AddFriend() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  let Friend_Request='Friend_Request';
  const [friendRequest, setFriendRequest] = useState([]); // here I have selected user to send friend request
  const socket = useSocket();
  const user = useSelector((state) => state.user.currentUser);
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`http://localhost:3000/chat/getNotMyFriend`, { withCredentials: true });
      if (res.data.data.length > 0) {
        // Add 'add' property to users
        const usersWithToggle = res.data.data.map(user => ({ ...user, add: false }));
        setUsers(usersWithToggle);
      }
    };
    fetchUsers();
  }, []);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    //  setFriendRequest([]) ;
    setOpen(false);
  };

  const handleButtonClick = (e, user) => {
    e.preventDefault(); // Prevent default action

    setUsers((prev) =>
      prev.map((obj) => {
        if (obj._id === user._id) { // Use _id instead of id
          const updatedUser = { ...obj, add: !obj.add }; // Toggle the add state
          // Manage friend requests based on the updated state
          if (!obj.add) {
            setFriendRequest((prevRequests) => [...prevRequests, updatedUser]); // Add user to friend requests
          } else {
            setFriendRequest((prevRequests) =>
              prevRequests.filter((req) => req._id !== user._id) // Remove user from friend requests
            );
          }
          return updatedUser; // Return the updated user
        }
        return obj; // Return unchanged user
      })
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // send friendRequest to backend
    try {
      console.log(friendRequest);
      // await axios.post('http://localhost:3000/chat/sendFriendRequests', { requests: friendRequest }, { withCredentials: true });
       // here send api to send list of user to send friend request
      socket.emit(Friend_Request,{
     sender:user,
     friends:friendRequest
      })
      setFriendRequest([]); 
      handleClose(); 
    } catch (error) {
      console.error('Error sending friend requests:', error);
    }
  };

  return (
    <>
      <Tooltip title="Add Friend">
        <span onClick={handleClickOpen}>
          <AddIcon sx={{ fontSize: 30 }} className='text-white' />
        </span>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            height: '70vh', 
            maxWidth: '400px', 
            width: '100%', 
          },
          component: 'form',
          onSubmit: handleSubmit
        }}
      >
        <DialogTitle>Add friend</DialogTitle>
        <DialogContentText className='p-2'>
          <div>
            {friendRequest.length > 0 && friendRequest.map((obj) => (
              <span key={obj._id} id={obj._id} className='px-2'>
               <span>{obj.username}</span>
              </span>
            ))}
          </div>
        </DialogContentText>
        <DialogContent>
        <Autocomplete
  disablePortal
  options={users} // Use users array as options
  getOptionLabel={(option) => option.username} // Return just the username as a string
  renderInput={(params) => <TextField {...params} label="User" />}
  renderOption={(props, user) => (
    <li {...props} id={user._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <img src={user.avatar} alt={user.username} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '8px' }} /> {/* Display the avatar */}
        {user.username} {/* Display user username */}
      </span>
      <Button onClick={(e) => handleButtonClick(e, user)}>
        {user.add ? <RemoveCircleOutlineIcon sx={{ color: "red" }} /> : <AddCircleOutlineIcon />}
      </Button>
    </li>
  )}
/>

        </DialogContent>
        <DialogActions>
          <Button type='submit' color="primary">Send</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
