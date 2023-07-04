import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BsFillBookmarkFill } from "react-icons/bs";
import useAutosuggest from "@/hooks/useAutosuggestion";
import Select from "react-select";
import JobsCard from "./JobsCard";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import { HiLocationMarker } from "react-icons/hi";
import { FaSuitcase } from "react-icons/fa";
import { LuLocateFixed } from "react-icons/lu";

import dotenv from "dotenv";
import { toast, ToastContainer } from "react-toastify";
dotenv.config();

const locations = [
  "Dhaka",
  "Chittagong",
  "Khulna",

  // Add more location suggestions as needed
];

export default function Intro() {
  const [search, setSearch] = useState("");
  // const jobData = useSelector(state => state.Job.JobData);
  const [filterJobs, setFilteredJobs] = useState([]);
  const [doneSearch, setDoneSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [error, setError] = useState("");
  // console.log(jobData)
  console.log(query, location, jobType, jobLevel);
  const handleSearch = async (e) => {
    e.preventDefault();
    setDoneSearch(false);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/getSearchJobs?q=${query}&loc=${location}&jt=${jobType}&jl=${jobLevel}`
      );

      // Handle the response data

      console.log(response.data);
      setFilteredJobs(response.data);
      setDoneSearch(true);
    } catch (error) {
      console.error(error);
    }
  };
  // console.log(query, category, location, jobType)

  /// Auto Suggest

  const {
    suggestions,
    inputProps,
    onSuggestionsFetchRequested,
    onSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion,
  } = useAutosuggest(location, setLocation);


  const handleJobTypesChange = useCallback((selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : "";
    setJobType(selectedValue);
  }, []);

  const optionsTypes = [
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Remote", label: "Remote" },
    { value: "Intern", label: "Intern" },
  ];

  const defaultValueTypes = useMemo(() => optionsTypes[0], []);

  const handleJobLevelChange = useCallback((selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : "";
    setJobLevel(selectedValue);
  }, []);

  const optionsLevel = [
    { value: "Entry level", label: "Entry level" },
    { value: "Imtermediate level", label: "Imtermediate level" },
    { value: "Senior level", label: "Senior level" },
  ];

  const defaultValueLevel = useMemo(() => optionsLevel[0], []);

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        // Use latitude and longitude to fetch the location details
        var requestOptions = {
          method: "GET",
        };

        // console.log(process.env.NEXT_PUBLIC_GEO_API_KEY);

        fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${process.env.NEXT_PUBLIC_GEO_API_KEY}`,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) =>{
            console.log(result.features[0].properties.city)
            setLocation(
              `${result.features[0].properties.city}${","}${
                result.features[0].properties.country
              }`
            )}
          )
          .catch((error) => setError(error.message));
      });
    } else {
      setError("Your browser does not support geolocation!");
    }
  };

  return (
    <>
      <div className="w-full h-full flex items-center lg:justify-start py-24 justify-center flex-wrap  ">
        <div className="lg:w-12/12 w-full sm:p-2 h-full my-2 flex items-center justify-center px-2 md:items-start md:justify-start md:p-20 flex-col ">
          <h1 className="md:text-6xl text-4xl sm:text-5xl font-extrabold mb-4 text-black ">
            To Choose <span className="text-indigo-600">Right Jobs.</span>{" "}
          </h1>
          <p className="md:text-lg sm:text-base text-sm mb-10 md:2- text-gray-400">
            2400 Peoples are daily search in this portal, 100 user added job
            portal!
          </p>
          <div className="relative w-full bg-white px-2 mb-6 md:px-4 py-3 first-letter: md:py-6 flex sm:flex-row items-center justify-center rounded ring-2 ring-indigo-300/90">
            <div className="flex flex-col w-full space-y-2">
              <label
                htmlFor="What"
                className="flex gap-2 items-center text-base  text-gray-400"
              >
                <FaSuitcase size={18} />
                What
              </label>

              <input
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Job keyword or company..."
                className=" w-full  h-full px-4 bg-indigo-100/80 text-base py-3 outline-none rounded-md "
              />
            </div>
            <div className="flex flex-col w-full space-y-2">
              <label
                htmlFor="What"
                className="flex gap-2 items-center text-base text-gray-500"
              >
                <HiLocationMarker size={18} />
                Where
              </label>
              <div className="flex items-center w-full">
                <Autosuggest
                  className=""
                  onChange={(e) => setLocation(e.target.value)}
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={inputProps}
                />
                <LuLocateFixed
                  size={18}
                  className=" block -ml-7 z-20 cursor-pointer"
                  onClick={handleLocationClick}
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="px-3 py-2 my-2 mt-[36px] border border-indigo-600/90 rounded uppercase tracking-widest mx-4   text-white bg-indigo-600/90 transition-all duration-700 hover:bg-indigo-200 font-semibold text-base hover:text-indigo-700/80"
            >
              Search
            </button>
          </div>
          <div className="flex items-center justify-center space-x-4 ">
            <div className="flex item-center gap-4">
              <Select
                className="w-full flex flex-col items-start justify-center"
                defaultValue={defaultValueTypes}
                value={optionsTypes.find((option) => option.value === jobType)}
                onChange={handleJobTypesChange}
                placeholder="Please Select Job Level"
                options={optionsTypes}
              />
            </div>
            <div className="flex item-center justify-center gap-4">
              <Select
                className="w-full flex flex-col items-start justify-center"
                defaultValue={defaultValueLevel}
                value={optionsLevel.find((option) => option.value === jobLevel)}
                onChange={handleJobLevelChange}
                placeholder="Please Select Job Level"
                options={optionsLevel}
              />
            </div>
          </div>
          <div className=" w-full mt-3 py-2 flex items-center justify-start flex-wrap">
            <div className="flex items-center justify-center">
              <BsFillBookmarkFill className="text-indigo-600 text-xl " />
              <h1 className="font-semibold text-lg mx-2">Suggest Tag : </h1>
            </div>
            <div className="flex items-center justify-center px-4 flex-wrap">
              <p className="px-2 text-gray-600">Software</p>
              <p className="px-2 text-gray-600">Marketing</p>
              <p className="px-2 text-gray-600">UI/UX Design</p>
            </div>
          </div>
        </div>
        {/* <div className='w-3/6 my-2 h-full bg-gray-200 hidden items-center justify-center flex-col p-20 lg:flex'>
          <Image width={600} height={700} src="/intro.png" alt="no-image-found" />
        </div> */}
      </div>
      {doneSearch && (
        <div className="w-full flex flex-wrap items-center justify-center py-2 px-2">
          {Array.isArray(filterJobs) && filterJobs.length > 0 ? (
            filterJobs?.map((job) => {
              return <JobsCard job={job} key={job?._id} />;
            })
          ) : (
            <p className="text-sm text-center font-semibold  text-red-500">
              Sorry No such Categories Job Available Right Now
            </p>
          )}
        </div>
      )}
      <ToastContainer />
    </>
  );
}
