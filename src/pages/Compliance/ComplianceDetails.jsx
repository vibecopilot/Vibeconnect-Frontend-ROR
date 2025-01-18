import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoDocumentAttach } from "react-icons/io5";
import { LuStamp } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ComplianceAudit from "./ComplianceAudit";
import { GrCertificate } from "react-icons/gr";
import { getComplianceConfigurationDetails } from "../../api";
import { dateFormat, dateFormatSTD } from "../../utils/dateUtils";

const ComplianceDetails = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [modal, setModal] = useState(false);
  const { id } = useParams();
  const [details, setDetails] = useState({});
  useEffect(() => {
    const fetchComplianceDetails = async () => {
      try {
        const res = await getComplianceConfigurationDetails(id);
        setDetails(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComplianceDetails();
  }, []);
  return (
    <section className="mb-10">
      <div
        style={{ background: themeColor }}
        className="fixed w-full top-0 p-2 text-white font-medium text-lg grid grid-cols-3 items-center "
      >
        <p className="">{details.name}</p>
        <p className="text-center">{details.site_name}</p>
        <div className="flex justify-end">
          <div className="text-right  p-2 rounded-md text-green-500">
            <span className="bg-white p-2 rounded-md">100% Completed</span>
          </div>
          <button className="flex items-center gap-2 bg-violet-400 text-white p-2 rounded-md">
            <GrCertificate /> Generate Certificate
          </button>
        </div>
      </div>
      <div className="border rounded-xl p-2 m-2 bg-gray-50 mt-20">
        <h2 className="font-medium text-lg border-b border-black mb-2">
          Basic Details
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <div className="grid grid-cols-2 gap-1">
            <p className="font-medium">Auditor :</p>
            <p>{details?.reviewer_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="font-medium">Vendor :</p>
            <p>{details?.assign_to_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="font-medium">Frequency :</p>
            <p>{details?.frequency}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="font-medium">Start Date :</p>
            <p>{dateFormatSTD(details?.start_date)}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="font-medium">End Date :</p>
            <p>{dateFormatSTD(details?.end_date)}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="font-medium">Target Days :</p>
            <p>{details?.due_in_days} days</p>
          </div>

          <div className="grid grid-cols-2 gap-1">
            <p className="font-medium">Priority :</p>
            <p>{details?.priority}</p>
          </div>
        </div>
        <h2 className="font-medium text-lg border-b border-black my-2">
          Compliance for
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {details?.compliance_config_tags?.map((category) => (
            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Category :</p>
              <p>{category.compliance_tag_name}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="border-b border-black px-2 font-medium text-lg ">
          Tasks
        </h2>
      </div>
      <div className="border p-2 rounded-xl m-2 flex flex-col gap-2">
        <div className="bg-gray-50 rounded-xl p-2">
          <div className="grid grid-cols-4 border-b">
            <h2 className="font-medium text-green-500">
              Q1. Attendance or Muster Roll
            </h2>
            <p className="text-center font-medium">Weightage : 10%</p>
            <p className="text-right font-medium">Mandatory : Yes</p>
            <p className="flex justify-end font-medium gap-2 items-center text-right text-green-500">
              <FaCheck /> Complied
            </p>
          </div>
          <div className="p-2 bg-blue-50 m-1">
            <h2 className="font-medium border-b mb-1">Answer</h2>
            <p className="bg-violet-100 p-2 rounded-md text-black">
              Remark: Attendance or Muster Roll
            </p>

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
        </div>
        <div className="bg-gray-50 rounded-xl p-2">
          <div className="grid grid-cols-4 border-b">
            <h2 className="font-medium  text-green-500">
              Q1. Attendance or Muster Roll
            </h2>
            <p className="text-center font-medium">Weightage : 10%</p>
            <p className="text-right font-medium">Mandatory : Yes</p>
            <div className="flex justify-end">
              <button
                className="bg-white shadow-custom-all-sides hover:bg-gray-50 rounded-full text-green-400 flex items-center gap-2 font-medium px-4 "
                onClick={() => setModal(true)}
              >
                <LuStamp /> Verify
              </button>
            </div>
          </div>
          <div className="p-2 bg-blue-50 m-1">
            <h2 className="font-medium border-b mb-1">Answer</h2>
            <p className="bg-violet-100 p-2 rounded-md text-black">
              Remark: Attendance or Muster Roll
            </p>
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
        </div>
      </div>

      {modal && <ComplianceAudit onClose={() => setModal(false)} />}
    </section>
  );
};

export default ComplianceDetails;
