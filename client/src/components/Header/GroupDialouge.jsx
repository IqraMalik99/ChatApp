import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogContent, DialogTitle, DialogContentText, Autocomplete, Tooltip, DialogActions } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export default function GroupDialouge() {
  const [open, setOpen] = useState(false);
  let [friendRequest, setFriendRequest] = useState([]);   // here i have selected user to send friend request
  let [groupName,setGroupName]=useState("")
  const [users, setUsers] = useState([
    { id: 1, name: 'User One', add: false },
    { id: 2, name: 'User Two', add: false },
    { id: 3, name: 'User Three', add: false }
  ]); // Sample user array which expect to come from api , 
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleButtonClick = async (e, user) => {
    e.preventDefault(); // Prevent default action

    setUsers((prev) =>
      prev.map((obj) => {
        if (obj.id === user.id) {
          const updatedUser = { ...obj, add: !obj.add }; // Toggle the add state
          // Manage friend requests based on the updated state
          if (!obj.add) {
            setFriendRequest((prevRequests) => [...prevRequests, updatedUser]); // Add user to friend requests
          } else {
            setFriendRequest((prevRequests) =>
              prevRequests.filter((req) => req.id !== user.id) // Remove user from friend requests
            );
          }
          return updatedUser; // Return the updated user
        }
        return obj; // Return unchanged user
      })
    );

    // Since friendRequest is updated asynchronously, log it here

  };

  return (
    <>
  <Tooltip title="Make Group">  <span onClick={handleClickOpen}><GroupIcon sx={{ fontSize: 30 }} className='text-white' /></span>  </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            height: '70vh', // Set height to 70% of the viewport height
            maxWidth: '400px', // Maintain a specific width if desired
            width: '100%', // Make it responsive to width
          },
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            // send this user to added as friend
            console.log(friendRequest);
           console.log(groupName);
            // here send backened request
            setFriendRequest([]);

          }
        }}
      >
        <DialogTitle>Make Group</DialogTitle>
        <DialogContentText className='p-2'>
          <div>
            {/* <h3 className='px-2'>Friend Requests:</h3> */}
            {friendRequest.length > 0 && friendRequest.map((obj) => (
              <span key={obj.id} id={obj.id} className='px-2'>
                {obj.name},
              </span>
            ))}
            {/* {friendRequest.length === 0 && <span className='p-2'>No friend requests</span>} */}
          </div>
        </DialogContentText>
        <DialogContent>
        <TextField id="standard-basic" sx={{margin:2}} label="Group Name" variant="standard"  onChange={(e)=> {setGroupName(e.currentTarget.value); 
        console.log(groupName);}
        }/>
          <Autocomplete
            disablePortal
            options={users} // Use users array as options
            getOptionLabel={(option) => option.name} // Display the name property
            renderInput={(params) => <TextField {...params} label="User" />}
            renderOption={(props, user) => (
              <li {...props} id={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{user.name}</span> {/* Display user name */}
                <Button onClick={(e) => handleButtonClick(e, user)}>{user.add ? <RemoveCircleOutlineIcon sx={{color:"red"}}/> : <AddCircleOutlineIcon />}</Button>
              </li>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button type='submit' color="primary">Create</Button>
        </DialogActions>

      </Dialog>
    </>
  );
}

