import React from 'react';
import { useRouter } from 'next/router';
import {TbBuildingBank} from 'react-icons/tb'
import {SlLocationPin} from 'react-icons/sl'
import {CgSandClock} from 'react-icons/cg'
const JobsCard = ({ job }) => {
//   console.log(job)
  const { job_title, company_name, job_description, job_location, createdAt, job_date} = job;
  console.log(job);
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/jobs/${job._id}`);
  };

  return (
    <div
      key={job._id}
      className="group w-full p-4 cursor-pointer transition-all duration-600 border-none shadow-gray-400 hover:shadow-lg rounded-md"
      onClick={handleCardClick}
    >
      <div className="flex justify-center space-y-1 flex-col">
        <h1 className="font-semibold text-base md:text-lg">{job_title}</h1>
        <div className="flex items-start  space-x-4 text-xs text-gray-500">
          <div className="flex items-baseline justify-center space-x-1">
            <TbBuildingBank className='text-xs'/>
            <span>{company_name}</span>
          </div>
          <div className="flex items-baseline justify-center space-x-1">
            <SlLocationPin className='text-xs'/>
            <span>{job_location}</span>
          </div>
        </div>
      </div>
      <div className="destext text-sm md:text-base mt-4 ">{job_description}</div>
      <div className="flex items-center justify-between mt-4 mb-2 border-t-2 border-b-gray-200">
        <div className="flex items-center space-x-2 mt-1">
            <CgSandClock/>
            <span>{}</span>
        </div>
      </div>
    </div>
  );
}

export default JobsCard;
