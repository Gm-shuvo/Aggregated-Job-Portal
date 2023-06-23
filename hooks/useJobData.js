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

  useEffect(() => {
    if (jobData?.data && LinkedInData?.data) {
      const formattedJobData = jobData.data.map(({ createdAt,job_types,...job }) => {
        const job_type = job_types
        return {
          ...job,
          job_type,
          job_date: formatDistanceToNow(new Date(createdAt), { addSuffix: true })
        };
      });

      const formattedLinkedInData = LinkedInData.data.map(({ job_types, ...job }) => {
        const [job_level,k, job_type] = job_types.split(' ');
        return {
          ...job,
          job_level,
          job_type,
        };
      });

      const combinedJobs = [
        ...formattedJobData,
        ...formattedLinkedInData
      ];

      dispatch(setJobData(combinedJobs));
    }
  }, [jobData, LinkedInData, dispatch]);

  return {
    loading: load1 || load2,
    error: er1 || er2
  };
}
