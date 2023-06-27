import Cookies from "js-cookie";


export const check_bookmark_job = async (id) => {
  console.log("jobId", id);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/checkbookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ id }), // Send the data as an object with 'id' property
    });

    return res;
  } catch (error) {
    console.log("Error in bookmarkJob:", error);
    throw error; // Propagate the error to the calling code
  }
};

// bookmark job api



export const book_mark_job = async (id) => {
  console.log("jobId", id);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/bookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ id }), // Send the data as an object with 'id' property
    });

    return res;
  } catch (error) {
    console.log("Error in bookmarkJob:", error);
    throw error; // Propagate the error to the calling code
  }
};

// get bookmark job api

export const get_book_mark_job = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/bookmark?id=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    const data = res.json();
    return data;
  } catch (error) {
    console.log("error in getting bookmark job (service) => ", error);
  }
};

// delete bookmark job api

export const delete_book_mark_job = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/bookmark`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(id),
      }
    );
    const data = res.json();
    return data;
  } catch (error) {
    console.log("error in deleting bookmark job (service) => ", error);
  }
};
