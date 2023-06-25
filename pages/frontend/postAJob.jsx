import NavBar from "@/components/NavBar";
import Select from "react-select";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { post_job } from "@/Services/job";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { withAuth } from "@/middleware/withAuth";

const options = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Remote", label: "Remote" },
  { value: "Intern", label: "Intern" },
];

const optionsLevel = [
  { value: "Entry", label: "Entry" },
  { value: "Imtermediate", label: "Imtermediate" },
  { value: "Senior", label: "Senior" },
];

function PostAJob() {
  const user = useSelector((state) => state.User.userData);
  const router = useRouter();
  const [formData, setFormData] = useState({
    user: user?._id,
    job_title: "",
    job_type: "",
    job_level: "",
    company_name: "",
    job_location: "",
    job_description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  

  useEffect(() => {
    if (user?.type === "candidate") {
      router.push("/");
    }
  }, [user, router]);

  const validateForm = useCallback(() => {
    const errors = {};
    let hasErrors = false;

    if (!formData.job_title) {
      errors.job_title = "Job Title is required";
      hasErrors = true;
    }

    if (!formData.job_type) {
      errors.job_type = "Job Type is required";
      hasErrors = true;
    }

    if (!formData.job_level) {
      errors.job_level = "Job Level is required";
      hasErrors = true;
    }

    if (!formData.company_name) {
      errors.company_name = "Company Name is required";
      hasErrors = true;
    }

    if (!formData.job_location) {
      errors.job_location = "Job Location is required";
      hasErrors = true;
    }

    if (!formData.job_description) {
      errors.job_description = "Job Description is required";
      hasErrors = true;
    }

    setFormErrors(errors);
    return !hasErrors;
  }, [formData]);

  
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      
      console.log(formData);

      if (formData.user && validateForm()) {
        const res = await post_job(formData);
        if (res.success) {
          toast.success(res.message);
          setTimeout(() => {
            router.push("/frontend/displayJobs");
          }, 1000);
        } else {
          if(error === 'TokenExpiredError'){
            Cookies.remove("token");
            localStorage.removeItem("user");
            dispatch(setUserData(null));

            router.push('/auth/login');
          }
          toast.error(res.message);
        }
      }

      if (!formData.user) {
        toast.error("Please Login First");
      }
    },
    [formData, validateForm, router]
  );

  const handleJobTypeChange = useCallback((selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : "";
    setFormData((prevFormData) => ({
      ...prevFormData,
      job_type: selectedValue,
    }));
  }, []);

  const defaultValue = useMemo(() => options[0], []);

  const handleJobLevelChange = useCallback((selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : "";
    setFormData((prevFormData) => ({
      ...prevFormData,
      job_level: selectedValue,
    }));
  }, []);

  const defaultValueLevel = useMemo(() => optionsLevel[0], []);

  return (
    <>
      <NavBar />
      <div className="w-full py-20 flex items-center justify-center flex-col">
        <h1 className="text-xl mt-4 uppercase tracking-widest border-b-2 border-b-indigo-600 py-2 font-semibold mb-8 md:text-2xl lg:text-4xl">
          Enter Job Details
        </h1>
        <form
          onSubmit={handleSubmit}
          className="sm:w-1/2 w-full px-4 mx-4 h-full"
        >
          <div className="w-full mb-4 flex flex-col items-start justify-center">
            <label htmlFor="title" className="mb-1 text-base font-semibold">
              Title:
            </label>
            <input
              className="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-indigo-500"
              type="text"
              id="jobTitle"
              value={formData.job_title}
              onChange={(e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  job_title: e.target.value,
                }))
              }
            />
            {formErrors.job_title && (
              <span className="text-sm text-red-500">
                {formErrors.job_title}
              </span>
            )}
          </div>

          <div className="w-full mb-4 flex flex-col items-start justify-center">
            <label
              htmlFor="companyName"
              className="mb-1 text-base font-semibold"
            >
              Company Name:
            </label>
            <input
              className="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-indigo-500"
              type="text"
              id="companyName"
              value={formData.company_name}
              onChange={(e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  company_name: e.target.value,
                }))
              }
            />
            {formErrors.company_name && (
              <span className="text-sm text-red-500">
                {formErrors.company_name}
              </span>
            )}
          </div>

          <div className="w-full mb-4 flex flex-col items-start justify-center">
            <label htmlFor="Location" className="mb-1 text-base font-semibold">
              Job Location:
            </label>
            <input
              className="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-indigo-500"
              type="text"
              id="jobLocation"
              value={formData.job_location}
              onChange={(e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  job_location: e.target.value,
                }))
              }
            />
            {formErrors.job_location && (
              <span className="text-sm text-red-500">
                {formErrors.job_location}
              </span>
            )}
          </div>

          <div className="w-full mb-4 flex flex-col items-start justify-center">
            <label
              htmlFor="description"
              className="mb-1 text-base font-semibold"
            >
              Description:
            </label>
            <textarea
              onChange={(e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  job_description: e.target.value,
                }))
              }
              onResize={(e) => "false"}
              type="text"
              id="description"
              className="w-full py-2 px-3 mb-2 border-2 border-gray-200 p-3 rounded outline-none focus:border-indigo-500"
              placeholder="Enter description of job"
            />
            {formErrors.job_description && (
              <span className="text-sm text-red-500">
                {formErrors.job_description}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between my-2">
            <Select
              className="w-full flex flex-col items-start justify-center"
              defaultValue={defaultValue}
              value={options.find(
                (option) => option.value === formData.job_type
              )}
              onChange={handleJobTypeChange}
              placeholder="Please Select Job type"
              options={options}
            />
            {formErrors.job_type && (
              <span className="text-sm text-red-500">
                {formErrors.job_type}
              </span>
            )}

            <Select
              className="w-full flex flex-col items-start justify-center"
              defaultValue={defaultValueLevel}
              value={optionsLevel.find(
                (option) => option.value === formData.job_level
              )}
              onChange={handleJobLevelChange}
              placeholder="Please Select Job Level"
              options={optionsLevel}
            />
            {formErrors.job_level && (
              <span className="text-sm text-red-500">
                {formErrors.job_level}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 rounded bg-indigo-600 text-white font-semibold tracking-widest"
          >
            Submit
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default withAuth(PostAJob);
