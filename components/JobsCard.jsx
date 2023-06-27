import React from 'react';
import { useRouter } from 'next/router';
import {TbBuildingBank} from 'react-icons/tb'
import {SlLocationPin} from 'react-icons/sl'
import {PiClockCountdownBold} from 'react-icons/pi'
import { MdOutlineCategory } from 'react-icons/md';
import { SiOpslevel } from 'react-icons/si';
import Link from 'next/link';
const JobsCard = ({ job, border }) => {
  // console.log()
  const { job_title, company_name, job_description, job_location, job_date, job_type, job_level,source} = job;
  console.log(job);
  const router = useRouter();


  return (
    <Link href={`/frontend/singleJob/${job?._id}?s=${source}`} key={job?._id}
    className={`group w-full p-4 cursor-pointer transition-all duration-600 border-${border} shadow-gray-400 hover:shadow-lg rounded-md`}
  >
    <div
      
    >
      <div className="flex justify-center space-y-1 flex-col">
        <h1 className="font-semibold text-base md:text-lg">{job_title}</h1>
        <div className="flex items-start  space-x-4 text-xs text-gray-500 md:text-sm">
          <div className="flex items-baseline justify-center space-x-1">
            <TbBuildingBank className=''/>
            <span>{company_name}</span>
          </div>
          <div className="flex items-baseline justify-center space-x-1">
            <SlLocationPin className=''/>
            <span>{job_location}</span>
          </div>
        </div>
      </div>
      <div className="destext text-sm md:text-md mt-4 ">{job_description}</div>
      <div className="flex items-center justify-between mt-4 mb-2 px-2 py-3 border-t-2 border-b-gray-200">
        <div className="flex items-center space-x-1 text-xs text-gray-600 md:text-sm">
            <PiClockCountdownBold className=''/>
            <span className=''>{job_date}</span>
        </div>
            <div className="flex items-center space-x-4 ">
                {job_type && <div className="flex items-center space-x-1 text-xs text-gray-600 md:text-sm">
                    <MdOutlineCategory className=''/>
                    <span className=''>{job_type}</span>
                </div>}

                {job_level && <div className="flex items-center space-x-1 text-xs text-gray-600 md:text-sm">
                    <SiOpslevel className=''/>
                    <span className=''>{job_level}</span>
                </div>}
            </div>
      </div>
    </div>
    </Link>
  );
}

export default JobsCard;
