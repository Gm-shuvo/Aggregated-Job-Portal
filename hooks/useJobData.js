import { useEffect, useState } from "react";
import { get_job, get_linkedin_job } from "@/Services/job";
import { setJobData } from "@/Utils/JobSlice";
import { useDispatch } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import JobsList from "@/components/ListJobs";

const PAGE_SIZE = 10; // Number of jobs to fetch per page

export default function useJobsData(JobsList) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobData, linkedInData] = await Promise.all([
          get_job(page, PAGE_SIZE),
          get_linkedin_job(page, PAGE_SIZE),
        ]);

        const formattedJobData = [...jobData?.data] || [];
        const formattedLinkedInData = linkedInData?.data || [];
        const combinedJobs = [...formattedJobData, ...formattedLinkedInData];
        console.log("🚀 ~ file: useJobData.js:27 ~ fetchData ~ combinedJobs:", combinedJobs)

        console.log(page)

        // dispatch(setJobData(combinedJobs));
        setJobs(combinedJobs);

        setLoading(false);

        // Check if there are more jobs to fetch
        if (
          formattedJobData.length + formattedLinkedInData.length < PAGE_SIZE
        ) {
          setHasMore(false);
        }
      } catch (error) {
        console.log("Error fetching job data:", error);
        setError(error);
      }
    };

    if (hasMore) {
      fetchData();
    }
  }, [page, hasMore]);

  const loadMoreJobs = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return {
    jobs,
    loading,
    error,
    loadMoreJobs,
  };
}
