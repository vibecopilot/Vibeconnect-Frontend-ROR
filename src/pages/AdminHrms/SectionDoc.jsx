import React, { useState, useRef } from "react";
import EmployeeSections from "./EmployeeSections";
import EditEmployeeDirectory from "./EditEmployeeDirectory";
import Table from "../../components/table/Table";
import { Link, useParams } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { FaDownload } from "react-icons/fa";
import Collapsible from "react-collapsible";
import CustomTrigger from "../../containers/CustomTrigger";
const SectionDoc = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const column = [
    {
      name: "view",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/grn-detail/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },

    { name: "Fiscal Year", selector: (row) => row.year, sortable: true },
    {
      name: "Total Section-80 C Declarations",
      selector: (row) => row.td,
      sortable: true,
    },
    {
      name: "Total Other Declarations",
      selector: (row) => row.od,
      sortable: true,
    },

    {
      name: "Total Rent Declarations",
      selector: (row) => row.rd,
      sortable: true,
    },
    { name: "Total Perquisites", selector: (row) => row.tp, sortable: true },
    { name: "Total Other Income", selector: (row) => row.ti, sortable: true },
  ];

  const data = [
    {
      year: "2023-2024",
      td: "0",
      od: "0",
      rd: "0",
      tp: "0",
      ti: "0",
    },
  ];

  return (
    <div className="flex flex-col ml-20">
      <EditEmployeeDirectory />

      <div className="flex">
        <div className="">
          <EmployeeSections empId={id} />
        </div>
        <div className="w-full px-4">
          <Collapsible
            readOnly
            trigger={
              <CustomTrigger isOpen={isOpen}>
                <h2 className="text-2xl font-medium ">Employee Documents</h2>
              </CustomTrigger>
            }
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            className="bg-gray-100 my-4 p-2 rounded-md font-bold "
          >
           
          </Collapsible>
          <Collapsible
            readOnly
            trigger={
              <CustomTrigger isOpen={isOpen}>
                <h2 className="text-2xl font-medium ">Employee Letters</h2>
              </CustomTrigger>
            }
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            className="bg-gray-100 my-4 p-2 rounded-md font-bold "
          >
           
          </Collapsible>
        </div>
        
      </div>
    </div>
  );
};

export default SectionDoc;
