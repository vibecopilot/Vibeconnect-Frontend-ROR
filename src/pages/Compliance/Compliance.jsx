import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Table from "../../components/table/Table";
import { useSelector } from "react-redux";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import { Eye } from "react-ionicons";
import { BsEye } from "react-icons/bs";
import { IoFilter } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { getComplianceConfiguration } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";

const Compliance = () => {
  const [filter, setFilter] = useState(false);
  const [compliances, setCompliances] = useState([]);

  const fetchCompliances = async () => {
    try {
      const res = await getComplianceConfiguration();
      const sortedData = res?.data?.sort((a, b) => {
        return b.created_at - a.created_at;
      });
      console.log("sortedData:",sortedData)
      setCompliances(sortedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompliances();
  }, []);

  const columns = [
    {
      name: "View",
      selector: (row) => (
        <div>
          <Link to={`/compliance/compliance-details/${row.id}`}>
            <BsEye />
          </Link>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Site",
      selector: (row) => row.site_name || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "Compliance Name",
      selector: (row) => row.name || "N/A",
      sortable: true,
    },
    {
      name: "Vendor",
      selector: (row) => row.assign_to_name || "N/A",
      sortable: true,
    },
    {
      name: "Auditor",
      selector: (row) => row.reviewer_name|| "N/A",
      sortable: true,
    },
    // {
    //   name: "Category",
    //   selector: (row) => row.category,
    //   sortable: true,
    // },
    {
      name: "Due days",
      selector: (row) => `${row.due_in_days} days` || "N/A",
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) => row.priority || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <div>
          <p
            className={`font-medium ${
              row.status === "100% Completed"
                ? "text-green-500"
                : row.status === "50% Completed"
                ? "text-green-400"
                : row.status === "25% Completed"
                ? " text-yellow-400"
                : row.status === "5% Completed"
                ? "text-orange-400"
                : ""
            }`}
          >
            {row.status}
          </p>
        </div>
      ),
      sortable: true,
    },
    // {
    //   name: "Risk Level",
    //   selector: (row) => row.riskLevel,
    //   sortable: true,
    // },
  ];
 

  const themeColor = useSelector((state) => state.theme.color);
const userType = getItemInLocalStorage("USERTYPE")
  return (
    <section className="flex">
      <Navbar />
      <div className=" w-full flex mx-3 mb-5 flex-col overflow-hidden">
        <div></div>
        <div className="my-2 flex justify-end gap-2">
          {!filter && (
            <button
              className="flex items-center gap-2 bg-yellow-500 p-2 px-4 rounded-md font-medium text-white"
              onClick={() => setFilter(true)}
            >
              <IoFilter /> Filter
            </button>
          )}
         {userType === "pms_admin" && <Link
            to={"/compliance/add-compliance"}
            className="flex items-center gap-2 bg-green-500 p-2 px-4 rounded-md font-medium text-white"
          >
            <PiPlusCircle size={20} /> Add
          </Link>}
        </div>
        {filter && (
          <div className="mb-5 border p-2 rounded-md">
            <div className="grid grid-cols-4 gap-2 ">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Main Company
                </label>
                <select
                  name=""
                  id=""
                  className="border rounded-md border-gray-400 p-2"
                >
                  <option value="">Select Main Company</option>
                  <option value="">Company A</option>
                  <option value="">Company B</option>
                  <option value="">Company C</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Select Unit
                </label>
                <select
                  name=""
                  id=""
                  className="border rounded-md border-gray-400 p-2"
                >
                  <option value="">Select Unit</option>
                  <option value="">Unit A</option>
                  <option value="">Unit B</option>
                  <option value="">Unit C</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Unit
                </label>
                <select
                  name=""
                  id=""
                  className="border rounded-md border-gray-400 p-2"
                >
                  <option value="">Select Unit Type</option>
                  <option value="">Unit Type A</option>
                  <option value="">Unit Type B</option>
                  <option value="">Unit Type C</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  State
                </label>
                <select
                  name=""
                  id=""
                  className="border rounded-md border-gray-400 p-2"
                >
                  <option value="">Select State</option>
                  <option value="">State A</option>
                  <option value="">State Type B</option>
                  <option value="">State C</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Select Location
                </label>
                <select
                  name=""
                  id=""
                  className="border rounded-md border-gray-400 p-2"
                >
                  <option value="">Select Location</option>
                  <option value="">Location A</option>
                  <option value="">Location B</option>
                  <option value="">Location C</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="">Audit Start Date</label>
                <input
                  type="date"
                  name=""
                  id=""
                  className="border rounded-md border-gray-400 p-2"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Audit End Date
                </label>
                <input
                  type="date"
                  name=""
                  id=""
                  className="border rounded-md border-gray-400 p-2"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Audit Month
                </label>
                <input
                  type="month"
                  name=""
                  id=""
                  className="border rounded-md border-gray-400 p-2"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Vendor Category
                </label>
                <select
                  name=""
                  id=""
                  className="border rounded-md border-gray-400 p-2"
                >
                  <option value="">Select vendor Category</option>
                  <option value="">Vendor Category 1</option>
                  <option value="">Vendor Category 2</option>
                  <option value="">Vendor Category 3</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Vendor
                </label>
                <select
                  name=""
                  id=""
                  className="border rounded-md border-gray-400 p-2"
                >
                  <option value="">Select vendor </option>
                  <option value="">Vendor 1</option>
                  <option value="">Vendor 2</option>
                  <option value="">Vendor 3</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Compliance Name
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Compliance Name"
                  className="border rounded-md border-gray-400 p-2"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Display Score Option
                </label>
                <select
                  name=""
                  id=""
                  className="border rounded-md border-gray-400 p-2"
                >
                  <option value="">Select Score option</option>
                  <option value="">Score option 1</option>
                  <option value="">Score option 2</option>
                  <option value="">Score option 3</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Seal submitted audit
                </label>
                <select
                  name=""
                  id=""
                  className="border rounded-md border-gray-400 p-2"
                >
                  <option value="">Select </option>
                  <option value=""> option 1</option>
                  <option value=""> option 2</option>
                  <option value=""> option 3</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Business vertical
                </label>
                <select
                  name=""
                  id=""
                  className="border rounded-md border-gray-400 p-2"
                >
                  <option value="">Select Business vertical</option>
                  <option value="">Vertical option 1</option>
                  <option value="">Vertical option 2</option>
                  <option value="">Vertical option 3</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center gap-2 border-t p-1 mt-1">
              <button
                className="bg-red-500 rounded-md p-2 text-white flex items-center gap-2"
                onClick={() => setFilter(false)}
              >
                <MdClose /> Cancel
              </button>
              <button className="bg-green-500 rounded-md p-2 text-white flex items-center gap-2">
                <IoFilter /> Filter
              </button>
            </div>
          </div>
        )}
        <Table
          columns={columns}
          data={compliances}
          pagination
          responsive
          highlightOnHover
          pointerOnHover
        />
      </div>
    </section>
  );
};

export default Compliance;
