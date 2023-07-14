import '@/styles/globals.css'
import { store } from '@/Store/store'
import { Provider } from 'react-redux'
import { useRouter } from "next/router";
import 'react-toastify/dist/ReactToastify.css';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import Head from 'next/head';
import NavBar from '@/components/NavBar';




export default function App({
  Component,
  pageProps: { session, ...pageProps },
})
{
  
  const queryClient = new QueryClient()
  const router = useRouter();

  const currentPath = router.pathname;
  console.log(currentPath);

  const titles = {
    
    "/auth/login": "Login",
    "/auth/register": "Signup",
    "/forgot-password": "Forgot Password",
    "/frontend/postAJob": "Post A Job",
    "/frontend/dashboard": "Dashboard",
    "/frontend/displayJobs": "Jobs",
    "/frontend/singleJob/[id]": "Job Details",
    "/frontend/editJob/[id]": "Edit Job",
    "/frontend/applyJob/[id]": "Apply Job",
    "/frontend/detailsPostedJob/[id]": "Details Posted Job",
    "/frontend/editPostedJob/[id]": "Edit Posted Job",
    "/frontend/applicationDetails/[id]": "Application Details",                                            

  }  

  const title = titles[currentPath];
  
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Head>
          <title>{`JobBit | ${title}`}</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <NavBar />
        <Component {...pageProps} />
      </Provider>
    </QueryClientProvider>
  )
}