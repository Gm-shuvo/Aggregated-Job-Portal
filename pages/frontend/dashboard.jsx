import AppliedJobDataTable from "@/components/AppliedJobDataTable";
import { Loader } from "@/components/Loader";
import NavBar from "@/components/NavBar";
import SavedJobDataTable from "@/components/SavedJobDataTable";
import { withAuth } from "@/middleware/withAuth";
import { get_my_applied_job } from "@/Services/job";
import { get_book_mark_job } from "@/Services/job/bookmark";
import { setAppliedJob, setBookMark } from "@/Utils/AppliedJobSlice";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsFillBookmarkStarFill } from "react-icons/bs";
import { GiSuitcase } from "react-icons/gi";
import { InfinitySpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

function Dashboard() {
  const [showTable, setShowTable] = useState("appliedJobs");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const activeUser = useSelector((state) => state?.User?.userData);
  const select_get_job = useSelector((state) => state?.AppliedJob?.appliedJob);
  const select_get_bookmarks = useSelector((state) => state?.AppliedJob?.bookMark);
  const id = activeUser?._id;

  useEffect(() => {
    if (activeUser?.type === 'recruiter') {
      router.push('/')
    }
  }, [activeUser, router])

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      setIsLoading(true);

      const [get_job, get_bookmarks] = await Promise.all([
        get_my_applied_job(),
        get_book_mark_job(),
      ]);

      console.log(
        "🚀 ~ file: dashboard.jsx:41 ~ fetchAppliedJobs ~ get_bookmarks:",
        get_bookmarks.data
      );
      console.log(
        "🚀 ~ file: dashboard.jsx:41 ~ fetchAppliedJobs ~ get_job",
        get_job.data
      );

      // get_bookmarks.data?.map((item) => {
      //   if(item?.source === 'LinkedIn') {
      //     const res = await get_linkedin_job()

      if (get_job.success && get_bookmarks.success) {
        dispatch(setAppliedJob(get_job?.data));
        dispatch(setBookMark(get_bookmarks?.data));
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error('Something went wrong!')
        retrun;
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  

  return (
    <>
      {isLoading ? (
      <Loader />
      ) : (
        <>
          
          <div className="w-full h-screen pt-20 flex items-center justify-start flex-col">
            <div className="flex bg-gray-100 flex-wrap items-center justify-center w-full py-2 px-2">
              {/* applied Jobs */}
              <div
                onClick={() => setShowTable("appliedJobs")}
                className="py-2 cursor-pointer border-indigo-600 border-b-2 hover:border-b-4 focus-within:ring-1 ring-indigo-500 px-2 w-60 h-32 rounded mx-2 my-2 bg-white flex items-center justify-center"
              >
                <GiSuitcase className="bg-gray-50 text-indigo-600 rounded-full w-10 h-10" />
                <div className="flex flex-col mx-2 items-start justify-start px-2">
                  <p className="text-xl font-semibold">Total Applied</p>
                  <p className="text-lg font-semibold">{select_get_job.length}</p>
                </div>
              </div>

              {/* applied Jobs */}
              <div
                onClick={() => setShowTable("savedJobs")}
                className="py-2 cursor-pointer border-b-teal-600 hover:border-b-4 border-b-2 px-2 w-60 h-32 rounded mx-2 my-2 bg-white flex items-center justify-center"
              >
                <BsFillBookmarkStarFill className="bg-gray-50 text-indigo-600 rounded-full w-10 h-10" />
                <div className="flex  flex-col items-start mx-2 justify-start px-2 ">
                  <p className="text-xl font-semibold">Save Jobs</p>
                  <p className="text-lg font-semibold">{select_get_bookmarks.length}</p>
                </div>
              </div>

            {/* applied Jobs */}
            </div>
            <div className="w-full h-full px-4 ">
              {showTable === "savedJobs" ? (
                <SavedJobDataTable />
              ) : (
                <AppliedJobDataTable />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default withAuth(Dashboard);
