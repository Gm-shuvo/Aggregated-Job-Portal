import React from "react";
import { useSelector } from "react-redux";
import JobsCard from "@/components/JobsCard";
import Empty from "@/components/Empty";

const JobsList = () => {
  const jobList = useSelector((state) => state?.Job?.jobData) || [];
  console.log(jobList);

  return (
    <div className="w-full h-full gap-6 py-4 flex overflow-y-auto items-center justify-center flex-wrap">
      {jobList.length > 0 ? (
        jobList.map((job) => <JobsCard job={job} key={job._id} />)
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default JobsList;
