import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import Table from "../../components/table/Table";
import PayrollSettingDetailsList from "./PayrollSettingDetailsList";
import { GrHelpBook } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import { FaCheck, FaTrash } from "react-icons/fa";
import Select from "react-select";
import {
  deleteVariableAllowance,
  getMyHRMSEmployees,
  getMyOrganizationLocations,
  getMyOrgDepartments,
  getVariableAllowance,
  postVariableAllowance,
  getHrmsFixedAllowance,
  postHrmsFixedAllowance,
  deleteHrmsFixedAllowance,
  getHrmsFilteredAllowance,
} from "../../api";
import { BiEdit } from "react-icons/bi";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import EditVariableAllowanceModal from "./Modals/EditVariableAllowanceModal";
import { Pagination } from "antd";

const VariableAllowance = () => {
  const listItemStyle = {
    listStyleType: "disc",
    color: "black",
    fontSize: "14px",
    fontWeight: 500,
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [VariableAllowance, setVariableAllowance] = useState([]);
  const [filteredVariableAllowances, setFilteredVariableAllowances] = useState(
    []
  );

  const columns = [
    {
      name: "Custom Label",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Percentage of ctc",
      selector: (row) => row.percentage_of_ctc,
      sortable: true,
    },
    {
      name: "Value",
      selector: (row) => row.value,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button
            className="text-blue-400"
            onClick={() => handleEditModal(row.id)}
          >
            <BiEdit size={15} />{" "}
          </button>
          <button
            className="text-red-400"
            onClick={() => handleDeleteFixedAllowance(row.id)}
          >
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  const [editId, setEditId] = useState("");
  const handleEditModal = (id) => {
    setIsEditModal(true);
    setEditId(id);
  };
  const openModal = () => {
    setFormData({
      name: "",
      component_type: "variable",
      percentage_of_ctc: "",
      value: "0",
    });
    setErrors({
      name: false,
      percentage_of_ctc: false,
    });
    setModalIsOpen(true);
  };
  const closeModal = () => setModalIsOpen(false);

  const handleDeleteFixedAllowance = async (VAid) => {
    try {
      await deleteHrmsFixedAllowance(VAid);
      toast.success("Variable Allowance deleted successfully");
      fetchVariableAllowance();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    component_type: "variable",
    percentage_of_ctc: "",
    value: "0",
  });

  const [errors, setErrors] = useState({
    name: false,
    percentage_of_ctc: false,
  });

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === "",
      percentage_of_ctc:
        formData.percentage_of_ctc === "" ||
        isNaN(formData.percentage_of_ctc) ||
        Number(formData.percentage_of_ctc) < 0 ||
        Number(formData.percentage_of_ctc) > 100,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState("");
  const fetchVariableAllowance = async () => {
    try {
      const res = await getHrmsFilteredAllowance(
        hrmsOrgId,
        "variable",
        pageNumber + 1,
        searchText
      );
      const results = res?.results;
      const variableComponent = results.filter(
        (item) => item.component_type === "variable"
      );
      setFilteredVariableAllowances(variableComponent);
      setVariableAllowance(results);
      setTotalPages(res?.total_pages);
    } catch (error) {
      console.log("Error get fixed allowance ", error);
    }
  };

  useEffect(() => {
    // fetchFixedAllowance();
    fetchVariableAllowance();
  }, [pageNumber, searchText]);

  // const fetchVariableAllowance = async () => {
  //   try {
  //     const res = await getHrmsFixedAllowance(hrmsOrgId);
  //     const VariableAllowance = res.filter((item) => item.component_type === "variable");
  //     setFilteredVariableAllowances(VariableAllowance);
  //     setVariableAllowance(VariableAllowance);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchVariableAllowance();
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (value.trim() !== "") {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setErrors({ ...errors, [name]: value.trim() === "" });
    } else if (name === "percentage_of_ctc") {
      setErrors({
        ...errors,
        [name]:
          value === "" ||
          isNaN(value) ||
          Number(value) < 0 ||
          Number(value) > 100,
      });
    }
  };

  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");

  const handleAddVariableAllowance = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    try {
      const postData = new FormData();
      postData.append("name", formData.name.trim());
      postData.append("component_type", formData.component_type);
      postData.append("percentage_of_ctc", formData.percentage_of_ctc);
      postData.append("value", formData.value);
      postData.append("organization", hrmsOrgId);

      await postHrmsFixedAllowance(postData);
      toast.success("Variable Allowance added successfully");
      closeModal();
      fetchVariableAllowance();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add Variable Allowance");
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
            className="border-2 font-semibold hover:bg-black hover:text-white duration-150 transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
          >
            <PiPlusCircle size={20} />
            Add
          </button>
        </div>
        <Table
          columns={columns}
          data={filteredVariableAllowances}
          pagination={false}
        />
        {filteredVariableAllowances.length > 0 && (
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
              Add New Variable Allowance
            </h2>
            <div>
              <div className="grid md:grid-cols-2 gap-5 my-5 max-h-96 overflow-y-auto p-1">
                <div className="grid gap-2 items-center w-full">
                  <label className="block mb-1 font-semibold">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-2 border rounded ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter allowance name"
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      Name is required
                    </p>
                  )}
                </div>

                <div className="grid gap-2 items-center w-full bg-gray-100 opacity-55 ">
                  <label className="block mb-1 font-semibold">
                    Component Type
                  </label>
                  <input
                    type="text"
                    value={formData.component_type}
                    name="component_type"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                    disabled
                  />
                </div>

                <div className="grid gap-2 items-center w-full">
                  <label className="block mb-1 font-semibold">
                    Percentage of CTC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.percentage_of_ctc}
                    name="percentage_of_ctc"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-2 border rounded ${
                      errors.percentage_of_ctc
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter percentage (0-100)"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                  {errors.percentage_of_ctc && (
                    <p className="text-red-500 text-sm mt-1">
                      {formData.percentage_of_ctc === ""
                        ? "Percentage is required"
                        : "Must be between 0 and 100"}
                    </p>
                  )}
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
                  onClick={handleAddVariableAllowance}
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
        <EditVariableAllowanceModal
          EditId={editId}
          closeModal={() => setIsEditModal(false)}
          fetchVariableAllowance={fetchVariableAllowance}
        />
      )}

      <div className="my-4 mx-2 w-fit">
        <div className="flex flex-col mt-4 mr-1 bg-gray-50 rounded-md text-wrap  gap-4 my-2 py-2 pl-5 pr-2 w-[18rem]">
          <div className="flex  gap-4 font-medium">
            <GrHelpBook size={20} />
            <h2>Help Center</h2>
          </div>
          <div className=" ">
            <ul style={listItemStyle} className="flex flex-col gap-2">
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Variable allowances are the one which are not paid every
                    month and tend to vary each month. These include Bonus,
                    Incentives, and Commission and so on.{" "}
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    You can also show the variable allowance in your CTC
                    (Annually) for that you need enable setting in allowance
                    setting i.e. select YES for Does this variable allowance
                    show up in CTC structure? and Select YES for Do you want to
                    automatically process this variable amount in the payroll
                    process? If wish to get paid automatically in respective
                    month automatically.{" "}
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Variable Allowance component can be captured in salary
                    annexure like appointment letter and Increment letter
                    through our letter Generation Module
                    {""}{" "}
                    <a href="#" className="text-blue-400">
                      Click Here{" "}
                    </a>{" "}
                    {""}
                    to know more and {""}
                    <a href="#" className="text-blue-400">
                      Click Here{" "}
                    </a>
                    to see recorded webinar of letter generation{" "}
                  </li>
                </ul>
              </li>
              <li>
                <p>
                  Variable allowance won't have any relation with Attendance or
                  Payable days of the employees.{" "}
                </p>
              </li>
              <li>
                <p>
                  You can change allowances setting anytime but once payroll is
                  processed won't be deleted.{" "}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VariableAllowance;