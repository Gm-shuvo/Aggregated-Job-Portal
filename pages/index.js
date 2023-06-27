import Intro from "@/components/Intro";

import NavBar from "@/components/NavBar";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { setUserToken, setUserData } from "@/Utils/UserSlice";
import { useEffect } from "react";
import Cookies from "js-cookie";

import { Loader } from "@/components/Loader";


// //getserver side props
//  export async function getServerSideProps() {
//   const jobData = await get_job()
//   const LinkedInData = await get_linkedin_job()
//   return {
//     props: {
//       jobData,
//       LinkedInData,

//     }, // will be passed to the page component as props
//   }
// }


export default function Home() {
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  useEffect(() => {
    dispatch(setUserData(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null));
  }, [dispatch])

  useEffect(() => {
    if (token) {
      
      dispatch(setUserToken(token));
    } else {
      localStorage.removeItem("user");
      dispatch(setUserData(null));
    }
  }, [token, dispatch]);

  return (
    <>
    
      <Head>
        <title>Job Poral</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Search and apply for the latest jobs in your field. Explore opportunities from top companies and make your career dreams come true."
        />
        <meta
          name="keywords"
          content="job portal, job search, career opportunities, employment, job listings, job openings, job vacancies, job postings, hiring, recruitment"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://job-portal-teal.vercel.app/" />
        <meta name="author" content="GM-SHUVO" />
        <meta
          property="og:title"
          content="Find Your Dream Job | Job Portal Name"
        />
        <meta
          name="twitter:title"
          content="Find Your Dream Job | Job Portal Name"
        />
        <meta name="language" content="en-US" />
      </Head>
        <>
          <NavBar />
          <div className="w-full h-screen bg-gray-200  text-black">
            <Intro />
          </div>
        </>
    
    </>
  );
}
