import React, { useEffect, useMemo, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import Navbar from "../../components/Navbar";
import Table from "../../components/table/Table";
import { getSetupUsers, getUserCount, getBuildings, updateUserAdminApproval, sendMailToUsers } from "../../api";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { BiEdit, BiUser } from "react-icons/bi";
import { FaCheck, FaDownload, FaUsers } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdApartment, MdDevices } from "react-icons/md";
import { DNA } from "react-loader-spinner";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const UserSetup = () => {
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [count, setCount] = useState({});
  const [activeTab, setActiveTab] = useState("approved");
  const [filters, setFilters] = useState({
    tower: "",
    flat: "",
    status: "",
    appDownloaded: "",
    firstname: "",
    lastname: "",
    ownership: "",
  });

  const themeColor = useSelector((state) => state.theme.color);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const [setupUsers, userCount, buildingRes] = await Promise.all([
          getSetupUsers(),
          getUserCount(),
          getBuildings(),
        ]);

        setCount(userCount.data || {});
        setBuildings(buildingRes.data || []);

        const formattedUsers = (setupUsers.data || []).map((user) => ({
          ...user,
          firstname: user.firstname || "",
          lastname: user.lastname || "",
          mobile: user.mobile || "",
          email: user.email || "",
          Tower: user.user_sites?.[0]?.tower || "",
          Flat: user.user_sites?.[0]?.flat || "",
          Ownership_Types: user.user_sites?.[0]?.ownership_type || "N/A",
          Phase: user.user_phase || "N/A",
          Occupied: user.user_sites?.[0]?.occupied || "N/A",
          Status:
            user.is_admin_approved === true
              ? "Approved"
              : user.is_admin_approved === false
              ? "Rejected"
              : "Pending",
          App_Downloaded: user.is_downloaded ? "Yes" : "No",
          GST_Number: user.gst_number || "N/A",
          PAN_Number: user.pan_number || "N/A",
          Created_On: user.created_at ? new Date(user.created_at).toLocaleDateString() : "",
          Updated_On: user.updated_at ? new Date(user.updated_at).toLocaleDateString() : "",
          full_unit_name: `${user.user_sites?.[0]?.tower || ""}${user.user_sites?.[0]?.flat ? `-${user.user_sites[0].flat}` : ""}`,
        }));

        setUsers(formattedUsers);
        setFilteredData(formattedUsers);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const tabFilteredUsers = useMemo(() => {
    if (activeTab === "approved") {
      return users.filter((u) => u.is_admin_approved === true);
    }
    if (activeTab === "pending") {
      return users.filter((u) => u.is_admin_approved === null || u.is_admin_approved === undefined);
    }
    if (activeTab === "rejected") {
      return users.filter((u) => u.is_admin_approved === false);
    }
    return users;
  }, [users, activeTab]);

  const finalFilteredUsers = useMemo(() => {
    if (!searchText.trim()) return tabFilteredUsers;

    const words = searchText.toLowerCase().split(" ").filter(Boolean);
    return tabFilteredUsers.filter((item) => {
      const searchable = [
        item.firstname,
        item.lastname,
        item.email,
        item.mobile,
        item.user_type,
        item.full_unit_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return words.every((word) => searchable.includes(word));
    });
  }, [searchText, tabFilteredUsers]);

  const applyFilters = () => {
    let filtered = users;

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        filtered = filtered.filter((u) => {
          if (key === "tower" || key === "flat") {
            return (u[key] || "").toString().toLowerCase().includes(value.toLowerCase());
          }
          return (u[key] || "").toString().toLowerCase() === value.toLowerCase();
        });
      }
    });

    setFilteredData(filtered);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleSendMail = async (userId, first, last) => {
    try {
      toast.loading(`Sending Mail to ${first} ${last}...`);
      await sendMailToUsers(userId);
      toast.dismiss();
      toast.success("Welcome Mail Sent");
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong");
    }
  };

  const handleUserApproval = async (id, isApproved) => {
    try {
      const token = localStorage.getItem("TOKEN");
      await updateUserAdminApproval(id, { is_admin_approved: isApproved }, token);
      toast.success(isApproved ? "User approved successfully" : "User rejected successfully");
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_admin_approved: isApproved } : u)));
      setFilteredData((prev) => prev.map((u) => (u.id === id ? { ...u, is_admin_approved: isApproved } : u)));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update approval");
    }
  };

  const totalTotalUsers = users.length;
  const totalAppDownloads = users.filter((u) => u.is_downloaded).length;
  const approvedUsers = users.filter((u) => u.is_admin_approved === true).length;
  const pendingUsers = users.filter((u) => u.is_admin_approved === null || u.is_admin_approved === undefined).length;
  const rejectedUsers = users.filter((u) => u.is_admin_approved === false).length;

  const dashboardCards = [
    { title: "Total Users", value: count?.total_user || totalTotalUsers, icon: <FaUsers size={28} />, bg: "bg-blue-400" },
    { title: "Total App Downloads", value: count?.total_user_downloads || totalAppDownloads, icon: <FaDownload size={28} />, bg: "bg-green-400" },
    { title: "Approved Users", value: approvedUsers, icon: <FaCheck size={28} />, bg: "bg-indigo-400" },
    { title: "Pending Users", value: pendingUsers, icon: <IoClose size={28} />, bg: "bg-yellow-400" },
    { title: "Rejected Users", value: rejectedUsers, icon: <MdDevices size={28} />, bg: "bg-red-400" },
  ];

  const userColumn = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Link to={`/setup/users-details/${row.id}`} title="View"><BsEye size={18} /></Link>
          <Link to={`/setup/edit-user/${row.id}`} state={{ user: row }} title="Edit"><BiEdit size={18} /></Link>
          <button onClick={() => handleSendMail(row.id, row.firstname, row.lastname)} className="text-white bg-blue-500 px-2 py-1 rounded">Send</button>
        </div>
      ),
      width: "200px",
    },
    { name: "Name", selector: (row) => `${row.firstname} ${row.lastname}`, sortable: true },
    { name: "Mobile", selector: (row) => row.mobile || "N/A", sortable: true },
    { name: "Email", selector: (row) => row.email || "N/A", sortable: true },
    { name: "Ownership", selector: (row) => row.Ownership_Types || "N/A", sortable: true },
    { name: "Status", selector: (row) => row.Status || "N/A", sortable: true },
    {
      name: "Approval",
      cell: (row) =>
        activeTab === "pending" ? (
          <div className="flex gap-2">
            <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={() => handleUserApproval(row.id, true)}>✓</button>
            <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => handleUserApproval(row.id, false)}>✕</button>
          </div>
        ) : row.is_admin_approved === true ? (
          <span className="text-green-600">Approved</span>
        ) : row.is_admin_approved === false ? (
          <span className="text-red-600">Rejected</span>
        ) : (
          <span className="text-yellow-600">Pending</span>
        ),
      sortable: true,
    },
  ];

  return (
    <section className="flex bg-gray-50 min-h-screen">
      <Navbar />
      <div className="w-full mx-3 flex flex-col gap-4 overflow-hidden mb-5">
        <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-4 mt-4">
          {dashboardCards.map((card, idx) => (
            <div key={idx} className={`bg-gradient-to-r ${card.bg} text-white rounded-xl p-5 shadow-lg`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">{card.title}</p>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                </div>
                <div className="opacity-90">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <button onClick={() => setActiveTab("approved")} className={`px-4 py-2 rounded-full ${activeTab === "approved" ? "bg-green-500 text-white" : "bg-white"}`}>Approved</button>
          <button onClick={() => setActiveTab("pending")} className={`px-4 py-2 rounded-full ${activeTab === "pending" ? "bg-yellow-500 text-white" : "bg-white"}`}>Pending</button>
          <button onClick={() => setActiveTab("rejected")} className={`px-4 py-2 rounded-full ${activeTab === "rejected" ? "bg-red-500 text-white" : "bg-white"}`}>Rejected</button>
        </div>

        <div className="mt-3 flex flex-col md:flex-row gap-3 justify-between md:items-center">
          <input value={searchText} onChange={handleSearch} className="border px-3 py-2 rounded-md w-full md:w-3/5" placeholder="Search by name/email/mobile" />
          <Link to="/setup/users-setup/add-new-user" className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2"><PiPlusCircle />Add User</Link>
        </div>

        <button onClick={() => setShowFilter((prev) => !prev)} className="text-sm text-blue-600 mt-2">{showFilter ? "Hide Filters" : "Show Filters"}</button>

        {showFilter && (
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-3">
              <input value={filters.firstname} onChange={(e) => setFilters((prev) => ({ ...prev, firstname: e.target.value }))} className="border p-2 rounded" placeholder="First Name" />
              <input value={filters.lastname} onChange={(e) => setFilters((prev) => ({ ...prev, lastname: e.target.value }))} className="border p-2 rounded" placeholder="Last Name" />
              <input value={filters.tower} onChange={(e) => setFilters((prev) => ({ ...prev, tower: e.target.value }))} className="border p-2 rounded" placeholder="Tower" />
              <input value={filters.flat} onChange={(e) => setFilters((prev) => ({ ...prev, flat: e.target.value }))} className="border p-2 rounded" placeholder="Flat" />
              <select value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))} className="border p-2 rounded"><option value="">Status</option><option value="Approved">Approved</option><option value="Pending">Pending</option><option value="Rejected">Rejected</option></select>
              <select value={filters.appDownloaded} onChange={(e) => setFilters((prev) => ({ ...prev, appDownloaded: e.target.value }))} className="border p-2 rounded"><option value="">App Download</option><option value="Yes">Yes</option><option value="No">No</option></select>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={applyFilters} style={{ background: themeColor }} className="text-white px-4 py-2 rounded">Apply</button>
              <button onClick={() => { setFilters({ tower: "", flat: "", status: "", appDownloaded: "", firstname: "", lastname: "", ownership: ""}); setFilteredData(users); }} className="border px-4 py-2 rounded">Reset</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-4">
          {loading ? <p className="text-center">Loading users...</p> : <Table columns={userColumn} data={finalFilteredUsers} />}
        </div>
      </div>
    </section>
  );
};

export default UserSetup;