import { useEffect, useMemo, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import Navbar from "../../components/Navbar";
import Table from "../../components/table/Table";
import { getSetupUsers, getUserCount, putSetupUser, updateUserAdminApproval } from "../../api";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { FaCheck, FaTimes } from "react-icons/fa";
// import { useSelector } from "react-redux";
import toast from "react-hot-toast";
// import { getItemInLocalStorage } from "../../utils/localStorage";
import { BiEdit, BiUser } from "react-icons/bi";
import { DNA } from "react-loader-spinner";
import { FaDownload, FaUsers } from "react-icons/fa";
import { MdApartment, MdDevices } from "react-icons/md";

const UserSetup = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [count, setCount] = useState("");
  const [activeTab, setActiveTab] = useState("approved"); // NEW
  const [loading, setLoading] = useState(true); // Add loading state
  // const themeColor = useSelector((state) => state.theme.color);

  // console.log("akshay", akshay);
  // const users = akshay.users || [];
  // console.log("Users:", users);
  const fetchUsers = async () => {
      try {
        setLoading(true); // Start loading
        const setupUsers = await getSetupUsers();
        const userCount = await getUserCount();
        setCount(userCount.data);
        const data = setupUsers.data || [];
        setUsers(data);

        setFilteredData(setupUsers.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

  useEffect(() => {
        fetchUsers();
  }, []);

 const tabFilteredUsers = useMemo(() => {
  if (activeTab === "approved") {
    return users.filter(
      (user) =>
        user.is_admin_approved === true ||
        user.user_type === "pms_admin" // always approved
    );
  }

  if (activeTab === "pending") {
    return users.filter(
      (user) =>
        user.is_admin_approved === null &&
        user.user_type !== "pms_admin" // exclude admin
    );
  }

  if (activeTab === "rejected") {
    return users.filter(
      (user) =>
        user.is_admin_approved === false &&
        user.user_type !== "pms_admin"
    );
  }

  return users;
}, [users, activeTab]);


  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    if (searchValue.trim() === "") {
      setFilteredData(users);
    } else {
      const searchWords = searchValue.toLowerCase().split(" ").filter(Boolean);
      const filteredResults = users.filter((item) => {
        // Combine searchable fields into one string
        const searchable = [
          item.firstname,
          item.lastname,
          // item.unit_name,
          item.email,
          item.mobile,
          item.user_type,
          item.unit?.name || "",
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        // Check if every search word is present in the combined string
        return searchWords.every((word) => searchable.includes(word));
      });
      setFilteredData(filteredResults);
    }
  };

  const finalFilteredUsers = useMemo(() => {
    if (!searchText.trim()) return tabFilteredUsers;

    const searchWords = searchText.toLowerCase().split(" ").filter(Boolean);

    return tabFilteredUsers.filter((item) => {
      const searchable = [
        item.firstname,
        item.lastname,
        item.email,
        item.mobile,
        item.user_type,
        item.unit?.name || "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchWords.every((word) => searchable.includes(word));
    });
  }, [searchText, tabFilteredUsers]);

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

    // ✅ FIXED TOAST
    if (isApproved === true) {
      toast.success("User approved successfully ✅");
    } else {
      toast.error("User rejected successfully ❌");
    }

  } catch (err) {
    console.error(err);

    toast.error("Failed to update approval ❌");

    // rollback if failed
    fetchUsers();
  }
};

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
  // const totalUsers = users.length;
  // const appDownloadedCount = users.filter((user) => user.is_downloaded).length;
  // const appDownloadTenant = users.filter(
  //   (user) =>
  //     user.is_downloaded &&
  //     user.user_sites.some((site) => site.ownership === "tenant")
  // ).length;
  // const appDownloadOwner = users.filter(
  //   (user) =>
  //     user.is_downloaded &&
  //     user.user_sites.some((site) => site.ownership === "owner")
  // ).length;
  // const approvedUsers = users.filter(
  //   (user) => user.status === "approved"
  // ).length;
  // const pendingUsers = users.filter((user) => user.status === "pending").length;

  const userColumn = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Link to={`/setup/users-details/${row.id}`} title="View"><BsEye size={18} /></Link>
          <Link to={`/setup/edit-user/${row.id}`} state={{ user: row }} title="Edit"><BiEdit size={18} /></Link>
        </div>
      ),
      width: "200px",
    },
    { name: "First Name", selector: (row) => row.firstname, sortable: true },
    { name: "Last Name", selector: (row) => row.lastname, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Mobile", selector: (row) => row.mobile || "NA", sortable: true },
    {
      name: "App Downloaded",
      selector: (row) => (row.is_downloaded ? "Yes" : "No"),
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
        // Determine base user type
        let userType = "USERTYPE";
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
          row.user_type === "user"
        ) {
          userType = "Resident";
        } else if (row.user_type === "unit_owner") {
          userType = "Resident";
        } else {
          userType = "User";
        }

        // Get ownership info from user_sites if available
        const ownership = row.user_sites?.[0]?.ownership;
        const ownershipType = row.user_sites?.[0]?.ownership_type;

        // Add ownership suffix for residents
        if (
          userType === "Resident" ||
          userType === "Occupant" ||
          userType === "Occupant Admin"
        ) {
          if (ownership === "owner") {
            userType += ` - Owner${ownershipType === "primary" ? " (Primary)" : ownershipType === "secondary" ? " (Secondary)" : ""}`;
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

      {/* Track */}
      <div
        className={`w-11 h-6 rounded-full relative transition-all duration-300
          ${row.user_status ? "bg-green-500" : "bg-red-500"}
        `}
      >
        {/* Thumb */}
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300
            ${row.user_status ? "left-6" : "left-1"}
          `}
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
              onClick={() => handleUserApproval(row.id, true)}
            >
              <FaCheck size={14} />
            </button>

            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
              onClick={() => handleUserApproval(row.id, false)}
            >
              <FaTimes size={14} />
            </button>
          </div>
        ) : row.is_admin_approved === true ? (
          <span className="text-green-600 font-semibold">Approved</span>
        ) : row.is_admin_approved === false ? (
          <span className="text-red-600 font-semibold">Rejected</span>
        ) : (
          <span className="text-yellow-600 font-semibold">Pending</span>
        ),
      sortable: true,
    }
  ];

  const totalDownloads = users?.filter(user => user.is_downloaded).length || 0;

  const dashboardCards = [
    {
      title: "Total Users",
      value: count?.total_user || 0,
      icon: <FaUsers size={28} />,
      bg: "from-blue-500 to-blue-700",
    },
    {
      title: "Total App Downloads",
      value: totalDownloads || 0,
      icon: <FaDownload size={28} />,
      bg: "from-green-500 to-green-700",
    },
    {
      title: "Device Registered",
      value: count?.total_user_downloads || 0,
      icon: <MdDevices size={28} />,
      bg: "from-purple-500 to-purple-700",
    },
    {
      title: "Tenant Register",
      value: count?.total_tenant_downloads || 0,
      icon: <MdApartment size={28} />,
      bg: "from-orange-500 to-orange-600",
    },
    {
      title: "Owner Register",
      value: count?.total_owner_downloads || 0,
      icon: <BiUser size={28} />,
      bg: "from-pink-500 to-pink-700",
    },
  ];
  console.log("Filtered Data:", users);

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col gap-4 overflow-hidden mb-5">
        {/* ---------- TABS ---------- */}
        <div className="flex bg-gray-100 py-2 rounded-full shadow-inner justify-center mt-4 ">

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

        <div className="mt-5 flex md:flex-row flex-col justify-between md:items-center gap-4">
          <input
            type="text"
            placeholder="Search Anything (Name, Email and Mobile) along with Spaces"
            className="p-2 w-full border border-gray-300 rounded-md placeholder:text-sm outline-none"
            value={searchText}
            onChange={handleSearch}
          />
          <Link
            to="/setup/users-setup/add-new-user"
            style={{ background: "rgb(19 27 32)" }}
            className="font-semibold p-2 px-4 rounded-md text-white flex items-center gap-2"
          >
            <PiPlusCircle size={20} /> Add
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-80 mt-10">
            <DNA
              visible={true}
              height={110}
              width={120}
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        ) : (
          <>
            {/* Attractive Dashboard Cards */}
            <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-8">
              {dashboardCards.map((card, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-r ${card.bg} text-white rounded-xl p-6 shadow-lg hover:scale-105 transform transition duration-300`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium opacity-90">
                        {card.title}
                      </h3>
                      <p className="text-3xl font-bold mt-2">{card.value}</p>
                    </div>
                    <div className="opacity-90">{card.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <Table columns={userColumn} data={finalFilteredUsers} />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default UserSetup;
