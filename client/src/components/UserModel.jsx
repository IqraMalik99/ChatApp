// import React, { useEffect, useState } from 'react'
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
// import { styled } from '@mui/material/styles';
// import { Avatar } from '@mui/material';
// import axios from 'axios';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DeleteIcon from '@mui/icons-material/Delete';
// import DialogTitle from '@mui/material/DialogTitle';
// import Button from '@mui/material/Button';
// import { useDispatch } from 'react-redux';
// import { userId } from '../store/reducer.js';
// import { useNavigate } from 'react-router-dom';

// const Item = styled(Paper)(({ theme }) => ({
//     backgroundColor: '#fff',
//     ...theme.typography.body2,
//     padding: theme.spacing(1),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//     ...theme.applyStyles('dark', {
//         backgroundColor: '#1A2027',
//     }),
// }));

// // const handleRightDelete=(e,id)=>{
// //     e.preventDefault();
// //     console.log("hello"); 
// // }

// function UserModel() {
//     let [friends, setFriends] = useState([]);
//     let [chatId, setChat] = useState('');
//     let dispatch = useDispatch();
//     let navigate = useNavigate();
//     useEffect(() => {
//         let fetcher = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/chat/get-chat', { withCredentials: true });
    
//                 // Set the friends state
//                 setFriends(response.data);
//       console.log(response.data," my chats");
      
//                 // Use response.data directly to set the chatId
//                 if (response.data.length > 0) {
//                     setChat(response.data[0]._id);
//                 }
//             } catch (error) {
//                 console.error("Error fetching data: ", error);
//             }
//         };
//         fetcher();
//     }, []); 





//     const [open, setOpen] = useState(false);
//     // Handle opening of the dialog
//     const handleFocus = (e, id) => {
//         e.preventDefault();
//         // delete logic here api backened
//         setOpen(true);
//     };

//     // Handle closing of the dialog
//     const handleClose = () => {
//         setOpen(false);
//     };

//     return (
//         <div>
//             {friends.map((user) => (
//                 <div onClick={
//                     async () => {
//                     setChat(user._id);
//                     console.log(chatId);
//                     dispatch(userId(chatId));
//                     console.log(chatId);
//                    if(chatId){
//                     navigate(`/chats/${chatId}`);
//                    } 
    
//                 }} key={user._id} tabIndex="0" className='w-5/6  focus:bg-purple-300  bg-purple-100 h-16 rounded-xl m-auto mb-2 px-3'>
//                     <div className='flex items-center h-16 gap-3' onContextMenu={(e) => handleFocus(e, user._id)}>
//                         {user.isGrouped ? (
//                             // here i have to map over each member 
//                             <Stack direction="row" spacing={0} sx={{ position: 'relative' }}>
//                                 <Avatar src={user.members[0].avatar} sx={{ marginLeft: '0', marginRight: '-10px' }} />
//                                 <Avatar src={user.members[1].avatar} sx={{ marginLeft: '-10px', marginRight: '-10px' }} />
//                                 <Avatar src={user.members[2].avatar} sx={{ marginLeft: '-10px' }} />
//                             </Stack>
//                         ) : (
//                             <Avatar src={user.members[0].avatar} />

//                         )}
//                         <div>
//                             <p className='font-semibold text-pink-600'>{user.name}</p>
//                             {/* <p className='text-gray-400'>New Notifications</p> */}
//                         </div>
//                     </div>
//                 </div>
//             ))}
//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle sx={{ color: "gray" }}><DeleteIcon sx={{ fontSize: 30, color: "gray" }} /> Delete chat</DialogTitle>
//                 <DialogActions>
//                     <Button onClick={handleClose} sx={{ color: "red" }}>
//                         Delete
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     )
// }

// export default UserModel;



import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Avatar } from '@mui/material';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { userId } from '../store/reducer.js';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../socket.jsx';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function UserModel() {
  let [friends, setFriends] = useState([]);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const socket = useSocket();
  let REFETCH_CHATS = 'REFETCH_CHATS';

  useEffect(()=>{

    socket.on(REFETCH_CHATS, async({})=>{
      let fetcher = async () => {
        try {
          const response = await axios.get('http://localhost:3000/chat/get-chat', { withCredentials: true });
          setFriends(response.data);
          console.log(response.data, " my chats");
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };
      fetcher();
    }) 


    return () => {
      socket.off(REFETCH_CHATS);
    };
  },[socket])

  useEffect(() => {
    let fetcher = async () => {
      try {
        const response = await axios.get('http://localhost:3000/chat/get-chat', { withCredentials: true });
        setFriends(response.data);
        console.log(response.data, " my chats");
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetcher();
  }, []);

  const [open, setOpen] = useState(false);
  
  // Handle opening of the dialog
  const handleFocus = (e, id) => {
    e.preventDefault();
    setOpen(true);
  };

  // Handle closing of the dialog
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {friends.map((user) => (
        <div
          key={user._id}
          onClick={() => {
            // Directly use the user._id for dispatching and navigation
            dispatch(userId(user._id));  // Dispatch the correct user id
            navigate(`/chats/${user._id}`);  // Navigate to the specific chat
          }}
          tabIndex="0"
          className="w-5/6 focus:bg-purple-300 bg-purple-100 h-16 rounded-xl m-auto mb-2 px-3"
        >
          <div className="flex items-center h-16 gap-3" onContextMenu={(e) => handleFocus(e, user._id)}>
            {user.isGrouped ? (
              <Stack direction="row" spacing={0} sx={{ position: 'relative' }}>
                <Avatar src={user.members[0].avatar} sx={{ marginLeft: '0', marginRight: '-10px' }} />
                <Avatar src={user.members[1].avatar} sx={{ marginLeft: '-10px', marginRight: '-10px' }} />
                <Avatar src={user.members[2].avatar} sx={{ marginLeft: '-10px' }} />
              </Stack>
            ) : (
              <Avatar src={user.members[0].avatar} />
            )}
            <div>
              <p className="font-semibold text-pink-600">{user.name}</p>
            </div>
          </div>
        </div>
      ))}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: "gray" }}>
          <DeleteIcon sx={{ fontSize: 30, color: "gray" }} /> Delete chat
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "red" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserModel;
