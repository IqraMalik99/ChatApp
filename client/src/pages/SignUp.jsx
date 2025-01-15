// import React, { useRef } from 'react'
// import Input from '../components/Input.jsx'
// import { Link, useNavigate } from 'react-router-dom'
// import { useForm } from "react-hook-form"
// import axios from 'axios';
// import { useDispatch } from 'react-redux'
// import { userState } from '../store/reducer.js';
// import Header from '../components/Header/Header.jsx';
// // import OAuth from '../components/OAuth.jsx';
// import { Avatar, Tooltip } from '@mui/material';
// function SignUp() {
//     const fileInputRef =useRef();
//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors },
//     } = useForm();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     let onSubmit = async (data) => {
//         try {
//             // Send data to the backend using axios
//             console.log("Mydata is",data)
//             const response = await axios.post('http://localhost:3000/user/sign-up', data, { withCredentials: true });
//             console.log('Response from server:', response.data);
//             reset();
//             dispatch(userState(data))
//             // navigate('/sign-in')
//             // navigate('/sign-in')
//         } catch (error) {
//             console.error('Error submitting form:', error);
//         }
        
//     };
//     const handleAvatarClick = () => {
//         if (document.getElementsByClassName("InputFile").current) {
//             fileInputRef.current.click();
//         }
//     };
//     return (
//        <>
//         <Header/>
//         <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="w-full mt-4 h-full">
//                 <div className="p-8 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg h-3/5 w-5/6 mx-auto flex justify-center items-center flex-col lg:w-1/3">
//                     <p className="text-2xl font-bold text-purple-500">Sign Up</p>
//                     <div onClick={handleAvatarClick} className='mt-2 relative'><Tooltip title="Profile picture" ><Avatar
//                             alt="profile picture"
//                             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMcAAACUCAMAAAAQwc2tAAAAMFBMVEXMzMz////Pz8/8+/zJycnX19f09PT4+PjT09Po6Ojk5OTs7Ozf39/a2trx8fHGxsY4AFzyAAAE1klEQVR4nO2dSZbjIAxAMcgGM5j737YgTipJxTPCkuvlL/r1ohf8gCwxthBfvnyhAYSQdwQAdWsOAdG0vndDd2dwXlzOBaLwndaqSdz+uP1Fa23lhUxiDE6rTPOBduYyJkbnX3/aIzFY6gZuAfxk419QavCGupnLALRO3+NiSUS7lrqpS4Dw+jaiVnokmXaWb5eAcePvvTaybv/CGUnd4GlAdqsCLyp6CMDRBILeoXFTsQxFQO7VSHGSol2myoW67S+A2TOofkXCWHvxoV372M6IeF4eZtjwlZrtEerW/yKHQxKZjlGHxP6wRtN4NoEOoUCjaYzg4rH/i/vKwEQjuiKNVKFQG9wAU9YdKa+3HKZWRUE+0nPw2FUdTtNxiBB7LAG+ohjMdM3xFPhkoJ9U+fLuaHIypKY8yjM9tYYsTR4jjjjSoUUZVimFEHuUlVZPAnEKsUgexAFSMPF4R9N+eQ8sLsx40AbIf/FokTSahtZjdXH9Gh7wX/rj6/H1+Hqc4RFoPXDKXfI8WLzm84B4Zos0jaKfSGF5UK+YYBUm1AsNWB8s6nMBaOsM1EuK/8UjYGSQvN1J7IEysAYGe1IYC6OWwR7hoQMA73SGwZ4tIOzjCAYeoi2tsfI2DgOP4jVFG4GFhyyL9J7Nqd6iWYgWXDQElOwR2kjd/CcFm4Qs9mrvSNkOq4dEZzSoC903pAzDsXNktMsLf5FZ5IgG9fTpL0mk3V+fKM8oOEayyO5zr9x6437rxuxL7AwOMXww3h0Ctz3YVW8E/aTjk1EkbA2SwQNHiwcgc5es9kq+lcOmGplGhn71SLINDEPjD+l3bhfDRPWBT2W4CMjWTmbFpKetv9KVtVQ6+s+Q16GNDK9KLAMQwVvX6czgnI0xcg/ueWJ83Eq9rILIeQ5AMDqIX8TjovDV+Xrw4uvBi+t7QEZc2uIm0IYQfJ+x3vvbzbQLZcNUkAgTbO/+lL3KpeIkVexXyewyhFRVzRTtuuuvUPFCrnNX79F3tmUdMJAmg8Om1R/dG66dAiDtale8dIqywHDBBKLp9ZanAN46hd/wSn0x/sp7RJrOGk73z0GmSaw64KHUEAwXj/SNcgd3P25PgDBZBAKRAuOoR34kpHMtg601mFgX2Yu21PVKigyUk5bExxOh+CzDg440SHAuQY6Q3d5O+VsffF1iWoSqUnEbniTaJUKyB926nWXIOnkXWp5bc8GB7dlNIudOgssfM5hGnfu+TNJAjYwXkXDiWSwwDXps/IqcWKSYOgp3Tns9Y/Pm8iHUSWdn8GqRObpTRNCuOM9zxokNwLpxvsQJ5S/ejVpKkYh30W6ZukeaaqXxT+oev4SqX9w3asZ6tLWy+AR9tbwOBne+sYyu9uCw6c70qDayoFe1qtxp6jzvlWZOs08116GrMbIA7PyT05Wo8cgMeHW6R413ytBuNu8BP9TrV+tTVLhd3587pO6gR0i1hYVl0DvEnhziD5BXfXN3kHjgPrg25g4KD9ykLjWZR4M4ESFI5U8sXofEbsslgkp0iAOLyiGj0CxOWeqZB29gUZRWT9C+WGiP8h0D6x3u/f+RBC4K6c1OwNnqP+7hkQYWbXig1VgID2KUgXPWIYUHZfpocvGOMbDyxJzWAydA4MzF0GlQMiH05B4bMuEPZVg866VQypEAAAAASUVORK5CYII="
//                             sx={{ width: 90 , height: 90  , border: '3px solid',borderColor: '#850F8D',boxShadow: '0 0 10px rgba(94, 53, 177, 0.7)'  }}
//                         /> </Tooltip ><input  type='file'   {...register('avatar')} className='h-20 w-20 hidden'/> </div>
//                     {/* Username input */}
//                     <Input
//                         {...register('username', { required: true })}
//                         placeholder="Username..."
//                     />
//                     {errors.username && (
//                         <div className="text-red-600">Username is required!</div>
//                     )}

//                     {/* Email input */}
//                     <Input
//                         {...register('email', { required: true })}
//                         placeholder="Email..."
//                     />
//                     {errors.email && (
//                         <div className="text-red-600">Email is required!</div>
//                     )}

//                     {/* Password input */}
//                     <Input
//                         {...register('password', { required: true })}
//                         placeholder="Password..."
//                         type="password" // Added password type
//                     />
//                     {errors.password && (
//                         <div className="text-red-600">Password is required!</div>
//                     )}

//                     {/* Submit button */}
//                     <button
//                         type="submit" // Added submit type
//                         className="p-1 mb-3 h-8 bg-purple-500 w-64 hover:bg-purple-400 text-white font-semibold"
//                     >
//                         Sign Up
//                     </button>
//                     {/* <OAuth /> */}
//                     <p className='text-purple-500'>
//                         Have an account?{' '}
//                         <Link className="text-blue-500" to={'/sign-in'}>
//                             Log In
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </form>
//        </>
//     );
// }

// export default SignUp;
// // import React from 'react'

// // function SignUp() {
// //   return (
// //     <div>
// //       gg
// //     </div>
// //   )
// // }

// // export default SignUp

import React from 'react';
import Input from '../components/Input.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userState } from '../store/reducer.js';
import Header from '../components/Header/Header.jsx';
import { Avatar, Tooltip ,Button} from '@mui/material';

function SignUp() {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            console.log("My data is", data);
            const response = await axios.post('http://localhost:3000/user/sign-up', data,  {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                 withCredentials: true });
            console.log('Response from server:', response.data);
            reset();
            dispatch(userState(data));
            navigate('/sign-in');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleAvatarClick = () => {
        document.getElementById("fileInput").click(); // Opens the hidden file input
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setValue('avatar', file); // Manually set the file in react-hook-form
    };

    return (
        <>
            {/* <Header /> */}
            <div className='mt-3 ml-3 mb-1' onClick={()=> navigate('/sign-up')}>
            <Button
                variant="outlined"
                sx={{
                    color: "purple",      // Text color
                    borderColor: "purple" // Outline color
                }}
            >
                Create an account
            </Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full mt-4 h-full">
                    <div className="p-8 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg h-3/5 w-5/6 mx-auto flex justify-center items-center flex-col lg:w-1/3">
                        <p className="text-2xl font-bold text-purple-500">Sign Up</p>
                        
                        {/* Avatar Upload */}
                        <div onClick={handleAvatarClick} className='mt-2 relative'>
                            <Tooltip title="Profile picture">
                                <Avatar
                                    alt="profile picture"
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMcAAACUCAMAAAAQwc2tAAAAMFBMVEXMzMz////Pz8/8+/zJycnX19f09PT4+PjT09Po6Ojk5OTs7Ozf39/a2trx8fHGxsY4AFzyAAAE1klEQVR4nO2dSZbjIAxAMcgGM5j737YgTipJxTPCkuvlL/r1ohf8gCwxthBfvnyhAYSQdwQAdWsOAdG0vndDd2dwXlzOBaLwndaqSdz+uP1Fa23lhUxiDE6rTPOBduYyJkbnX3/aIzFY6gZuAfxk419QavCGupnLALRO3+NiSUS7lrqpS4Dw+jaiVnokmXaWb5eAcePvvTaybv/CGUnd4GlAdqsCLyp6CMDRBILeoXFTsQxFQO7VSHGSol2myoW67S+A2TOofkXCWHvxoV372M6IeF4eZtjwlZrtEerW/yKHQxKZjlGHxP6wRtN4NoEOoUCjaYzg4rH/i/vKwEQjuiKNVKFQG9wAU9YdKa+3HKZWRUE+0nPw2FUdTtNxiBB7LAG+ohjMdM3xFPhkoJ9U+fLuaHIypKY8yjM9tYYsTR4jjjjSoUUZVimFEHuUlVZPAnEKsUgexAFSMPF4R9N+eQ8sLsx40AbIf/FokTSahtZjdXH9Gh7wX/rj6/H1+Hqc4RFoPXDKXfI8WLzm84B4Zos0jaKfSGF5UK+YYBUm1AsNWB8s6nMBaOsM1EuK/8UjYGSQvN1J7IEysAYGe1IYC6OWwR7hoQMA73SGwZ4tIOzjCAYeoi2tsfI2DgOP4jVFG4GFhyyL9J7Nqd6iWYgWXDQElOwR2kjd/CcFm4Qs9mrvSNkOq4dEZzSoC903pAzDsXNktMsLf5FZ5IgG9fTpL0mk3V+fKM8oOEayyO5zr9x6437rxuxL7AwOMXww3h0Ctz3YVW8E/aTjk1EkbA2SwQNHiwcgc5es9kq+lcOmGplGhn71SLINDEPjD+l3bhfDRPWBT2W4CMjWTmbFpKetv9KVtVQ6+s+Q16GNDK9KLAMQwVvX6czgnI0xcg/ueWJ83Eq9rILIeQ5AMDqIX8TjovDV+Xrw4uvBi+t7QEZc2uIm0IYQfJ+x3vvbzbQLZcNUkAgTbO/+lL3KpeIkVexXyewyhFRVzRTtuuuvUPFCrnNX79F3tmUdMJAmg8Om1R/dG66dAiDtale8dIqywHDBBKLp9ZanAN46hd/wSn0x/sp7RJrOGk73z0GmSaw64KHUEAwXj/SNcgd3P25PgDBZBAKRAuOoR34kpHMtg601mFgX2Yu21PVKigyUk5bExxOh+CzDg440SHAuQY6Q3d5O+VsffF1iWoSqUnEbniTaJUKyB926nWXIOnkXWp5bc8GB7dlNIudOgssfM5hGnfu+TNJAjYwXkXDiWSwwDXps/IqcWKSYOgp3Tns9Y/Pm8iHUSWdn8GqRObpTRNCuOM9zxokNwLpxvsQJ5S/ejVpKkYh30W6ZukeaaqXxT+oev4SqX9w3asZ6tLWy+AR9tbwOBne+sYyu9uCw6c70qDayoFe1qtxp6jzvlWZOs08116GrMbIA7PyT05Wo8cgMeHW6R413ytBuNu8BP9TrV+tTVLhd3587pO6gR0i1hYVl0DvEnhziD5BXfXN3kHjgPrg25g4KD9ykLjWZR4M4ESFI5U8sXofEbsslgkp0iAOLyiGj0CxOWeqZB29gUZRWT9C+WGiP8h0D6x3u/f+RBC4K6c1OwNnqP+7hkQYWbXig1VgID2KUgXPWIYUHZfpocvGOMbDyxJzWAydA4MzF0GlQMiH05B4bMuEPZVg866VQypEAAAAASUVORK5CYII="
                                    sx={{ width: 90 , height: 90 , border: '3px solid', borderColor: '#850F8D', boxShadow: '0 0 10px rgba(94, 53, 177, 0.7)'  }}
                                />
                            </Tooltip>
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                {...register('avatar')}
                                onChange={handleFileChange} // Capture file change
                            />
                        </div>
                        
                        {/* Username input */}
                        <Input
                            {...register('username', { required: true })}
                            placeholder="Username..."
                        />
                        {errors.username && (
                            <div className="text-red-600">Username is required!</div>
                        )}

                        {/* Email input */}
                        <Input
                            {...register('email', { required: true })}
                            placeholder="Email..."
                        />
                        {errors.email && (
                            <div className="text-red-600">Email is required!</div>
                        )}

                        {/* Password input */}
                        <Input
                            {...register('password', { required: true })}
                            placeholder="Password..."
                            type="password"
                        />
                        {errors.password && (
                            <div className="text-red-600">Password is required!</div>
                        )}
                        
                        {/* Submit button */}
                        <button
                        type="submit" // Added submit type
                        className="p-1 mb-3 h-8 bg-purple-500 w-64 hover:bg-purple-400 text-white font-semibold"
                    >
                        Sign Up
            </button>
                        
                        <p className="text-sm text-purple-600 mt-3">Already registered? <Link className='text-blue-500' to="/sign-in">Sign In</Link></p>
                    </div>
                </div>
            </form>
        </>
    );
}

export default SignUp;
