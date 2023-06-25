import NavBar from "@/components/NavBar";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GoLocation } from "react-icons/go";
import { MdCategory, MdEmail, MdOutlineCategory } from "react-icons/md";
import { BsBookmarkCheck } from "react-icons/bs";
import { SiOpslevel } from "react-icons/si";
import { AiOutlineArrowRight, AiOutlineDollarCircle } from "react-icons/ai";
import { RiUserSearchFill } from "react-icons/ri";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { HiOutlineStar } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setMatchingJobData } from "@/Utils/JobSlice";
import { get_specified_job, get_specifiedLinkedin_job } from "@/Services/job";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSWR from "swr";
import { bookMarkJob } from "@/Services/job/bookmark";
import { Loader } from "@/components/Loader";
import { SlLocationPin } from "react-icons/sl";
import { TbBuildingBank } from "react-icons/tb";
import { PiClockCountdownBold } from "react-icons/pi";

export default function JobDetails() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { id, s } = router.query;

  //   console.log(router.query);

  const [jobData, setJobData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const allJobData = useSelector((state) => state?.Job?.JobData);
  const matchingData = useSelector((state) => state?.Job?.matchingData);
  const user = useSelector((state) => state?.User?.userData);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        if (s === "LinkedIn") {
          const { data } = await get_specifiedLinkedin_job(id);
          setJobData(data);
        } else {
          const { data } = await get_specified_job(id);
          setJobData(data);
        }
      } catch (error) {
        console.log("Error fetching job data:", error);
        if (error) toast.error(error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [id, s]);

  console.log(jobData);
  console.log(allJobData);

  useEffect(() => {
    if (jobData) {
      const filteredJobData = allJobData?.filter(
        (job) => job.job_type === jobData?.job_type
      );

      //   const combinedData = [
      //     ...filteredJobData1,
      //     ...filteredJobData2,
      //     ...filteredJobData3,
      //     ...filteredJobData4,
      //   ];
      dispatch(setMatchingJobData(filteredJobData));
    }
  }, [jobData, allJobData]);

  console.log(matchingData);

  const handleApply = () => {
    if (!user) return toast.error("Please Login First");
    // Handle apply logic here
  };

  const handleBookmark = async () => {
    if (!user) return toast.error("Please Login First");

    try {
      await bookMarkJob(id);
      toast.success("Job bookmarked successfully");
    } catch (error) {
      console.log("Error bookmarking job:", error);
      if (error) toast.error(error);
    }
  };

  return (
    <>
      <NavBar />

      <section className="mx-auto my-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        {jobData && (
          <div className="mb-10 border-b-2 border-gray-400">
            <div className="flex justify-between items-center">
              <h1 className="text-lg sm:text-xl md:text-2xl max-w-[400px] font-semibold text-gray-800">
                {jobData?.job_title}
              </h1>

              <div className="flex items-start mt-[12px] space-x-3">
                <button
                  onClick={handleBookmark}
                  className=" text-gray-500 focus:outline-none "
                >
                  <BsBookmarkCheck
                    size={40}
                    className="text-start hover:text-indigo-600"
                  />
                </button>
                <button
                  onClick={handleBookmark}
                  className="text-white bg-indigo-500 font-semibold border px-4 py-2 rounded focus:outline-none"
                >
                  <span>Apply Now</span>
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
          </div>
        )}
      </section>
      <ToastContainer />
    </>
  );
}
