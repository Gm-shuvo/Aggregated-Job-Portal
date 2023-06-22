import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setUserData } from '@/Utils/UserSlice';
import NavBar from '@/components/NavBar';
import LoginForm from '@/components/LoginForm';
import {login_me} from '@/Services/auth';
import Cookies from 'js-cookie';
import Router from 'next/router';

export default function Login() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (Cookies.get('token')) {
      Router.push('/');
    }
  }, []);

  const handleLogin = async (formData) => {
    try {
      // Make the API request to login
      const res = await login_me(formData);

      if (res.success) {
          Cookies.set('token', res?.finalData?.token);
          localStorage.setItem('user', JSON.stringify(res?.finalData?.user));
          dispatch(setUserData(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null));
          Router.push('/');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
      toast.error('An error occurred during login. Please try again later.');
    }
  };

  return (
    <>
      <NavBar />
      <div className='w-full h-screen bg-indigo-600'>
        <div className="flex flex-col items-center  text-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div className="w-full bg-white text-black rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Sign in to your account
              </h1>
              <LoginForm onLogin={handleLogin} />
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
