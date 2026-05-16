import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { FaCheck, FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiPlusCircle } from "react-icons/pi";
import Table from "../../../components/table/Table";
import { getItemInLocalStorage } from "../../../utils/localStorage";

import {
  getIncidentTags,
  postIncidentTags,
  updateIncidentTag,
  deleteIncidentTag,
} from "../../../api";

import toast from "react-hot-toast";

const IncidenceStatusSetup = () => {
  const [statuses, setStatuses] = useState([]);

  const [addStatus, setAddStatus] = useState(false);

  const [status, setStatus] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  const companyId = getItemInLocalStorage("COMPANYID");

  const fetchIncidentStatus = async () => {
    try {
      const res = await getIncidentTags("IncidentStatus");

      if (Array.isArray(res.data)) {
        setStatuses(res.data);
      } else if (res.data?.data) {
        setStatuses(res.data.data);
      } else {
        setStatuses([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch statuses");
    }
  };

  useEffect(() => {
    fetchIncidentStatus();
  }, []);

  const handleAddStatus = async () => {
    if (!status.trim()) {
      toast.error("Please enter status");
      return;
    }

    const payload = {
      name: status,
      active: true,
      tag_type: "IncidentStatus",
      resource_id: companyId,
      resource_type: "Pms::CompanySetup",
    };

    try {
      await postIncidentTags(payload);

      toast.success("Incident Status Created Successfully!");

      fetchIncidentStatus();

      setStatus("");
      setAddStatus(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create status");
    }
  };

  const handleEditClick = (row) => {
    setEditId(row.id);
    setEditStatus(row.name);

    setShowEditModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!editStatus.trim()) {
      toast.error("Please enter status");
      return;
    }

    const payload = {
      name: editStatus,
      active: true,
      tag_type: "IncidentStatus",
      resource_id: companyId,
      resource_type: "Pms::CompanySetup",
    };

    try {
      await updateIncidentTag(editId, payload);

      toast.success("Incident Status Updated Successfully!");

      fetchIncidentStatus();

      setShowEditModal(false);

      setEditId(null);
      setEditStatus("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this status?"
    );

    if (!confirmDelete) return;

    try {
      await deleteIncidentTag(id);

      toast.success("Incident Status Deleted Successfully!");

      fetchIncidentStatus();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete status");
    }
  };

  const column = [
    {
      name: "Status",
      selector: (row) => row.name,
      sortable: true,
    },

    {
      name: "Action",

      cell: (row) => (
        <div className="flex items-center gap-4">
          {/* EDIT */}
          <button
            onClick={() => handleEditClick(row)}
            className="text-blue-500"
          >
            <BiEdit size={15} />
          </button>

          {/* DELETE */}
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-500"
          >
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="mx-2">
      <div className="w-full flex flex-col gap-2 overflow-hidden">

        {/* ================= ADD STATUS ================= */}
        {addStatus && (
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              placeholder="Enter Status"
              className="border p-2 w-full border-gray-300 rounded-lg"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />

            <button
              className="bg-green-500 text-white p-2 flex gap-2 items-center rounded-md"
              onClick={handleAddStatus}
            >
              <FaCheck />
              Submit
            </button>

            <button
              className="bg-red-400 text-white flex items-center gap-2 p-2 rounded-md"
              onClick={() => {
                setAddStatus(false);
                setStatus("");
              }}
            >
              <MdClose />
              Cancel
            </button>
          </div>
        )}

        {/* ================= ADD BUTTON ================= */}
        {!addStatus && (
          <div className="flex justify-end">
            <button
              className="bg-green-500 p-2 rounded-md text-white flex items-center gap-2"
              onClick={() => setAddStatus(true)}
            >
              <PiPlusCircle />
              Add
            </button>
          </div>
        )}

        {/* ================= TABLE ================= */}
        <div>
          <Table
            columns={column}
            data={statuses}
            isPagination={true}
          />
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {showEditModal && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40"></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[400px] p-5">

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  Update Incident Status
                </h2>

                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditId(null);
                    setEditStatus("");
                  }}
                >
                  <MdClose size={22} />
                </button>
              </div>

              {/* Input */}
              <input
                type="text"
                placeholder="Enter Status"
                className="border p-2 w-full border-gray-300 rounded-lg mb-4"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              />

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditId(null);
                    setEditStatus("");
                  }}
                >
                  Cancel
                </button>

                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={handleUpdateStatus}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default IncidenceStatusSetup;