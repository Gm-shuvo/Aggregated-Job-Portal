import Cookies from "js-cookie";

export const check_apply_job = async (id) => {
    console.log("jobId", id);
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/checkapply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({id}), // Send the data as an object with 'id' property
       
      });
      const data = res.json();
      return data;
    } catch (error) {
      console.log("Error in checkApply:", error);
      throw error; // Propagate the error to the calling code
    }
  };

export const delete_apply_job = async (id) => {
  try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job/deleteapply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({id}), // Send the data as an object with 'id' property
    });
    const data = await res.json();
    return data;
  }catch(error){
    console.log("Error in deleteApply:", error);
    throw error; // Propagate the error to the calling code
  }
};