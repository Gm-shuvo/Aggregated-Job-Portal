import Intro from "@/components/Intro";

import NavBar from "@/components/NavBar";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

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
  

  return (
    <>
      <div className="w-full h-screen bg-gray-100  text-black">
        <Intro />
      </div>
    </>
  );
}
