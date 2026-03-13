// import React, { useEffect, useState } from "react";
// import { PiPlusCircle } from "react-icons/pi";
// import Table from "../../components/table/Table";
// import { getSetupUsers, sendMailToUsers } from "../../api";
// import { Link } from "react-router-dom";
// import { BsEye } from "react-icons/bs";
// import { FiEdit } from "react-icons/fi";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import { getItemInLocalStorage } from "../../utils/localStorage";
// import SetupNavbar from "../../components/navbars/SetupNavbar";

// const UserSetup = () => {
//   const [users, setUsers] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
  

//   const themeColor = useSelector((state) => state.theme.color);
//   const siteId = getItemInLocalStorage("SITEID");

//   // ✅ Fetch users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const setupUsers = await getSetupUsers();

//         // Format user data for the table
//         const formattedUsers = setupUsers.data.map((user) => ({
//           id: user.id,
//           firstname: user.firstname || "",
//           lastname: user.lastname || "",
//           mobile: user.mobile || "",
//           email: user.email || "",
//           Ownership_Types: user.user_sites?.[0]?.ownership_type || "N/A",
//           Phase: user.user_phase || "N/A",
//           Status: user.user_status ? "Active" : "Inactive",
//           Vehical: user.vehicle || "N/A",
//           App_Downloaded: user.is_downloaded ? "Yes" : "No",
//           Alternate_Address: user.user_address || "",
//           Alternate_Email_1: user.email_1 || "",
//           Landline_Number: user.landline_number || "",
//           Intercom_Number: user.intercom_number || "",
//           GST_Number: user.gst_number || "N/A",
//           PAN_Number: user.pan_number || "N/A",
//           Created_On: user.created_at
//             ? new Date(user.created_at).toLocaleDateString()
//             : "",
//           Updated_On: user.updated_at
//             ? new Date(user.updated_at).toLocaleDateString()
//             : "",
//           user_type:
//             user.user_type === ""
//               ? "N/A"
//               : user.user_type === "pms_admin"
//               ? "Admin"
//               : user.user_type === "employee"
//               ? "Employee"
//               : user.user_type,
//         }));

//         setUsers(formattedUsers);
//         setFilteredData(formattedUsers);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         toast.error("Failed to load users");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Derived counts for the new buttons
//   const totalUsers = users.length;
//   const activeCount = users.filter((u) => u.Status === "Active").length;
//   const pendingCount = users.filter((u) => u.Status === "Inactive").length;
//   const appDownloadedCount = users.filter((u) => u.App_Downloaded === "Yes")
//     .length;

//   // ✅ Search functionality
//   const handleSearch = (e) => {
//     const searchValue = e.target.value;
//     setSearchText(searchValue);

//     if (searchValue.trim() === "") {
//       setFilteredData(users);
//     } else {
//       const filteredResults = users.filter(
//         (item) =>
//           (item.firstname &&
//             item.firstname.toLowerCase().includes(searchValue.toLowerCase())) ||
//           (item.lastname &&
//             item.lastname.toLowerCase().includes(searchValue.toLowerCase())) ||
//           (item.email &&
//             item.email.toLowerCase().includes(searchValue.toLowerCase()))
//       );
//       setFilteredData(filteredResults);
//     }
//   };

//   // ✅ Send Mail
//   const handleSendMail = async (userId, first, last) => {
//     try {
//       toast.loading(`Sending Mail to ${first} ${last}...`);
//       await sendMailToUsers(userId);
//       toast.dismiss();
//       toast.success("Welcome Mail Sent");
//     } catch (error) {
//       toast.dismiss();
//       toast.error("Something went wrong");
//       console.error(error);
//     }
//   };

//   // ✅ Table columns
//   const userColumn = [
//   {
//     name: "Action",
//     cell: (row) => (
//       <div className="flex items-center gap-4">

//         {/* View User Details */}
//         <Link
//           to={`/setup/users-details/${row.id}`}
//           className="text-gray-700 hover:text-indigo-600 transition-all"
//           title="View User Details"
//         >
//           <BsEye size={15} className="cursor-pointer hover:scale-110 duration-200" />
//         </Link>

//         {/* Edit User */}
//         <Link
//           to={`/setup/edit-user/${row.id}`}
//           state={{ user: row }}
//           className="text-gray-700 hover:text-blue-600 transition-all"
//           title="Edit User"
//         >
//           <FiEdit size={15} className="cursor-pointer hover:scale-110 duration-200" />
//         </Link>

//       </div>
//     ),
//     width: "120px",
//   },
//   { name: "Name", selector: (row) => `${row.firstname} ${row.lastname}` },
//     { name: "Mobile", selector: (row) => row.mobile },
//     { name: "Email", selector: (row) => row.email },
//     { name: "Ownership Type", selector: (row) => row.Ownership_Types },
//     { name: "Phase", selector: (row) => row.Phase },
//     { name: "Occupied", selector: (row) => row.Occupied },
//     { name: "Status", selector: (row) => row.Status },
//     { name: "App Downloaded", selector: (row) => row.App_Downloaded },
//     { name: "PAN", selector: (row) => row.PAN_Number },
//     { name: "GST", selector: (row) => row.GST_Number },
//     { name: "Created On", selector: (row) => row.Created_On },
//     { name: "Updated On", selector: (row) => row.Updated_On },
//     { name: "User Type", selector: (row) => row.user_type },
//     {
//       name: "Send Email",
//       cell: (row) => (
//         <button
//           style={{ background: themeColor }}
//           onClick={() => handleSendMail(row.id, row.firstname, row.lastname)}
//           className="text-white md:text-sm text-xs rounded-full shadow-custom-all-sides p-1 px-4 hover:opacity-90"
//         >
//           Send
//         </button>
//       ),
//     },
//   ];

//   return (
//     <section className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
//       {/* Sidebar Navbar */}
//       <SetupNavbar />

//       {/* Main Content */}
//       <div className="w-full flex mx-3 flex-col gap-4 overflow-hidden mb-5">
//         {/* 🔍 Search + Add Buttons + Counts */}
//         <div className="mt-5 flex md:flex-row flex-col justify-between md:items-center gap-4">
//           <div className="flex gap-3 sm:flex-row flex-col w-full md:w-auto">
//             <input
//               type="text"
//               placeholder="Search by name or email"
//               className="p-2 md:w-96 border border-gray-300 rounded-md placeholder:text-sm outline-none focus:ring-2 focus:ring-indigo-400"
//               value={searchText}
//               onChange={handleSearch}
//             />

//             <Link
//               to="/setup/users-setup/add-new-user"
//               className="font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center rounded-md text-black hover:bg-gray-100"
//             >
//               <svg
//                 stroke="currentColor"
//                 fill="currentColor"
//                 strokeWidth="0"
//                 viewBox="0 0 512 512"
//                 height="1em"
//                 width="1em"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path d="M416 277.333H277.333V416h-42.666V277.333H96v-42.666h138.667V96h42.666v138.667H416v42.666z"></path>
//               </svg>
//               Add
//             </Link>
//           </div>

//           {/* Right-side controls: counts + primary add */}
//           <div className="flex items-center gap-3 flex-wrap">

//             {/* Count button: States (Pending / Active) */}
//             <div className="text-sm px-3 py-1 rounded-md border border-gray-200 bg-white shadow-sm flex items-center gap-2">
//               <span className="font-semibold">States</span>
//               <span className="text-xs text-gray-600">
//                 Pending {pendingCount} / Active {activeCount}
//               </span>
//             </div>

//             {/* Count button: App Downloaded */}
//             <div className="text-sm px-3 py-1 rounded-md border border-gray-200 bg-white shadow-sm flex items-center gap-2">
//               <span className="font-semibold">App Downloaded</span>
//               <span className="text-xs text-gray-600">{appDownloadedCount}</span>
//             </div>

//             {/* Count button: Total Users */}
//             <div className="text-sm px-3 py-1 rounded-md border border-gray-200 bg-white shadow-sm flex items-center gap-2">
//               <span className="font-semibold">Users</span>
//               <span className="text-xs text-gray-600">{totalUsers}</span>
//             </div>

//             {/* Conditional Add User Button (prominent) */}
//             {siteId === 10 && (
//               <Link
//                 to={"/setup/users-setup/add-new-user"}
//                 style={{ background: themeColor }}
//                 className="font-semibold duration-300 ease-in-out transition-all p-1 px-4 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center hover:opacity-90"
//               >
//                 <PiPlusCircle size={20} />
//                 Add User
//               </Link>
//             )}
//           </div>
//         </div>

//         {/* 🧭 Table Section */}
//         {loading ? (
//           <p className="text-center text-gray-500 mt-10">Loading users...</p>
//         ) : filteredData.length === 0 ? (
//           <p className="text-center text-gray-500 mt-10">No users found.</p>
//         ) : (
//           <div className="bg-white rounded-lg shadow-md p-4">
//             <Table columns={userColumn} data={filteredData} />
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default UserSetup;

import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import Table from "../../components/table/Table";
import { getSetupUsers, sendMailToUsers,getBuildings } from "../../api";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getItemInLocalStorage } from "../../utils/localStorage";
import SetupNavbar from "../../components/navbars/SetupNavbar";

const UserSetup = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [buildings, setBuildings] = useState([]);
  // const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [flats, setFlats] = useState([]);
  const [filters, setFilters] = useState({
  tower: "",
  flat: "",
  status: "",
  appDownloaded: "",
  firstname: "",
  lastname: "",
  ownership: ""
});

  const themeColor = useSelector((state) => state.theme.color);
  const siteId = getItemInLocalStorage("SITEID");


  /* ---------------- FETCH USERS ---------------- */

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const setupUsers = await getSetupUsers();
        const buildingRes = await getBuildings();
        

        setBuildings(buildingRes.data || []);

  const formattedUsers = setupUsers.data.map((user) => {

  console.log("API user_status:", user.user_status);
  console.log("Full API user object:", user);

  return {
    id: user.id,
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
  user.user_status === true
    ? "Approved"
    : user.user_status === false
    ? "Rejected"
    : "Pending",

    Vehical: user.vehicle || "N/A",

    App_Downloaded: user.is_downloaded ? "Yes" : "No",

    Alternate_Address: user.user_address || "",
    Alternate_Email_1: user.email_1 || "",
    Landline_Number: user.landline_number || "",
    Intercom_Number: user.intercom_number || "",

    GST_Number: user.gst_number || "N/A",
    PAN_Number: user.pan_number || "N/A",

    Created_On: user.created_at
      ? new Date(user.created_at).toLocaleDateString()
      : "",

    Updated_On: user.updated_at
      ? new Date(user.updated_at).toLocaleDateString()
      : "",

    user_type:
      user.user_type === ""
        ? "N/A"
        : user.user_type === "pms_admin"
        ? "Admin"
        : user.user_type === "employee"
        ? "Employee"
        : user.user_type,
  };
});

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

  /* ---------------- DASHBOARD COUNTS ---------------- */

 const totalRegisteredUsers = users.length;

const appPendingUsers = users.filter(
  (u) => u.App_Downloaded === "No"
).length;

const approvedUsers = users.filter(
  (u) => u.Status === "Approved"
).length;

const rejectedUsers = users.filter(
  (u) => u.Status === "Rejected"
).length;

const pendingUsers = users.filter(
  (u) => u.Status === "Pending"
).length;

const totalFlats = new Set(
  users.map((u) => u.Flat).filter((f) => f && f !== "N/A")
).size;

const totalOwners = users.filter(
  (u) => u.Ownership_Types?.toLowerCase() === "primary"
).length;

const totalTenantsDownload = users.filter(
  (u) =>
    u.Ownership_Types?.toLowerCase() === "secondary" &&
    u.App_Downloaded === "Yes"
).length;
  /* ---------------- SEARCH ---------------- */

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value) {
      setFilteredData(users);
      return;
    }

    const filtered = users.filter(
      (item) =>
        item.firstname.toLowerCase().includes(value.toLowerCase()) ||
        item.lastname.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };


  const applyFilters = () => {
  let filtered = users;

  if (filters.firstname) {
    filtered = filtered.filter((u) =>
      u.firstname
        .toLowerCase()
        .includes(filters.firstname.toLowerCase())
    );
  }

  if (filters.lastname) {
    filtered = filtered.filter((u) =>
      u.lastname
        .toLowerCase()
        .includes(filters.lastname.toLowerCase())
    );
  }

  if (filters.ownership) {
    filtered = filtered.filter(
      (u) => u.Ownership_Types === filters.ownership
    );
  }

  if (filters.status) {
    filtered = filtered.filter(
      (u) => u.Status === filters.status
    );
  }

  if (filters.appDownloaded) {
    filtered = filtered.filter(
      (u) => u.App_Downloaded === filters.appDownloaded
    );
  }

  if (filters.flat) {
    filtered = filtered.filter((u) =>
      u.Flat?.toLowerCase().includes(filters.flat.toLowerCase())
    );
  }

  if (filters.tower) {
    filtered = filtered.filter(
      (u) => u.Tower === filters.tower
    );
  }

  setFilteredData(filtered);
};

  /* ---------------- SEND MAIL ---------------- */

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

  /* ---------------- TABLE COLUMNS ---------------- */

  const userColumn = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">

          <Link
            to={`/setup/users-details/${row.id}`}
            title="View"
          >
            <BsEye size={15} />
          </Link>

          <Link
            to={`/setup/edit-user/${row.id}`}
            state={{ user: row }}
            title="Edit"
          >
            <FiEdit size={15} />
          </Link>

        </div>
      ),
      width: "120px",
    },

    { name: "Name", selector: (row) => `${row.firstname} ${row.lastname}` },
    { name: "Mobile", selector: (row) => row.mobile },
    { name: "Email", selector: (row) => row.email },
    { name: "Ownership Type", selector: (row) => row.Ownership_Types },
    { name: "Phase", selector: (row) => row.Phase },
    { name: "Occupied", selector: (row) => row.Occupied },
    { name: "Status", selector: (row) => row.Status },
    { name: "App Downloaded", selector: (row) => row.App_Downloaded },
    { name: "PAN", selector: (row) => row.PAN_Number },
    { name: "GST", selector: (row) => row.GST_Number },
    { name: "Created On", selector: (row) => row.Created_On },
    { name: "Updated On", selector: (row) => row.Updated_On },

    {
      name: "Send Email",
      cell: (row) => (
        <button
          style={{ background: themeColor }}
          onClick={() => handleSendMail(row.id, row.firstname, row.lastname)}
          className="text-white text-xs rounded-full px-4 py-1"
        >
          Send
        </button>
      ),
    },
  ];

  return (
    <section className="flex bg-gray-50 min-h-screen">

      <SetupNavbar />

      <div className="w-full mx-3 flex flex-col gap-4">

        {/* DASHBOARD CARDS */}

        <div className="flex flex-wrap gap-4 mt-4">

         <div onClick={() => setShowFilter(true)}
              className="px-6 py-3 bg-white rounded-full shadow border cursor-pointer hover:shadow-md"
              >
              <p className="text-sm">Total Registered User</p>
              <p className="font-bold">{totalRegisteredUsers}</p>
          </div>

          {/* <div className="px-6 py-3 bg-white rounded-full shadow border">
            <p className="text-sm">App Pending</p>
            <p className="font-bold">{appPendingUsers}</p>
          </div> */}

          <div className="px-6 py-3 bg-white rounded-full shadow border">
            <p className="text-sm">Approved User</p>
            <p className="font-bold">{approvedUsers}</p>
          </div>

            <div className="px-6 py-3 bg-white rounded-full shadow border">
             <p className="text-sm">Pending User</p>
             <p className="font-bold">{pendingUsers}</p>
            </div>


          <div className="px-6 py-3 bg-white rounded-full shadow border">
            <p className="text-sm">Rejected User</p>
            <p className="font-bold">{rejectedUsers}</p>
          </div>

           {/* ADD THIS */}
         <div className="px-6 py-3 bg-white rounded-full shadow border">
         <p className="text-sm">Total Flats Download</p>
         <p className="font-bold">{totalFlats}</p>
          </div>


          <div className="px-6 py-3 bg-white rounded-full shadow border">
            <p className="text-sm">Total Owners Download</p>
            <p className="font-bold">{totalOwners}</p>
          </div>

          <div className="px-6 py-3 bg-white rounded-full shadow border">
            <p className="text-sm">Tenant Download</p>
            <p className="font-bold">{totalTenantsDownload}</p>
          </div>

        </div>

        {/* SEARCH + ADD */}

        <div className="flex justify-end items-center mt-4">

          <input
            type="text"
            placeholder="Search by name or email"
            className="p-2 w-96 border rounded"
            value={searchText}
            onChange={handleSearch}
          />

          <Link
            to="/setup/users-setup/add-new-user"
            className="flex items-center gap-2 border px-4 py-2 rounded"
          >
            <PiPlusCircle />
            Add User
          </Link>

        </div>
        {/* FILTER PANEL */}
{showFilter && (
  <div className="bg-white border rounded-lg p-4 shadow-md mb-4">

    <div className="grid grid-cols-4 gap-4">

      {/* First Name */}
<input
  type="text"
  placeholder="First Name"
  className="border p-2 rounded"
  value={filters.firstname}
  onChange={(e) =>
    setFilters({ ...filters, firstname: e.target.value })
  }
/>

{/* Last Name */}
<input
  type="text"
  placeholder="Last Name"
  className="border p-2 rounded"
  value={filters.lastname}
  onChange={(e) =>
    setFilters({ ...filters, lastname: e.target.value })
  }
/>

{/* Ownership */}
<select
  className="border p-2 rounded"
  value={filters.ownership}
  onChange={(e) =>
    setFilters({ ...filters, ownership: e.target.value })
  }
>
  <option value="">Ownership Type</option>
  <option value="primary">Primary</option>
  <option value="secondary">Secondary</option>
</select>

    <select
       className="border p-2 rounded"
       value={filters.tower}
       onChange={(e) =>
       setFilters({ ...filters, tower: e.target.value })
        }
        >
       <option value="">Select Tower</option>

         {buildings.map((b) => (
         <option key={b.id} value={b.name}>
           {b.name}
          </option>
         ))}


    </select>


      <input
        type="text"
        placeholder="Flat"
        className="border p-2 rounded"
        value={filters.flat}
        onChange={(e) =>
          setFilters({ ...filters, flat: e.target.value })
        }
      />

      <select
        className="border p-2 rounded"
        value={filters.status}
        onChange={(e) =>
          setFilters({ ...filters, status: e.target.value })
        }
      >
        <option value="">Status</option>
        <option value="Approved">Approved</option>
        <option value="Pending">Pending</option>
        <option value="Rejected">Rejected</option>
      </select>

      <select
        className="border p-2 rounded"
        value={filters.appDownloaded}
        onChange={(e) =>
          setFilters({ ...filters, appDownloaded: e.target.value })
        }
      >
        <option value="">App Download</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>

    </div>

    <div className="flex gap-3 mt-4">

      <button
        style={{ background: themeColor }}
        className="text-white px-4 py-2 rounded"
        onClick={applyFilters}
      >
        Apply Filter
      </button>

      <button
        className="border px-4 py-2 rounded"
        onClick={() => {
          setShowFilter(false);
          setFilteredData(users);
        }}
      >
        Reset
      </button>

    </div>
    

  </div>
)}


        {/* TABLE */}

        {loading ? (
          <p className="text-center">Loading users...</p>
        ) : (
          <Table columns={userColumn} data={filteredData} />
        )}

      </div>
    </section>
  );
};

export default UserSetup;