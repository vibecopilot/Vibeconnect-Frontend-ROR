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
        <button 
          onClick={() => handleEditStatusModal(row.id)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <BiEdit size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full my-2 flex overflow-hidden flex-col">
      {/* Tab Navigation */}
      <div className="flex w-full">
        <div className="flex gap-2 p-2 pb-0 border-b-2 border-gray-200 w-full">
          {["Category Type", "Status", "Operational Days"].map((tab) => (
            <h2
              key={tab}
              className={`p-1 px-4 rounded-t-md cursor-pointer transition-all font-medium ${
                page === tab
                  ? "bg-white text-blue-500 shadow-custom-all-sides"
                  : "text-gray-700 hover:text-blue-500"
              }`}
              onClick={() => setPage(tab)}
            >
              {tab}
            </h2>
          ))}
        </div>
      </div>

      {/* Category Type Tab */}
      {page === "Category Type" && <TicketCategorySetup />}

      {/* Status Tab */}
      {page === "Status" && (
        <div className="p-4">
          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Status Name"
              className="border border-gray-300 p-3 rounded-lg flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.status}
              onChange={handleChange}
              name="status"
            />
            <input
              type="text"
              placeholder="Fixed State"
              className="border border-gray-300 p-3 rounded-lg flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.fixedState}
              onChange={handleChange}
              name="fixedState"
            />
            <input
              type="number"
              placeholder="Order"
              className="border border-gray-300 p-3 rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.order}
              onChange={handleChange}
              name="order"
            />
            <ColorPicker
              value={formData.color}
              onChange={(color) =>
                setFormData({ ...formData, color: color.toHexString() })
              }
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              onClick={handleAddStatus}
            >
              Add Status
            </button>
          </div>
          
          <Table
            responsive
            columns={statusColumns}
            data={statuses}
            isPagination={true}
          />
        </div>
      )}

      {/* Operational Days Tab */}
      {page === "Operational Days" && (
        <div className="p-6">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
              <thead style={{ background: themeColor }} className="text-white">
                <tr>
                  <th className="px-6 py-4 border border-gray-300 text-left font-semibold"></th>
                  <th className="px-6 py-4 border border-gray-300 text-left font-semibold">Operational Days</th>
                  <th className="px-6 py-4 border border-gray-300 text-left font-semibold">Start Time</th>
                  <th className="px-6 py-4 border border-gray-300 text-left font-semibold">End Time</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(operationalDays).map(([day, data]) => (
                  <tr key={day} className="hover:bg-gray-50 transition-colors">
                    <td className="border border-gray-300 px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={data.enabled}
                        onChange={(e) =>
                          updateDay(day, "enabled", e.target.checked)
                        }
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>

                    <td className="border border-gray-300 px-6 py-4 font-medium text-gray-900">
                      {day}
                    </td>

                    <td className="border border-gray-300 px-6 py-4">
                      <input
                        type="time"
                        value={data.start}
                        disabled={!data.enabled}
                        onChange={(e) =>
                          updateDay(day, "start", e.target.value)
                        }
                        className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                      />
                    </td>

                    <td className="border border-gray-300 px-6 py-4">
                      <input
                        type="time"
                        value={data.end}
                        disabled={!data.enabled}
                        onChange={(e) =>
                          updateDay(day, "end", e.target.value)
                        }
                        className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center my-8">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-12 py-3 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              style={{ background: themeColor }}
              onClick={handleOperationalSubmit}
            >
              Save Operational Days
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
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
