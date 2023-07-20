import NavBar from "@/components/NavBar";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Loader } from "@/components/Loader";
import JobsCard from "@/components/JobsCard";
import Empty from "@/components/Empty";
import useJobsData from "@/hooks/useJobData";

export default function DisplayJobs() {
  // const jobList = useSelector((state) => state?.Job?.JobData) || [];
  const [jobList, setJobList] = useState([]);
  const { jobs, loadMoreJobs, loading, error } = useJobsData();

  console.log("🚀 ~ file: displayJobs.jsx:13 ~ DisplayJobs ~ jobs:", jobs)
  console.log("🚀 ~ DisplayJobs ~ jobList:", jobList);
  console.log("🚀 ~ DisplayJobs ~ loading, error:", loading, error);


  useEffect(() => {
    if (jobs?.length > 0) {
      setJobList(jobs);
    }
  }, []);

  const sentinelRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.8, // Trigger when the sentinel is 80% visible
    };

    const handleIntersection = (entries) => {
      if (entries[0].isIntersecting) {
        console.log("visible");
        setJobList((prev) => [...prev, ...jobs]);
        loadMoreJobs();
      }
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [loadMoreJobs]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full py-20 flex items-center md:px-8 px-2 justify-center flex-col">
          <h1 className="px-4 mx-2 py-2 uppercase tracking-wider border-b-2 border-b-indigo-600 text-3xl font-semibold">
            Available Jobs
          </h1>
          <ul className="w-11/12 md:w-8/12 h-full gap-6 py-4 flex overflow-y-auto items-center justify-center flex-wrap">
            {jobList?.length > 0 ? (
              jobList?.map((job, index) => (
                <React.Fragment key={job?._id}>
                  <JobsCard job={job} />
                  {/* {index === jobList?.length - 3 && <div ref={sentinelRef} />} */}
                </React.Fragment>
              ))
            ) : (
              <Empty />
            )}
          </ul>
          <div ref={sentinelRef} />
        </div>
      )}
    </>
  );
}
