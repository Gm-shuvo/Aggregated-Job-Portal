import NavBar from "@/components/NavBar";
import React, { useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { get_job, get_linkedin_job } from "@/Services/job";
import { setJobData } from "@/Utils/JobSlice";
import JobsCard from "@/components/JobsCard";
import Empty from "@/components/Empty";
import { useSelector, useDispatch } from "react-redux";
import { Loader } from "@/components/Loader";

export default function DisplayJobs() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: jobData, error: er1, isLoading: load1 } = useSWR("api/db1/getAllJobs", get_job);

  const { data: LinkedInData, error: er2, isLoading: load2 } = useSWR(
    "api/db2/getAllLinkedInJobs",
    get_linkedin_job
  );

  console.log("jobData", jobData);
  console.log("LinkedInData", LinkedInData);

  useEffect(() => {
    if (jobData && LinkedInData) {
      const combinedJobs = [...jobData?.data, ...LinkedInData?.data];
      dispatch(setJobData(combinedJobs));
    }
  }, [jobData, LinkedInData, dispatch]);

  const jobList = useSelector((state) => state.Job.JobData) || [];

  console.log(jobList)

  return (
    <>
      <NavBar />
      {true ? (<div className="w-full py-20 flex items-center md:px-8 px-2 justify-center flex-col">
        <h1 className="px-4 mx-2 py-2 uppercase tracking-wider border-b-2 border-b-indigo-600 text-3xl font-semibold">
          Available Jobs
        </h1>
        <div className="w-1/2 h-full gap-6 py-4 flex overflow-y-auto items-center justify-center flex-wrap">
          {jobList?.length > 0 ? (
            jobList?.map((job) => <JobsCard job={job} key={job._id} />)
          ) : (
            <Empty />
          )}
        </div>
      </div>):(
        <Loader/>
      )}
    </>
  );
}
