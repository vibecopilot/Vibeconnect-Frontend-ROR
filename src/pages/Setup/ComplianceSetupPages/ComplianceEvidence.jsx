import React from "react";
import { useSelector } from "react-redux";
import FileInputBox from "../../../containers/Inputs/FileInputBox";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

const ComplianceEvidence = () => {
  const themeColor = useSelector((state) => state.theme.color);
  return (
    <section className="mb-10">
      <div
        style={{ background: themeColor }}
        className="p-2 text-white font-medium text-lg flex justify-between items-center "
      >
        <p>Payment Of Gratuity Act, 1972</p>
      </div>
      {/* <p className="m-2 font-medium text-sm text-gray-400">
        Upload Valid evidence
      </p> */}
      <div className="m-2 flex flex-col gap-2 border rounded-md p-2">
        <div className="border-b border-gray-500 grid grid-cols-3">
          <p className="font-medium ">
            Nomination Form And Updation of Nomination Form
          </p>
          <p className="font-medium text-center">Weightage: 10%</p>
          <p className="font-medium text-right">Mandatory: Yes</p>
        </div>
        <input
          type="text"
          name=""
          id=""
          className="border rounded-md p-2"
          placeholder="Enter Remark"
        />
        <FileInputBox />
      </div>
      <div className="m-2 flex flex-col gap-2 border rounded-md p-2">
        <div className="border-b border-gray-500 grid grid-cols-3">
          <p className="font-medium ">Payment Of Gratuity</p>
          <p className="font-medium text-center">Weightage: 10%</p>
          <p className="font-medium text-right">Mandatory: Yes</p>
        </div>
        <input
          type="text"
          name=""
          id=""
          className="border rounded-md p-2"
          placeholder="Enter Remark"
        />
        <FileInputBox />
      </div>

      <div className="border-t p-1 flex items-center justify-center gap-2">
        <Link
          to={"/compliance/vendor"}
          className="bg-red-400 text-white p-2 flex items-center gap-2 rounded-md"
        >
          <MdClose size={18} /> Cancel
        </Link>
        <Link
          to={"/compliance/vendor"}
          className="bg-green-400 text-white p-2 flex items-center gap-2 rounded-md"
        >
          <FaCheck /> Submit
        </Link>
      </div>
    </section>
  );
};

export default ComplianceEvidence;
