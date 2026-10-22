import React, { useEffect, useState } from "react";
import Detail from "../../../containers/Detail";
import {
  domainPrefix,
  getCARItems,
  getComplaintsDetails,
} from "../../../api";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { BiEdit, BiAngry, BiHappy, BiSad, BiSmile } from "react-icons/bi";
import toast from "react-hot-toast";

import {
  MdAddCircleOutline,
  MdOutlineSentimentNeutral,
} from "react-icons/md";

import { useSelector } from "react-redux";
import CARAddItemsModal from "../../../containers/modals/CARAddItemsModal";
import Table from "../../../components/table/Table";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import ApprovalModal from "../../../containers/modals/ApprovalModal";

const TicketDetails = () => {
  const siteId = getItemInLocalStorage("SITEID");
  const userId = getItemInLocalStorage("UserId");

  const { id } = useParams();

  const [approval, setApproval] = useState(false);
  const [ticketinfo, setTicketInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [feat, setFeat] = useState("");

  const themeColor = useSelector((state) => state.theme.color);

  const getAllowedFeatures = () => {
    const storedFeatures = getItemInLocalStorage("FEATURES");

    if (storedFeatures) {
      setFeat(storedFeatures.map((feature) => feature.feature_name));
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getComplaintsDetails(id);
        setTicketInfo(response.data);
      } catch (error) {
        toast.error("Failed to fetch ticket details");
      }
    };

    const fetchCARItems = async () => {
      try {
        const itemsResp = await getCARItems(id);
        setItems(itemsResp.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetails();
    fetchCARItems();
    getAllowedFeatures();
  }, [showModal, id]);

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "-";

    const createdTime = moment(timestamp);
    const now = moment();
    const diff = now.diff(createdTime, "minutes");

    if (diff < 60) {
      return `${diff} minutes ago`;
    } else if (diff < 1440) {
      return `${Math.floor(diff / 60)} hours ago`;
    } else {
      return `${Math.floor(diff / 1440)} days ago`;
    }
  };

  const dateFormat = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const smielyRating = [
    { icon: <BiAngry size={30} />, defaultColor: "red" },
    { icon: <BiSad size={30} />, defaultColor: "orange" },
    { icon: <MdOutlineSentimentNeutral size={30} />, defaultColor: "black" },
    { icon: <BiSmile size={30} />, defaultColor: "grey" },
    { icon: <BiHappy size={30} />, defaultColor: "green" },
  ];

  const ticketDetails = [
    { title: "Site Owner :", description: ticketinfo.responsible_person },
    { title: "Ticket No :", description: ticketinfo.ticket_number },
    { title: "Status :", description: ticketinfo.issue_status },
    { title: "Site :", description: ticketinfo.site_name },
    { title: "Issue Type :", description: ticketinfo.issue_type },
    { title: "Assigned To :", description: ticketinfo.assigned_to },
    { title: "Building Name :", description: ticketinfo.building_name },
    { title: "Category :", description: ticketinfo.category_type },
    { title: "Priority :", description: ticketinfo.priority },
    { title: "Floor Name :", description: ticketinfo.floor_name },
    { title: "Sub Category :", description: ticketinfo.sub_category },
    { title: "Related To :", description: ticketinfo.issue_related_to },
    { title: "Unit :", description: ticketinfo.unit },
    {
      title: "Total Time :",
      description: getTimeAgo(ticketinfo.created_at),
    },
    { title: "Created By :", description: ticketinfo.created_by },
    {
      title: "Created On :",
      description: dateFormat(ticketinfo.created_at),
    },
    {
      title: "Updated On :",
      description: dateFormat(ticketinfo.updated_at),
    },
    {
      title: "Rating :",
      description:
        ticketinfo.rating >= 1 && ticketinfo.rating <= 5 ? (
          <>
            {React.cloneElement(smielyRating[ticketinfo.rating - 1].icon, {
              style: {
                color: smielyRating[ticketinfo.rating - 1].defaultColor,
              },
            })}
          </>
        ) : (
          "-"
        ),
    },
  ];

  const ItemColumn = [
    {
      name: "Name",
      selector: (row) => row.item_name,
      sortable: true,
    },
    {
      name: "Rate",
      selector: (row) => row.rate,
      sortable: true,
    },
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {showModal && (
        <CARAddItemsModal onclose={() => setShowModal(false)} />
      )}

      {approval && (
        <ApprovalModal
          onclose={() => setApproval(false)}
          issueStatusId={ticketinfo.issue_status_id}
        />
      )}

      {/* Top Buttons */}
      <div className="flex justify-end gap-2 mb-4 flex-wrap">
        {feat.includes("items") && (
          <button
            onClick={() => setShowModal(true)}
            className="border border-black flex gap-2 p-2 rounded-md items-center px-4 bg-white hover:bg-gray-100"
          >
            <MdAddCircleOutline />
            Add Items
          </button>
        )}

        <Link
          to={`/edit/${id}`}
          className="border border-black flex gap-2 p-2 rounded-md items-center px-4 bg-white hover:bg-gray-100"
        >
          <BiEdit size={20} />
          Edit
        </Link>
      </div>

      {/* Ticket Details */}
      <div className="bg-white rounded-xl shadow-md p-4 border">
        <Detail
          details={ticketDetails}
          heading={"Ticket Details"}
          title={ticketinfo.heading}
        />
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-xl shadow-md mt-5 p-5 border">
        <h2
          style={{ background: themeColor }}
          className="text-center text-white font-semibold text-lg p-3 rounded-lg shadow-sm"
        >
          Additional Info
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mt-5">
          {[
            { label: "Description", value: ticketinfo.text },
            { label: "Impact", value: ticketinfo.impact },
            { label: "Root Cause", value: ticketinfo.root_cause },
            {
              label: "Corrective Action",
              value: ticketinfo.corrective_action,
            },
            {
              label: "Proactive/Reactive",
              value: ticketinfo.proactive_reactive || "Reactive",
            },
            { label: "Correction", value: ticketinfo.correction },
          ].map((item, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-4">
              <p className="font-semibold mb-2">{item.label}</p>

              <p className="text-sm text-gray-700 break-words">
                {item.value || "-"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Approval */}
      {feat.includes("items") && (
        <div className="mt-5">
          {ticketinfo.territory_manager_id === userId && (
            <div className="flex justify-end mb-4">
              <button
                className="p-2 px-5 rounded-md text-white"
                style={{ background: themeColor }}
                onClick={() => setApproval(true)}
              >
                Approve
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-4 border">
            <h2 className="font-semibold text-lg mb-4">
              Approval Requests
            </h2>

            <Table columns={ItemColumn} data={items} />
          </div>
        </div>
      )}

      {/* Attachments */}
      <div className="mt-5 bg-white rounded-xl shadow-md p-5 border">
        <h2
          style={{ background: themeColor }}
          className="text-center text-white font-semibold text-lg p-3 rounded-lg shadow-sm"
        >
          Attachments
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4">
          {ticketinfo?.documents?.length > 0 ? (
            ticketinfo.documents.map((doc, index) => (
              <div key={index}>
                <a
                  href={doc.document}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={doc.document}
                    alt="Attachment"
                    className="w-full h-52 object-cover rounded-lg border shadow-sm"
                    onError={(e) => {
                      console.log("Image failed:", doc.document);
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=Image+Not+Found";
                    }}
                  />
                </a>
              </div>
            ))
          ) : (
            <p>No Attachments Found</p>
          )}
        </div>
      </div>

      {/* Logs */}
      <div className="mt-5 bg-white rounded-xl shadow-md p-5 border">
        <h2
          style={{ background: themeColor }}
          className="text-center text-white font-semibold text-lg p-3 rounded-lg shadow-sm"
        >
          Logs
        </h2>

        <div className="mt-5">
          {ticketinfo.complaint_logs &&
            ticketinfo.complaint_logs.map((log) => (
              <div className="mb-5" key={log.id}>
                <div className="bg-white border rounded-xl shadow-md p-5">
                  <div className="flex justify-between flex-wrap gap-2 mb-4">
                    <p className="font-semibold text-gray-700">
                      {log.log_by || "-"}
                    </p>

                    <time className="text-sm text-gray-500">
                      {dateFormat(log.created_at)}
                    </time>
                  </div>

                  <div className="space-y-3">
                    {log.priority && (
                      <div>
                        <span className="font-semibold">Priority :</span>{" "}
                        {log.priority}
                      </div>
                    )}

                    {log.log_comment && (
                      <div>
                        <span className="font-semibold">Comment :</span>{" "}
                        {log.log_comment}
                      </div>
                    )}

                    {log.log_status && (
                      <div>
                        <span className="font-semibold">Status :</span>{" "}
                        {log.log_status}
                      </div>
                    )}
                  </div>

                  {/* Log Documents */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                    {log.documents &&
                      log.documents.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.document}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={doc.document}
                            alt={`Attachment ${index}`}
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Escalations */}
      <div className="mt-5 bg-white rounded-xl shadow-md p-5 border mb-10">
        <h2
          style={{ background: themeColor }}
          className="text-center text-white font-semibold text-lg p-3 rounded-lg shadow-sm"
        >
          Escalations
        </h2>

        <div className="mt-5">
          {ticketinfo.escalations &&
            ticketinfo.escalations.map((esclate) => (
              <div
                key={esclate.id}
                className="bg-white rounded-xl shadow-md border p-5 mb-5 flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <p className="font-semibold">Escalation Level :</p>
                    <p>{esclate.level}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <p className="font-semibold">Escalated To :</p>
                    <p>{esclate.esc_to}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-500 font-medium">
                  {dateFormat(esclate.esc_on)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
