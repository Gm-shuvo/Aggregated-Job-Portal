import { get_my_posted_job } from "@/Services/job";
import { setMyJobs } from "@/Utils/JobSlice";
import JobsCard from "@/components/JobsCard";
import { Loader } from "@/components/Loader";
import NavBar from "@/components/NavBar";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withAuth } from "@/middleware/withAuth";

function PostedJobs() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.User?.userData);
  const myJobs = useSelector((state) => state?.Job?.myJobs);

  const id = user?._id;

  const [isLoading, setIsLoading] = useState(false);

  console.log(myJobs);

  useEffect(() => {
    if (user?.type === "candidate") {
      roture.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    const getPostedJobs = async () => {
      try {
        setIsLoading(true);
        const res = await get_my_posted_job(id);

        // console.log(res);

        if (res.success) {
          dispatch(setMyJobs(res?.data));
        }
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    if (id) getPostedJobs();
  },[ router,dispatch, id]);

  


  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          
          <div className="w-full pt-20 flex flex-col items-center ">
            <div className="w-full h-20 bg-gray-50 text-indigo-600 font-bold flex items-center justify-center flex-col">
              <h1 className="text-3xl">Posted Jobs</h1>
            </div>
            <div className="w-1/2 h-full px-4 py-4 grid overflow-y-auto gap-8 flex-wrap">
              {myJobs?.map((job, index) => (
                <JobsCard key={index} border={2} job={job} posted={true} />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default withAuth(PostedJobs);
