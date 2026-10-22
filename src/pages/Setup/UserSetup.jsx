import { useEffect, useMemo, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import Navbar from "../../components/Navbar";
import Table from "../../components/table/Table";
import {
  getSetupUsers,
  getUserCount,
  putSetupUser,
  updateUserAdminApproval,
  sendBulkWelcomeEmail,
  UsersExport,
  getBuildings,
  getAllFloors,
  getAllUnits,
  UsersImport,
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
  FaEnvelope,
  FaPaperclip,
  FaAndroid,
  FaApple,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { BiEdit, BiUserCheck } from "react-icons/bi";
import { DNA } from "react-loader-spinner";
import { MdApartment, MdDevices } from "react-icons/md";
import { useSelector } from "react-redux";
import SiteHeader from "../../components/SiteHeader";
import { getItemInLocalStorage } from "../../utils/localStorage";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import { Download, UploadCloud } from "lucide-react";

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
  const [filterFirstName, setFilterFirstName] = useState("");
  const [filterLastName, setFilterLastName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterMobile, setFilterMobile] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterAppDownloaded, setFilterAppDownloaded] = useState("");
  const [filterBuilding, setFilterBuilding] = useState("");
  const [filterFloor, setFilterFloor] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);
   const [emailAttachments, setEmailAttachments] = useState([]);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importingUsers, setImportingUsers] = useState(false);


  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ✅ BULK EMAIL SELECTION STATE
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sendingBulkEmail, setSendingBulkEmail] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const buildUserFilterParams = () => {
  const params = {};

  if (activeSiteId) {
    params["q[user_sites_site_id_eq]"] = activeSiteId;
    params["q[site_id]"] = activeSiteId;
  }

  if (filterFirstName.trim()) params["q[firstname_eq]"] = filterFirstName.trim();
  if (filterLastName.trim()) params["q[lastname_eq]"] = filterLastName.trim();
  if (filterEmail.trim()) params["q[email_eq]"] = filterEmail.trim();
  if (filterMobile.trim()) params["q[mobile_eq]"] = filterMobile.trim();

  if (filterBuilding) params["q[building_id_eq]"] = filterBuilding;
  if (filterFloor) params["q[floor_id_eq]"] = filterFloor;
  if (filterUnit) params["q[unit_id_eq]"] = filterUnit;

  if (filterAppDownloaded === "yes") {
    params["q[is_downloaded_eq]"] = true;
  } else if (filterAppDownloaded === "no") {
    params["q[is_downloaded_eq]"] = false;
  }

  if (fromDate) params["q[created_at_gteq]"] = `${fromDate} 00:00:00`;
  if (toDate) params["q[created_at_lteq]"] = `${toDate} 23:59:59`;

  return params;
};

  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);

      const setupUsers = await getSetupUsers(params);
      const userCount = await getUserCount();

      setCount(userCount.data);

      const data = setupUsers.data || [];
      const filteredSiteUsers = data.filter((user) => {
        if (!activeSiteId) return true;

        if (String(user.site_id) === String(activeSiteId)) return true;

        return Array.isArray(user.user_sites) &&
          user.user_sites.some(
            (site) => String(site.site_id) === String(activeSiteId)
          );
      });

      setUsers(filteredSiteUsers);
      setFilteredData(filteredSiteUsers);
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- USE EFFECT ---------------- */
  useEffect(() => {
    fetchUsers();
  }, [activeSiteId]);

  // ✅ CLEAR SELECTION WHEN SWITCHING TABS
  useEffect(() => {
    setSelectedUsers([]);
  }, [activeTab]);

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

  
const handleExportUsers = async () => {
  try {
    const filterParams = buildUserFilterParams();

    const response = await UsersExport(filterParams);

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered_users.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Failed to export users");
  }
};

  const matchesTextFilter = (values, filterValue) => {
    const search = String(filterValue || "").trim().toLowerCase();

    if (!search) return true;

    return values.some((value) =>
      String(value ?? "").toLowerCase().includes(search)
    );
  };

  const getFilterValues = (user, type) => {
    const values = [];

    const add = (...items) => {
      items.forEach((item) => {
        if (item !== null && item !== undefined && item !== "") {
          values.push(String(item).trim().toLowerCase());
        }
      });
    };

    // Read the nested objects in your API response.
    if (type === "building") {
      add(
        user.building?.name,
        user.building?.id,
        user.building_name,
        user.build_id,
        user.building_id
      );
    }

    if (type === "floor") {
      add(
        user.floor?.name,
        user.floor?.id,
        user.floor_name,
        user.floor_id,
        user.unit?.floor_id
      );
    }

    if (type === "unit") {
      add(
        user.unit?.name,
        user.unit?.id,
        user.unit_name,
        user.unit_id,
        user.full_unit_name
      );
    }

    // Read site-specific location details.
    if (Array.isArray(user.user_sites)) {
      user.user_sites.forEach((site) => {
        if (type === "building") {
          add(
            site.building?.name,
            site.building?.id,
            site.building_name,
            site.build_id,
            site.building_id
          );
        }

        if (type === "floor") {
          add(
            site.floor?.name,
            site.floor?.id,
            site.floor_name,
            site.floor_id
          );
        }

        if (type === "unit") {
          add(
            site.unit?.name,
            site.unit?.id,
            site.unit_name,
            site.unit_id,
            site.full_unit_name,
            site.hierarchy
          );
        }
      });
    }

    return values;
  };

  const matchesLocationFilter = (user, type, selectedId) => {
  if (!selectedId) return true;

  const idFields = {
    building: ["build_id", "building_id"],
    floor: ["floor_id"],
    unit: ["unit_id"],
  };

  const ids = [];
  const nested = user[type];

  if (nested?.id != null) {
    ids.push(String(nested.id));
  }

  idFields[type].forEach((field) => {
    if (user[field] != null) {
      ids.push(String(user[field]));
    }
  });

  if (Array.isArray(user.user_sites)) {
    user.user_sites.forEach((site) => {
      idFields[type].forEach((field) => {
        if (site[field] != null) {
          ids.push(String(site[field]));
        }
      });

      if (site[type]?.id != null) {
        ids.push(String(site[type].id));
      }
    });
  }

  return ids.includes(String(selectedId));
};


useEffect(() => {
  const fetchLocationOptions = async () => {
    if (!activeSiteId) {
      setBuildings([]);
      setFloors([]);
      setUnits([]);
      return;
    }

    try {
      const token = getItemInLocalStorage("TOKEN");

      const params = {
        token: token || "",
        site_id: activeSiteId,
      };

      const [buildingResponse, floorResponse, unitResponse] =
        await Promise.all([
          getBuildings({
            ...params,
            Page: 1,
            Per_Page: 1000,
          }),
          getAllFloors(params),
          getAllUnits(params),
        ]);

      const getList = (response, keys) => {
        const data = response?.data ?? response;

        if (Array.isArray(data)) {
          return data;
        }

        for (const key of keys) {
          if (Array.isArray(data?.[key])) {
            return data[key];
          }
        }

        return [];
      };

      setBuildings(
        getList(buildingResponse, ["buildings", "data"])
      );

      setFloors(
        getList(floorResponse, ["floors", "data"])
      );

      setUnits(
        getList(unitResponse, ["units", "data"])
      );
    } catch (error) {
      console.error("Location options error:", error);

      setBuildings([]);
      setFloors([]);
      setUnits([]);

      toast.error("Failed to load location options");
    }
  };

  fetchLocationOptions();
}, [activeSiteId]);


  /* ---------------- DATE FILTER ---------------- */
  const dateFilteredUsers = useMemo(() => {
    let data = [...tabFilteredUsers];

    const firstName = filterFirstName.trim().toLowerCase();
    const lastName = filterLastName.trim().toLowerCase();
    const email = filterEmail.trim().toLowerCase();
    const mobile = filterMobile.trim().toLowerCase();
    const building = filterBuilding.trim().toLowerCase();
    const floor = filterFloor.trim().toLowerCase();
    const unit = filterUnit.trim().toLowerCase();

    return data.filter((user) => {
      /* ---------- FIRST NAME ---------- */
      if (
        firstName &&
        !String(user.firstname || "")
          .toLowerCase()
          .includes(firstName)
      ) {
        return false;
      }

      /* ---------- LAST NAME ---------- */
      if (
        lastName &&
        !String(user.lastname || "")
          .toLowerCase()
          .includes(lastName)
      ) {
        return false;
      }

      /* ---------- EMAIL ---------- */
      if (
        email &&
        !String(user.email || "")
          .toLowerCase()
          .includes(email)
      ) {
        return false;
      }

      /* ---------- MOBILE ---------- */
      if (
        mobile &&
        !String(user.mobile || "")
          .toLowerCase()
          .includes(mobile)
      ) {
        return false;
      }

      /* ---------- FROM DATE ---------- */
      if (fromDate) {
        if (!user.created_at) return false;

        const created = new Date(user.created_at);
        const from = new Date(fromDate);

        from.setHours(0, 0, 0, 0);

        if (created < from) {
          return false;
        }
      }

      /* ---------- TO DATE ---------- */
      if (toDate) {
        if (!user.created_at) return false;

        const created = new Date(user.created_at);
        const to = new Date(toDate);

        to.setHours(23, 59, 59, 999);

        if (created > to) {
          return false;
        }
      }

      // APP DOWNLOADED FILTER
      if (filterAppDownloaded !== "") {
        const downloaded =
          user.is_downloaded === true ||
          String(user.is_downloaded).toLowerCase() === "true" ||
          String(user.is_downloaded) === "1";

        if (filterAppDownloaded === "yes" && !downloaded) {
          return false;
        }

        if (filterAppDownloaded === "no" && downloaded) {
          return false;
        }
      }
if (
  !matchesLocationFilter(
    user,
    "building",
    filterBuilding
  )
) {
  return false;
}

if (
  !matchesLocationFilter(
    user,
    "floor",
    filterFloor
  )
) {
  return false;
}

if (
  !matchesLocationFilter(
    user,
    "unit",
    filterUnit
  )
) {
  return false;
}

      return true;
    });
  }, [
    tabFilteredUsers,
    filterFirstName,
    filterLastName,
    filterEmail,
    filterMobile,
    fromDate,
    toDate,
    filterAppDownloaded,
    filterBuilding,
    filterFloor,
    filterUnit,
  ]);

  // ✅ Reset to page 1 whenever the filtered list itself changes (tab,
  // search, date filter) so we never show a stale page past the end.
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilteredUsers]);

  const pagedUsers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;

    return dateFilteredUsers.slice(start, start + rowsPerPage);
  }, [dateFilteredUsers, currentPage, rowsPerPage]);

  /* ---------------- CLEAR ALL FILTERS ---------------- */
  const clearDateFilters = () => {
    setFromDate("");
    setToDate("");
    setFilterFirstName("");
    setFilterLastName("");
    setFilterEmail("");
    setFilterMobile("");
    setFilterAppDownloaded("");
    setFilterBuilding("");
    setFilterFloor("");
    setFilterUnit("");
    setSearchText("");
    setFilteredData(users);
    setCurrentPage(1);
    setFilterOpen(false);
    setFilterBuilding("");
setFilterFloor("");
setFilterUnit("");
  };

   const handleImportUsers = async () => {
    if (!importFile) {
      toast.error("Select an Excel file first");
      return;
    }

    try {
      setImportingUsers(true);
      await UsersImport(importFile, activeSiteId);

      toast.success("Users imported successfully");
      setImportFile(null);
      setImportModalOpen(false);
      await fetchUsers(buildUserFilterParams());
    } catch (error) {
      console.error("Import users error:", error);
      toast.error(
        error.response?.data?.message || "Failed to import users"
      );
    } finally {
      setImportingUsers(false);
    }
  };

  /* ---------------- USER APPROVAL ---------------- */
  const handleUserApproval = async (id, isApproved) => {
    const token = localStorage.getItem("TOKEN");

    // Optimistically update BOTH users and filteredData
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

    setFilteredData((prev) =>
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

      // Restore latest data if API fails
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
      fetchUsers();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update status ❌");
    }
  };

  /* ---------------- BULK EMAIL ---------------- */
  const handleSendBulkEmail = async () => {
    if (selectedUsers.length === 0) return;

    const userIds = selectedUsers.map((u) => u.id);

    try {
      setSendingBulkEmail(true);

      const res = await sendBulkWelcomeEmail(userIds, emailAttachments);
      const sentCount = res?.data?.sent?.length ?? userIds.length;
      const failedCount = res?.data?.failed?.length ?? 0;

      if (failedCount > 0) {
        toast.error(
          `Sent ${sentCount} email(s), ${failedCount} failed ❌`
        );
      } else {
        toast.success(`Welcome email sent to ${sentCount} user(s) ✅`);
      }

      setSelectedUsers([]);
      setEmailAttachments([]);
      setEmailModalOpen(false);
    } catch (error) {
      console.error(error);

      toast.error("Failed to send bulk email ❌");
    } finally {
      setSendingBulkEmail(false);
    }
  };

  const handleAddAttachments = (e) => {
    const newFiles = Array.from(e.target.files || []);

    setEmailAttachments((prev) => [...prev, ...newFiles]);

    e.target.value = "";
  };

  const handleRemoveAttachment = (index) => {
    setEmailAttachments((prev) => prev.filter((_, i) => i !== index));
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

  // Owner count based on selected site's ownership
  const ownerCount = users.filter((user) =>
    Array.isArray(user.user_sites) &&
    user.user_sites.some(
      (site) =>
        String(site.site_id) === String(activeSiteId) &&
        String(site.ownership || "").toLowerCase() === "owner"
    )
  ).length;

  // Tenant count based on selected site's ownership
  const tenantCount = users.filter((user) =>
    Array.isArray(user.user_sites) &&
    user.user_sites.some(
      (site) =>
        String(site.site_id) === String(activeSiteId) &&
        String(site.ownership || "").toLowerCase() === "tenant"
    )
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
      width: "100px",
    },

    {
      name: "First Name",
      selector: (row) => row.firstname,
      sortable: true,
      width: "100px",
    },

    {
      name: "Last Name",
      selector: (row) => row.lastname,
      sortable: true,
      width: "100px",
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
      width: "150px",
    },

    {
      name: "App Downloaded",
      cell: (row) => {
        if (!row.is_downloaded) {
          return (
            <span className="text-red-500 font-semibold">
              No
            </span>
          );
        }

        const devices = Array.isArray(row.user_deives)
          ? row.user_deives.filter(Boolean)
          : [];

        const latestDevice =
          devices.length > 0
            ? [...devices].sort(
              (a, b) =>
                new Date(b.created_at || 0) -
                new Date(a.created_at || 0)
            )[0]
            : null;

        const deviceType = String(
          latestDevice?.device_type || ""
        ).toLowerCase();

        return (
          <div className="flex items-center gap-2">
            {deviceType === "android" && (
              <FaAndroid
                size={22}
                className="text-green-600"
                title={`Android - ${latestDevice?.device_name || ""}`}
              />
            )}

            {deviceType === "ios" && (
              <FaApple
                size={22}
                className="text-gray-800"
                title={`iOS - ${latestDevice?.device_name || ""}`}
              />
            )}
            <span className="text-green-600 font-semibold">
              Yes
            </span>
          </div>
        );
      },
      sortable: true,
      width: "160px",
    },

    {
      name: "App Download Date & Time",
      cell: (row) => {
        const devices = Array.isArray(row.user_deives)
          ? row.user_deives.filter(Boolean)
          : [];

        const latestDevice =
          devices.length > 0
            ? [...devices].sort(
              (a, b) =>
                new Date(b.created_at || 0) -
                new Date(a.created_at || 0)
            )[0]
            : null;

        if (!row.is_downloaded || !latestDevice?.created_at) {
          return "-";
        }

        return new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date(latestDevice.created_at));
      },
      sortable: true,
      width: "220px",
    },

    {
      name: "Building-Floor-Unit",
      selector: (row) => row.full_unit_name,
      sortable: true,
    },

    {
      name: "User Type",
      selector: (row) => {
        const userTypeValue = String(row.user_type || "").toLowerCase();

        let userType = "User";

        if (userTypeValue === "pms_admin") {
          userType = "Admin";
        } else if (userTypeValue === "pms_occupant_admin") {
          userType = "Occupant Admin";
        } else if (userTypeValue === "pms_technician") {
          userType = "Technician";
        } else if (userTypeValue === "pms_occupant") {
          userType = "Occupant";
        } else if (userTypeValue === "security_guard") {
          userType = "Security Guard";
        } else if (row.user_type === "valet_manager") {
          userType = "Valet Manager";
        } else if (row.user_type === "employee") {
          userType = "Employee";
        } else if (
          userTypeValue === "unit_resident" ||
          userTypeValue === "user" ||
          userTypeValue === "unit_owner"
        ) {
          userType = "Resident";
        }

        const ownership = row.user_sites?.[0]?.ownership;
        const ownershipType = row.user_sites?.[0]?.ownership_type;

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
      width: "120px"
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
      width: "150px"
    },

    {
      name: "Created At",
      selector: (row) => {
        if (!row.created_at) return "NA";

        return new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date(row.created_at));
      },
      sortable: true,
      // wrap: true,
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
    // {
    //   title: "Device Registered",
    //   value: count?.total_user_downloads || 0,
    //   icon: <MdDevices size={22} />,
    //   bg: "bg-purple-400 text-white",
    // },
    {
      title: "Tenant Register",
      value: tenantCount || 0,
      icon: <MdApartment size={22} />,
      bg: "bg-orange-400 text-white",
    },
    {
      title: "Owner Register",
      value: ownerCount || 0,
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
      <SetupNavbar />

      <div className="w-full flex mx-3 flex-col gap-4 overflow-hidden ">

        {/* ✅ SITE HEADER */}
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id);

            setSearchText("");
            setFromDate("");
            setToDate("");
            setFilterFirstName("");
            setFilterLastName("");
            setFilterEmail("");
            setFilterMobile("");
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
            {selectedUsers.length > 0 && (
              // Sends immediately on click (no attachment popup) — the
              // popup below is intentionally left wired but unused while
              // per-send attachments are on hold; attachments for the
              // welcome email are configured once per site instead, in
              // Welcome Mail Setup. Re-point this onClick at
              // `() => setEmailModalOpen(true)` to bring the popup back.
              <button
                onClick={handleSendBulkEmail}
                disabled={sendingBulkEmail}
                title={
                  sendingBulkEmail
                    ? "Sending..."
                    : `Send welcome email to ${selectedUsers.length} selected user(s)`
                }
                style={{ background: themeColor }}
                className="relative text-white w-10 h-10 rounded-md flex items-center justify-center disabled:opacity-60"
              >
                <FaEnvelope size={16} />
                {!sendingBulkEmail && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] leading-none rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {selectedUsers.length}
                  </span>
                )}
              </button>
            )}

              <button
              onClick={() => setImportModalOpen(true)}
              style={{ background: themeColor }}
              className="text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <UploadCloud />
              Import
            </button>

            <button
              onClick={handleExportUsers}
              style={{ background: themeColor }}
              className="text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Download />
              Export
            </button>

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
            <div className="grid lg:grid-cols-7 md:grid-cols-5 grid-cols-1 gap-4">
              {dashboardCards.map((card, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-r ${card.bg} rounded-xl p-3 shadow-lg hover:scale-90 transform transition duration-300`}
                >
                  <div className="flex justify-between items-center h-[70px]">
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
            <div className="bg-white rounded-xl shadow-md p-3">
              <Table
                columns={userColumn}
                data={pagedUsers}
                selectableRow
                onSelectedRows={setSelectedUsers}
                paginationServer
                paginationTotalRows={dateFilteredUsers.length}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onChangePage={setCurrentPage}
                onChangeRowsPerPage={(newPerPage, page) => {
                  setRowsPerPage(newPerPage);
                  setCurrentPage(page);
                }}
              />
            </div>
          </>
        )}

        {/* FILTER MODAL */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-[800px] p-6 max-h-[90vh] overflow-y-auto">

              {/* HEADER */}
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">
                  Filter Users
                </h2>

                <button
                  onClick={() => setFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* FIRST NAME */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    First Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter First Name"
                    value={filterFirstName}
                    onChange={(e) => setFilterFirstName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* LAST NAME */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    value={filterLastName}
                    onChange={(e) => setFilterLastName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email ID
                  </label>

                  <input
                    type="email"
                    placeholder="Enter Email ID"
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* MOBILE */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Mobile
                  </label>

                  <input
                    type="text"
                    placeholder="Enter Mobile"
                    value={filterMobile}
                    onChange={(e) => setFilterMobile(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>


                {/* APP DOWNLOADED */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    App Downloaded
                  </label>
                  <select
                    value={filterAppDownloaded}
                    onChange={(e) => setFilterAppDownloaded(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1"
                  >
                    <option value="">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>


                {/* BUILDING DROPDOWN */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Building
                  </label>

                  <select
                    value={filterBuilding}
                    onChange={(e) => {
                      setFilterBuilding(e.target.value);
                      setFilterFloor("");
                      setFilterUnit("");
                    }}
                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1"
                  >
                    <option value="">All Buildings</option>

                    {buildings.map((building) => (
                      <option key={building.id} value={String(building.id)}>
                        {building.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* FLOOR DROPDOWN */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Floor
                  </label>

                  <select
                    value={filterFloor}
                    onChange={(e) => {
                      setFilterFloor(e.target.value);
                      setFilterUnit("");
                    }}
                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1"
                  >
                    <option value="">All Floors</option>

                    {floors
                      .filter((floor) => {
                        if (!filterBuilding) return true;

                        return String(
                          floor.building_id ??
                          floor.build_id ??
                          floor.building?.id ??
                          ""
                        ) === filterBuilding;
                      })
                      .map((floor) => (
                        <option key={floor.id} value={String(floor.id)}>
                          {floor.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* UNIT DROPDOWN */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Unit
                  </label>

                  <select
                    value={filterUnit}
                    onChange={(e) => setFilterUnit(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1"
                  >
                    <option value="">All Units</option>

                    {units
                      .filter((unit) => {
                        if (filterFloor) {
                          return String(
                            unit.floor_id ?? unit.floor?.id ?? ""
                          ) === filterFloor;
                        }

                        if (filterBuilding) {
                          return String(
                            unit.building_id ??
                            unit.build_id ??
                            unit.building?.id ??
                            ""
                          ) === filterBuilding;
                        }

                        return true;
                      })
                      .map((unit) => (
                        <option key={unit.id} value={String(unit.id)}>
                          {unit.name}
                        </option>
                      ))}
                  </select>
                </div>


                {/* FROM DATE */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    From Date
                  </label>

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* TO DATE */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    To Date
                  </label>

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* BUTTONS */}
                <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                  <button
                    onClick={clearDateFilters}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                  >
                    Clear
                  </button>

                     <button
                    onClick={() => {
                      setCurrentPage(1);
                      setFilterOpen(false);
                      fetchUsers(buildUserFilterParams());
                    }}
                    style={{ background: themeColor }}
                    className="px-5 py-2 text-white rounded-lg"
                  >
                    Apply
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* SEND EMAIL MODAL */}
        {emailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-[440px] p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">
                  Send Welcome Email
                </h2>

                <button
                  onClick={() => {
                    if (sendingBulkEmail) return;

                    setEmailModalOpen(false);
                  }}
                  className="text-gray-500 text-xl"
                >
                  ×
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                This will send the welcome email to{" "}
                <span className="font-semibold">
                  {selectedUsers.length}
                </span>{" "}
                selected user(s).
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Attachments{" "}
                    <span className="text-gray-400 font-normal">
                      (optional — attached to every email)
                    </span>
                  </label>

                  <label className="flex items-center justify-center gap-2 border border-dashed rounded-lg p-3 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                    <FaPaperclip />
                    Choose file(s)
                    <input
                      type="file"
                      multiple
                      onChange={handleAddAttachments}
                      className="hidden"
                    />
                  </label>

                  {emailAttachments.length > 0 && (
                    <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                      {emailAttachments.map((file, index) => (
                        <li
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between text-xs bg-gray-100 rounded px-2 py-1"
                        >
                          <span className="truncate mr-2">
                            {file.name}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveAttachment(index)
                            }
                            className="text-red-500 shrink-0"
                            title="Remove"
                          >
                            <FaTimes size={12} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setEmailModalOpen(false)}
                    disabled={sendingBulkEmail}
                    className="px-4 py-2 rounded-lg border disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSendBulkEmail}
                    disabled={sendingBulkEmail}
                    style={{ background: themeColor }}
                    className="px-5 py-2 text-white rounded-lg disabled:opacity-60"
                  >
                    {sendingBulkEmail ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

         {importModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Import Users</h2>
                <button
                  type="button"
                  onClick={() => {
                    if (importingUsers) return;
                    setImportModalOpen(false);
                    setImportFile(null);
                  }}
                  className="text-xl text-gray-500"
                  aria-label="Close import dialog"
                >
                  ×
                </button>
              </div>

              <label
                htmlFor="users-import-file"
                className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 text-center"
              >
                <UploadCloud size={30} className="mb-3 text-indigo-500" />
                <span className="text-sm font-medium">
                  {importFile?.name || "Drag and drop a file here or browse"}
                </span>
                <span className="mt-2 text-xs text-gray-500">
                  Supported formats: .xlsx, .xls
                </span>
              </label>

              <input
                id="users-import-file"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(event) =>
                  setImportFile(event.target.files?.[0] || null)
                }
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setImportModalOpen(false);
                    setImportFile(null);
                  }}
                  disabled={importingUsers}
                  className="rounded-lg border px-4 py-2 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImportUsers}
                  disabled={!importFile || importingUsers}
                  style={{ background: themeColor }}
                  className="rounded-lg px-5 py-2 text-white disabled:opacity-60"
                >
                  {importingUsers ? "Uploading..." : "Upload Users"}
                </button>
              </div>
            </div>
          </div>
        )}
    </section>
  );
};

export default UserSetup;