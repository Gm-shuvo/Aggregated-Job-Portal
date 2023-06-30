import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { delete_apply_job } from "@/Services/job/apply";
import { setAppliedJob } from "@/Utils/AppliedJobSlice";


export default function AppliedJobDataTable() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [Data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const appliedJobData = useSelector((state) => state.AppliedJob?.appliedJob);

  console.log(
    "🚀 ~ file: AppliedJobDataTable.jsx:12 ~ AppliedJobDataTable ~ appliedJobData",
    appliedJobData
  );
  // const [Data, setData] = useState([]);
  // console.log(
  //   "🚀 ~ file: AppliedJobDataTable.jsx:12 ~ AppliedJobDataTable ~ Data:",
  //   Data
  // );

  useEffect(() => {
    setData(appliedJobData);
  }, [appliedJobData]);

  useEffect(() => {
    setFilteredData(Data);
  }, [Data]);

  

  const columns = [
    {
      name: "Apply Date",
      selector: (row) =>
        new Date(`${row?.job?.createdAt}`).toLocaleDateString("en-GB"),
    },
    {
      name: "Company",
      selector: (row) => row?.job?.company_name,
    },
    {
      name: "Job title",
      selector: (row) => row?.job?.job_title,
    },
    {
      name: "Job type",
      selector: (row) => row?.job?.job_level + " | " + row?.job?.job_type,
    },
    {
      name: "Status",
      selector: (row) => (
        <p
          className={`uppercase font-semibold ${
            row?.status === "approved" ? "text-green-500" : ""
          }  ${row?.status === "rejected" ? "text-red-600" : ""}`}
        >
          {row?.status}
        </p>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => handleDelete(row?._id)}
          className="md:px-2 md:py-2 px-1 py-1 text-xl text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600   rounded transition-all duration-700  "
        >
          <AiFillDelete />
        </button>
      ),
    },
    {
      name: "View Detail",
      cell: (row) => (
        <div className="flex items-center space-x-4">
          <button
            onClick={() =>
              router.push(`/frontend/singleJob/${row?.job?._id}?s=JobBit`)
            }
            className="md:px-2 md:py-2 px-1 py-1 text-xs text-indigo-600 hover:text-white my-2 hover:bg-indigo-600 border border-indigo-600   rounded transition-all duration-700  "
          >
            view Detail
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (search === "") {
      setFilteredData(Data);
    } else {
      setFilteredData(
        Data?.filter((item) => {
          const itemData = item?.job?.company_name.toUpperCase();
          const textData = search.toUpperCase();
          return itemData.indexOf(textData) > -1;
        })
      );
    }
  }, [search, Data]);

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Job is not found");
      return;
    }
    try {
      const res = await delete_apply_job(id);
      console.log(
        "🚀 ~ file: AppliedJobDataTable.jsx:43 ~ handleDelete ~ res:",
        res
      );
      if (res.success) {
        toast.success(res.message);
        return dispatch(
          setAppliedJob(filteredData.filter((item) => item?._id !== id))
        );
      } else {
        return toast.error(res.message);
      }
    } catch (err) {
      toast.error(err?.message);
    }
  };

  return (
    <>
      <DataTable
        subHeaderAlign={"right"}
        columns={columns}
        data={filteredData}
        keyField="id"
        pagination
        title={`Total Applied Jobs: ${filteredData?.length}`}
        fixedHeader
        fixedHeaderScrollHeight="79%"
        selectableRows
        selectableRowsHighlight
        subHeader
        persistTableHead
        subHeaderComponent={
          <input
            className="w-60  py-2 px-2  outline-none  border-b-2 border-indigo-600"
            type={"search"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Search with company name..."}
          />
        }
        className="h-screen bg-white"
      />
      <ToastContainer />
    </>
  );
}
