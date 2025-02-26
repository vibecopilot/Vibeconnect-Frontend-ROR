import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdAdd, IoMdAddCircleOutline } from "react-icons/io";
import { LuDownload } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import IncidentUpdateModal from "../../../containers/modals/IncidentUpdateModal";
import IncidentInjuryModal from "../../../containers/modals/IncidentInjuryModal";
import {
  getIncidentData,
  updateIncidents,
  getInjured,
  getIncidents,
} from "../../../api";
import { data } from "autoprefixer";
const IncidentsDetails = () => {
  const [modal, showModal] = useState(false);
  const [injurymodal, showInjurymodal] = useState(false);
  const [injured, setInjured] = useState([]);
  const { id } = useParams();
  console.log("id", id);
  const [details, setDetails] = useState({});
  console.log(details);

  useEffect(() => {
    const fetchIncidentsCategory = async () => {
      try {
        const res = await getIncidentData(id);
        setDetails(res.data);
        console.log(details);
      } catch (error) {
        console.log(error);
      }
    };

    fetchIncidentsCategory(id, data);
  }, []);
  const fetchInjured = async () => {
    try {
      const res = await getInjured(id);
      console.log(res, "res");
      setInjured(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInjured();
  }, [id]);
  const handleUpdatedInjurey = () => {
    fetchInjured();
  };

  console.log(id);
  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex gap-2 justify-end my-3  md:flex-row flex-col">
          <Link
            to={`/admin/edit-incidents/${id}`}
            className="font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center rounded-md"
          >
            <BiEdit />
            Edit Details
          </Link>
          <Link
            to=""
            className="font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center rounded-md"
            onClick={() => showModal(true)}
          >
            <FaCheckCircle />
            Update Status
          </Link>
          {modal && (
            <IncidentUpdateModal onclose={() => showModal(false)} id={id} />
          )}
          <Link
            to=""
            className="font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center rounded-md"
            onClick={() => showInjurymodal(true)}
          >
            <IoMdAddCircleOutline />
            Add Injury
          </Link>
          {injurymodal && (
            <IncidentInjuryModal
              onclose={() => showInjurymodal(false)}
              onsave={handleUpdatedInjurey}
            />
          )}
          <Link
            to=""
            className="font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center rounded-md"
          >
            <LuDownload />
            Download Report
          </Link>
        </div>
        <div className="border flex flex-col my-2  p-4 gap-4 rounded-md border-gray-400">
          <h2 className=" text-lg border-black border-b font-semibold ">
            BASIC DETAILS
          </h2>
          <div className="my-2 md:px-10 text-sm items-center font-medium grid gap-4 md:grid-cols-2">
            <div className="grid grid-cols-2 items-center">
              <p>Status:</p>
              <p> {details.status}</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Incident Date and Time: </p>

              <p className="text-sm font-normal ">{details.time_and_date}</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Revision Date and Time:</p>
              <p className="text-sm font-normal "></p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Reporting Date and Time:</p>
              <p className="text-sm font-normal "></p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Reported By:</p>
              <p className="text-sm font-normal ">{details.created_by_name}</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Level:</p>
              <p className="text-sm font-normal ">{details.incident_level}</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Incident Primary Category:</p>
              <p className="text-sm font-normal ">
                {details.primary_incident_category}
              </p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Incident secondary Category:</p>
              <p className="text-sm font-normal ">
                {details.secondary_incident_category}
              </p>
            </div>
            <div className="grid grid-cols-2 items-center">
  <p>Category for the Injury / Illness Incident:</p>
  <p className="text-sm font-normal ">
    {details.incident_injuries && details.incident_injuries.map((injury) => injury.injury_type).join(', ')}
  </p>
</div>
            <div className="grid grid-cols-2 items-center">
              <p>Support Required:</p>
              <p className="text-sm font-normal ">
                {details.support_required ? "Yes" : "No"}
              </p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>First Aid provided by Employees?:</p>
              <p className="text-sm font-normal ">
                <p className="text-sm font-normal ">
                  {details.first_aid_provided_employee ? "Yes" : "No"}
                </p>
              </p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Sent for Medical Treatment:</p>
              <p className="text-sm font-normal ">{details.sent_medical_treatment ? "Yes" : "No"}</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>Has Any Property Damage Happened In The Incident:</p>
              <p className="text-sm font-normal ">
                <p className="text-sm font-normal ">
                  {details.property_damage ? "Yes" : "No"}
                </p>{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="border flex flex-col my-2  p-4 gap-4 rounded-md border-gray-400">
          <h2 className=" text-lg border-black border-b font-semibold ">
            DESCRIPTION DETAILS
          </h2>
          <div className="my-2 md:px-10 text-sm items-center font-medium grid gap-4 md:grid-cols-2">
            <div className="grid grid-cols-2 items-center">
              <p>Description:</p>
              <p className="text-sm font-normal ">{details.description}</p>
            </div>
            <div className="grid grid-cols-2 items-center">
              <p>RCA:</p>
              <p className="text-sm font-normal ">{details.rca}</p>
            </div>
          </div>
        </div>
        <div className="border-2 flex flex-col my-2  p-4 gap-4 rounded-md border-gray-400">
          <h2 className=" text-lg font-semibold ">
            INJURIES -{" "}
            {details.incident_injuries ? details.incident_injuries.length : 0}
          </h2>
          <ul>
            {/* {details.map((injuredPerson) => (
            <li key={injuredPerson.id}>{injuredPerson.name}</li>
          ))} */}
          </ul>
        </div>
        <div className="border-2 flex flex-col-2 my-2  p-4 gap-8 rounded-md border-gray-400">
          <h2 className="text-xl font-semibold">
            Attachments - {details.attachments ? details.attachments.length : 0}
          </h2>
          {details.attachments &&
            details.attachments.map((attachment, index) => (
              <div key={index} className="flex justify-between">
                <p className="text-sm font-normal">{attachment.name}</p>
                {/* <button
        className="font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center rounded-md"
        onClick={() => window.open(attachment.url, '_blank')}
      >
        View
      </button> */}
              </div>
            ))}
        </div>
        <div className="border-2 flex flex-col mb-16  p-4 gap-4 rounded-md border-gray-400">
          <h2 className=" text-lg font-semibold ">UPDATE LOGS</h2>
        </div>
      </div>
    </section>
  );
};

export default IncidentsDetails;
