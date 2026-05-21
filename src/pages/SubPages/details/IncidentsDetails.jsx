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
  domainPrefix,
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
        <div className="border flex flex-col my-2 p-4 gap-4 rounded-md border-gray-400">
          <h2 className="text-lg border-b border-black font-semibold pb-2">
            BASIC DETAILS
          </h2>

          <div className="my-2 md:px-10 text-sm items-center font-medium grid gap-4 md:grid-cols-2">
            <div className="grid grid-cols-2 items-center">
              <p>Status:</p>
              <p className="font-normal">{details.status || "-"}</p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Incident Date & Time:</p>
              <p className="font-normal">
                {details.time_and_date
                  ? new Date(details.time_and_date).toLocaleString()
                  : "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Reported By:</p>
              <p className="font-normal">
                {details.created_by_name || "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Building:</p>
              <p className="font-normal">{details.building_name || "-"}</p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Level:</p>
              <p className="font-normal">
                {details.incident_level || "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Severity:</p>
              <p className="font-normal">
                {details.incident_severity || "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Probability:</p>
              <p className="font-normal">{details.probability || "-"}</p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Primary Category:</p>
              <p className="font-normal">
                {details.primary_incident_category || "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Primary Sub Category:</p>
              <p className="font-normal">
                {details.primary_incident_sub_category || "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Primary Sub Sub Category:</p>
              <p className="font-normal">
                {details.primary_incident_sub_sub_category || "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Secondary Category:</p>
              <p className="font-normal">
                {details.secondary_incident_category || "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Secondary Sub Category:</p>
              <p className="font-normal">
                {details.secondary_incident_sub_category || "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Injury Type:</p>

              <p className="font-normal">
                {details.incident_injuries?.length > 0
                  ? details.incident_injuries
                    .map((injury) => injury.injury_type)
                    .join(", ")
                  : "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Support Required:</p>
              <p className="font-normal">
                {details.support_required ? "Yes" : "No"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>First Aid Provided:</p>
              <p className="font-normal">
                {details.first_aid_provided_employee ? "Yes" : "No"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Medical Treatment:</p>
              <p className="font-normal">
                {details.sent_medical_treatment ? "Yes" : "No"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Property Damage:</p>
              <p className="font-normal">
                {details.property_damage ? "Yes" : "No"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Insurance Covered:</p>
              <p className="font-normal">
                {details.damage_coverd_under_insurance ? "Yes" : "No"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>First Aid Attendant:</p>
              <p className="font-normal">
                {details.first_aid_attendant || "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Treatment Facility:</p>
              <p className="font-normal">
                {details.treatment_facility || "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-center">
              <p>Attending Physician:</p>
              <p className="font-normal">
                {details.attending_physician || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* DESCRIPTION DETAILS */}
        <div className="border flex flex-col my-2 p-4 gap-4 rounded-md border-gray-400">
          <h2 className="text-lg border-b border-black font-semibold pb-2">
            DESCRIPTION DETAILS
          </h2>

          <div className="my-2 md:px-10 text-sm items-center font-medium grid gap-4 md:grid-cols-2">
            <div className="grid grid-cols-2 items-start">
              <p>Description:</p>
              <p className="font-normal">{details.description || "-"}</p>
            </div>

            <div className="grid grid-cols-2 items-start">
              <p>RCA:</p>
              <p className="font-normal">{details.rca || "-"}</p>
            </div>

            <div className="grid grid-cols-2 items-start">
              <p>Root Cause Category:</p>
              <p className="font-normal">
                {details.primary_root_cause_category || "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-start">
              <p>Corrective Action:</p>
              <p className="font-normal">
                {details.corrective_action || "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 items-start">
              <p>Preventive Action:</p>
              <p className="font-normal">
                {details.preventive_action || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* INJURIES */}
        <div className="border-2 flex flex-col my-2 p-4 gap-4 rounded-md border-gray-400">
          <h2 className="text-lg font-semibold">
            INJURIES - {details.incident_injuries?.length || 0}
          </h2>

          {details.incident_injuries?.length > 0 ? (
            <div className="grid gap-4">
              {details.incident_injuries.map((injury) => (
                <div
                  key={injury.id}
                  className="border rounded-md p-4 grid md:grid-cols-2 gap-3"
                >
                  <div>
                    <span className="font-semibold">Name:</span>{" "}
                    {injury.name || "-"}
                  </div>

                  <div>
                    <span className="font-semibold">Injury Type:</span>{" "}
                    {injury.injury_type || "-"}
                  </div>

                  <div>
                    <span className="font-semibold">Company:</span>{" "}
                    {injury.company_name || "-"}
                  </div>

                  <div>
                    <span className="font-semibold">Mobile:</span>{" "}
                    {injury.mobile || "-"}
                  </div>

                  <div>
                    <span className="font-semibold">Who Got Injured:</span>{" "}
                    {injury.who_got_injured || "-"}
                  </div>

                  <div>
                    <span className="font-semibold">Lost Time:</span>{" "}
                    {injury.lost_time || "-"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No injuries found</p>
          )}
        </div>

        {/* WITNESSES */}
        <div className="border-2 flex flex-col my-2 p-4 gap-4 rounded-md border-gray-400">
          <h2 className="text-lg font-semibold">
            WITNESSES - {details.witnesses?.length || 0}
          </h2>

          {details.witnesses?.length > 0 ? (
            details.witnesses.map((witness) => (
              <div
                key={witness.id}
                className="border rounded-md p-4 grid md:grid-cols-2 gap-3"
              >
                <div>
                  <span className="font-semibold">Name:</span>{" "}
                  {witness.name}
                </div>

                <div>
                  <span className="font-semibold">Mobile:</span>{" "}
                  {witness.mobile}
                </div>
              </div>
            ))
          ) : (
            <p>No witnesses found</p>
          )}
        </div>

        {/* INVESTIGATION TEAM */}
        <div className="border-2 flex flex-col my-2 p-4 gap-4 rounded-md border-gray-400">
          <h2 className="text-lg font-semibold">
            INVESTIGATION TEAM -{" "}
            {details.investigation_teams?.length || 0}
          </h2>

          {details.investigation_teams?.length > 0 ? (
            details.investigation_teams.map((team) => (
              <div
                key={team.id}
                className="border rounded-md p-4 grid md:grid-cols-2 gap-3"
              >
                <div>
                  <span className="font-semibold">Name:</span> {team.name}
                </div>

                <div>
                  <span className="font-semibold">Mobile:</span>{" "}
                  {team.mobile}
                </div>

                <div>
                  <span className="font-semibold">Designation:</span>{" "}
                  {team.designation}
                </div>
              </div>
            ))
          ) : (
            <p>No investigation team found</p>
          )}
        </div>

        {/* COST DETAILS */}
        <div className="border-2 flex flex-col my-2 p-4 gap-4 rounded-md border-gray-400">
          <h2 className="text-lg font-semibold">COST OF INCIDENT</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">
                Equipment / Property Cost:
              </span>{" "}
              ₹
              {details.cost_of_incident?.equipment_property_cost || 0}
            </div>

            <div>
              <span className="font-semibold">Production Loss:</span> ₹
              {details.cost_of_incident?.production_loss || 0}
            </div>

            <div>
              <span className="font-semibold">Treatment Cost:</span> ₹
              {details.cost_of_incident?.treatment_cost || 0}
            </div>

            <div>
              <span className="font-semibold">Absenteeism Cost:</span> ₹
              {details.cost_of_incident?.absenteeism_cost || 0}
            </div>

            <div>
              <span className="font-semibold">Other Cost:</span> ₹
              {details.cost_of_incident?.other_cost || 0}
            </div>

            <div>
              <span className="font-semibold">Total Cost:</span> ₹
              {details.cost_of_incident?.total_cost || 0}
            </div>
          </div>
        </div>

        {/* ATTACHMENTS */}
        <div className="border-2 flex flex-col my-2 p-4 gap-4 rounded-md border-gray-400">
          <h2 className="text-xl font-semibold">
            Attachments - {details.attachments?.length || 0}
          </h2>

          {details.attachments?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {details.attachments.map((attachment, index) => (
                <div
                  key={attachment.id || index}
                  className="border rounded-md p-2"
                >
                  <img
                    src={`${domainPrefix}${attachment.file_url}`}
                    alt={`attachment-${index}`}
                    className="w-full h-52 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No attachments found</p>
          )}
        </div>

        {/* UPDATE LOGS */}
        <div className="border-2 flex flex-col mb-16 p-4 gap-4 rounded-md border-gray-400">
          <h2 className="text-lg font-semibold">UPDATE LOGS</h2>

          <p className="text-sm text-gray-500">
            No update logs available
          </p>
        </div>
      </div>
    </section>
  );
};

export default IncidentsDetails;
