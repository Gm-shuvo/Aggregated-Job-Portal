import Intro from "@/components/Intro";

import NavBar from "@/components/NavBar";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { setUserToken, setUserData } from "@/Utils/UserSlice";
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
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  useEffect(() => {
    dispatch(
      setUserData(
        localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user"))
          : null
      )
    );
  }, [dispatch]);

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
      <div className="w-full h-screen bg-gray-100  text-black">
        <Intro />
      </div>
    </>
  );
}
