
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { edit_post_job, get_specified_job } from "@/Services/job";
import { useRouter } from "next/router";
import { withAuth } from "@/middleware/withAuth";

function EditJobPost() {
  const user = useSelector((state) => state.User.userData);
  console.log(user);

  const router = useRouter();
  const [formData, setFormData] = useState({
    id: router.query.id,
    user: user?._id,
    job_title: "",
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

  useEffect(() => {
    const id = router.query.id;
    const fetchData = async () => {
      const { data } = await get_specified_job(id);
      console.log(data);
      setFormData({
        id: data?._id,
        user: user?._id,
        job_title: data.job_title,
        company_name: data.company_name,
        job_location: data.job_location,
        job_description: data.job_description,
      });
    };
    if (id) fetchData();
  }, [router.query.id]);

  const validateForm = useCallback(() => {
    const errors = {};
    let hasErrors = false;

    if (!formData.job_title) {
      errors.job_title = "Job Title is required";
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
      if (!formData.user) {
        toast.error("Please Login First");
        return;
      }

      console.log(formData);

      if (formData.user && validateForm()) {
        const res = await edit_post_job(formData);
        if (res.success) {
          toast.success(res.message);
          setTimeout(() => {
            router.push(`/frontend/singleJob/${res.data?._id}?s=JobBit`);
          }, 1000);
        } else {
          toast.error(res.message);
          router.reload();
        }
      }
    },
    [formData, validateForm, router]
  );

  return (
    <>
      <div className="w-full py-20 flex items-center justify-center flex-col">
        <h1 className="text-xl mt-4 uppercase tracking-widest border-b-2 border-b-indigo-600 py-2 font-semibold mb-8 md:text-2xl lg:text-4xl">
          Edit Job Post
        </h1>
        <form
          onSubmit={handleSubmit}
          className="sm:w-1/2 w-full px-8 mx-4 h-full bg-indigo-100/80 pt-10 pb-16 border rounded-md shadow-md "
        >
          <div className="w-full mb-4 flex flex-col items-start justify-center">
            <label htmlFor="title" className="mb-1 text-base font-semibold">
              Title:
            </label>
            <input
              className="w-full border-2 border-gray-200 p-3 rounded-md outline-none focus:border-indigo-500"
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
              className="w-full border-2 border-gray-200 p-3 rounded-md outline-none focus:border-indigo-500"
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
              className="w-full border-2 border-gray-200 p-3 rounded-md outline-none focus:border-indigo-500"
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
              value={formData.job_description}
              className="w-full py-2 px-3 mb-2 border-2 border-gray-200 p-3 rounded-md outline-none focus:border-indigo-500"
              placeholder="Enter description of job"
            />
            {formErrors.job_description && (
              <span className="text-sm text-red-500">
                {formErrors.job_description}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-2 rounded bg-indigo-500 hover:bg-indigo-500/90 text-white font-semibold tracking-widest"
          >
            Submit
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default withAuth(EditJobPost);
