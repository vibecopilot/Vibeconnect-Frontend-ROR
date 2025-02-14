import React, { useState, useRef, useEffect } from "react";
import EmployeeSections from "./EmployeeSections";
import EditEmployeeDirectory from "./EditEmployeeDirectory";
import Table from "../../components/table/Table";
import { Link, useParams } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { FaDownload, FaEye, FaTrash } from "react-icons/fa";
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
import {
  deleteEmployeeDocs,
  deleteEmployeeLetters,
  getAdminAccess,
  getEmployeeDocs,
  getEmployeeEsic,
  getEmployeeLetters,
  getFamilyMember,
  hrmsDomain,
  postEmployeeDocs,
  postEmployeeLetters,
  postEsicCard,
  postFamilyEsic,
} from "../../api";
import {
  dateFormat,
  dateFormatSTD,
  dateTimeFormat,
} from "../../utils/dateUtils";
import { IoDocument } from "react-icons/io5";
import toast from "react-hot-toast";
import PdfViewer from "./Components/PdfViewer";
import { getItemInLocalStorage } from "../../utils/localStorage";

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [addDoc, setAddDoc] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    doc: [],
  });

  const [esicModalOpen, setEsicModalOpen] = useState(false);
  const [esicData, setEsicData] = useState({
    esic_number: "",
    photo: [],
  });

  const [familyMember, setFamilyMember] = useState({
    id: "",
    name: "",
    relation: "",
    dateOfBirth: "",
    // gender: "",
    photo: [],
  });

  const [letterData, setLetterData] = useState({
    name: "",
    letters: [],
  });

  const handleFileChange = (e) => {
    const selectedFile = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      doc: selectedFile,
    }));
  };
  const handleLetterChange = (e) => {
    const selectedFile = Array.from(e.target.files);
    setLetterData((prevData) => ({
      ...prevData,
      letters: selectedFile,
    }));
  };

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
  const [lettersModal, setLettersModal] = useState(false);
  const openLetterModal = (item) => {
    setCurrentItem(item);
    setLettersModal(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentItem(null);
  };
  const closeLetterModal = () => {
    setLettersModal(false);
    setCurrentItem(null);
  };

  // const downloadPDF = () => {
  //   if (!currentItem) return;

  //   const doc = new jsPDF();
  //   doc.text(`Name: ${currentItem.document_name}`, 10, 10);
  //   doc.text(`Updated On: ${currentItem.updated_date}`, 10, 20);
  //   doc.addImage(currentItem.document_file, "PNG", 10, 30, 180, 0);
  //   doc.save(`${currentItem.document_name}.pdf`);
  // };
  const [addLetter, setAddLetter] = useState(false);
  const [deleteDocModal, setDeleteDocModal] = useState(false);
  const openLetter = () => {
    setAddLetter(true);
  };
  const closeLetter = () => {
    setAddLetter(false);
  };
  const [documentList, setDocumentList] = useState([]);
  const [lettersList, setLettersList] = useState([]);
  const fetchEmployeeDocs = async () => {
    try {
      const res = await getEmployeeDocs(id);
      setDocumentList(res);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchEmployeeLetters = async () => {
    try {
      const res = await getEmployeeLetters(id);
      setLettersList(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchEmployeeDocs();
    fetchEmployeeLetters();
  }, []);

  const capitalize = (name) => {
    const capital = `${name[0].toUpperCase()}${name.slice(1).toLowerCase()}`;
    return capital;
  };

  const handleAddEmployeeDocs = async () => {
    const postData = new FormData();
    postData.append("document_name", formData.name);
    postData.append("employee", id);
    formData.doc.forEach((file) => {
      postData.append("document_file", file);
    });
    try {
      await postEmployeeDocs(postData);
      fetchEmployeeDocs();
      toast.success(`${formData.name} added in employee document`);
      setAddDoc(false);
      setFormData({ ...formData, name: "", doc: [] });
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddEmployeeLetters = async () => {
    if (!letterData.name) {
      toast.error("Please provide the letter name.");
      return;
    }
    if (!letterData.letters || letterData.letters.length === 0) {
      toast.error("Please upload  document.");
      return;
    }
    const postData = new FormData();
    postData.append("document_name", letterData.name);
    postData.append("employee", id);
    letterData.letters.forEach((file) => {
      postData.append("letter_file", file);
    });
    try {
      await postEmployeeLetters(postData);
      fetchEmployeeLetters();
      toast.success(`${letterData.name} added in employee letters`);
      setAddLetter(false);
      setLetterData({ ...letterData, name: "", letters: [] });
    } catch (error) {
      console.log(error);
    }
  };

  // Esic
  const handleFamilySubmit = async (e) => {
    e.preventDefault();
    try {
      const familyData = {
        "employee": id,
       " esic_record": esicId,
        "family_member_name": familyMember.name,
        "relation": familyMember.relation,
        "date_of_birth": familyMember.dateOfBirth,
        "gender": familyMember.gender,
        "photo": familyMember.photo,
      };
      console.log(getEmployeeEsic(id));
      try {
        const response = await postFamilyEsic(familyData);
        console.log(response);
        toast.success(`${familyMember.name} added as a family member`);
        setFamilyModalOpen(false);
        setFamilyMembers(familyMember);
        // Reset the form
        setFamilyMember({
          name: "",
          relation: "",
          dateOfBirth: "",
          gender: "",
          photo: null,
          esic_record: "",
        });
         fetchFamilyMembers();
      } catch (error) {
        console.error("Error adding family member:", error);
        toast.error("Failed to add family member. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching ESIC data:", error);
      toast.error("Failed to fetch ESIC data. Please try again.");
    }
  };
  // console.log(AddFamily)

  const [docDelId, setDocDelId] = useState("");
  const [letterDelId, setLetterDelId] = useState("");
  const handleDeleteDocModal = async (id) => {
    console.log(id);
    setDocDelId(id);
    setDeleteDocModal(true);
  };
  const handleDeleteLetterModal = async (id) => {
    setLetterDelId(id);
    setDeleteLetter(true);
  };

  const handleDeleteEmployeeDoc = async () => {
    try {
      await deleteEmployeeDocs(docDelId);
      fetchEmployeeDocs();
      setDeleteDocModal(false);
      toast.success("Employee document deleted successfully ");
    } catch (error) {
      console.log(object);
    }
  };
  const [deleteLetter, setDeleteLetter] = useState(false);
  const handleDeleteEmployeeLetter = async () => {
    try {
      await deleteEmployeeLetters(letterDelId);
      fetchEmployeeLetters();
      setDeleteLetter(false);
      toast.success("Employee letter deleted successfully ");
    } catch (error) {
      console.log(object);
    }
  };
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);
  const [esic, setEsic] = useState([]);
  const [esicId, setEsicId] = useState("");
  const fetchEmployeeESICData = async () => {
    try {
      const res = await getEmployeeEsic(id);
      console.log(res);
      const esicData = res.find((item) => item); // Find the first object in the array
      setEsic(res);
      setEsicId(esicData.id);
      console.log(esicId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployeeESICData();
  }, []);

  const empId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
  const orgId = getItemInLocalStorage("HRMSORGID");
  const [roleAccess, setRoleAccess] = useState({});
  useEffect(() => {
    const fetchRoleAccess = async () => {
      try {
        const res = await getAdminAccess(orgId, empId);

        setRoleAccess(res[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoleAccess();
  }, []);

  const [familyModalOpen, setFamilyModalOpen] = useState(false);

  const handleFamilyInputChange = (e) => {
    const { name, value, type } = e.target;
    setFamilyMember((prev) => ({
      ...prev,
      [name]: type === "file" ? e.target.files[0] : value,
    }));
  };

  const handlFamilySubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log(familyMember);
    setFamilyModalOpen(false);
    // Reset the form
    setFamilyMember({
      name: "",
      relation: "",
      dateOfBirth: "",
      gender: "",
      photo: [],
    });
  };

  const handleAddEsicCard = async () => {
    const formData = new FormData();
    formData.append("esic_number", esicData.esic_number);
    formData.append("photo", esicData.photo);
    formData.append("employee_id", id);
    try {
      const response = await postEsicCard(empId, formData);
      console.log(response);
      toast.success("ESIC card added successfully");
      setEsicModalOpen(false);
      setEsicData({
        esic_number: "",
        photo: null,
      });
      fetchEmployeeESICData()
    } catch (error) {
      console.error(error);
      toast.error("Failed to add ESIC card");
    }
  };

  const [familyMembers, setFamilyMembers] = useState([]);
  const fetchFamilyMembers = async () => {
    try {
      const res = await getFamilyMember(id);
      setFamilyMembers(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

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
                  {roleAccess?.can_edit_employee && (
                    <div className="flex justify-end items-center mb-2">
                      <button
                        onClick={openDocs}
                        className="text-blue-500 px-2 border-2 rounded-full border-blue-500 flex gap-2 items-center p-1 "
                      >
                        <AddCircleOutline /> Add
                      </button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documentList.map((doc, index) => (
                      <div
                        key={doc.id}
                        className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-center "
                      >
                        <div className="text-3xl mb-2 text-blue-600">
                          <IoDocument />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {capitalize(doc.document_name)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Updated On: {dateFormat(doc.updated_date)}
                        </p>
                        <div className="flex justify-end w-full ">
                          <a
                            href={hrmsDomain + doc.document_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-blue-400 px-2 hover:bg-yellow-100 border rounded-l-md p-1"
                          >
                            <BsEye />
                          </a>
                          <button
                            className="p-1  px-2 border border-blue-400 rounded-r-md text-red-500 hover:bg-red-100"
                            onClick={() => handleDeleteDocModal(doc.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
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
                <div className="flex justify-end items-center mb-2">
                  {/* <h2 className="text-xl font-semibold">Employee Letters</h2> */}
                  {roleAccess?.can_edit_employee && (
                    <button
                      onClick={openLetter}
                      className="text-green-500 px-2 border-2 rounded-full border-green-500 flex gap-2 items-center p-1 "
                    >
                      <AddCircleOutline /> Add
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lettersList.map((letter, index) => (
                    <div
                      key={letter.id}
                      className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-center "
                      onClick={() => openModal(letter)}
                    >
                      <div className="text-3xl mb-2 text-green-600">
                        <FaFileAlt />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {capitalize(letter?.document_name)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Updated On: {dateFormat(letter?.updated_date)}
                      </p>
                      <div className="flex justify-end w-full ">
                        <button
                          className="border-blue-400 px-2 hover:bg-yellow-100 border rounded-l-md p-1"
                          onClick={() => openLetterModal(doc)}
                        >
                          <BsEye />
                        </button>
                        <a
                          href={hrmsDomain + letter.letter_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-blue-400 px-2 hover:bg-yellow-100 border rounded-l-md p-1"
                        >
                          <BsEye />
                        </a>
                        <button
                          className="p-1  px-2 border border-blue-400 rounded-r-md text-red-500 hover:bg-red-100"
                          onClick={() => handleDeleteLetterModal(letter.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
          <Accordion
            title="Employee ESIC Card"
            icon={MdDescription}
            content={
              <div className="bg-green-100 p-4 rounded-lg mb-1">
                <div className="flex justify-end items-center mb-2">
                  <button
                    onClick={() => setEsicModalOpen(true)}
                    className="text-green-500 px-2 border-2 rounded-full border-green-500 flex gap-2 items-center p-1 "
                  >
                    <AddCircleOutline /> Add
                  </button>
                </div>
                <div className="flex justify-center ">
                  {esic.map((letter, index) => (
                    <div
                      key={letter.id}
                      className="flex flex-col justify-center gap-4 w-full p-4"
                    >
                      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex  justify-between min-w-[30rem]">
                        <div className="grid-cols-2 grid">
                          <p>ESIC No. : </p>
                          <p>{letter.esic_number}</p>
                        </div>
                        <div className="grid-cols-2 grid text-gray-500">
                          <p>Updated at : </p>
                          <p>{dateFormatSTD(letter.updated_at)}</p>
                        </div>
                      </div>
                      <div>
                        <img
                          src={hrmsDomain + letter.photo || "/placeholder.svg"}
                          alt=""
                          className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-center w-auto h-auto max-h-80 max-w-[20rem] object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          />

          <Modal
            isOpen={esicModalOpen}
            onRequestClose={() => setEsicModalOpen(false)}
            className="fixed inset-0 flex flex-col items-center justify-center p-4"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col h-auto max-h-[80vh] overflow-y-auto">
              <h2 className="font-medium text-xl border-b border-gray-300 mb-4">
                Add ESIC Card
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddEsicCard();
                }}
                className="flex flex-col gap-4"
              >
                <input
                  type="text"
                  name="esic_number"
                  value={esicData.esic_number}
                  onChange={(e) =>
                    setEsicData({ ...esicData, esic_number: e.target.value })
                  }
                  placeholder="ESIC Card Number"
                  className="border border-gray-300 p-2 rounded"
                  required
                />
                <input
                  type="file"
                  name="photo"
                  onChange={(e) =>
                    setEsicData({ ...esicData, photo: e.target.files[0] })
                  }
                  className="border border-gray-300 p-2 rounded"
                  accept="image/*"
                  required
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEsicModalOpen(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </Modal>

          <Accordion
            title="ESIC - Add Family "
            icon={MdDescription}
            content={
              <div className="bg-green-100 p-4 rounded-lg mb-1">
                <div className="flex justify-end items-center mb-2">
                  {roleAccess?.can_edit_employee && (
                    <button
                      onClick={() => setFamilyModalOpen(true)}
                      className="text-green-500 px-2 border-2 rounded-full border-green-500 flex gap-2 items-center p-1"
                    >
                      <AddCircleOutline /> Add Family Member
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 my-auto sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.isArray(familyMembers) &&  familyMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-center "
                    >
                      <p className=" text-sm  ml-auto"> Created At :{dateFormatSTD(member.created_at)}</p>
                      {/* <div className="text-3xl mb-2 text-green-600">
                        <FaFileAlt />
                      </div> */}

                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Name :  {member.family_member_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Relation: {member.relation}
                      </p>
                      <p className="text-sm text-gray-500">
                        Date of Birth: {member.date_of_birth}
                      </p>
                      <div className="flex justify-center items-center">
                        <div className="flex flex-col items-center">
                          <img
                            src={
                              hrmsDomain + member.photo || "/placeholder.svg"
                            }
                            alt=""
                            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-center w-full h-full object-cover"
                          />

<div className="flex justify-center items-center mt-2">
  <button
    onClick={() => {
      if (member.photo) {
        const url = hrmsDomain + member.photo;
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `image_${member.id}.jpg`;
            link.click();
            link.remove();
          });
      } else {
        alert("No photo available to download");
      }
    }}
    className="text-green-500 px-2 border-2 rounded-full border-green-500 flex gap-2 items-center p-1"
  >
    <FaDownload /> Download
  </button>
  <button
    onClick={() => {
      if (member.photo) {
        const url = hrmsDomain + member.photo;
        window.open(url, "_blank");
      } else {
        alert("No photo available to view");
      }
    }}
    className="text-green-500 px-2 border-2 rounded-full border-green-500 flex gap-2 items-center p-1 ml-2"
  >
    <FaEye /> View
  </button>
</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
        </div>
      </div>

      <Modal
        isOpen={addDoc}
        onRequestClose={closeDocs}
        contentLabel="add Document "
        className="fixed inset-0 flex flex-col items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col h-auto max-h-[80vh] overflow-y-auto">
          {/* <h2 className="text-2xl font-semibold mb-4">{currentItem?.name}</h2> */}
          <h2 className="font-medium text-xl border-b border-gray-3">
            Add Document
          </h2>
          <div className="flex flex-col gap-3 mt-2 ">
            <div className="flex flex-col gap-2 ">
              <label htmlFor="" className="font-medium">
                Document name
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Document name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="border-2 border-dashed p-2 mt-2 rounded">
              <input type="file" name="" id="" onChange={handleFileChange} />
            </div>
            <div className="flex justify-end w-full gap-2">
              <button
                onClick={handleAddEmployeeDocs}
                className="bg-blue-400 text-white p-1 px-2 w-full rounded-md"
              >
                Save
              </button>
              <button
                className="bg-red-400 text-white p-1 px-2 w-full rounded-md"
                onClick={closeDocs}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={familyModalOpen}
        onRequestClose={() => setFamilyModalOpen(false)}
        className="fixed inset-0 flex flex-col items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col h-auto max-h-[80vh] overflow-y-auto">
          <h2 className="font-medium text-xl border-b border-gray-300 mb-4">
            Add Family Member
          </h2>
          <form onSubmit={handleFamilySubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={familyMember.name}
              onChange={handleFamilyInputChange}
              placeholder="Name"
              className="border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="text"
              name="relation"
              value={familyMember.relation}
              onChange={handleFamilyInputChange}
              placeholder="Relation"
              className="border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="date"
              name="dateOfBirth"
              value={familyMember.dateOfBirth}
              onChange={handleFamilyInputChange}
              className="border border-gray-300 p-2 rounded"
              required
            />
            {/* <select
              name="gender"
              value={familyMember.gender}
              onChange={handleFamilyInputChange}
              className="border border-gray-300 p-2 rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select> */}
            <input
              type="file"
              name="photo"
              onChange={handleFamilyInputChange}
              className="border border-gray-300 p-2 rounded"
              accept="image/*"
              required
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handlFamilySubmit}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={deleteDocModal}
        onRequestClose={() => setDeleteDocModal(true)}
        // contentLabel="add Document "
        className="fixed inset-0 flex flex-col items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col h-auto max-h-[80vh] overflow-y-auto">
          {/* <h2 className="text-2xl font-semibold mb-4">{currentItem?.name}</h2> */}
          <h2 className="font-medium text-xl border-b border-gray-3">
            Delete Document
          </h2>
          <div className="flex flex-col gap-2">
            <p className="font-medium mt-2">
              Are you sure you want to delete this document?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="rounded-full px-4 p-1 bg-green-400 text-white"
                onClick={handleDeleteEmployeeDoc}
              >
                Yes
              </button>
              <button
                className="rounded-full px-4 p-1 bg-red-400 text-white"
                onClick={() => setDeleteDocModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={deleteLetter}
        onRequestClose={() => setDeleteLetter(true)}
        // contentLabel="add Document "
        className="fixed inset-0 flex flex-col items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col h-auto max-h-[80vh] overflow-y-auto">
          {/* <h2 className="text-2xl font-semibold mb-4">{currentItem?.name}</h2> */}
          <h2 className="font-medium text-xl border-b border-gray-3">
            Delete Document
          </h2>
          <div className="flex flex-col gap-2">
            <p className="font-medium mt-2">
              Are you sure you want to delete this Letter?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="rounded-full px-4 p-1 bg-green-400 text-white"
                onClick={handleDeleteEmployeeLetter}
              >
                Yes
              </button>
              <button
                className="rounded-full px-4 p-1 bg-red-400 text-white"
                onClick={() => setDeleteLetter(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SectionDoc;
