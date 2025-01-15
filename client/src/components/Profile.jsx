import React, { useEffect } from 'react'
import { Avatar } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import moment from 'moment';
import { useSelector } from 'react-redux';

function Profile() {
let data = useSelector((state)=> state.user.currentUser);
console.log(data);

let timeAgo = moment(data.time).fromNow();
  return (
   <div className='-z-40 bg-purple-200 sticky top-0'>
 <div className='  bg-purple-200 flex flex-col justify-center items-center w-full h-[calc(100vh)] overflow-y-hidden '>
      <div className=''><Avatar src= {data.avatar} sx={{ width: 150, height: 150  , border: '3px solid',borderColor: '#850F8D',boxShadow: '0 0 10px rgba(94, 53, 177, 0.7)'  }} /></div>
      <div className='flex gap-4 mt-4'>
        <span className='font-bold text-xl text-gray-400'> @ </span>
        <span className='flex flex-col justify-center items-center'>
          <span className='font-bold text-xl text-outline-purple'>{data.username}</span>
          <span className='text-gray-400 '>UserName</span>
        </span>
      </div>
      <div className='flex gap-4 mt-4'>
        <CalendarMonthIcon sx={{color:'gray'}}/>
        <span className='flex flex-col justify-center items-center'>
          <span className='font-bold text-xl text-outline-purple '>{timeAgo}</span>
          <span className='text-gray-400 '>Joined</span>
        </span>
      </div>
    </div>
   </div>
  )
}

export default Profile
