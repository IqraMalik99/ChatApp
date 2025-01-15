import React, { useState } from 'react'
import Input from '../components/Input.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { userState, userLogin } from '../store/reducer.js';
import Header from '../components/Header/Header.jsx';
import { Button } from '@mui/material';

function SignIn() {
    let dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    const navigate = useNavigate();
    let onSubmit = async (data) => {
        try {
            // Send data to the backend using axios

            const response = await axios.post('http://localhost:3000/user/sign-in', data, { withCredentials: true });
            console.log('Response from server:', response.data);
            reset();
            let userInfo = {
                username: data.username,
                email: data.email,
                avatar: response.data.data.avatar,
                time: response.data.data.time,
                id: response.data.data.id
            };
            console.log(userInfo);


            dispatch(userState(userInfo));
            dispatch(userLogin());
            navigate('/chats/1');

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <>
            {/* <Header /> */}
            <div className='mt-3 ml-3 mb-1' onClick={() => navigate('/sign-up')}>
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
                <div className="w-full mt-10 h-full">
                    <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-xl border border-white/30 shadow-lg p-6  h-3/5 w-5/6 mx-auto flex justify-center items-center flex-col lg:w-1/3">
                        <p className="text-2xl font-bold text-purple-500">Log In</p>

                        {/* Username input */}
                        <Input
                            name="username"
                            {...register('username', { required: true })}
                            placeholder="Username..."
                        />

                        {/* Email input */}
                        <Input
                            name="email"
                            {...register('email', { required: true })}
                            placeholder="Email..."
                        />


                        {/* Password input */}
                        <Input
                            {...register('password', { required: true })}
                            placeholder="Password..."
                            type="password" // Added password type
                        />
                        {errors.password && (
                            <div className="text-red-600">Password is required!</div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit" // Added submit type
                            className="p-1 mb-3 h-8 bg-purple-500 w-64 hover:bg-purple-400 text-white font-semibold ">
                            Log In
                        </button>

                        <p className='text-purple-500'>
                            Don't have an account?{' '}
                            <Link className="text-blue-500" to={'/sign-up'}>
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </>
    );
}

export default SignIn;

