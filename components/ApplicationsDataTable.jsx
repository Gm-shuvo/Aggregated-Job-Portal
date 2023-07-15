import { change_application_status } from "@/Services/job";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { toast } from "react-toastify";

export default function ApplicationsDataTable({ application }) {
  const router = useRouter();

  const [Data, setData] = useState([]);
  console.log("🚀 ~ file: ApplicationsDataTable.jsx:12 ~ ApplicationsDataTable ~ Data:", Data)

  useEffect(() => {
    setData(application);
  }, [application]);

  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(Data);
  }, [Data]);

  const handleStatusChange = async (id, status) => {

    const data = { id, status };
    const res = await change_application_status(data);
    if (res.success) {
      router.reload();
    } else {
      toast.error(res.message);
    }
  };

  

  const optionsTypes = [
    { value: "shortlisted", label: "Short-Listed" },
    { value: "callForInterview", label: "CallFor-Interview" },
    { value: "selected", label: "Selected" },
    { value: "rejected", label: "Rejected" },
  ];


  const defaultValueTypes = useMemo(() => Data[0]?.status, []);

  const handleDownloadCV = async (cvUrl, Name) => {

    try {
      const response = await fetch(cvUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${Name}_cv.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Error in downloading CV:", error);
    }
  };

  const columns = [
    {
      name: "Candidate name",
      selector: (row) => row?.user?.name,
    },
    {
      name: "Email",
      selector: (row) => row?.user?.email,
    },
    {
      name: "Status",
      selector: (row) => (
        <span className="uppercase font-semibold">
          {row?.status ? row?.status : "Not Specified"}
        </span>
      )
    },
    {
      name: "CV",
      selector: (row) => (
        <button
          onClick={() => handleDownloadCV(row?.cv, row?.user?.name)}
          className="w-30 p-2 text-xs text-center text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600 rounded transition-all duration-700"
        >
          Download CV
        </button>
      ),
    },
    
    {
      name: "Action",
      cell: (row) => (
        <div className="flex">
        <Select
        className="w-full flex flex-col items-start justify-center"
        defaultValue={defaultValueTypes}
        value={optionsTypes.find((option) => option.value === row?.status)}
        onChange={(selectedOption) => { handleStatusChange(row?._id, selectedOption.value) }}
        placeholder="Please Select Job Level"
        options={optionsTypes}
      />
        
        <button
          onClick={() =>
            router.push(`/frontend/applicationDetail/${row?._id}`)
          }
          className="w-20 py-2 mx-2 text-xs text-indigo-600 hover:text-white my-2 hover:bg-indigo-600 border border-indigo-600 rounded transition-all duration-700"
        >
          Details
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
          const itemData = item?.user?.name.toUpperCase();
          const textData = search.toUpperCase();
          return itemData.indexOf(textData) > -1;
        })
      );
    }
  }, [search, Data]);

  return (
    <>
      <DataTable
        subHeaderAlign="right"
        columns={columns}
        data={filteredData}
        keyField="id"
        pagination
        title={`Total Applications: ${Data?.length}`}
        fixedHeader
        fixedHeaderScrollHeight="79%"
        selectableRows
        selectableRowsHighlight
        subHeader
        persistTableHead
        subHeaderComponent={
          <input
            className="w-60 py-2 px-2 outline-none border-b-2 border-indigo-600"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search with Applicant name..."
          />
        }
        className="h-screen bg-white"
      />
    </>
  );
}
