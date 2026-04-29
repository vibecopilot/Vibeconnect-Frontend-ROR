import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoAddCircleOutline } from "react-icons/io5";
import { ImEye } from "react-icons/im";
import { Link } from "react-router-dom";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { getBroadCast,updateBroadcastEnableStatus } from "../../api";
import Table from "../../components/table/Table";
import { useSelector } from "react-redux";
import { BsEye } from "react-icons/bs";
import Navbar from "../../components/Navbar";
import Communication from "../Communication";
import { BiEdit } from "react-icons/bi";
import { toast } from "react-hot-toast";

const Broadcast = () => {
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [broadcast, setBroadcast] = useState([]);
  const themeColor = useSelector((state) => state.theme.color);
  useEffect(() => {
    const userType = getItemInLocalStorage("USERTYPE");
    setUser(userType);
    const fetchBroadCast = async () => {
      const broadcastResp = await getBroadCast();
      const sortedBroadcast = broadcastResp.data.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setFilteredData(sortedBroadcast);
      setBroadcast(sortedBroadcast);
      console.log(broadcastResp);
    };
    fetchBroadCast();
  }, []);
  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };


const handleToggle = async (id) => {
    const item = broadcast.find((b) => b.id === id);
    if (!item) return;

    const previousStatus = item.enabled;
    const newStatus = !previousStatus;

    const updateLocal = (status) => {
      setBroadcast((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, enabled: status } : b
        )
      );

      setFilteredData((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, enabled: status } : b
        )
      );
    };

    // Update UI instantly
    updateLocal(newStatus);

    try {
      // API call to update the status
      await updateBroadcastEnableStatus(id, newStatus);
      toast.success(newStatus ? "Broadcast Enabled" : "Broadcast Disabled");
    } catch (err) {
      toast.error("Failed to update");console.log("API CALL FUNCTION =>", updateBroadcastEnableStatus.toString());


      updateLocal(previousStatus); // revert on failure
    }
  };

  const column = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/communication/broadcast/broadcast-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/communication/broadcast/edit-broadcast/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
      sortable: true,
    },
    { name: "Title", selector: (row) => row.notice_title, sortable: true },
    // {
    //   name: "Type",
    //   selector: (row) => row.type,
    //   sortable: true,
    // },
    {
      name: "Notice Description",
      selector: (row) => row.notice_discription,
      sortable: true,
    },
    { name: "Created By", selector: (row) => row.CreatedBy, sortable: true },
    {
      name: "Expiry Date",
      selector: (row) => dateFormat(row.expiry_date),
      sortable: true,
    },
    {
      name: "Created On",
      selector: (row) => dateFormat(row.created_at),
      sortable: true,
    },
{
  name: "Status",
  selector: (row) => {
    const now = new Date();
    const expiryDate = new Date(row.expiry_date);

    // ✅ Remove time (safe way)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const expiry = new Date(
      expiryDate.getFullYear(),
      expiryDate.getMonth(),
      expiryDate.getDate()
    );

    if (today > expiry) {
      return "EXPIRED";   // ✅ Past date
    } else if (today.getTime() === expiry.getTime()) {
      return "ONGOING";   // ✅ Today expiry
    } else if (today < expiry) {
      return "UPCOMING";  // ✅ Future
    } else {
      return "N/A";
    }
  },
  sortable: true,
},
     {
      name: "Enable / Disable",
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row.enabled}
            onChange={() => handleToggle(row.id)}
          />

          <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-all"></div>

          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-full transition-all"></div>
        </label>
      ),
      sortable: false,
    }
  ];

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchText(searchValue);
    const filteredResults = broadcast.filter((item) =>
      item.notice_title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filteredResults);
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
        <Communication />
        <div className="grid grid-cols-12 my-2 gap-2">
          {/* <div className="flex justify-between items-center sm:flex-row flex-col my-2"> */}
          <input
            type="text"
            placeholder="Search by title"
            className="border p-2 border-gray-300 rounded-lg col-span-10"
            value={searchText}
            onChange={handleSearch}
          />
          {user === "pms_admin" && (
            <Link
              to={"/communication/broadcast/create-broadcast"}
              style={{ background: themeColor }}
              className="  rounded-md flex font-semibold items-center gap-2 text-white p-2 col-span-2"
            >
              <IoAddCircleOutline size={20} />
              Add Broadcast/Notice
            </Link>
          )}
        </div>
        <Table columns={column} data={filteredData} />
      </div>
    </div>
  );
};

export default Broadcast;
