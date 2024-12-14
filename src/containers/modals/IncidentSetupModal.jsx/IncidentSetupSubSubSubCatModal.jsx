import React from "react";
import ModalWrapper from "../ModalWrapper";
import { BiEditAlt } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

const SubSubSubCategorySetupModal = ({ onclose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
      <div className="bg-white overflow-auto max-h-[70%] md:w-auto min-w-96 p-4 flex flex-col rounded-xl gap-5">
        <div className="flex flex-col w-full justify-center">
          <h2 className="flex gap-2 items-center justify-center font-bold text-lg ">
            <BiEditAlt /> Edit Incident Sub Sub Sub Category
          </h2>
          <div className="border-t-2 border-black">
            <div className="grid grid-cols-2 gap-2 my-2">
              <select
                name=""
                id=""
                className="border p-2 border-gray-500 rounded-md w-full"
              >
                <option value="">Select Category</option>
                <option value="">Health and Safety</option>
                <option value="">Fire</option>
                <option value="">Near Miss/Good Catch</option>
              </select>
              <select
                name=""
                id=""
                className="border p-2 border-gray-500 rounded-md w-full"
              >
                <option value="">Select Sub Category</option>
              </select>
              <select
                name=""
                id=""
                className="border p-2 border-gray-500 rounded-md w-full"
              >
                <option value="">Select Sub Sub Category</option>
              </select>
              <input
                type="text"
                name=""
                id=""
                placeholder="Sub Sub Sub Category"
                className="border p-2 border-gray-500 rounded-md w-full"
              ></input>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 mt-2 border-t p-1">
            <button
              className="bg-red-500 flex items-center gap-2 font-medium text-white rounded-md p-2 px-4 "
              onClick={onclose}
            >
              <MdClose /> Cancel
            </button>
            <button className="bg-green-500 flex items-center gap-2 font-medium text-white rounded-md px-4 p-2 ">
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubSubSubCategorySetupModal;
