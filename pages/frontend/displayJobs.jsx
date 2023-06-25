import NavBar from "@/components/NavBar";
import React from "react";
import { useRouter } from "next/router";
import JobsCard from "@/components/JobsCard";
import Empty from "@/components/Empty";
import { useSelector, useDispatch } from "react-redux";
import { Loader } from "@/components/Loader";

import useJobsData from "@/hooks/useJobData";

export default function DisplayJobs() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {loading, error} = useJobsData();

  const jobList = useSelector((state) => state?.Job?.JobData) || [];

  console.log(jobList)

  return (
    <>
      <NavBar />
      {loading || error ? (
        <Loader />
      ) : (
        <div className="w-full py-20 flex items-center md:px-8 px-2 justify-center flex-col">
          <h1 className="px-4 mx-2 py-2 uppercase tracking-wider border-b-2 border-b-indigo-600 text-3xl font-semibold">
            Available Jobs
          </h1>
          <div className="w-1/2 h-full gap-6 py-4 flex overflow-y-auto items-center justify-center flex-wrap">
            {jobList.length > 0 ? (
              jobList.map((job) => <JobsCard job={job} key={job._id} />)
            ) : (
              <Empty />
            )}
          </div>
        </div>
      )}
    </>
  );
}
