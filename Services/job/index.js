import Cookies from "js-cookie";

import dotenv from 'dotenv';
dotenv.config();


export const post_job = async (formData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/postAJob`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error in post job (service) => ", error);
  }
};

// get job api
export const get_job = async (page = 1) => {
  console.log("page", page);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/db1/getAllJobs?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error in getting job (service) => ", error);
  }
};

//get Linedin job api
export const get_linkedin_job = async (page = 1) => {
  console.log("page", page);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/db2/getAllLinkedInJobs?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error in getting job (service) => ", error);
  }
};

// get specified job api
export const get_specified_job = async (id) => {
  console.log("id", id);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/getSpecifiedJob?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error in getting  specified job (service) => ", error);
  }
};

export const get_specifiedLinkedin_job = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/getSpecifiedLinkedInJob?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error in getting  specified job (service) => ", error);
    throw error;
  }
};

export const get_related_jobs = async (type, level) => {
  console.log("type", type);
  console.log("level", level);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/getRelatedJobs?t=${type}&l=${level}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error in getting  specified job (service) => ", error);
    throw error;
  }
};

export const get_related_jobs_linkedin = async (type, level) => {
  console.log("type", type);
  console.log("level", level);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/getRelatedJobsLinkedIn?t=${type}&l=${level}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error in getting  specified job (service) => ", error);
    throw error;
  }
};

// apply  job api

export const apply_job = async (formData) => {
  
  console.log("🚀 ~ file: index.js:155 ~ constapply_job= ~ formData:", formData)
  
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/applyJob`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = res.json();
    return data;
  } catch (error) {
    console.log("error in apply job (service) => ", error);
  }
};

// get my all applied job api

export const get_my_applied_job = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/getAppliedJobs`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error in getting  getting my all job (service) => ", error);
  }
};

// get my all posted job api

export const get_my_posted_job = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/getPostedJobs?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error in   getting my all job (service) => ", error);
  }
};

// get my all application of specified jobs api

export const get_all_applications = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/getAllApplicationsOfSpecifiedJob?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(
      "error in   getting my all application of specified jobs (service) => ",
      error
    );
  }
};

// change application status api

export const change_application_status = async (formData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/responseOfApplication`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(
      "error in   getting my all application of specified jobs (service) => ",
      error
    );
  }
};

export const get_application_details = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/getApplicationDetail?id=${id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(
      "error in getting my all application of specified jobs (service) => ",
      error
    );
  }
};
