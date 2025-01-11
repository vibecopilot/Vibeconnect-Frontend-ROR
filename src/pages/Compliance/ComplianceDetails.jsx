import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoDocumentAttach } from "react-icons/io5";
import { LuStamp } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ComplianceAudit from "./ComplianceAudit";
import { GrCertificate } from "react-icons/gr";

const ComplianceDetails = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [modal, setModal] = useState(false);
  return (
    <section className="mb-10">
      <div
        style={{ background: themeColor }}
        className="p-2 text-white font-medium text-lg grid grid-cols-3 items-center "
      >
        <p className="">Contractor Labour Act</p>
        <p className="text-center">STTGDC-Delhi Sarswati Vihar </p>
        <p className="text-right  p-2 rounded-md text-green-500">
          <span className="bg-white p-2 rounded-md">100% Completed</span>
        </p>
      </div>
      <div className="border p-2 rounded-md m-2">
        <h2 className="font-medium border-b text-green-500">
          Attendance or Muster Roll
        </h2>
        <div className="grid grid-cols-3 gap-2 border rounded-md p-2 bg-blue-50 m-2">
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Id :</p>
            <p>59436</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Unit :</p>
            <p>STTGDC-Delhi Sarswati Vihar</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">location :</p>
            <p>Delhi</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Risk :</p>
            <p>High</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Critical :</p>
            <p>No</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Frequency :</p>
            <p>Daily</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Weightage :</p>
            <p>5%</p>
          </div>

          <div className="flex justify-end gap-2 col-span-2">
            <p className="flex justify-end font-medium gap-2 items-center text-right text-green-500">
              <FaCheck /> Complied
            </p>
            <button
              className="bg-white shadow-custom-all-sides rounded-full text-green-400 flex items-center gap-2 font-medium px-4 "
              onClick={() => setModal(true)}
            >
              <LuStamp /> Verify
            </button>
          </div>
        </div>
        <div className="p-2">
          <h2 className="border-b font-medium">Evidence attachments</h2>
          <div className="flex items-center gap-4">
            <p className="flex flex-col gap-2 items-start m-2">
              <IoDocumentAttach className="text-yellow-400" size={40} />
              Attendance_or_Muster_Roll.pdf
            </p>
            <p className="flex flex-col gap-2 items-start m-2">
              <IoDocumentAttach className="text-yellow-400" size={40} />
              Attendance_or_Muster_Roll.pdf
            </p>
          </div>
        </div>
        <div className="border border-black" />
        <h2 className="font-medium border-b text-green-500">
          Commencement Of Contract
        </h2>
        <div className="grid grid-cols-3 gap-2 border rounded-md p-2 bg-blue-50 m-2">
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Id :</p>
            <p>59436</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Unit :</p>
            <p>STTGDC-Delhi Sarswati Vihar</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">location :</p>
            <p>Delhi</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Risk :</p>
            <p>High</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Critical :</p>
            <p>No</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Frequency :</p>
            <p>Monthly</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Weightage :</p>
            <p>10%</p>
          </div>
          <div className="flex justify-end gap-2 col-span-2">
            <p className="flex justify-end font-medium gap-2 items-center text-right text-green-500">
              <FaCheck /> Complied
            </p>
            <button
              className="bg-white shadow-custom-all-sides rounded-full text-green-400 flex items-center gap-2 font-medium px-4 "
              onClick={() => setModal(true)}
            >
              <LuStamp /> Verify
            </button>
          </div>
        </div>
        <div className="p-2">
          <h2 className="border-b font-medium">Evidence attachments</h2>
          <div className="flex items-center gap-4">
            <p className="flex flex-col gap-2 items-start m-2">
              <IoDocumentAttach className="text-yellow-400" size={40} />
              commencement_of_contract.pdf
            </p>
            <p className="flex flex-col gap-2 items-start m-2">
              <IoDocumentAttach className="text-yellow-400" size={40} />
              commencement_of_contract.pdf
            </p>
          </div>
        </div>
        <div className="border border-black" />
        <h2 className="font-medium border-b text-green-500">
          Contract Labour License or Application
        </h2>
        <div className="grid grid-cols-3 gap-2 border rounded-md p-2 bg-blue-50 m-2">
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Id :</p>
            <p>59436</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Unit :</p>
            <p>STTGDC-Delhi Sarswati Vihar</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">location :</p>
            <p>Delhi</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Risk :</p>
            <p>High</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Critical :</p>
            <p>No</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Frequency :</p>
            <p>Weekly</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Weightage :</p>
            <p>10%</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Compliance for :</p>
            <p className="text-green-500 font-medium"></p>
          </div>
          <div className="flex justify-end gap-2 ">
            <p className="flex justify-end font-medium gap-2 items-center text-right">
              Not Applicable
            </p>
          </div>
        </div>
        <div className="p-2">
          <h2 className="border-b font-medium">Evidence attachments</h2>
          <div className="flex items-center gap-4">
            <p className="flex flex-col gap-2 items-start m-2">
              <IoDocumentAttach className="text-yellow-400" size={40} />
              contract_labour_license_or_application.pdf
            </p>
            <p className="flex flex-col gap-2 items-start m-2">
              <IoDocumentAttach className="text-yellow-400" size={40} />
              contract_labour_license_or_application.pdf
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 p-1 border-t mt-1">
        <Link
          to={"/compliance"}
          className="bg-red-400 text-white font-medium p-2 rounded-md  flex items-center gap-2"
        >
          <MdClose />
          Cancel
        </Link>
        <button className="bg-green-400 text-white rounded-md p-2 flex items-center font-medium gap-2">
          <GrCertificate  size={18} /> Generate Certificate
        </button>
      </div>
      {modal && <ComplianceAudit onClose={() => setModal(false)} />}
    </section>
  );
};

export default ComplianceDetails;
