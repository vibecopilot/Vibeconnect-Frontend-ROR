import React, { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  API_URL,
  disableChecklistSchedule,
  editChecklist,
  enableChecklistSchedule,
  getChecklist,
  getVibeBackground,
  getChecklistGroups,
} from "../api";
import DisableEnableScheduleModal from "../components/DisableEnableScheduleModal";
import ScheduleStatusBadge from "../components/ScheduleStatusBadge";
import Table from "../components/table/Table";
import ChecklistImportExport from "../components/ChecklistImportExport";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import AssetNav from "../components/navbars/AssetNav";
import Navbar from "../components/Navbar";
import { getItemInLocalStorage } from "../utils/localStorage";
import { DNA } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaCopy, FaDownload } from "react-icons/fa";
import Switch from "../Buttons/Switch";
import { BsEye } from "react-icons/bs";
import toast from "react-hot-toast";
import { Filter } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import { withPublicParams } from "../utils/publicAuth";

const Checklist = ({ standalone = false }) => {
  const [checklists, setChecklists] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  // ── reactive site ID — updated by SiteHeader on site switch ──
  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filterValues, setFilterValues] = useState({
    name: "",
    frequency: "",
    status: "",
    startDate: "",
    endDate: "",
    group: "",
  });
  const [checklistGroups, setChecklistGroups] = useState([]);
  const [scheduleModal, setScheduleModal] = useState(null); // { mode: "disable"|"enable", checklist }

  const handleApprove = async (row) => {
    try {
      await editChecklist({ is_approved: true }, row.id);
      await fetchChecklist();
      toast.success("Checklist approved successfully");
    } catch (error) {
      console.error("Error approving checklist:", error);
      toast.error("Failed to approve checklist");
    }
  };

  const handleReject = async (row) => {
    try {
      await editChecklist({ is_approved: false }, row.id);
      await fetchChecklist();
      toast.success("Checklist rejected successfully");
    } catch (error) {
      console.error("Error rejecting checklist:", error);
      toast.error("Failed to reject checklist");
    }
  };

  const handleScheduleConfirm = async (payload) => {
    const { mode, checklist } = scheduleModal;
    const action = mode === "disable" ? disableChecklistSchedule : enableChecklistSchedule;
    const res = await action(checklist.id, payload);
    await fetchChecklist();
    setScheduleModal(null);
    toast.success(res?.data?.message || `Checklist schedule ${mode}d successfully`);
  };

  const themeColor = useSelector((state) => state.theme.color);

  const fetchChecklist = async () => {
    try {
      setLoading(true);

      const checklist = await getChecklist();

      const routineChecklistsOnly = checklist.data.checklists.filter(
        (checklist) => checklist.ctype === "routine"
      );

      const sortedChecklists = routineChecklistsOnly.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setChecklists(sortedChecklists);
      setFilteredData(sortedChecklists);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
    const fetchChecklistCategories = async () => {
      try {
        const response = await getChecklistGroups();
        setChecklistGroups(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching checklist categories:", error);
      }
    };

    fetchChecklistCategories();
  }, [activeSiteId]); // ✅ re-fetch when site changes

  /** Keep the app-provided token when navigating inside the public flow. */
  const pagePath = (normalPath, publicPath) =>
    standalone ? withPublicParams(publicPath) : normalPath;

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "300px",
    },
    {
      name: "frequency",
      selector: (row) => row.frequency,
      sortable: true,
    },
    {
      name: "Checklist Category",
      selector: (row) => row.group_name || "-",
      sortable: true,
    },
    { name: "Start Date", selector: (row) => row.start_date, sortable: true },
    { name: "End Date", selector: (row) => row.end_date, sortable: true },
    {
      name: "Status",
      selector: (row) => <ScheduleStatusBadge row={row} />,
      sortable: true,
    },
    {
      name: "No. of Groups",
      selector: (row) => row?.groups?.length,
      sortable: true,
    },
    // {
    //   name: "Status",
    //   selector: (row) => row.is_approved === null ? (
    //     <span className="text-yellow-500">Pending</span>
    //   ) : row.is_approved ? (
    //     <span className="text-green-500">Approved</span>
    //   ) : (
    //     <span className="text-red-500">Rejected</span>
    //   ),
    //   sortable: true,
    // },
    {
      name: "Associations",
      selector: (row) => (
        <div>
          <Link
            to={pagePath(
              `/assets/associate-checklist/${row.id}`,
              `/apps/checklist/associate/${row.id}`
            )}
            className=" px-4 bg-green-400 text-white rounded-full"
          >
            Associate
          </Link>
        </div>
      ),
      sortable: true,
    },
    // {
    //   name: "Approvals",
    //   cell: (row) => (
    //     <div className="flex items-center gap-3">
    //       <FaCheckCircle
    //         className="text-green-500 cursor-pointer hover:text-green-700"
    //         size={22}
    //         title="Approve"
    //         onClick={() => handleApprove(row)}
    //       />
    //       <FaTimesCircle
    //         className="text-red-500 cursor-pointer hover:text-red-700"
    //         size={23}
    //         title="Reject"
    //         onClick={() => handleReject(row)}
    //       />
    //     </div>
    //   ),
    // },
  {
  name: "Action",
  cell: (row) => (
    <div className="flex items-center gap-4">

      {/* VIEW */}
      <Link
        to={pagePath(
          `/admin/edit-checklist/${row.id}?mode=view`,
          `/apps/checklist/edit/${row.id}?mode=view`
        )}
      >
        <BsEye size={15} />
      </Link>

      {/* EDIT */}
      <Link
        to={pagePath(
          `/admin/edit-checklist/${row.id}?mode=edit`,
          `/apps/checklist/edit/${row.id}?mode=edit`
        )}
      >
        <BiEdit size={15} />
      </Link>

      {/* COPY */}
      <Link to={pagePath(`/admin/copy-checklist/${row.id}`, `/apps/checklist/copy/${row.id}`)}>
        <FaCopy size={15} />
      </Link>

      {/* DISABLE / ENABLE SCHEDULE — a toggle rather than a cross icon;
          on = active, off = fully disabled ("All"). Clicking opens the
          scope-picker modal instead of acting immediately. The extra
          checkmark only appears when partially disabled (schedule still
          active, some occurrences hidden), so the admin can bring just
          the hidden subset back without a full re-enable. */}
      <div
        className="flex items-center gap-2"
        title={row.active === false ? "Enable Schedule" : "Disable Schedule"}
      >
        <Switch
          checked={row.active !== false}
          onChange={() =>
            setScheduleModal({
              mode: row.active === false ? "enable" : "disable",
              checklist: row,
            })
          }
        />
        {row.active !== false && row.disabled_summary?.total > 0 && (
          <button
            type="button"
            title="Enable hidden occurrences"
            onClick={() => setScheduleModal({ mode: "enable", checklist: row })}
          >
            <FaCheckCircle size={15} className="text-green-600" />
          </button>
        )}
      </div>

    </div>
  ),
},
  ];

  let selectedImageSrc = "";
  let selectedImageIndex = 0;
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const Get_Background = async () => {
    try {
      const user_id = getItemInLocalStorage("VIBEUSERID");
      const data = await getVibeBackground(user_id);

      if (data.success) {
        selectedImageSrc = API_URL + data.data.image;
        selectedImageIndex = data.data.index;
        setSelectedImage(selectedImageSrc);
        setSelectedIndex(selectedImageIndex);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // Public app pages are self-contained: no user background from localStorage.
    if (!standalone) Get_Background();
  }, [standalone]);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    if (searchValue.trim() === "") {
      setFilteredData(checklists);
    } else {
      // FIXED: Filter from checklists (full routine list)
      const filteredResults = checklists.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setFilteredData(filteredResults);
    }
  };

  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const applyFilter = async () => {
    try {
      setLoading(true);

      const payload = {
        name: filterValues.name,
        frequency: filterValues.frequency,
        startDate: filterValues.startDate,
        endDate: filterValues.endDate,
        group: filterValues.group,
      };

      const response = await getChecklist(payload);

      setFilteredData(response.data.checklists);
      setChecklists(response.data.checklists);

      setShowFilter(false);
    } catch (error) {
      console.error("Filter API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = async () => {
    try {
      setLoading(true);

      setFilterValues({
        name: "",
        frequency: "",
        status: "",
        startDate: "",
        endDate: "",
        group: "",
      });

      const response = await getChecklist();

      const routineChecklistsOnly = response.data.checklists.filter(
        (item) => item.ctype === "routine"
      );

      const sortedData = routineChecklistsOnly.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setChecklists(sortedData);
      setFilteredData(sortedData);

    } catch (error) {
      console.error("Reset filter error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="flex"
      style={
        standalone
          ? undefined
          : {
              background: `url(${selectedImage})no-repeat center center / cover`,
            }
      }
    >
      {!standalone && <Navbar />}
      <div className="p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
        {standalone ? (
          <h1 className="mb-3 text-xl font-semibold text-gray-800">Checklist</h1>
        ) : (
          <SiteHeader
            onSiteChange={(id) => {
              setActiveSiteId(id); // triggers data useEffect
              setChecklists([]);
              setFilteredData([]);
            }}
          />
        )}
        {!standalone && <AssetNav />}
        <div className="flex md:flex-row flex-col justify-between items-center my-2 gap-2  ">
          <input
            type="text"
            placeholder="Search By name"
            className="border-2 p-2 md:w-96 border-gray-300 rounded-lg placeholder:text-sm"
            value={searchText}
            onChange={handleSearch}
          />
          <div className="md:flex grid grid-cols-2 sm:flex-row  flex-col gap-2">
            <Link
              to={pagePath("/admin/add-checklist", "/apps/checklist/add")}
              className="bg-black  text-sm rounded-lg flex justify-center font-semibold items-center gap-2 text-white py-2 px-4 transition-all duration-300 "
              style={{ background: themeColor }}
            >
              <IoAddCircleOutline size={20} />
              Add
            </Link>
            <button
              onClick={() => setShowFilter(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex justify-center items-center gap-2"
            >
              <Filter size={20} />   Filter
            </button>
            <ChecklistImportExport
              ctype="routine"
              onSuccess={fetchChecklist}
              themeColor={themeColor}
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <DNA height="120" width="120" />
          </div>
        ) : filteredData.length > 0 ? (
          <Table
            columns={columns}
            data={filteredData}
            isPagination={true}
          />
        ) : (
          <div className="bg-white shadow rounded-lg p-10 text-center mt-4">
    <h2 className="text-xl font-semibold text-gray-600">
      No Submission Yet
    </h2>
  </div>
        )}
      </div>
      {showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[800px] shadow-lg relative">

            {/* Close */}
            <button
              className="absolute top-3 right-3 text-[30px] text-gray-500 hover:text-gray-700 transition"
              onClick={() => setShowFilter(false)}
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-4">Filter By</h2>

            <div className="grid grid-cols-3 gap-4">

              {/* Name */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">Name</label>
                <input
                  type="text"
                  className="border p-2 rounded"
                  value={filterValues.name}
                  onChange={(e) =>
                    setFilterValues({ ...filterValues, name: e.target.value })
                  }
                />
              </div>

              {/* Frequency */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">Frequency</label>
                <select
                  className="border p-2 rounded"
                  value={filterValues.frequency}
                  onChange={(e) =>
                    setFilterValues({ ...filterValues, frequency: e.target.value })
                  }
                >
                  <option value="">Select Frequency</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half_yearly">Half Yearly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {/* Status */}
              {/* <div className="flex flex-col">
                <label className="text-sm mb-1">Status</label>
                <select
                  className="border p-2 rounded"
                  value={filterValues.status}
                  onChange={(e) =>
                    setFilterValues({ ...filterValues, status: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div> */}

              {/* Start Date */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">Start Date</label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={filterValues.startDate}
                  onChange={(e) =>
                    setFilterValues({ ...filterValues, startDate: e.target.value })
                  }
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">End Date</label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={filterValues.endDate}
                  onChange={(e) =>
                    setFilterValues({ ...filterValues, endDate: e.target.value })
                  }
                />
              </div>

              {/* Group */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">Checklist Category</label>
                <select
                  className="border p-2 rounded"
                  value={filterValues.group}
                  onChange={(e) =>
                    setFilterValues({ ...filterValues, group: e.target.value })
                  }
                >
                  <option value="">Select Checklist Category</option>
                  {checklistGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={applyFilter}
                className="bg-gray-700 text-white px-6 py-2 rounded"
              >
                Filter
              </button>

              <button
                onClick={clearFilter}
                className="border px-6 py-2 rounded"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
      {scheduleModal && (
        <DisableEnableScheduleModal
          mode={scheduleModal.mode}
          checklistName={scheduleModal.checklist.name}
          onConfirm={handleScheduleConfirm}
          onCancel={() => setScheduleModal(null)}
        />
      )}
    </section>
  );
};

export default Checklist;