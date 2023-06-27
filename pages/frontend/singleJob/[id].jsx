import NavBar from "@/components/NavBar";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCategory } from "react-icons/md";
import { BsBookmarkCheck } from "react-icons/bs";
import { SiOpslevel } from "react-icons/si";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setMatchingJobData } from "@/Utils/JobSlice";
import { get_specified_job, get_specifiedLinkedin_job, get_related_jobs, get_related_jobs_linkedin } from "@/Services/job";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { book_mark_job } from "@/Services/job/bookmark";
import { Loader } from "@/components/Loader";
import { SlLocationPin } from "react-icons/sl";
import { TbBuildingBank } from "react-icons/tb";
import { PiClockCountdownBold } from "react-icons/pi";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import JobsCard from "@/components/JobsCard";
import { formatDistanceToNow } from "date-fns";
import {withAuth} from "@/middleware/withAuth";

function JobDetails() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { id, s } = router.query;

  console.log("ID:", id);
  console.log("Source:", s);

  const [jobData, setJobData] = useState([]);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChoose, setIsChoose] = useState("Description");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const allJobData = useSelector((state) => state?.Job?.JobData);
  const matchingData = useSelector((state) => state?.Job?.matchingData);
  const user = useSelector((state) => state?.User?.userData);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const { data } =
          s === "LinkedIn"
            ? await get_specifiedLinkedin_job(id)
            : await get_specified_job(id);
            
        const [relatedJobs, relatedJobLinkedIn] = await Promise.all([
          get_related_jobs(data?.job_type, data?.job_level),
          get_related_jobs_linkedin(data?.job_type, data?.job_level),
        ]);

        // const relatedJobsData = relatedJobs?.data?.data;
        // const relatedJobsLinkedInData = relatedJobLinkedIn?.data?.data;
        console.log("Job Data:", data);
        console.log("Related Jobs:", relatedJobs?.data);
        console.log("Related Jobs LinkedIn:", relatedJobLinkedIn?.data);

        const combineRelatedJobs = [
          ...relatedJobs?.data,
          ...relatedJobLinkedIn?.data,
        ];
        
        setJobData(data);
        setRelatedJobs(combineRelatedJobs)
      } catch (error) {
        console.log("Error fetching job data:", error);
        if (error) toast.error(error);
      }

      setIsLoading(false);
    };

    if (id && s) fetchData();
  }, [id, s]);

  useEffect(() => {
    if (jobData) {
      const filteredJobData = relatedJobs?.filter(
        (job) => job._id !== jobData._id
      );

      dispatch(setMatchingJobData(filteredJobData));
    }
  }, [jobData, relatedJobs, dispatch]);

  console.log("Job Data:", jobData);
  console.log("Related Jobs:", relatedJobs);

  const handleApply = () => {
    if (!user) return toast.error("Please Login First");
    // Handle apply logic here
  };

  const handleBookmark = async () => {
    if (!user) return toast.error("Please Login First");

    try {
      const res = await book_mark_job(id);
      if(res.ok){
        toast.success("Job bookmarked successfully");
        setIsBookmarked(true);
      }
    } catch (error) {
      console.log("Error bookmarking job:", error);
      if (error) toast.error(error);
    }
  };

  

  
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <NavBar />

          <section className="mx-auto my-20 max-w-7xl px-4 sm:px-6 lg:px-8">
            {jobData && (
              <>
              <div className="">
                <div className="flex justify-between items-center ">
                  <h1 className="text-lg sm:text-xl md:text-2xl max-w-[400px] font-semibold text-gray-800">
                    {jobData?.job_title}
                  </h1>

                  <div className="flex items-start   space-x-3">
                    <button
                      onClick={handleBookmark}
                      className="text-gray-500 focus:outline-none "
                    >
                      <BsBookmarkCheck
                        size={40}
                        className="text-start hover:text-indigo-600"
                      />
                    </button>
                    <button
                      onClick={handleBookmark}
                      disabled={isBookmarked}
                      className="text-white bg-indigo-500 font-semibold border px-4 py-2 rounded focus:outline-none"
                    >
                      { s === "LinkedIn" ?
                        <span>Apply on LinkedIn</span> :
                        <span>Apply Now</span>
                      }
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-6 mb-3 text-xs md:text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <TbBuildingBank size={20} />
                    <span>{jobData?.company_name}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MdOutlineCategory size={20} />
                    <span>{jobData?.job_type}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <SiOpslevel size={20} />
                    <span>{jobData?.job_level}</span>
                  </div>
                </div>
                <div className="flex gap-4 items-center ">
                  <div className="flex space-x-2 mb-6 text-xs md:text-sm text-gray-500">
                    <SlLocationPin size={20} />
                    <span>{jobData?.job_location}</span>
                  </div>
                  <div className="flex space-x-2 mb-6 text-xs md:text-sm text-gray-500">
                    <PiClockCountdownBold size={20} />
                    <span>{jobData?.job_date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 border-b-2 border-gray-400 py-4 cursor-pointer font-medium">
                  <h4
                    onClick={() => {
                      setIsChoose("Description");
                    }}
                  >
                    Description
                  </h4>
                  <h4
                    onClick={() => {
                      setIsChoose("Reviews");
                    }}
                  >
                    Reviews
                  </h4>
                </div>
                {isChoose === "Description" ? (
                  <div className="mb-6 text-base md:text-lg flex mx-auto mt-5">
                    <div className="whitespace-pre-wrap">
                    <ReactMarkdown>{jobData?.job_description}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 text-gray-500 text-base md:text-lg flex mx-auto mt-5">
                    <p className="mb-4">No Reviews</p>
                  </div>
                )}

              </div>
              <div className="mt-10">
                <h2 className="text-lg md:text-xl font-semibold border-b-2 py-4">Related Jobs...</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {matchingData?.map((job) => (
                    <JobsCard border ={2} key={job.id} job={job} />

                  ))}
                </div>
              </div>
              </>
            )}
          </section>
          <ToastContainer />
        </>
      )}
    </>
  );
}

export default JobDetails;
