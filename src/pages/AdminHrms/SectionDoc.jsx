import React, { useState, useRef, useEffect } from "react";
import EmployeeSections from "./EmployeeSections";
import EditEmployeeDirectory from "./EditEmployeeDirectory";
import Table from "../../components/table/Table";
import { Link, useParams } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { FaDownload } from "react-icons/fa";
import Collapsible from "react-collapsible";
import CustomTrigger from "../../containers/CustomTrigger";
import { AddCircleOutline } from "react-ionicons";
import Modal from "react-modal";
import jsPDF from "jspdf";
import letter from "/letter.jpg";
import aadhar from "/aadhar.jpg";
import birth from "/birth.jpg";
import form16 from "/form16.jpg";
import pancard from "/pan-card.jpg";
import res from "/res.jpg";
import { MdExpandMore, MdExpandLess, MdDescription } from "react-icons/md";
import {
  FaIdCard,
  FaCertificate,
  FaFileContract,
  FaIdBadge,
  FaFileAlt,
} from "react-icons/fa";
import Accordion from "./Components/Accordion";
const documentList = [
  {
    name: "Adhaar Card",
    icon: <FaIdCard />,
    updatedOn: "2024-08-28",
    type: "Document",
    imageUrl: aadhar,
  },
  {
    name: "Birth Certificate",
    icon: <FaCertificate />,
    updatedOn: "2024-08-28",
    type: "Document",
    imageUrl: birth,
  },
  {
    name: "Form 16 ",
    icon: <FaFileContract />,
    updatedOn: "2024-08-28",
    type: "Document",
    imageUrl: form16,
  },
  {
    name: "PAN Card",
    icon: <FaIdBadge />,
    updatedOn: "2024-08-28",
    type: "Document",
    imageUrl: pancard,
  },
  {
    name: "Resume",
    icon: <FaFileAlt />,
    updatedOn: "2024-08-28",
    type: "Document",
    imageUrl: res,
  },
];
const lettersList = [
  {
    name: "Appointment Letter",
    icon: <FaFileAlt />,
    updatedOn: "2024-08-28",
    imageUrl: letter,
  },
];

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

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [addDoc, setAddDoc] = useState(false);
  const openDocs = () => {
    setAddDoc(true);
  };
  const closeDocs = () => {
    setAddDoc(false);
  };
  const openModal = (item) => {
    setCurrentItem(item);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentItem(null);
  };

  const downloadPDF = () => {
    if (!currentItem) return;

    const doc = new jsPDF();
    doc.text(`Name: ${currentItem.name}`, 10, 10);
    doc.text(`Updated On: ${currentItem.updatedOn}`, 10, 20);
    // Add image if necessary
    doc.addImage(currentItem.imageUrl, "PNG", 10, 30, 180, 0);
    doc.save(`${currentItem.name}.pdf`);
  };
  const [addLetter, setAddLetter] = useState(false);
  const openLetter = () => {
    setAddLetter(true);
  };
  const closeLetter = () => {
    setAddLetter(false);
  };

  const [documentsExpanded, setDocumentsExpanded] = useState(true);
  const [lettersExpanded, setLettersExpanded] = useState(false);
  const documentsRef = useRef(null);
  const lettersRef = useRef(null);

  useEffect(() => {
    if (documentsRef.current) {
      documentsRef.current.style.maxHeight = documentsExpanded
        ? `${documentsRef.current.scrollHeight}px`
        : "0px";
    }
  }, [documentsExpanded]);

  useEffect(() => {
    if (lettersRef.current) {
      lettersRef.current.style.maxHeight = lettersExpanded
        ? `${lettersRef.current.scrollHeight}px`
        : "0px";
    }
  }, [lettersExpanded]);

  return (
    <div className="flex flex-col ml-20">
      <EditEmployeeDirectory />

      <div className="flex">
        <div className="">
          <EmployeeSections empId={id} />
        </div>
        <div className="flex flex-col w-full p-2 mb-10">
          <Accordion
            icon={MdDescription}
            title={"Employee Documents"}
            content={
              <div className="border-b border-gray-200 mb-1">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <div className="flex justify-end items-center mb-2">
                    <button className="text-blue-500 px-2 border-2 rounded-full border-blue-500 flex gap-2 items-center p-1 ">
                      <AddCircleOutline onClick={openDocs} /> Add
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documentList.map((doc, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-center cursor-pointer"
                        onClick={() => openModal(doc)}
                      >
                        <div className="text-3xl mb-2 text-blue-600">
                          {doc.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {doc.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Updated On: {doc.updatedOn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          />

          <Accordion
            title="Employee Letters"
            icon={MdDescription}
            content={
              <div className="bg-green-100 p-4 rounded-lg mb-1">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">Employee Letters</h2>
                  <button className="text-blue-500 px-2 border-2 rounded-full border-blue-500 flex gap-2 items-center p-1 ">
                    <AddCircleOutline onClick={openLetter} /> Add
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lettersList.map((letter, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-center cursor-pointer"
                      onClick={() => openModal(letter)}
                    >
                      <div className="text-3xl mb-2 text-green-600">
                        {letter.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {letter.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Updated On: {letter.updatedOn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SectionDoc;
