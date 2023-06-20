import React, { useEffect, useState } from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import Image from 'next/image'
import { BsFillBookmarkFill } from 'react-icons/bs'
import { useSelector } from 'react-redux';
import JobsCard from './JobsCard';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import { HiLocationMarker } from 'react-icons/hi';
import { FaSuitcase } from 'react-icons/fa';

const locations = [
  'Dhaka',
  'Chittagong',
  'Khulna',

  // Add more location suggestions as needed
];

export default function Intro() {
  const [search, setSearch] = useState('');
  // const jobData = useSelector(state => state.Job.JobData);
  const [filterJobs, setFilteredJobs] = useState([])
  const [doneSearch , setDoneSearch] = useState(false)
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  // console.log(jobData)
  console.log(query, location , jobType)
  const handleSearch = async (e) => {
    e.preventDefault();
    // const filteredJobs = jobData?.filter((job) => {
    //   let x = job?.job_category;
    //   return x?.toUpperCase() === search?.toUpperCase().trim();
    // });
    // setDoneSearch(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/getSearchJobs?query=${query}&category=${category}&location=${location}&job_type=${jobType}`);

      // Handle the response data

      console.log(response.data);
      setFilteredJobs(response.data);
      setDoneSearch(true)
    } catch (error) {
      console.error(error);
    }

  }
  // console.log(query, category, location, jobType)
  
  /// Auto Suggest
  const [suggestions, setSuggestions] = useState([]);
  const onLocationChange = (event, { newValue }) => {
    setLocation(newValue);
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : locations.filter((loc) => loc.toLowerCase().slice(0, inputLength) === inputValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion;
  const renderSuggestion = (suggestion) => <div className=''>{suggestion}</div>;

  const inputProps = {
    placeholder: 'Town or origin...',
    value: location,
    onChange: onLocationChange,
  };
  return (
    <>
      <div className='w-full  h-full flex items-center lg:justify-start py-24 justify-center flex-wrap  '>
        <div className='lg:w-6/6 w-full sm:p-2 h-full my-2 flex items-center justify-center px-4 md:items-start md:justify-start md:p-20 flex-col '>
          <h1 className='md:text-6xl text-2xl sm:text-2xl font-extrabold mb-4 text-black '>To Choose <span className='text-indigo-600'>Right Jobs.</span> </h1>
          <p className='md:text-lg sm:text-sm text-xs mb-20 text-gray-400'>2400 Peoples are daily search in this portal, 100 user added job portal!</p>
          <div className='relative bg-white px-2 mb-6 w-full md:px-4  py-4 flex sm:flex-row items-center justify-center rounded-md'>
            {/* <BiSearchAlt className='text-2xl text-indigo-600 mx-2 hidden sm:flex' /> */}
            <div className="flex flex-col w-full space-y-2">
            <label htmlFor='What' className='flex gap-2 items-center text-base text-gray-400'>
                <FaSuitcase className='w-[20px] h-[20px]'/>What</label>
                <input onChange={(e) => setQuery(e.target.value)} type="text" placeholder='Job keyword or company...' className='xs:w-full w-full  h-full px-2 bg-gray-200 text-base py-3 outline-none rounded-md' />
            </div>
            <div className="flex flex-col w-full space-y-2">
            <label htmlFor='What' className='flex gap-2 items-center text-base text-gray-400'>
                <HiLocationMarker className='w-[20px] h-[20px]'/>Where</label>
                <Autosuggest onChange={(e) => setLocation(e.target.value)} className= 'w-3/4'
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />

            </div>

            <button onClick={handleSearch} className='px-3 py-2 my-2 mt-[36px] border border-indigo-600 rounded uppercase tracking-widest mx-4   text-white bg-indigo-600 transition-all duration-700 hover:bg-transparent font-semibold text-base hover:text-indigo-600'>Search</button>
          </div>
          <div className="flex item-center justify-center gap-4">
            <label htmlFor="Job type">Sort by:</label>
            <select name="" id="job_type" className='px-2 py-1 bg-white rounded-[3px] outline-none' onChange={(e)=>{setJobType(e.target.value)}}>
              <option value="fulltime">Full-time</option>
              <option value="parttime">Part-time</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div className=' w-full py-2 flex items-center justify-start flex-wrap'>
            <div className='flex items-center justify-center'>
              <BsFillBookmarkFill className='text-indigo-600 text-xl ' />
              <h1 className='font-semibold text-lg mx-2'>Suggest Tag : </h1>
            </div>
            <div className='flex items-center justify-center px-4 flex-wrap'>
              <p className='px-2 text-gray-600'>Software</p>
              <p className='px-2 text-gray-600'>Marketing</p>
              <p className='px-2 text-gray-600'>UI/UX Design</p>
            </div>
          </div>
        </div>
        {/* <div className='w-3/6 my-2 h-full bg-gray-200 hidden items-center justify-center flex-col p-20 lg:flex'>
          <Image width={600} height={700} src="/intro.png" alt="no-image-found" />
        </div> */}
      </div>
      {
        doneSearch && (
          <div className='w-full flex flex-wrap items-center justify-center py-2 px-2'>
            {
              Array.isArray(filterJobs) && filterJobs.length > 0 ? filterJobs?.map((job) => {
                return (
                  <JobsCard job={job} key={job?._id} />
                )
              }) : <p className='text-sm text-center font-semibold  text-red-500'>Sorry No such Categories Job Available Right Now</p>
            }
          </div>
        )
      }
    </>
  )
}


