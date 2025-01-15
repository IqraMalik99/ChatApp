// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import { Tooltip } from '@mui/material';
// import { useEffect } from 'react';
// import { useSocket } from '../../socket';
// import { useSelector } from 'react-redux';

// export default function Notification() {
//   const [open, setOpen] = React.useState(false);
//   const [requests, setRequests] = React.useState([]);
//   const socket = useSocket();

//   // Listening for friend requests
//   useEffect(() => {
//     const FRIEND_REQUEST_ALERT = 'FRIEND_REQUEST_ALERT';

//     socket.on(FRIEND_REQUEST_ALERT, ({ sender }) => {
//       console.log("Received friend request from:", sender);
//       setRequests((prev) => [...prev, sender]); // Add new sender to the list
//     });

//     // Cleanup listener on unmount
//     return () => {
//       socket.off(FRIEND_REQUEST_ALERT);
//     };
//   }, [socket]);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };
//   let reject=()=>{
//     setOpen(false);
//   };
//   let accept=()=>{
//     setOpen(false);
//   };

//   return (
//     <React.Fragment>
//       <Button onClick={handleClickOpen}>
//         <Tooltip title="Notification">
//           <span>
//             <NotificationsIcon sx={{ fontSize: 30 }} className="text-white" />
//           </span>
//         </Tooltip>
//       </Button>
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="notification-dialog-title"
//         aria-describedby="notification-dialog-description"
//       >
//         <DialogTitle id="notification-dialog-title">
//           Friend Requests
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="notification-dialog-description">
//             {requests.length > 0 ? (
//               requests.map((request) => (
//                 <div key={request._id}>
//                 <span className='text-purple-500 font-semibold'>{request.username || "Unknown User"}</span>   has sent you a friend request. 
//                 </div>
//               ))
//             ) : (
//               "No new friend requests."
//             )}
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//                 <button className='p-2 m-2 text-green-700 border-2 border-green-700 rounded-lg'>Accept</button>
//                 <button  className='p-2 m-2 text-red-700 border-2 border-red-700 rounded-lg'>Reject</button>
//           </DialogActions>   
//       </Dialog>
//     </React.Fragment>
//   );
// }


import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Tooltip } from '@mui/material';
import { useEffect } from 'react';
import { useSocket } from '../../socket';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export default function Notification() {
  const [open, setOpen] = React.useState(false);
  const [requests, setRequests] = React.useState([]);
  const socket = useSocket();
  let uniqueId = uuidv4();
  let [msg,setmsg]=React.useState([]);

  // Listening for friend requests
  useEffect(() => {
    const FRIEND_REQUEST_ALERT = 'FRIEND_REQUEST_ALERT';
    const Accept_FRIEND_Request_ALERT = 'Accept_FRIEND_Request_ALERT';
    const Reject_FRIEND_Request_ALERT='Reject_FRIEND_Request_ALERT';
    
    socket.on(Accept_FRIEND_Request_ALERT, async({ message }) => {
      console.log("its message to sender ", message);
      setmsg((prev)=>[...prev,message])
    })

  
    socket.on(Reject_FRIEND_Request_ALERT, ({ message }) => {
      console.log("its message to sender ", message);
      setmsg((prev)=>[...prev,message])
    })

    socket.on(FRIEND_REQUEST_ALERT, async({ sender }) => {
    //  let fetcher = async ()=>{
      console.log("Received friend request from hehe:", sender);
      let res = await axios.get(`http://localhost:3000/user/updateReq/${sender.id}`, { withCredentials: true }); // see if id or _id
      console.log(`respone is : ${res}`);
      setRequests((prev) => [...prev, sender]); // Add new sender to the list
    //  };
    //  fetcher();
    });

    // Cleanup listener on unmount
    return () => {
      socket.off(FRIEND_REQUEST_ALERT);
      socket.off(Accept_FRIEND_Request_ALERT);
      socket.off(Reject_FRIEND_Request_ALERT);
    };
  }, [socket]);

  useEffect(()=>{
    let fetcher = async()=>{
      let res = await axios.get(`http://localhost:3000/user/getReq`, { withCredentials: true });
      console.log("reqgetter is :",res.data.data);
      if(res.data.data>0) {
        res.data.data.map((per)=> setRequests((prev)=> [...prev,per]));
      }
    };
    fetcher();
  },[])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle accepting a friend request
  const handleAccept = async(requestId) => {
    socket.emit('ACCEPT_FRIEND_REQUEST', { requestId });
    let res = await axios.get(`http://localhost:3000/chat/newSingleChat/${requestId}`, { withCredentials: true }); // see if id or _id
    console.log(`respone is : ${res}`);
    setRequests((prev) => prev.filter((req) => req.id !== requestId));
  };

  // Handle rejecting a friend request
  const handleReject = (requestId) => {
    socket.emit('REJECT_FRIEND_REQUEST', { requestId });
    setRequests((prev) => prev.filter((req) => req.id !== requestId));
  };


  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}>
        <Tooltip title="Notification">
          <span>
            <NotificationsIcon sx={{ fontSize: 30 }} className="text-white" />
          </span>
        </Tooltip>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="notification-dialog-title"
        aria-describedby="notification-dialog-description"
      >
        <DialogTitle id="notification-dialog-title">
          Friend Requests
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="notification-dialog-description">
            {requests.length > 0 ? (
              requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between my-2">
                  <div>
                    <span className="text-purple-500 font-semibold">
                      {request.username || "Unknown User"}
                    </span>{" "}
                    has sent you a friend request.
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 text-green-700 border-2 border-green-700 rounded-lg"
                      onClick={() => {
                        console.log("id is : ", request.id);
                        handleAccept(request.id)
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className="p-2 text-red-700 border-2 border-red-700 rounded-lg"
                      onClick={() => {
                        console.log("id is : ", request.id);
                        handleReject(request.id);
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              "No new friend requests."
            )}
            {msg.length > 0 ? (
              msg.map((content) => (
                <div key={uniqueId} className="flex items-center justify-between my-2">
                  <div>
                    <span className="text-purple-500 ">
                      {content}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className=" mx-2 p-2 text-black-700 "
                      onClick={() => {
                        setmsg((prev) => prev.filter((req) => req.toString() !== content))
                      }}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))
            ) : (
              "No new friend requests."
            )}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
