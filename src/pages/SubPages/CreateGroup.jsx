import React, { useEffect, useState } from "react";
import image from "/profile.png";
import Select from "react-select";
import { useSelector } from "react-redux";
import { PiPlusCircle } from "react-icons/pi";
import MultiSelect from "../AdminHrms/Components/MultiSelect";
import { getMyHRMSEmployees } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
function CreateGroup({ onclose }) {
  const [formData, setFormData] = useState({
    group: [],
    groupAddMember: [],
    groupRemoveMember: [],
    repeat: false,
  });
  const options = [
    {
      value: "Akshat",
      label: "Akshat",
      email: "akshat.shrawat@vibecopilot.ai",
    },
    { value: "Kunal", label: "Kunal", email: "kunal.sah@vibecopilot.ai" },
    { value: "Anurag", label: "Anurag", email: "anurag.sharma@vibecopilot.ai" },
  ];
  const addMember = [
    {
      value: "karan",
      label: "karan",
      email: "karan.abc@vibecopilot.ai",
    },
    { value: "virat", label: "virat", email: "virat.vit@vibecopilot.ai" },
    { value: "sameer", label: "sameer", email: "sameer.sharma@vibecopilot.ai" },
  ];
  const removeMember = [
    {
      value: "vijay",
      label: "vijay",
      email: "vijay.abc@vibecopilot.ai",
    },
    { value: "vinay", label: "vinay", email: "vinay.vinay@vibecopilot.ai" },
    { value: "sachin", label: "sachin", email: "sachin.sharma@vibecopilot.ai" },
  ];
  const themeColor = useSelector((state) => state.theme.color);
  const [supervisors, setSupervisors] = useState([]);
  const [filteredSupervisors, setFilteredSupervisors] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [editSelectedOptions, setEditSelectedOptions] = useState([]);
  const handleSelectEdit = (option) => {
    if (editSelectedOptions.includes(option)) {
      setEditSelectedOptions(
        editSelectedOptions.filter((item) => item !== option)
      );
    } else {
      setEditSelectedOptions([...editSelectedOptions, option]);
    }
  };
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const res = await getMyHRMSEmployees(hrmsOrgId);

        const employeesList = res.map((emp) => ({
          value: emp.id,
          label: `${emp.first_name} ${emp.last_name}`,
        }));

        setEmployees(employeesList);
        setSupervisors(employeesList);
        setFilteredSupervisors(employeesList);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllEmployees();
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
      <div class="max-h-screen bg-white p-2 w-[40rem] rounded-xl shadow-lg overflow-y-auto">
        <div className="flex flex-col justify-center">
          <div className=" ">
            <h2 className="flex items-center gap-2 justify-center border-b font-medium text-xl ">
              <PiPlusCircle size={20} /> Create Group
            </h2>

            <div className="md:grid grid-cols-2 gap-2 mx-2">
              <div className="flex flex-col my-2 ">
                <label className=" font-medium ">Group Name</label>
                <input
                  type="text"
                  placeholder="Group name"
                  className="border p-2 border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col mt-2 ">
                <MultiSelect
                  options={supervisors}
                  title={"Select members"}
                  handleSelect={handleSelectEdit}
                  // handleSelectAll={handleSelectAll}
                  selectedOptions={editSelectedOptions}
                  setSelectedOptions={setEditSelectedOptions}
                  setOptions={setSupervisors}
                  searchOptions={filteredSupervisors}
                />
              </div>
            </div>
            <div className="flex flex-col mx-2 ">
              <label className=" font-medium ">Description</label>
              <textarea
                name=""
                id=""
                cols="30"
                rows="3"
                className="border p-2 border-gray-300 rounded-md"
              ></textarea>
            </div>
            <div className="flex flex-col m-2 ">
              <label className=" font-medium ">Group profile picture</label>

              <input
                type="file"
                name=""
                id=""
                className="border p-2 border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-center items-center gap-2">
              <button
                className="flex items-center gap-2 bg-green-400 text-white p-2 rounded-full px-4 my-2"
                onClick={() => onclose()}
              >
                <FaCheck /> Create
              </button>
              <button
                className="flex items-center gap-2 bg-red-400 text-white p-2 rounded-full px-4 my-2"
                onClick={() => onclose()}
              >
                <MdClose /> Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;
