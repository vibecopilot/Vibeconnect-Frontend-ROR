import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BiEdit, BiTrash } from "react-icons/bi";
import toast from "react-hot-toast";

import TicketCategorySetup from "./TicketCategorySetup";
import Table from "../../../components/table/Table";
import EditStatusModal from "./EditStatusModal";

import {
  getHelpDeskStatusSetup,
  postHelpDeskStatusSetup,
  getIssueType,
  postIssueType,
  updateIssueType,
  getOperationalHours,
  postOperationalHours,
  updateOperationalHours,
  deleteOperationalHours,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";

/* ---------------- OPERATIONAL HOURS HELPERS ---------------- */
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const emptyDays = () =>
  DAYS.reduce(
    (acc, d) => ({ ...acc, [d]: { enabled: false, start: "", end: "" } }),
    {}
  );

const pad = (n) => String(n ?? 0).padStart(2, "0");

// UI state -> API payload
const buildPayload = (days) => {
  const operational_hours = {};
  DAYS.forEach((day) => {
    const v = days[day];
    if (v.enabled) {
      const [sh, sm] = v.start.split(":").map(Number);
      const [eh, em] = v.end.split(":").map(Number);
      operational_hours[day.toLowerCase()] = {
        is_open: true,
        start_hour: sh,
        start_min: sm,
        end_hour: eh,
        end_min: em,
      };
    } else {
      operational_hours[day.toLowerCase()] = {
        is_open: false,
        start_hour: 23,
        start_min: 59,
        end_hour: 23,
        end_min: 59,
      };
    }
  });
  return { operational_hours };
};

// API response -> UI state
const parseResponse = (data) => {
  const src = data?.operational_hours || data || {};
  const days = emptyDays();
  let found = false;
  DAYS.forEach((day) => {
    const v = src[day.toLowerCase()];
    if (v) {
      found = true;
      days[day] = {
        enabled: !!v.is_open,
        start: v.is_open ? `${pad(v.start_hour)}:${pad(v.start_min)}` : "",
        end: v.is_open ? `${pad(v.end_hour)}:${pad(v.end_min)}` : "",
      };
    }
  });
  return { days, found };
};

const TicketSetupPage = ({ activeSiteId }) => {
  const themeColor = useSelector((state) => state.theme.color);

  // adjust this key to match where your app stores the company id
  const companyId = getItemInLocalStorage("COMPANYID");

  const [page, setPage] = useState("Related To");
  const [statuses, setStatuses] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [operationalHoursId, setOperationalHoursId] = useState(null);

  // Related To (IssueType) state
  const [issueTypes, setIssueTypes] = useState([]);
  const [newIssueTypeName, setNewIssueTypeName] = useState("");
  const [editingIssueType, setEditingIssueType] = useState(null); // { id, name }
  const [editIssueTypeName, setEditIssueTypeName] = useState("");

  const [formData, setFormData] = useState({
    status: "",
    fixedState: "",
    color: "#1677ff",
    order: "",
  });

  // Operational days state
  const [operationalDays, setOperationalDays] = useState(emptyDays());
  const [hasOperationalHours, setHasOperationalHours] = useState(false); // true => edit mode
  const [opLoading, setOpLoading] = useState(false);

  /* ---------------- FETCH ISSUE TYPES ---------------- */
  const fetchIssueTypes = async () => {
    try {
      const res = await getIssueType();
      setIssueTypes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddIssueType = async () => {
    if (!newIssueTypeName.trim()) return toast.error("Enter issue type name");
    const siteId = activeSiteId || getItemInLocalStorage("SITEID");
    try {
      await postIssueType(newIssueTypeName.trim(), siteId);
      toast.success("Issue type added");
      setNewIssueTypeName("");
      fetchIssueTypes();
    } catch (err) {
      toast.error("Failed to add issue type");
    }
  };

  const handleUpdateIssueType = async (id) => {
    if (!editIssueTypeName.trim()) return toast.error("Enter name");
    try {
      await updateIssueType(id, editIssueTypeName.trim());
      toast.success("Issue type updated");
      setEditingIssueType(null);
      fetchIssueTypes();
    } catch (err) {
      toast.error("Failed to update issue type");
    }
  };

  const handleDeleteIssueType = async (id) => {
    if (!window.confirm("Delete this issue type?")) return;
    try {
      await updateIssueType(id, "", 0);
      toast.success("Issue type deleted");
      fetchIssueTypes();
    } catch (err) {
      toast.error("Failed to delete issue type");
    }
  };

  /* ---------------- FETCH STATUS ---------------- */
  const fetchStatuses = async () => {
    try {
      const res = await getHelpDeskStatusSetup();
      setStatuses(Object.values(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- FETCH OPERATIONAL HOURS ---------------- */
  const fetchOperationalHours = async () => {
    if (!companyId) return;
    try {
      const res = await getOperationalHours(companyId);
      const { days, found } = parseResponse(res.data);
      setOperationalDays(days);
      setHasOperationalHours(found);
    } catch (err) {
      setOperationalDays(emptyDays());
      setHasOperationalHours(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
    fetchIssueTypes();
    fetchOperationalHours();
  }, [activeSiteId]); // re-fetch when site changes

  const handleReset = () => {
    setFormData({
      status: "",
      fixedState: "",
      color: "#1677ff",
      order: "",
    });
  };

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStatus = async () => {
    if (!formData.status || !formData.fixedState || !formData.order) {
      return toast.error("Please fill all fields");
    }

    const siteID = activeSiteId; // reactive prop from parent

    const payload = new FormData();
    payload.append("complaint_status[of_phase]", "pms");
    payload.append("complaint_status[society_id]", siteID);
    payload.append("complaint_status[name]", formData.status);
    payload.append("complaint_status[fixed_state]", formData.fixedState);
    payload.append("complaint_status[color_code]", formData.color);
    payload.append("complaint_status[position]", formData.order);

    try {
      await postHelpDeskStatusSetup(payload);

      toast.success("Status added successfully");

      setFormData({
        status: "",
        fixedState: "",
        color: "#1677ff",
        order: "",
      });

      fetchStatuses(); // refresh table
    } catch (err) {
      const message = err?.response?.data?.error || "Failed to add status";
      toast.error(message);
    }
  };

  const updateDay = (day, field, value) => {
    setOperationalDays((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  /* ---------------- OPERATIONAL HOURS: CREATE / UPDATE ---------------- */
  const handleOperationalSubmit = async () => {
  if (!companyId) {
    return toast.error("Company ID not found");
  }

  const enabled = Object.entries(operationalDays).filter(
    ([_, v]) => v.enabled
  );

  if (!enabled.length) {
    return toast.error("Select at least one operational day");
  }

  for (const [day, v] of enabled) {
    if (!v.start || !v.end) {
      return toast.error(`Set start and end time for ${day}`);
    }

    if (v.end <= v.start) {
      return toast.error(
        `End time must be after start time for ${day}`
      );
    }
  }

  setOpLoading(true);

  try {
    const payload = buildPayload(operationalDays);

    console.log("Operational Hours ID:", operationalHoursId);
    console.log("Operational Hours Payload:", payload);

    if (hasOperationalHours && operationalHoursId) {
      // UPDATE EXISTING RECORD BY ID
      await updateOperationalHours(
        companyId,
        operationalHoursId,
        payload
      );

      toast.success("Operational days updated successfully");
    } else {
      // CREATE NEW RECORD
      const response = await postOperationalHours(
        companyId,
        payload
      );

      // Save newly-created record ID
      const newId =
        response?.data?.id ||
        response?.data?.data?.id ||
        response?.data?.operational_hours?.id ||
        response?.data?.data?.operational_hours?.id ||
        null;

      if (newId) {
        setOperationalHoursId(newId);
      }

      setHasOperationalHours(true);

      toast.success("Operational days saved successfully");
    }

    await fetchOperationalHours();
  } catch (err) {
    console.error(
      "Operational hours save/update error:",
      err
    );

    toast.error(
      err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to save operational days"
    );
  } finally {
    setOpLoading(false);
  }
};

  /* ---------------- OPERATIONAL HOURS: DELETE ---------------- */
  const handleDeleteOperationalHours = async () => {
    if (!companyId) return toast.error("Company ID not found");
    if (!window.confirm("Delete all operational hours?")) return;

    setOpLoading(true);
    try {
      await deleteOperationalHours(companyId);
      toast.success("Operational days deleted");
      setOperationalDays(emptyDays());
      setHasOperationalHours(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.error || "Failed to delete operational days"
      );
    } finally {
      setOpLoading(false);
    }
  };

  /* ---------------- TABLE ---------------- */
  const statusColumns = [
    { name: "Order", selector: (row) => row.position },
    { name: "Status", selector: (row) => row.name },
    { name: "Fixed State", selector: (row) => row.fixed_state },
    {
      name: "Color",
      cell: (row) => (
        <div
          className="w-4 h-4 rounded"
          style={{ background: row.color_code }}
        />
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => {
            setEditId(row.id);
            setShowEditModal(true);
          }}
        >
          <BiEdit />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full my-2">
      {/* Tabs */}
      <div className="flex border-b">
        {["Related To", "Category Type", "Status", "Operational Days"].map(
          (tab) => (
            <button
              key={tab}
              className={`px-4 py-2 ${
                page === tab ? "border-b-2 text-blue-500" : ""
              }`}
              onClick={() => setPage(tab)}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Related To (IssueType) */}
      {page === "Related To" && (
        <div className="p-4">
          <table className="w-full border text-sm">
            <thead style={{ background: themeColor }} className="text-white">
              <tr>
                <th className="p-2 text-left w-12">S.No.</th>
                <th className="p-2 text-left">Issue Type</th>
                <th className="p-2 text-left w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {issueTypes.map((it, idx) => (
                <tr key={it.id} className="border-b">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">
                    {editingIssueType?.id === it.id ? (
                      <input
                        className="border p-1 rounded w-full"
                        value={editIssueTypeName}
                        onChange={(e) => setEditIssueTypeName(e.target.value)}
                      />
                    ) : (
                      it.name
                    )}
                  </td>
                  <td className="p-2 flex gap-2">
                    {editingIssueType?.id === it.id ? (
                      <>
                        <button
                          className="text-green-600 font-semibold"
                          onClick={() => handleUpdateIssueType(it.id)}
                        >
                          Save
                        </button>
                        <button
                          className="text-gray-500"
                          onClick={() => setEditingIssueType(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingIssueType(it);
                            setEditIssueTypeName(it.name);
                          }}
                        >
                          <BiEdit className="text-orange-500" size={16} />
                        </button>
                        <button onClick={() => handleDeleteIssueType(it.id)}>
                          <BiTrash className="text-red-500" size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {/* Add new row */}
              <tr>
                <td className="p-2">{issueTypes.length + 1}</td>
                <td className="p-2">
                  <input
                    className="border p-1 rounded w-full"
                    placeholder="Enter Issue Type"
                    value={newIssueTypeName}
                    onChange={(e) => setNewIssueTypeName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddIssueType()}
                  />
                </td>
                <td className="p-2">
                  <button
                    className="px-3 py-1 text-white rounded text-xs"
                    style={{ background: themeColor }}
                    onClick={handleAddIssueType}
                  >
                    + Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Category */}
      {page === "Category Type" && <TicketCategorySetup />}

      {/* Status */}
      {page === "Status" && (
        <div className="p-4">
          <div className="grid md:grid-cols-5 gap-2 mb-4">
            <input
              name="status"
              placeholder="Status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="fixedState"
              placeholder="Fixed State"
              value={formData.fixedState}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="order"
              type="number"
              placeholder="Order"
              value={formData.order}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <button
              onClick={handleAddStatus}
              className="text-white rounded"
              style={{ background: themeColor }}
            >
              Add
            </button>
            <button
              onClick={handleReset}
              className="text-white rounded bg-black"
            >
              Reset
            </button>
          </div>

          <Table columns={statusColumns} data={statuses} isPagination />
        </div>
      )}

      {/* Operational Days */}
      {page === "Operational Days" && (
        <div className="p-4">
          <table className="w-full border">
            <thead style={{ background: themeColor }} className="text-white">
              <tr>
                <th />
                <th>Day</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(operationalDays).map(([day, data]) => (
                <tr key={day}>
                  <td className="border text-center">
                    <input
                      type="checkbox"
                      checked={data.enabled}
                      onChange={(e) =>
                        updateDay(day, "enabled", e.target.checked)
                      }
                    />
                  </td>

                  <td className="border text-center">{day}</td>

                  <td className="border">
                    <input
                      type="time"
                      disabled={!data.enabled}
                      value={data.start}
                      onChange={(e) => updateDay(day, "start", e.target.value)}
                    />
                  </td>

                  <td className="border">
                    <input
                      type="time"
                      disabled={!data.enabled}
                      value={data.end}
                      onChange={(e) => updateDay(day, "end", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center mt-6 flex justify-center gap-3">
            <button
              onClick={handleOperationalSubmit}
              disabled={opLoading}
              className="px-8 py-2 text-white rounded disabled:opacity-60"
              style={{ background: themeColor }}
            >
              {hasOperationalHours
                ? "Update Operational Days"
                : "Save Operational Days"}
            </button>

            {/* {hasOperationalHours && (
              <button
                onClick={handleDeleteOperationalHours}
                disabled={opLoading}
                className="px-8 py-2 text-white rounded bg-red-500 disabled:opacity-60 flex items-center gap-1"
              >
                <BiTrash /> Delete
              </button>
            )} */}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditStatusModal
          id={editId}
          onClose={() => setShowEditModal(false)}
          onUpdated={() => {
            setShowEditModal(false);
            fetchStatuses(); // refresh after edit
          }}
        />
      )}
    </div>
  );
};

export default TicketSetupPage;