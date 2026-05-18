import { useEffect, useMemo, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import Navbar from "../../components/Navbar";
import Table from "../../components/table/Table";
import {
  getSetupUsers,
  getUserCount,
  putSetupUser,
  updateUserAdminApproval,
} from "../../api";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import {
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaFilter,
  FaTimes,
  FaTimesCircle,
  FaDownload,
  FaUsers,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { BiEdit, BiUserCheck } from "react-icons/bi";
import { DNA } from "react-loader-spinner";
import { MdApartment, MdDevices } from "react-icons/md";
import { useSelector } from "react-redux";
import SiteHeader from "../../components/SiteHeader";
import { getItemInLocalStorage } from "../../utils/localStorage";

const UserSetup = () => {
  const themeColor = useSelector((state) => state.theme.color);

  // ✅ SITE CHANGE STATE
  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [count, setCount] = useState("");
  const [activeTab, setActiveTab] = useState("approved");
  const [filterOpen, setFilterOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH USERS ---------------- */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const setupUsers = await getSetupUsers();
      const userCount = await getUserCount();

      setCount(userCount.data);

      const data = setupUsers.data || [];

      // ✅ SITE WISE FILTER
      const filteredSiteUsers = data.filter((user) => {
        if (!activeSiteId) return true;

        // direct site_id
        if (String(user.site_id) === String(activeSiteId)) {
          return true;
        }

        // user_sites array
        if (Array.isArray(user.user_sites)) {
          return user.user_sites.some(
            (site) => String(site.site_id) === String(activeSiteId)
          );
        }

        return false;
      });

      setUsers(filteredSiteUsers);
      setFilteredData(filteredSiteUsers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- USE EFFECT ---------------- */
  useEffect(() => {
    fetchUsers();
  }, [activeSiteId]);

  /* ---------------- SEARCHABLE TEXT ---------------- */
  const buildSearchableText = (item) => {
    const userSitesHierarchy = Array.isArray(item.user_sites)
      ? item.user_sites
        .map((site) => site.hierarchy || site.full_unit_name || "")
        .join(" ")
      : "";

    return [
      item.firstname,
      item.lastname,
      item.email,
      item.mobile,
      item.user_type,
      item.full_unit_name,
      item.unit?.name,
      userSitesHierarchy,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  };

  /* ---------------- SEARCH ---------------- */
  const handleSearch = (e) => {
    const searchValue = e.target.value;

    setSearchText(searchValue);

    if (searchValue.trim() === "") {
      setFilteredData(users);
    } else {
      const searchWords = searchValue
        .toLowerCase()
        .split(" ")
        .filter(Boolean);

      const filteredResults = users.filter((item) => {
        const searchable = buildSearchableText(item);

        return searchWords.every((word) =>
          searchable.includes(word)
        );
      });

      setFilteredData(filteredResults);
    }
  };

  /* ---------------- TAB FILTER ---------------- */
  const tabFilteredUsers = useMemo(() => {
    if (activeTab === "approved") {
      return filteredData.filter(
        (user) =>
          user.is_admin_approved === true ||
          user.user_type === "pms_admin"
      );
    }

    if (activeTab === "pending") {
      return filteredData.filter(
        (user) =>
          user.is_admin_approved === null &&
          user.user_type !== "pms_admin"
      );
    }

    if (activeTab === "rejected") {
      return filteredData.filter(
        (user) =>
          user.is_admin_approved === false &&
          user.user_type !== "pms_admin"
      );
    }

    return filteredData;
  }, [filteredData, activeTab]);

  /* ---------------- DATE FILTER ---------------- */
  const dateFilteredUsers = useMemo(() => {
    let data = [...tabFilteredUsers];

    if (!fromDate && !toDate) return data;

    return data.filter((user) => {
      if (!user.created_at) return false;

      const created = new Date(user.created_at);

      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);

        if (created < from) return false;
      }

      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);

        if (created > to) return false;
      }

      return true;
    });
  }, [tabFilteredUsers, fromDate, toDate]);

  /* ---------------- CLEAR FILTER ---------------- */
  const clearDateFilter = () => {
    setFromDate("");
    setToDate("");
  };

  /* ---------------- USER APPROVAL ---------------- */
  const handleUserApproval = async (id, isApproved) => {
    const token = localStorage.getItem("TOKEN");

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
            ...u,
            is_admin_approved: isApproved,
            user_status: true,
          }
          : u
      )
    );

    try {
      await updateUserAdminApproval(
        id,
        {
          user_status: true,
          is_admin_approved: isApproved,
        },
        token
      );

      if (isApproved === true) {
        toast.success("User approved successfully ✅");
      } else {
        toast.error("User rejected successfully ❌");
      }
    } catch (err) {
      console.error(err);

      toast.error("Failed to update approval ❌");

      fetchUsers();
    }
  };

  /* ---------------- STATUS TOGGLE ---------------- */
  const handleStatusToggle = async (row) => {
    const newStatus = !row.user_status;

    try {
      const token = localStorage.getItem("TOKEN");

      await putSetupUser(
        row.id,
        { user: { user_status: newStatus } },
        token
      );

      setUsers((prev) =>
        prev.map((user) =>
          user.id === row.id
            ? { ...user, user_status: newStatus }
            : user
        )
      );

      toast.success(
        newStatus
          ? "User Activated Successfully ✅"
          : "User Deactivated Successfully ❌"
      );
    } catch (error) {
      console.error(error);

      toast.error("Failed to update status ❌");
    }
  };

  /* ---------------- COUNTS ---------------- */
  const approvedCount = users.filter(
    (u) =>
      u.is_admin_approved === true ||
      u.user_type === "pms_admin"
  ).length;

  const pendingCount = users.filter(
    (u) =>
      u.is_admin_approved === null &&
      u.user_type !== "pms_admin"
  ).length;

  const rejectedCount = users.filter(
    (u) =>
      u.is_admin_approved === false &&
      u.user_type !== "pms_admin"
  ).length;

  const totalUsersCount =
    approvedCount + pendingCount + rejectedCount;

  /* ---------------- TABLE COLUMNS ---------------- */
  const userColumn = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/setup/users-details/${row.id}`}
            title="View"
          >
            <BsEye size={18} />
          </Link>

          <Link
            to={`/setup/edit-user/${row.id}`}
            state={{ user: row }}
            title="Edit"
          >
            <BiEdit size={18} />
          </Link>
        </div>
      ),
      width: "200px",
    },

    {
      name: "First Name",
      selector: (row) => row.firstname,
      sortable: true,
    },

    {
      name: "Last Name",
      selector: (row) => row.lastname,
      sortable: true,
    },

    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },

    {
      name: "Mobile",
      selector: (row) => row.mobile || "NA",
      sortable: true,
    },

    {
      name: "App Downloaded",
      selector: (row) =>
        row.is_downloaded ? "Yes" : "No",
      sortable: true,
    },

    {
      name: "Building-Floor-Unit",
      selector: (row) => row.full_unit_name,
      sortable: true,
    },

    {
      name: "User Type",
      selector: (row) => {
        let userType = "User";

        if (row.user_type === "pms_admin") {
          userType = "Admin";
        } else if (row.user_type === "pms_occupant_admin") {
          userType = "Occupant Admin";
        } else if (row.user_type === "pms_technician") {
          userType = "Technician";
        } else if (row.user_type === "pms_occupant") {
          userType = "Occupant";
        } else if (row.user_type === "security_guard") {
          userType = "Security Guard";
        } else if (row.user_type === "employee") {
          userType = "Employee";
        } else if (
          row.user_type === "unit_resident" ||
          row.user_type === "user" ||
          row.user_type === "unit_owner"
        ) {
          userType = "Resident";
        }

        const ownership =
          row.user_sites?.[0]?.ownership;

        const ownershipType =
          row.user_sites?.[0]?.ownership_type;

        if (
          userType === "Resident" ||
          userType === "Occupant" ||
          userType === "Occupant Admin"
        ) {
          if (ownership === "owner") {
            userType += ` - Owner${ownershipType === "primary"
              ? " (Primary)"
              : ownershipType === "secondary"
                ? " (Secondary)"
                : ""
              }`;
          } else if (ownership === "tenant") {
            userType += " - Tenant";
          }
        }

        return userType;
      },
      sortable: true,
      wrap: true,
    },

    {
      name: "Status",
      cell: (row) => (
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.user_status === true}
            onChange={() => handleStatusToggle(row)}
            className="sr-only peer"
          />

          <div
            className={`w-11 h-6 rounded-full relative transition-all duration-300
            ${row.user_status
                ? "bg-green-500"
                : "bg-red-500"
              }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300
              ${row.user_status
                  ? "left-6"
                  : "left-1"
                }`}
            ></div>
          </div>
        </label>
      ),
      sortable: true,
    },

    {
      name: "Approval",
      cell: (row) =>
        activeTab === "pending" ? (
          <div className="flex gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600"
              onClick={() =>
                handleUserApproval(row.id, true)
              }
            >
              <FaCheck size={14} />
            </button>

            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
              onClick={() =>
                handleUserApproval(row.id, false)
              }
            >
              <FaTimes size={14} />
            </button>
          </div>
        ) : row.is_admin_approved === true ? (
          <span className="text-green-600 font-semibold">
            Approved
          </span>
        ) : row.is_admin_approved === false ? (
          <span className="text-red-600 font-semibold">
            Rejected
          </span>
        ) : (
          <span className="text-yellow-600 font-semibold">
            Pending
          </span>
        ),
      sortable: true,
    },

    {
      name: "Created At",
      selector: (row) =>
        new Date(row.created_at).toLocaleDateString(
          "en-GB"
        ),
      sortable: true,
    },
  ];

  /* ---------------- DASHBOARD CARDS ---------------- */
  const totalDownloads =
    users?.filter((user) => user.is_downloaded)
      .length || 0;

  const dashboardCards = [
    {
      title: "Total Users",
      value: totalUsersCount || 0,
      icon: <FaUsers size={22} />,
      bg: "bg-blue-400 text-white",
    },
    {
      title: "Total App Downloads",
      value: totalDownloads || 0,
      icon: <FaDownload size={22} />,
      bg: "bg-green-400 text-white",
    },
    {
      title: "Device Registered",
      value: count?.total_user_downloads || 0,
      icon: <MdDevices size={22} />,
      bg: "bg-purple-400 text-white",
    },
    {
      title: "Tenant Register",
      value: count?.total_tenant_downloads || 0,
      icon: <MdApartment size={22} />,
      bg: "bg-orange-400 text-white",
    },
    {
      title: "Owner Register",
      value: count?.total_owner_downloads || 0,
      icon: <BiUserCheck size={22} />,
      bg: "bg-pink-400 text-white",
    },
    {
      title: "Approved Users",
      value: approvedCount || 0,
      icon: <FaCheckCircle size={22} />,
      bg: "bg-emerald-400 text-white",
    },
    {
      title: "Pending Users",
      value: pendingCount || 0,
      icon: <FaClock size={22} />,
      bg: "bg-yellow-400 text-white",
    },
    {
      title: "Rejected Users",
      value: rejectedCount || 0,
      icon: <FaTimesCircle size={22} />,
      bg: "bg-red-400 text-white",
    },
  ];

  return (
    <section className="flex">
      <Navbar />

      <div className="w-full flex mx-3 flex-col gap-4 overflow-hidden ">

        {/* ✅ SITE HEADER */}
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id);

            setSearchText("");
            setFromDate("");
            setToDate("");
            setUsers([]);
          }}
        />

        {/* ---------- TABS ---------- */}
        <div className="flex bg-gray-100 py-2 rounded-full shadow-inner justify-center ">
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "approved"
              ? "bg-green-300 text-black shadow-md scale-105"
              : "text-gray-600 hover:text-green-600"
              }`}
          >
            Approved Users
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            className={`px-8 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "pending"
              ? "bg-yellow-500 text-black shadow-md scale-105"
              : "text-gray-600 hover:text-yellow-600"
              }`}
          >
            Pending Users
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-8 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "rejected"
              ? "bg-red-400 text-black shadow-md scale-105"
              : "text-gray-600 hover:text-red-600"
              }`}
          >
            Rejected Users
          </button>
        </div>

        {/* SEARCH + BUTTONS */}
        <div className="mt-2 flex md:flex-row flex-col justify-between md:items-center gap-4">
          <input
            type="text"
            placeholder="Search Anything (Name, Email, Mobile and Flat)"
            className="p-2 w-full border border-gray-300 rounded-md placeholder:text-sm outline-none"
            value={searchText}
            onChange={handleSearch}
          />

          <div className="flex gap-3">
            <button
              onClick={() => setFilterOpen(true)}
              style={{ background: themeColor }}
              className="text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaFilter />
              Filter
            </button>

            <Link
              to="/setup/users-setup/add-new-user"
              style={{ background: themeColor }}
              className="font-semibold p-2 px-4 rounded-md text-white flex items-center gap-2"
            >
              <PiPlusCircle size={20} />
              Add
            </Link>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center items-center h-80 mt-10">
            <DNA
              visible={true}
              height={110}
              width={120}
              ariaLabel="dna-loading"
            />
          </div>
        ) : (
          <>
            {/* DASHBOARD */}
            <div className="grid lg:grid-cols-8 md:grid-cols-5 grid-cols-1 gap-8">
              {dashboardCards.map((card, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-r ${card.bg} rounded-xl p-3 shadow-lg hover:scale-90 transform transition duration-300`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium opacity-90">
                        {card.title}
                      </h3>

                      <p className="text-3xl font-bold mt-2">
                        {card.value}
                      </p>
                    </div>

                    <div className="opacity-90">
                      {card.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <Table
                columns={userColumn}
                data={dateFilteredUsers}
              />
            </div>
          </>
        )}

        {/* FILTER MODAL */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">
                  Filter Users By Date
                </h2>

                <button
                  onClick={() => setFilterOpen(false)}
                  className="text-gray-500 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    From Date
                  </label>

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) =>
                      setFromDate(e.target.value)
                    }
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    To Date
                  </label>

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) =>
                      setToDate(e.target.value)
                    }
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={clearDateFilter}
                    className="px-4 py-2 rounded-lg border"
                  >
                    Clear
                  </button>

                  <button
                    onClick={() => setFilterOpen(false)}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserSetup;