import React, { useState, useRef, useEffect } from "react";
import AdminHRMS from "./AdminHrms";
import image from "/profile.png";
import EmployeeSections from "./EmployeeSections";
import { FaChevronDown } from "react-icons/fa";
import { getEmployeeDetails } from "../../api";
import { useParams } from "react-router-dom";

const EditEmployeeDirectory = () => {
  const { id } = useParams();
  const inputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const [empDetails, setEmpDetails] = useState({});
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const res = await getEmployeeDetails(id);
        setEmpDetails(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEmployeeDetails();
  }, []);

  return (
    <div className="flex">
      <AdminHRMS />

      <div className=" w-full  p-4 ">
        <h1 className="text-2xl font-semibold mb-4">Employee Directory</h1>

        <div className="bg-white border-gray-400 border-b border-dashed p-2">
          <div className="flex gap-10">
            <div
              onClick={handleImageClick}
              className="cursor-pointer w-64  my-4"
            >
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Uploaded"
                  className="border-4 border-gray-300 rounded-full w-40 h-40 object-cover"
                />
              ) : (
                <img
                  src={image}
                  alt="Default"
                  className="border-4 border-gray-300 rounded-full w-40 h-40 object-cover"
                />
              )}
              <input
                type="file"
                ref={inputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="w-full">
              <div className="flex justify-end gap-2">
                {/* <select
                  name=""
                  id=""
                  className="border p-2 border-black rounded-md"
                >
                  <option value="">Search Employee</option>
                </select> */}
                <div className="relative inline-block text-left">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-end gap-2 justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  >
                    Actions
                    <FaChevronDown />
                  </button>
                </div>{" "}
              </div>
              {isOpen && (
                <div className="origin-top-right absolute right-2 mt-1 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <button>Hold</button>
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {/* Upload Statutory Settings */}
                      <button>Deactivate</button>
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {/* Upload Documents */}
                      <button>Delete Employee</button>
                    </a>
                  </div>
                </div>
              )}

              <h1 className="text-xl font-semibold mb-4">
                {empDetails?.first_name} {empDetails?.last_name}
              </h1>
              <div className="grid grid-cols-2 gap-4 p-2 items-center">
                <div className="grid grid-cols-2 items-center">
                  <p className="font-medium">Joined on :</p>
                  <p className="text-sm font-medium">12-12-2022</p>
                </div>

                <div className="grid grid-cols-2 items-center">
                  <p className="font-medium">Mobile No :</p>
                  <p className="text-sm font-medium">
                    +91-{empDetails?.mobile}
                  </p>
                </div>
                <div className="grid grid-cols-2 items-center">
                  <p className="font-medium">Department:</p>
                  <p className="text-sm font-medium">Marketing</p>
                </div>

                <div className="grid grid-cols-2 items-center">
                  <p className="font-medium">Branch Location:</p>
                  <p className="text-sm font-medium">Mumbai, Maharashtra</p>
                </div>
                <div className="grid grid-cols-2 items-center">
                  <p className="font-medium">Email:</p>
                  <p className="text-sm font-medium">{empDetails.email_id}</p>
                </div>
                <div className="grid grid-cols-2 items-center">
                  <p className="font-medium">Position:</p>
                  <p className="text-sm font-medium">Digital Marketer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeDirectory;
