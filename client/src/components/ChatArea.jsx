import React, { useState, useEffect } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useSocket } from '../socket.jsx';
import Doll from './doll.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import { START_TYPING } from '../../../api/constansts/EventName.js';

function ChatArea() {
  const randomId = uuidv4();
  const chatId = useSelector((state) => state.user.chatId);
  const userId = useSelector((state) => state.user.currentUser.id);
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [memberChat, setMemberChat] = useState([]);
  const NEW_MESSAGE = 'NEW_MESSAGE';
  const fileref = useRef();
  const navigate = useNavigate();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('attachment', file);
    formData.append('chatId',chatId)
    console.log("My form data is:",formData)
    try {
      const response = await axios.post('http://localhost:3000/chat/createAttachment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log('Response from server:', response.data.data);
    
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  const sendMessage = (e) => {
       e.preventDefault();
       if (inputMessage.trim() === '') {
        toast.error('Cannot send an empty message!', { autoClose: 2000 });
        return;
      }
    socket.emit(NEW_MESSAGE, {
      sender:userId,
      content: inputMessage,    
      chatId,
      members: memberChat,
    });
    toast.success(`${userId}`, { autoClose: 2000 });
    setInputMessage('');
  };
  useEffect(() => {
    const handleMessage = ({ newMessageForRealTime}) => {
      console.log("new message",  newMessageForRealTime); 
      setMessages((prevMessages) => [...prevMessages,newMessageForRealTime]); 
    };
    socket.on(NEW_MESSAGE, handleMessage);
    socket.on("START_TYPING_SHOW",({chatId,username})=>{
      toast.dismiss('typing-notification'); // Dismiss existing notification
      toast.success(`${username} is typing...`, {style: { background: "purple", color: "white" }, icon:"", position: "bottom-center", id: 'typing-notification', autoClose: 1000 });    })
    return () => {
      socket.off(NEW_MESSAGE, handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    const fetcher = async () => {
      try {
        if (chatId !== 1) {
          const res = await axios.get(`http://localhost:3000/chat/getmsg/${chatId}`, { withCredentials: true });
          const membersofChat = await axios.get(`http://localhost:3000/chat/getmemberfromchatId/${chatId}`, { withCredentials: true });
          setMemberChat(membersofChat.data.message[0].members);
          setMessages(res.data.message);
          console.log(res.data.message);
          
        }
      } catch (error) {
        console.error('Error fetching chat data:', error);
        toast.error('Failed to load chat messages.');
      }
    };
    fetcher();
  }, [chatId]);

  let handleBack=()=>{
    console.log("hello");
    navigate('/friends');
  }

  return (
   <>
     <button className='mt-2 ml-2' onClick={handleBack}><ArrowBackIcon/></button> 
    <div className="w-full h-full flex flex-col">
      {/* Chat messages container */}
      <div className="flex-grow p-4 custom-scrollbar overflow-y-auto" style={{ paddingBottom: '80px' }}>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`w-full flex ${msg.sender._id.toString() === userId.toString() ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-64 mx-4 mt-2 bg-purple-100 p-2 rounded-xl">
                <div className="font-bold text-pink-500">{msg.sender.username}</div>
               {msg.attachment.length >0?
                msg.attachment.map((att)=> <div id={att._id}><img src={att.url}/></div>)
               : <div>{msg.content}</div>}
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <img src={Doll} alt="Doll" className="w-1/2 mt-4" />
            <div className="text-purple-500 font-bold text-2xl">CHAT AREA</div>
            <div className="text-purple-700 font-bold text-xl">START CHATTING ....</div>
          </div>
        )}
        <div className="w-full h-20"></div>
      </div>

      {/* Chat input area */}
      <div className="w-full flex justify-center items-center">
        <div className="flex items-center w-3/4 sm:w-1/2 lg:w-1/3  bg-purple-100 rounded-xl p-2 shadow-md border border-gray-300 fixed bottom-0 mb-4 ">
        <input onChange={handleFile} type="file" ref={fileref} className='w-10 h-6 hidden' />
          <button   onClick={() => fileref.current.click()}  className="flex items-center justify-center p-2 transition-transform transform hover:scale-105">
            <AttachFileIcon sx={{ color: 'gray' }} />
          </button>
          <input
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value); 
              socket.emit("START_TYPING", {chatId : chatId , userId:userId} );
            }}
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
            placeholder="Type your message here..."
          />
          <button onClick={(e)=> sendMessage(e)} className="flex items-center justify-center p-2 transition-transform transform hover:scale-105">
            <ArrowUpwardIcon sx={{ color: 'gray' }} />
          </button>
        </div>
      </div>
    </div>
   </>
  );
}

export default ChatArea;
