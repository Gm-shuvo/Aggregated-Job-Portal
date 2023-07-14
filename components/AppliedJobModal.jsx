import { apply_job } from "@/Services/job";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withAuth } from "@/middleware/withAuth";
import { useEffect, useState } from "react";

function ApplyJob({ id }) {
  const router = useRouter();
  const activeUser = useSelector((state) => state.User?.userData);
  // const [id, setId] = useState('');

  // useEffect(() => {
  //   setId(router.query?.id);
  // }, [router.query?.id]);

  console.log("🚀 ~ file: [id].jsx:9 ~ ApplyJob ~ id", id);

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  // console.log("🚀 ~ file: [id].jsx:17 ~ ApplyJob ~ errors:", errors);

  const [formikData, setFormikData] = useState({
    name: activeUser?.name,
    email: activeUser?.email,
    about: "",
    job: "",
    user: activeUser?._id,
  });

  // console.log("🚀 ~ file: [id].jsx:36 ~ ApplyJob ~ formikData:", formikData);

  // console.log(activeUser);

  useEffect(() => {
    if (activeUser?.type === "recruiter") {
      router.push("/");
    }
  }, []);

  if (id) {
    formikData.job = id;
  }
  const { name, email, about, job, user } = formikData;
  console.log(
    "🚀 ~ file: [id].jsx:44 ~ ApplyJob ~ name, email, about, job, user:",
    name,
    email,
    about,
    job,
    user
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("🚀 ~ file: [id].jsx:39 ~ validateForm ~ e:", validateForm());
    if (!validateForm()) return;

    const form = new FormData();
    form.append("name", name);
    form.append("email", email);
    form.append("about", about);
    form.append("job", job);
    form.append("user", user);
    form.append("cv", file);

    // console.log("🚀 ~ file: [id].jsx:50 ~ handleSubmit ~ form:", form);

    try {
      const res = await apply_job(form);
      // console.log("🚀 ~ file: [id].jsx:54 ~ handleSubmit ~ res:", res);

      if (res.success) {
        window.my_modal_1.close()
        toast.success("Your Application is Submitted, Redirecting...");

        setTimeout(() => {
          router.push("/frontend/dashboard");
        }, 500);
      } else {
        toast.error(res.message);
        router.reload();
      }
    } catch (error) {
      let errorMessage = "Something went wrong";
      if (error.response) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    }

    if (!about) {
      newErrors.about = "About is required";
    }

    if (!job) {
      newErrors.job = "Job is required";
    }

    if (!user) {
      newErrors.user = "Please login to apply";
    }

    if (!file || file.type !== "application/pdf") {
      newErrors.cv = "Please upload a valid PDF file";
    } else if (file.size > 10000000) {
      newErrors.cv = "CV size is too large";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      <form
        method="Dialog"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="modal-box w-full mx-4 my-10 bg-slate-50"
      >
        <div className="w-full mb-8  mt-10 flex flex-col items-start justify-center">
          <button
            className="absolute top-0 right-0 p-4 m-1 bg-transparent border-0 text-black opacity-50 text-3xl leading-none outline-none focus:outline-none"
            onClick={() => window.my_modal_1.close()}
          >
            <span className="bg-transparent text-black opacity-90 h-8 w-8 text-2xl block outline-none focus:outline-black">
              ×
            </span>
          </button>
          <label htmlFor="title" className="mb-1 text-base font-semibold">
            Full name:
          </label>
          <input
            name="name"
            value={name}
            onChange={(e) =>
              setFormikData({ ...formikData, name: e.target.value })
            }
            type="text"
            id="title"
            className="w-full py-2 px-3 mb-2 border focus:border-indigo-600 rounded outline:none"
            placeholder="Enter your Name"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div className="w-full mb-4 flex flex-col items-start justify-center">
          <label htmlFor="email" className="mb-1 text-base font-semibold">
            Email:
          </label>
          <input
            name="email"
            value={email}
            disabled
            type="email"
            id="email"
            className="w-full py-2 px-3 mb-2 border border-indigo-600 rounded"
            placeholder="Enter Email"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div className="w-full mb-4 flex flex-col items-start justify-center">
          <label htmlFor="description" className="mb-1 text-base font-semibold">
            About:
          </label>
          <textarea
            name="about"
            onChange={(e) =>
              setFormikData({ ...formikData, about: e.target.value })
            }
            type="description"
            id="description"
            className="w-full py-2 px-3 mb-2 border border-indigo-600 rounded"
            placeholder="Enter description"
          />
          {errors.about && (
            <p className="text-sm text-red-500">{errors.about}</p>
          )}
        </div>
        <div className="w-full mb-4 flex flex-col items-start justify-center">
          <label htmlFor="file" className="mb-1 text-base font-semibold">
            Upload CV:
          </label>
          <input
            accept="application/pdf"
            name="cv"
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            id="file"
            className="w-full py-2 px-3 mb-2 border border-indigo-600 rounded"
            placeholder="Enter Email"
          />
          {errors.cv && <p className="text-sm text-red-500">{errors.cv}</p>}
        </div>
        <div className="modal-action">
          <button
            type="submit"
            className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500/90 text-white font-semibold tracking-widest"
          >
            Submit
          </button>
        </div>
      </form>

      {/* <ToastContainer /> */}
    </>
  );
}

export default withAuth(ApplyJob);
