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
              <input
                type="number"
                placeholder="Enter order"
                className="border p-2 rounded-md border-gray-300"
                value={formData.order}
                onChange={handleChange}
                name="order"
              />
              <button
                className=" font-medium hover:text-white transition-all w-full p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
                style={{ background: themeColor }}
                onClick={handleAddStatus}
              >
                Add
              </button>
            </div>
            <Table
              responsive
              //   selectableRows
              columns={statusColumns}
              data={statuses}
              isPagination={true}
            />{" "}
            {/* <div className="flex gap-10">
              <label className="font-semibold mt-2" htmlFor="">
                Allow User to reopen ticket after closure
              </label>
              <select
                className="border p-2 rounded-md w-64 border-black"
                name=""
                id=""
              >
                <option value="">Select time period</option>
                <option value="">Days</option>
                <option value="">Hrs</option>
                <option value="">Months</option>
              </select>
              <input
                type="text"
                className="border p-2 rounded-md border-black"
                placeholder="2"
              />
              <button
                className="border-2 font-semibold hover:bg-black hover:text-white transition-all border-black p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
                style={{ background: themeColor }}
              >
                Update
              </button>
            </div> */}
          </div>
        )}
        {page === "Operational Days" && (
          <div className=" w-full  my-2">
            {/* <button
              onClick={openModal}
              className="border-2 font-semibold mt-5 ml-10 hover:bg-black hover:text-white transition-all border-black p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
              style={{ background: themeColor }}
              onClick={handleAddStatus}
            >
              Import
            </button> */}
            <table className="w-full">
              <thead style={{background: themeColor}} className="text-white">
                <tr>
                  <th className="px-4 py-2"></th>
                  <th className="px-4 py-2">Operational Days</th>
                  <th className="px-4 py-2">Start Time</th>
                  <th className="px-4 py-2">End Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="border px-4 py-2 text-center">Monday</td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="time"
                      value="13:45"
                      className="border border-gray-400 p-1 w-40 rounded-md"
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="time"
                      value="19:45"
                      className="border border-gray-400 p-1 w-40 rounded-md"
                    />
                  </td>
                  {/* <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td>
              <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td>
      
              <td class="border px-4 py-2 text-center"><input type="checkbox"/></td>
              <td class="border px-4 py-2 text-center"><input type="checkbox"/></td>
              <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td> */}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="border px-4 py-2 text-center">Tuesday</td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="time"
                      value="13:45"
                      className="border border-gray-400 p-1 w-40 rounded-md"
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="time"
                      value="16:45"
                      className="border border-gray-400 p-1 w-40 rounded-md"
                    />
                  </td>
                  {/* <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td> */}
                  {/* <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td>
              <td class="border px-4 py-2 text-center"><input type="checkbox"/></td>
              <td class="border px-4 py-2 text-center"><input type="checkbox"/></td>
              <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td> */}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="border px-4 py-2 text-center">Wednesday</td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="time"
                      value="15:45"
                      className="border border-gray-400 p-1 w-40 rounded-md"
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="time"
                      value="16:45"
                      className="border border-gray-400 p-1 w-40 rounded-md"
                    />
                  </td>
                  {/* <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td> */}
                  {/* <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td>
              <td class="border px-4 py-2 text-center"><input type="checkbox"/></td>
              <td class="border px-4 py-2 text-center"><input type="checkbox"/></td>
              <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td> */}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="border px-4 py-2 text-center">Thursday</td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="time"
                      value="14:45"
                      className="border border-gray-400 p-1 w-40 rounded-md"
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="time"
                      value="06:45"
                      className="border border-gray-400 p-1 w-40 rounded-md"
                    />
                  </td>
                  {/* <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td> */}
                  {/* <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td>
              <td class="border px-4 py-2 text-center"><input type="checkbox" className="border border-gray-400 p-2 rounded-md"/></td>
              <td class="border px-4 py-2 text-center"><input type="checkbox"/></td>
              <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td> */}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="border px-4 py-2 text-center">Friday</td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="time"
                      value="09:45"
                      className="border border-gray-400 p-1 w-40 rounded-md"
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="time"
                      value="13:45"
                      className="border border-gray-400 p-1 w-40 rounded-md"
                    />
                  </td>
                  {/* <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td> */}
                  {/* <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td>
              <td class="border px-4 py-2 text-center"><input type="checkbox"/></td>
              <td class="border px-4 py-2 text-center"><input type="checkbox"/></td>
              <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td> */}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="border px-4 py-2 text-center">Saturday</td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="time"
                      value="08:45"
                      className="border border-gray-400 p-1 w-40 rounded-md"
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={operationalDays[day].enabled}
                      onChange={(e) =>
                        updateDay(day, "enabled", e.target.checked)
                      }
                    />
                  </td>
                  {/* <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td> */}
                  {/* <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td>
              <td class="border px-4 py-2 text-center"><input type="checkbox"/></td>
              <td class="border px-4 py-2 text-center"><input type="checkbox"/></td>
              <td class="border px-4 py-2 text-center"><input type="time" className="border border-gray-400 p-2 rounded-md"/></td>
            */}
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="border px-4 py-2 text-center">Sunday</td>
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