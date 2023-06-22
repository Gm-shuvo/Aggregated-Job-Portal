import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const LoginForm = ({ onLogin }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data) => {
    setServerError('');
    console.log(data);

    try {
      await onLogin(data);
    } catch (error) {
      setServerError('An error occurred during login. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6" action="#">
      <div className='text-left'>
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
        <input {...register('email', { required: true })} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 " placeholder="name@company.com" required="" />
        {errors.email && <p className="text-sm text-red-500">Email Field is Required</p>}
      </div>
      <div className='text-left'>
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
        <input {...register('password', { required: true })} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5" required="" />
        {errors.password && <p className="text-sm text-red-500">Password Field is required</p>}
      </div>
      {serverError && <p className="text-sm text-red-500">{serverError}</p>}
      <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Sign in</button>
      <p className="text-sm font-light ">
        Don’t have an account yet? <Link href="/auth/register" className="font-medium text-indigo-600 hover:underline ">Sign up</Link>
      </p>
    </form>
  );
};

export default LoginForm;
