import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../../../components/Navbar";
import { CgNotes } from "react-icons/cg";
import { LiaEdit } from "react-icons/lia";
import { Link } from "react-router-dom";
import { LuCopyCheck } from "react-icons/lu";
function AddSurvey() {
  const themeColor = useSelector((state) => state.theme.color);
  return (
    <div className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="flex flex-col overflow-hidden w-full">
        <h2
          className="text-center text-lg font-bold my-5 p-2 rounded-md text-white mx-10"
          style={{ background: themeColor }}
        >
          Create Survey
        </h2>
        <div className="flex justify-center my-10">
          <div className="grid grid-cols-3 gap-5">
            <div className="border shadow-lg rounded-md p-6 w-[300px] h-[260px]">
              <Link
                to={`/admin/create-scratch-survey`}
                className="flex flex-col space-y-5"
              >
                <span>
                  <LiaEdit className="h-16 w-16 text-gray-400 font-light" />
                </span>
                <h2 className="text-lg font-medium">Start From Scratch</h2>
                <p className="text-start">
                  Begin with a blank survey or form. then add your questions,
                  text and images.
                </p>
              </Link>
            </div>
            <div className="border shadow-lg rounded-md p-6 w-[300px] h-[260px]">
              <Link
                to={`/admin/copy-survey`}
                className="flex flex-col space-y-5"
              >
                <span>
                  <LuCopyCheck className="h-16 w-16 text-gray-400" />
                </span>
                <h2 className="text-lg font-medium">Copy an existing survey</h2>
                <p className="text-start">
                  Choose a survey. Make a copy. Edit as needed
                </p>
              </Link>
            </div>
            <div className="border shadow-lg rounded-md p-6 w-[300px] h-[260px]">
              <Link
                to={`/admin/create-template-survey`}
                className="flex flex-col space-y-5"
              >
                <span>
                  <CgNotes className="h-16 w-16 text-gray-400" />
                </span>
                <h2 className="text-lg font-medium">Pick a popular template</h2>
                <p className="text-start">
                  Ask the right questions and save time with a template built
                  for your situation.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSurvey;
