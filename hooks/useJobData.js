import { useEffect, useState } from "react";
import { get_job, get_linkedin_job } from "@/Services/job";
import { setJobData } from "@/Utils/JobSlice";
import { useDispatch } from "react-redux";
import { formatDistanceToNow } from "date-fns";

export default function useJobsData() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobData, linkedInData] = await Promise.all([
          get_job(),
          get_linkedin_job()
        ]);

        const formattedJobData = [...jobData?.data] || [];

        console.log("formattedJobData", formattedJobData);

        // const formattedLinkedInData = linkedInData?.data;

        const formattedLinkedInData = linkedInData?.data || [];

        console.log("formattedLinkedInData", formattedLinkedInData);

        const combinedJobs = [...formattedJobData, ...formattedLinkedInData];

        console.log("combinedJobs", combinedJobs);

        dispatch(setJobData(combinedJobs));
        setLoading(false);
      } catch (error) {
        console.log("Error fetching job data:", error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  return {
    loading,
    error,
  };
}
