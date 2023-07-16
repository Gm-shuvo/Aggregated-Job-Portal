import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import useOutsideClick from "@/hooks/useOutsideClick";
import { BiSearchAlt } from "react-icons/bi";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { setUserToken, setUserData } from "@/Utils/UserSlice";
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { RxAvatar as Avatar, RxDashboard } from "react-icons/rx";
import { IoIosLogOut } from "react-icons/io";
import { BsMegaphone } from "react-icons/bs";

export default function NavBar() {
  const dispatch = useDispatch();
  const Router = useRouter();
  const navRef = useRef(null);
  const optionRef = useRef(null);
  const [openJobs, setOpenJobs] = useState(false);

  const currentPath = Router.pathname;
  // console.log("🚀 ~ file: NavBar.jsx:25 ~ NavBar ~ currentPath:", currentPath);

  const user = useSelector((state) => state?.User?.userData);

  // console.log(user?.type);

  const [isOpen, setIsOpen] = useState(false);

  const [scrolled, isScrolled] = useState(false);

  const [isUserOptionsOpen, setIsUserOptionsOpen] = useState(false);

  useEffect(() => {
    const addListener = () => {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
          isScrolled(true);
        } else {
          isScrolled(false);
        }
      });
    };
    addListener();
    return () => {
      addListener();
    };
  }, [scrolled]);


  
  const token = Cookies.get("token");

  useEffect(() => {
    dispatch(
      setUserData(
        localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user"))
          : null
      )
    );
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(setUserToken(token));
    } else {
      localStorage.removeItem("user");
      dispatch(setUserData(null));
    }
  }, []);


  const handleLogout = async () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    dispatch(setUserData(null));
    Router.push("/");
    // Router.reload();
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  const handleUserOptions = () => {
    setIsUserOptionsOpen(false);
  };

  useOutsideClick(navRef, handleClickOutside);
  useOutsideClick(navRef, handleUserOptions);
  return (
    <>
      <div
        className={`w-full ${
          scrolled ? "bg-indigo-600/70" : "bg-indigo-600/90"
        } px-4 md:px-8 h-[64px] py-[10px] md:py-[16px] inset-0 text-white flex items-center justify-between fixed z-50`}
        ref={navRef}
      >
        <div className="px-2 h-full flex items-center justify-center gap-10">
          <Link href={"/"}>
            <p className="uppercase font-semibold tracking-widest text-lg">
              JOB-BIT
            </p>
          </Link>
          {currentPath === "/" && (
            <div className="serach flex items-center justify-center gap-2 text-base">
              <BiSearchAlt size={23} className="active_underline" />
              Search
            </div>
          )}
        </div>
        <div className=" px-2 h-full hidden items-center justify-center lg:flex"></div>
        <div className="px-2 h-full hidden items-center justify-center lg:flex">
          {user?.type === "candidate" && (
            <Link
              href={"/"}
              className="group flex gap-2 items-center px-3 mx-4 hover:underline text-base font-medium "
            >
              <AiOutlinePlusCircle size={20} className="active_underline " />
              Upload your cv
            </Link>
          )}
          {user?.type === "recruiter" && (
            <Link
              href={"/frontend/postAJob"}
              className="flex gap-2 items-center px-3 mx-4 hover:underline text-base font-medium "
            >
              <BsMegaphone size={20} className="active_underline " />
              Post a job
            </Link>
          )}
          <div>
            {user !== null ? (
              <div
                
                className="relative hidden px-3 py-2 border-2 bg-indigo-500 rounded-lg lg:flex items-center cursor-pointer"
                onClick={() => setIsUserOptionsOpen(!isUserOptionsOpen)}
              >
                <Avatar size={22} className=" text-white font-medium " />
                <p className="text-lg px-4 font-semibold">{user?.name}</p>
              </div>
            ) : (
              <>
                <Link
                  href={"/auth/login"}
                  className="py-2 px-3 w-full text-center border border-indigo-200 rounded uppercase tracking-widest mx-4   transition-all duration-700 hover:bg-white font-semibold text-base hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  href={"/auth/register"}
                  className="py-2 px-3 w-full text-center border border-indigo-200 rounded uppercase tracking-widest mx-4   text-indigo-600 bg-indigo-200 transition-all duration-700 hover:bg-transparent font-semibold text-base hover:text-white"
                >
                  REGISTER
                </Link>
              </>
            )}
          </div>
        </div>

        {}
        {user !== null && isUserOptionsOpen && (
          <div  className="hidden lg:flex absolute top-16 right-16 bg-indigo-100/80 text-base text-black rounded shadow-lg w-40  flex-col gap-1">
            <ul  className=" ">
              <li>
                <Link
                  href={'/frontend/profile'}
                  onClick={() => setIsUserOptionsOpen(false)}
                  className="flex items-center px-2 justify-self-start gap-2 py-2 w-full text-center text-base  font-normal uppercase border-b-2 border-b-slate-100 hover:bg-indigo-600/80 hover:text-white transition-all duration-700"
                >
                  <Avatar size={20} />
                  Profile
                </Link>
              </li>
              {user.type === "candidate" ? (
                <li>
                  <Link
                    href={"/frontend/dashboard"}
                    onClick={() => setIsUserOptionsOpen(false)}
                    className="flex items-center px-2 justify-self-start gap-2 py-2 w-full text-center text-base font-normal uppercase border-b-2 border-b-slate-100 hover:bg-indigo-600/80 hover:text-white transition-all duration-700"
                  >
                    <RxDashboard />
                    Dashboard
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    href={"/frontend/postedJob"}
                    onClick={() => setIsUserOptionsOpen(false)}
                    className="flex items-center px-2 justify-selft-start gap-2 py-2 w-full text-center text-base font-normal uppercase border-b-2 border-b-slate-100 hover:bg-indigo-600/80 hover:text-white transition-all duration-700"
                  >
                    <RxDashboard />
                    My Jobs
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href={"/"}
                  onClick={() => {
                    handleLogout();
                    setIsUserOptionsOpen(false);
                  }}
                  className="flex items-center px-2 justify-self-start gap-2 py-2 w-full text-center text-base font-normal uppercase  hover:bg-indigo-600/80 hover:text-white transition-all duration-700"
                >
                  <IoIosLogOut />
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        )}

        <div id="menu" className="flex lg:hidden py-2 ">
          {isOpen ? (
            <AiOutlineClose
              size={25}
              className="text-2xl"
              onClick={() => setIsOpen((state) => !state)}
            />
          ) : (
            <AiOutlineMenu
              size={25}
              className="text-2xl"
              onClick={() => setIsOpen((state) => !state)}
            />
          )}
        </div>

        {isOpen && (
          <div className="flex w-full py-2 animate-fade-in-down  bg-indigo-600  transition-all fade duration-1000 absolute top-16 left-0  items-center justify-center flex-col ">
            <div className="px-2 text-center w-full h-full flex items-center justify-center flex-col py-2">
              <Link
                href={"/"}
                onClick={() => setIsOpen(false)}
                className="w-full hover:bg-indigo-400 px-2 py-2  m-4 text-base font-semibold  uppercase"
              >
                Home
              </Link>
              {user?.type === "recruiter" ? (
                <>
                  <button
                    onClick={() => setOpenJobs((state) => !state)}
                    className="px-3  m-4 text-base font-medium  uppercase flex items-center justify-center gap-2"
                  >
                    Jobs {openJobs ? <AiFillCaretUp /> : <AiFillCaretDown />}{" "}
                  </button>

                  {openJobs && (
                    <div className="w-full flex items-center justify-center flex-col gap-2 ">
                      <Link
                        href={"/frontend/displayJobs"}
                        onClick={() => setIsOpen(false)}
                        className="w-full py-2 hover:bg-indigo-400 outline-none px-2 rounded text-center uppercase font-semibold"
                      >
                        View Jobs
                      </Link>
                      <Link
                        href={"/frontend/postAJob"}
                        onClick={() => setIsOpen(false)}
                        className="w-full py-2 hover:bg-indigo-400 outline-none px-2 rounded text-center uppercase font-semibold"
                      >
                        Post Jobs
                      </Link>
                      <Link
                        href={"/frontend/postedJob"}
                        onClick={() => setIsOpen(false)}
                        className="w-full py-2 hover:bg-indigo-400 outline-none px-2 rounded text-center uppercase font-semibold"
                      >
                        My Jobs
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full flex text-center items-center justify-center flex-col gap-2">
                  <Link
                    href={"/frontend/displayJobs"}
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 hover:bg-indigo-400 outline-none px-2 rounded text-center uppercase font-semibold"
                  >
                    View Jobs
                  </Link>

                  {user?.type === "candidate" && (
                    <Link
                      href={"/frontend/dashboard"}
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2 hover:bg-indigo-400 outline-none px-2 rounded text-center uppercase font-semibold"
                    >
                      Dashboard
                    </Link>
                  )}
                </div>
              )}
            </div>
            <div className="px-2 h-full mt-3  items-center justify-center flex">
              {user !== null ? (
                <>
                  <p className="text-lg px-4 font-semibold">{user?.name}</p>
                  <IoIosLogOut
                    onClick={handleLogout}
                    className=" cursor-pointer text-3xl hover:text-red-500 transition-all duration-700"
                  />
                </>
              ) : (
                <>
                  <Link
                    href={"/auth/login"}
                    className="py-2 px-3 w-full text-center border border-indigo-200 rounded uppercase tracking-widest mx-4   transition-all duration-700 hover:bg-indigo-200 font-semibold text-base hover:text-indigo-600"
                  >
                    Login
                  </Link>
                  <Link
                    href={"/auth/register"}
                    className="py-2 px-3 w-full text-center border border-indigo-200 rounded uppercase tracking-widest mx-4   text-indigo-600 bg-indigo-200 transition-all duration-700 hover:bg-transparent font-semibold text-base hover:text-white"
                  >
                    REGISTER
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
