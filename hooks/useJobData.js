import { useEffect } from "react";
import useSWR from "swr";
import { get_job, get_linkedin_job } from "@/Services/job";
import { setJobData } from "@/Utils/JobSlice";
import { useDispatch } from "react-redux";
import { formatDistanceToNow } from 'date-fns';

export default function useJobsData() {
  const dispatch = useDispatch();

  const { data: jobData, error: er1, isLoading: load1 } = useSWR("api/db1/getAllJobs", get_job);
  const { data: LinkedInData, error: er2, isLoading: load2 } = useSWR("api/db2/getAllLinkedInJobs", get_linkedin_job);
 
  console.log(jobData)
  
  useEffect(() => {
    if (jobData?.data && LinkedInData?.data) {
      const combinedJobs = [
        ...jobData.data.map(({ createdAt, ...job }) => ({
          ...job,
          job_date: formatDistanceToNow(new Date(createdAt), { addSuffix: true })
        })),
        ...LinkedInData.data
      ];
      dispatch(setJobData(combinedJobs));
    }
  }, [jobData, LinkedInData, dispatch]);

  return {
    loading: load1 || load2,
    error: er1 || er2
  };
}
