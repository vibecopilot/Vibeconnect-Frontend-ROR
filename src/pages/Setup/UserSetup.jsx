import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import Table from "../../components/table/Table";
import { getSetupUsers, sendMailToUsers } from "../../api";
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

  const themeColor = useSelector((state) => state.theme.color);
  const siteId = getItemInLocalStorage("SITEID");

  // ✅ Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const setupUsers = await getSetupUsers();

        // Format user data for the table
        const formattedUsers = setupUsers.data.map((user) => ({
          id: user.id,
          firstname: user.firstname || "",
          lastname: user.lastname || "",
          mobile: user.mobile || "",
          email: user.email || "",
          Ownership_Types: user.user_sites?.[0]?.ownership_type || "N/A",
          Phase: user.user_phase || "N/A",
          Occupied: user.lives_here ? "Yes" : "No",
          Status: user.user_status ? "Active" : "Inactive",
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
        }));

        setUsers(formattedUsers);
        setFilteredData(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Derived counts for the new buttons
  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.Status === "Active").length;
  const pendingCount = users.filter((u) => u.Status === "Inactive").length;
  const appDownloadedCount = users.filter((u) => u.App_Downloaded === "Yes")
    .length;

  // ✅ Search functionality
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    if (searchValue.trim() === "") {
      setFilteredData(users);
    } else {
      const filteredResults = users.filter(
        (item) =>
          (item.firstname &&
            item.firstname.toLowerCase().includes(searchValue.toLowerCase())) ||
          (item.lastname &&
            item.lastname.toLowerCase().includes(searchValue.toLowerCase())) ||
          (item.email &&
            item.email.toLowerCase().includes(searchValue.toLowerCase()))
      );
      setFilteredData(filteredResults);
    }
  };

  // ✅ Send Mail
  const handleSendMail = async (userId, first, last) => {
    try {
      toast.loading(`Sending Mail to ${first} ${last}...`);
      await sendMailToUsers(userId);
      toast.dismiss();
      toast.success("Welcome Mail Sent");
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  // ✅ Table columns
  const userColumn = [
    {
      name: "Action",
      cell: (row) => (
        <div
          className="flex items-center gap-4"
          role="cell"
          data-column-id="1"
          data-tag="allowRowEvents"
        >
          <Link
            to={`/setup/users-details/${siteId}/${row.id}`}
            className="text-gray-700 hover:text-indigo-600 transition-all"
            title="View User Details"
          >
            <BsEye
              size={15}
              className="cursor-pointer hover:scale-110 duration-200"
            />
          </Link>

          <Link
            to={`/setup/users-edit/${siteId}/${row.id}`}
            state={{ user: row }}
            className="text-gray-700 hover:text-blue-600 transition-all"
            title="Edit User"
          >
            <FiEdit
              size={15}
              className="cursor-pointer hover:scale-110 duration-200"
            />
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
    { name: "User Type", selector: (row) => row.user_type },
    {
      name: "Send Email",
      cell: (row) => (
        <button
          style={{ background: themeColor }}
          onClick={() => handleSendMail(row.id, row.firstname, row.lastname)}
          className="text-white md:text-sm text-xs rounded-full shadow-custom-all-sides p-1 px-4 hover:opacity-90"
        >
          Send
        </button>
      ),
    },
  ];

  return (
    <section className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      {/* Sidebar Navbar */}
      <SetupNavbar />

      {/* Main Content */}
      <div className="w-full flex mx-3 flex-col gap-4 overflow-hidden mb-5">
        {/* 🔍 Search + Add Buttons + Counts */}
        <div className="mt-5 flex md:flex-row flex-col justify-between md:items-center gap-4">
          <div className="flex gap-3 sm:flex-row flex-col w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name or email"
              className="p-2 md:w-96 border border-gray-300 rounded-md placeholder:text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              value={searchText}
              onChange={handleSearch}
            />

            <Link
              to="/setup/users-setup/add-new-user"
              className="font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center rounded-md text-black hover:bg-gray-100"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M416 277.333H277.333V416h-42.666V277.333H96v-42.666h138.667V96h42.666v138.667H416v42.666z"></path>
              </svg>
              Add
            </Link>
          </div>

          {/* Right-side controls: counts + primary add */}
          <div className="flex items-center gap-3 flex-wrap">

            {/* Count button: States (Pending / Active) */}
            <div className="text-sm px-3 py-1 rounded-md border border-gray-200 bg-white shadow-sm flex items-center gap-2">
              <span className="font-semibold">States</span>
              <span className="text-xs text-gray-600">
                Pending {pendingCount} / Active {activeCount}
              </span>
            </div>

            {/* Count button: App Downloaded */}
            <div className="text-sm px-3 py-1 rounded-md border border-gray-200 bg-white shadow-sm flex items-center gap-2">
              <span className="font-semibold">App Downloaded</span>
              <span className="text-xs text-gray-600">{appDownloadedCount}</span>
            </div>

            {/* Count button: Total Users */}
            <div className="text-sm px-3 py-1 rounded-md border border-gray-200 bg-white shadow-sm flex items-center gap-2">
              <span className="font-semibold">Users</span>
              <span className="text-xs text-gray-600">{totalUsers}</span>
            </div>

            {/* Conditional Add User Button (prominent) */}
            {siteId === 10 && (
              <Link
                to={"/setup/users-setup/add-new-user"}
                style={{ background: themeColor }}
                className="font-semibold duration-300 ease-in-out transition-all p-1 px-4 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center hover:opacity-90"
              >
                <PiPlusCircle size={20} />
                Add User
              </Link>
            )}
          </div>
        </div>

        {/* 🧭 Table Section */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading users...</p>
        ) : filteredData.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No users found.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4">
            <Table columns={userColumn} data={filteredData} />
          </div>
        )}
      </div>
    </section>
  );
};

export default UserSetup;
