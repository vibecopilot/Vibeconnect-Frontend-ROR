import React, { useEffect, useState } from "react";

import { PiPlusCircle } from "react-icons/pi";
import Table from "../../components/table/Table";
import PayrollSettingDetailsList from "./PayrollSettingDetailsList";
import { GrHelpBook } from "react-icons/gr";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { FaCheck, FaTrash } from "react-icons/fa";
import Select from "react-select";
import {
  deleteFixedAllowance,
  getFixedAllowance,
  postFixedAllowance,
  getHrmsFixedAllowance,
  postHrmsFixedAllowance,
  deleteHrmsFixedAllowance,
  getHrmsFilteredAllowance,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import { BiEdit } from "react-icons/bi";
import EditFixedAllowanceModal from "./Modals/EditFixedAllowanceModal";
import { Pagination } from "antd";

const FixedAllowance = () => {
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const themeColor = useSelector((state) => state.theme.color);
  const listItemStyle = {
    listStyleType: "disc",
    color: "gray",
    fontSize: "14px",
    fontWeight: 500,
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    component_type: "fixed",
    percentage_of_ctc: "0.00",
    value: "0.00",
    organization: hrmsOrgId,
  });

  const options = [
    { value: "new", label: "New Regime" },
    { value: "old", label: "Old Regime" },
  ];
  const handleChangeTaxRegime = (option) => {
    setSelectedOption(option);
    console.log("Selected regime:", option);
  };
  const [fixedAllowances, setFixedAllowances] = useState([]);
  const [filteredFixedAllowances, setFilteredFixedAllowances] = useState([]);
  const columns = [
    {
      name: "Custom Label",
      selector: (row) => row.name,
      sortable: true,
    },
    // {
    //   name: "Type",
    //   selector: (row) => row.component_type,
    //   sortable: true,
    //   cell: (row) => (
    //     <span className={`capitalize ${row.component_type === 'fixed' ? 'text-blue-500' : 'text-green-500'}`}>
    //       {row.component_type}
    //     </span>
    //   )
    // },
    // {
    //   name: "Percentage of CTC",
    //   selector: (row) => row.percentage_of_ctc,
    //   sortable: true,
    //   cell: (row) => `${row.percentage_of_ctc}%`,
    //   sortable:true
    // },
    {
      name: "Value",
      selector: (row) => row.value,
      sortable: true,
      cell: (row) => `₹${parseFloat(row.value).toLocaleString("en-IN")}`,
    },
    // {
    //   name: "PT",
    //   selector: (row) => {
    //     return row.affect_professional_tax ? (
    //       <div>
    //         <FaCheck className="text-green-400" size={18} />
    //       </div>
    //     ) : (
    //       <div>
    //         <MdClose className="text-red-400 font-medium" size={18} />
    //       </div>
    //     );
    //   },
    //   sortable: true,
    // },
    // {
    //   name: "IT",
    //   selector: (row) => {
    //     return row.affect_income_tax ? (
    //       <div>
    //         <FaCheck className="text-green-400" size={18} />
    //       </div>
    //     ) : (
    //       <div>
    //         <MdClose className="text-red-400 font-medium" size={18} />
    //       </div>
    //     );
    //   },
    //   sortable: true,
    // },
    // {
    //   name: "Monthly Tax Exemption Limit",
    //   selector: (row) => row.Comment,
    //   sortable: true,
    // },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button
            className="text-blue-400"
            onClick={() => handleEditModal(row.id)}
          >
            <BiEdit size={18} />{" "}
          </button>
          <button
            className="text-red-400"
            onClick={() => handleDeleteFixedAllowance(row.id)}
          >
            <FaTrash size={18} />
          </button>
        </div>
      ),
    },
  ];
  const [EditId, setEditId] = useState("");
  const handleEditModal = (id) => {
    setIsEditModal(true);
    setEditId(id);
  };

  const handleDeleteFixedAllowance = async (FAId) => {
    try {
      await deleteHrmsFixedAllowance(FAId);
      // fetchFixedAllowance();
      fetchHrmsFixedAllowance();
      toast.success("Fixed Allowance deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  // const fetchFixedAllowance = async () => {
  //   try {
  //     const res = await getFixedAllowance(hrmsOrgId);
  //     setFilteredFixedAllowances(res);
  //     setFixedAllowances(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const [showOnlyFixed, setShowOnlyFixed] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState("");
  const fetchHrmsFixedAllowance = async () => {
    try {
      const res = await getHrmsFilteredAllowance(
        hrmsOrgId,
        "fixed",
        pageNumber + 1,
        searchText
      );
      const results = res?.results;
      const fixedComponents = results.filter(
        (item) => item.component_type === "fixed"
      );
      setFilteredFixedAllowances(fixedComponents);
      setFixedAllowances(results);
      setTotalPages(res?.total_pages);
    } catch (error) {
      console.log("Error get fixed allowance ", error);
    }
  };

  useEffect(() => {
    // fetchFixedAllowance();
    fetchHrmsFixedAllowance();
  }, [pageNumber, searchText]);
  // post data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFixedAllowance = async () => {
    const { name, value } = formData;

    if (!name) {
      toast.error("Please enter a name.");
      return;
    }

    if (!value) {
      toast.error("Please enter a value.");
      return;
    }

    try {
      const postData = {
        name: formData.name,
        component_type: "fixed",
        percentage_of_ctc: formData.percentage_of_ctc || "0.00",
        value: formData.value,
        organization: hrmsOrgId,
      };

      await postHrmsFixedAllowance(postData);
      setModalIsOpen(false);
      toast.success("Fixed Allowance added successfully");
      fetchHrmsFixedAllowance();

      // Reset form
      setFormData({
        name: "",
        component_type: "fixed",
        percentage_of_ctc: "0.00",
        value: "0.00",
        organization: hrmsOrgId,
      });
    } catch (error) {
      console.error("Error adding allowance:", error);
      toast.error("Failed to add fixed allowance");
    }
  };
  return (
    <section className="flex ml-20">
      <PayrollSettingDetailsList />
      <div className="w-2/3 flex m-3 flex-col overflow-hidden">
        <div className="flex justify-between gap-2 my-2">
          <input
            type="text"
            placeholder="Search by name"
            className="border border-gray-400 w-full placeholder:text-sm rounded-lg p-2"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            onClick={openModal}
            style={{ background: themeColor }}
            className="border-2 font-semibold hover:bg-black hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
          >
            <PiPlusCircle size={20} />
            Add
          </button>
        </div>
        <Table
          columns={columns}
          data={filteredFixedAllowances}
          pagination={false}
        />
        {filteredFixedAllowances.length > 0 && (
          <div className={"w-full mt- flex justify-end border rounded-md p-2"}>
            <Pagination
              current={pageNumber + 1}
              total={totalPages * 10}
              pageSize={10}
              onChange={(page) => {
                setPageNumber(page - 1);
              }}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>

      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-black bg-opacity-50">
          <div className="max-h-[100%] bg-white p-8 w-2/3 rounded-lg shadow-lg ">
            <h2 className="text-2xl font-bold border-b mb-2">
              Add New Fixed Allowance
            </h2>
            <div>
              <div className="grid md:grid-cols-2 gap-5 my-5 max-h-96 overflow-y-auto p-1">
                <div className="grid gap-2 items-center w-full">
                  <label className="block mb-1 font-semibold">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.name}
                    onChange={handleChange}
                    name="name"
                    placeholder="Allowance name"
                  />
                </div>

                <div className="grid gap-2 items-center w-full">
                  <label className="block mb-1 font-semibold bg-gray-100 opacity-55">
                    Component Type
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100 opacity-55"
                    value="Fixed"
                    readOnly
                    disabled
                  />
                  <input type="hidden" name="component_type" value="fixed" />
                </div>

                <div className="grid gap-2 items-center w-full">
                  <label className="block mb-1 font-semibold bg-gray-100 opacity-55">
                    Percentage of CTC
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 bg-gray-100 opacity-55 rounded"
                    value={formData.percentage_of_ctc}
                    onChange={handleChange}
                    name="percentage_of_ctc"
                    placeholder="0.00"
                    step="0.01"
                    disabled
                  />
                </div>

                <div className="grid gap-2 items-center w-full">
                  <label className="block mb-1 font-semibold">
                    Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.value}
                    onChange={handleChange}
                    name="value"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="flex mt-2 justify-end gap-2 p-1 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="border-2 font-semibold hover:bg-red-400 hover:text-red-500 hover:bg-opacity-30 flex items-center gap-2 duration-150 transition-all border-red-400 rounded-full p-1 px-3 text-red-400"
                >
                  <MdClose /> Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddFixedAllowance}
                  className="border-2 font-semibold hover:bg-green-400 hover:text-green-500 hover:bg-opacity-30 flex items-center gap-2  duration-150 transition-all border-green-400 rounded-full p-1 px-3 text-green-400"
                >
                  <FaCheck /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditModal && (
        <EditFixedAllowanceModal
          EditId={EditId}
          closeModal={() => setIsEditModal(false)}
          // fetchFixedAllowance={fetchFixedAllowance}
          fetchFixedAllowance={fetchHrmsFixedAllowance}
        />
      )}
      <div className="my-4 mx-2 w-fit">
        <div className="flex flex-col mt-4 mr-2  bg-gray-50 rounded-md text-wrap  gap-4 my-2 py-2 pl-5 pr-2 w-[18rem]">
          <div className="flex  gap-4 font-medium">
            <GrHelpBook size={20} />
            <h2>Help Center</h2>
          </div>
          <div className=" ">
            {/* <p className="font-medium">Help Center</p> */}
            <ul style={listItemStyle} className="flex flex-col gap-2 ">
              <li>
                <ul style={listItemStyle}>
                  <li>
                    You can create fixed allowances like Basic, DA and HRA and
                    so on and configure compliances as per your company
                    requirements.{" "}
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    There are some pre-configured allowances like Basic, HRA,
                    LTA, Medical and Education and Hostel as per income tax and
                    statutory rules.{" "}
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    You can add and manage third party users and invite them to
                    join login to the Vibe Connect software. For e.g., External
                    auditor, external consultants, etc.{" "}
                  </li>
                </ul>
              </li>

              <li>
                <p>
                  {/* <a href="#" className="text-blue-400">
                      Click Here{" "}
                    </a> */}
                  Created allowance can be mapped in Salary details and also
                  configurable in CTC Template (CTC Calculator) available
                  Payroll, which further eases your task by automatically
                  creating a break up in salary details of the employees.{" "}
                </p>
              </li>
              <li>
                <p>
                  {/* <a href="#" className="text-blue-400">
                      Click Here{" "}
                    </a> */}
                  You can select applicable compliances as per norms and there
                  is an option to choose the applicable tax regime also.{" "}
                </p>
              </li>
              <li>
                <p>
                  {/* <a href="#" className="text-blue-400">
                      Click Here{" "}
                    </a> */}
                  These allowance can be with or without linked with attendance
                  or Payable days{" "}
                </p>
              </li>
              <li>
                <p>
                  {/* <a href="#" className="text-blue-400">
                      Click Here{" "}
                    </a> */}
                  You can change allowances setting anytime but once payroll is
                  processed won’t be deleted.{" "}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FixedAllowance;