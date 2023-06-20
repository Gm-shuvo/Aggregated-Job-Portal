import React from 'react'
import { InfinitySpin } from 'react-loader-spinner'

export const Loader = () => {
  return (
    <div className='bg-gray w-full h-screen flex items-center flex-col justify-center'>
        <InfinitySpin width='200' color="#4f46e5" />
        <p className='text-xs uppercase'>Loading Resources Hold Tight...</p>
    </div>
  )
}
