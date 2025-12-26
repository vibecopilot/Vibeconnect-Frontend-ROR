import React, { useEffect, useState } from "react";
import TicketCategorySetup from "./TicketCategorySetup";
import { useSelector } from "react-redux";
import Table from "../../../components/table/Table";
import { BiEdit } from "react-icons/bi";
import { ColorPicker } from "antd";
import { getHelpDeskStatusSetup, postHelpDeskStatusSetup } from "../../../api";
import toast from "react-hot-toast";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import EditStatusModal from "./EditStatusModal";

const TicketSetupPage = () => {
  const [statusAdded, setStatusAdded] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [page, setPage] = useState("Category Type");
  const themeColor = useSelector((state) => state.theme.color);
  const [statuses, setStatuses] = useState([]);
  const [id, setId] = useState("");

  const [formData, setFormData] = useState({
    status: "",
    fixedState: "",
    color: "#1677ff",
    order: "",
  });

  const [operationalDays, setOperationalDays] = useState({
    Monday: { enabled: false, start: "", end: "" },
    Tuesday: { enabled: false, start: "", end: "" },
    Wednesday: { enabled: false, start: "", end: "" },
    Thursday: { enabled: false, start: "", end: "" },
    Friday: { enabled: false, start: "", end: "" },
    Saturday: { enabled: false, start: "", end: "" },
    Sunday: { enabled: false, start: "", end: "" },
  });

  useEffect(() => {
    const fetchTicketStatus = async () => {
      try {
        const statusResp = await getHelpDeskStatusSetup();
        setStatuses(Object.values(statusResp.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchTicketStatus();
  }, [statusAdded]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStatus = async () => {
    if (
      !formData.status ||
      !formData.order ||
      !formData.fixedState ||
      !formData.color
    ) {
      return toast.error("Please fill all fields");
    }

    const siteID = getItemInLocalStorage("SITEID");
    const postStatus = new FormData();

    postStatus.append("complaint_status[of_phase]", "pms");
    postStatus.append("complaint_status[society_id]", siteID);
    postStatus.append("complaint_status[name]", formData.status);
    postStatus.append("complaint_status[fixed_state]", formData.fixedState);
    postStatus.append("complaint_status[color_code]", formData.color);
    postStatus.append("complaint_status[position]", formData.order);

    try {
      await postHelpDeskStatusSetup(postStatus);
      toast.success("Status Added Successfully");
      setStatusAdded(true);
      setFormData({
        status: "",
        fixedState: "",
        color: "#1677ff",
        order: "",
      });
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to add status");
    } finally {
      setTimeout(() => setStatusAdded(false), 500);
    }
  };

  const handleEditStatusModal = (id) => {
    setId(id);
    setShowEditModal(true);
  };

  // 🔹 THIS IS THE IMPORTANT ADDITION
  const handleStatusUpdated = () => {
    setShowEditModal(false);
    setStatusAdded(true);
    setTimeout(() => setStatusAdded(false), 500);
  };

  const updateDay = (day, field, value) => {
    setOperationalDays({
      ...operationalDays,
      [day]: { ...operationalDays[day], [field]: value },
    });
  };

  const handleOperationalSubmit = () => {
    const payload = Object.entries(operationalDays)
      .filter(([_, v]) => v.enabled)
      .map(([day, v]) => ({ day, ...v }));

    if (!payload.length) {
      return toast.error("Select at least one operational day");
    }

    console.log("Operational Days:", payload);
    toast.success("Operational Days Saved");
  };

  const statusColumns = [
    { name: "Order", selector: (row) => row.position },
    { name: "Status", selector: (row) => row.name },
    { name: "Fixed State", selector: (row) => row.fixed_state },
    {
      name: "Color",
      cell: (row) => (
        <div
          style={{ background: row.color_code }}
          className="rounded-md w-4 h-4"
        />
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <button onClick={() => handleEditStatusModal(row.id)}>
          <BiEdit size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full my-2 flex overflow-hidden flex-col">
      <div className="flex w-full">
        <div className="flex gap-2 p-2 pb-0 border-b-2 border-gray-200 w-full">
          {["Category Type", "Status", "Operational Days"].map((tab) => (
            <h2
              key={tab}
              className={`p-1 ${
                page === tab &&
                "bg-white font-medium text-blue-500 shadow-custom-all-sides"
              } rounded-t-md px-4 cursor-pointer`}
              onClick={() => setPage(tab)}
            >
              {tab}
            </h2>
          ))}
        </div>
      </div>

      {page === "Category Type" && <TicketCategorySetup />}

      {page === "Status" && (
        <div className="m-2">
          <div className="grid md:grid-cols-5 gap-2 my-2">
            <input
              type="text"
              placeholder="Enter status"
              className="border p-2 rounded-md"
              value={formData.status}
              onChange={handleChange}
              name="status"
            />

            <select
              name="fixedState"
              onChange={handleChange}
              value={formData.fixedState}
              className="border p-2 rounded-md"
            >
              <option value="">Select Fixed State</option>
              <option value="closed">Closed</option>
              <option value="open">Open</option>
              <option value="complete">Complete</option>
            </select>

            <ColorPicker
              value={formData.color}
              onChange={(c) =>
                setFormData({ ...formData, color: c.toHexString() })
              }
            />

            <input
              type="number"
              placeholder="Enter order"
              className="border p-2 rounded-md"
              value={formData.order}
              onChange={handleChange}
              name="order"
            />

            <button
              type="button"
              className="text-white p-2 rounded-md"
              style={{ background: themeColor }}
              onClick={handleAddStatus}
            >
              Add
            </button>
          </div>

          <Table columns={statusColumns} data={statuses} isPagination />
        </div>
      )}

      {page === "Operational Days" && (
        <div className="w-full my-2">
          <table className="w-full">
            <thead style={{ background: themeColor }} className="text-white">
              <tr>
                <th></th>
                <th>Operational Days</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(operationalDays).map((day) => (
                <tr key={day}>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={operationalDays[day].enabled}
                      onChange={(e) =>
                        updateDay(day, "enabled", e.target.checked)
                      }
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">{day}</td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="time"
                      value={operationalDays[day].start}
                      disabled={!operationalDays[day].enabled}
                      onChange={(e) =>
                        updateDay(day, "start", e.target.value)
                      }
                      className="border p-1 w-40 rounded-md"
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="time"
                      value={operationalDays[day].end}
                      disabled={!operationalDays[day].enabled}
                      onChange={(e) =>
                        updateDay(day, "end", e.target.value)
                      }
                      className="border p-1 w-40 rounded-md"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center my-2 mb-5">
            <button
              className="text-white p-2 px-4 rounded-md"
              style={{ background: themeColor }}
              onClick={handleOperationalSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {showEditModal && (
        <EditStatusModal
          id={id}
          onClose={() => setShowEditModal(false)}
          onUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
};

export default TicketSetupPage;