// import React, { useEffect, useState } from "react";
// import Table from "../../components/table/Table";
// import { Link } from "react-router-dom";
// import { BsEye } from "react-icons/bs";
// import { BiEdit } from "react-icons/bi";
// import { PiPlusCircle } from "react-icons/pi";
// import { useSelector } from "react-redux";
// import { getItemInLocalStorage } from "../../utils/localStorage";
// import axios from "axios";

// function SelfRegistration() {
//   const themeColor = useSelector((state) => state.theme.color);

//   const siteId = getItemInLocalStorage("SITEID");
//   const token = getItemInLocalStorage("TOKEN");

//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ================= FETCH DATA ================= */
//   useEffect(() => {
//     fetchSelfRegistrations();
//   }, []);

//   const fetchSelfRegistrations = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `/api/self-registrations?site_id=${siteId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setData(response.data || []);
//       setFilteredData(response.data || []);
//     } catch (error) {
//       console.error("Error fetching self registrations:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= SEARCH ================= */
//   useEffect(() => {
//     if (!search) {
//       setFilteredData(data);
//       return;
//     }

//     const value = search.toLowerCase();

//     const filtered = data.filter(
//       (item) =>
//         item.name?.toLowerCase().includes(value) ||
//         item.host?.toLowerCase().includes(value) ||
//         item.contact_no?.includes(value)
//     );

//     setFilteredData(filtered);
//   }, [search, data]);

//   /* ================= TABLE COLUMNS ================= */
//   const columns = [
//     {
//       name: "Action",
//       cell: (row) => (
//         <div className="flex items-center gap-4">
//           <Link to={`/admin/passes/self-registration-details/${row.id}`}>
//             <BsEye size={15} />
//           </Link>
//           <Link to={`/admin/passes/edit-self-registration/${row.id}`}>
//             <BiEdit size={15} />
//           </Link>
//         </div>
//       ),
//     },
//     {
//       name: "Visitor Type",
//       selector: (row) => row.visit_type,
//       sortable: true,
//     },
//     {
//       name: "Name",
//       selector: (row) => row.name,
//       sortable: true,
//     },
//     {
//       name: "Host",
//       selector: (row) => row.host,
//       sortable: true,
//     },
//     {
//       name: "Contact No.",
//       selector: (row) => row.contact_no,
//       sortable: true,
//     },
//     {
//       name: "Purpose",
//       selector: (row) => row.purpose,
//       sortable: true,
//     },
//     {
//       name: "Coming From",
//       selector: (row) => row.coming_from,
//       sortable: true,
//     },
//     {
//       name: "Expected Date",
//       selector: (row) => row.expected_date,
//       sortable: true,
//     },
//     {
//       name: "Expected Time",
//       selector: (row) => row.expected_time,
//       sortable: true,
//     },
//   ];

//   return (
//     <div className="flex flex-col w-full overflow-hidden">
//       {/* ================= HEADER ================= */}
//       <div className="grid md:grid-cols-2 gap-2 items-center">
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border border-gray-300 p-2 rounded-md placeholder:text-sm"
//           placeholder="Search by visitor name, host, contact number"
//         />

//         <div className="flex justify-end">
//           <Link
//             to={`/admin/passes/add-self-registration/${siteId}?token=${token}`}
//             style={{ background: themeColor }}
//             className="font-semibold hover:text-white transition-all p-2 rounded-md text-white flex items-center gap-2"
//           >
//             <PiPlusCircle size={20} />
//             Add Self-Registration
//           </Link>
//         </div>
//       </div>

//       {/* ================= TABLE ================= */}
//       <div className="my-3">
//         <Table
//           columns={columns}
//           data={filteredData}
//           progressPending={loading}
//         />
//       </div>
//     </div>
//   );
// }

// export default SelfRegistration;









import React, { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import { Link, useParams } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { getSelfRegistration } from "../../api";

function SelfRegistration() {
  const themeColor = useSelector((state) => state.theme.color);
  const siteId = getItemInLocalStorage("SITEID");
  const token = getItemInLocalStorage("TOKEN");
  const { id } = useParams();
  const [records, setRecords] = useState([])
  const [searchText, setSearchText] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  console.log(id);
  console.log(siteId);

  // useEffect(() => {
  //   const query = useQuery();
  //   const tokenFromUrl = query.get("token"); // Extract the token
  //   setToken(tokenFromUrl);
  // }, []);

  // const [token, setToken] = useState("");
  const useQuery = () => {
    return new URLSearchParams(window.location.search);
  };

  console.log("records", records);

  useEffect(() => {
    const postLogs = async () => {
      try {
        const response = await getSelfRegistration();
        console.log("response", response);
        const selfRegistration = response.data
        // setRecords(selfRegistration.data);
        setRecords(selfRegistration.data);
        setFilteredRecords(selfRegistration.data);
      } catch (err) {
        console.log("Falied To fecth records:", err);
      }
    };
    postLogs()
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(e.target.value);

    if (!value.trim()) {
      setFilteredRecords(records);
      return;
    }

    const filtered = records.filter((item) => {
      const name = item.visitor_name?.toLowerCase() || "";
      const host = item.hosts?.[0]?.hosts_name?.toLowerCase() || "";
      const mobile = String(item.contact_no || "");
      const purpose = item.purpose?.toLowerCase() || "";

      return (
        name.includes(value) ||
        host.includes(value) ||
        mobile.includes(value) ||
        purpose.includes(value)
      );
    });

    setFilteredRecords(filtered);
  };

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/passes/self-registration-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/passes/edit-self-registration/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },

    {
      name: "Visitor Type",
      selector: (row) => row.visit_type === "Guest-SelfRegistration" ? "Guest" : "",
      sortable: true,
    },
    {
      name: " Name",
      selector: (row) => row.visitor_name,
      sortable: true,
    },
    {
      name: "Host",
      selector: (row) => row.hosts[0].hosts_name,
      sortable: true,
    },
    {
      name: "Contact No.",
      selector: (row) => row.contact_no,
      sortable: true,
    },

    {
      name: "Purpose",
      selector: (row) => row.purpose,
      sortable: true,
    },
    {
      name: "Coming from",
      selector: (row) => row.coming_from,
      sortable: true,
    },
    // {
    //   name: "Expected Date",
    //   selector: (row) =>
    //     row.expected_date
    //       ? new Date(row.expected_date).toLocaleDateString()
    //       : "-",
    //   sortable: true,
    // },
    // {
    //   name: "Expected Time",
    //   selector: (row) =>
    //     row.expected_time
    //       ? row.expected_time
    //       : "-",
    //   sortable: true,
    // },
  ];


  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="grid md:grid-cols-2 gap-2 items-center">
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-md placeholder:text-sm"
          placeholder="Search using Visitor name, Host, vehicle number"
          value={searchText}
          onChange={handleSearch}
        />
        {/* <div className="border md:flex-row flex-col flex p-2 rounded-md text-center border-black">
                <span
                  className={` md:border-r px-2 border-gray-300 cursor-pointer hover:underline ${
                    selectedVisitor === "expected"
                      ? "text-blue-600 underline"
                      : ""
                  } text-center`}
                  onClick={() => handleClick("expected")}
                >
                  <span>Expected visitor</span>
                </span>
                <span
                  className={`cursor-pointer hover:underline ${
                    selectedVisitor === "unexpected"
                      ? "text-blue-600 underline"
                      : ""
                  } text-center`}
                  onClick={() => handleClick("unexpected")}
                >
                  &nbsp; <span>Unexpected visitor</span>
                </span>
              </div> */}
        <div className="flex justify-end">
          <Link
            to={`/admin/passes/add-self-registration/${siteId}?token=${token}`}
            style={{ background: themeColor }}
            className=" font-semibold  hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
          >
            <PiPlusCircle size={20} />
            Add Self-Registration
          </Link>
        </div>
      </div>
      <div className="my-3">
        {/* <Table columns={columns} data={records} /> */}
        <Table columns={columns} data={filteredRecords} />
      </div>
    </div>
  );
}

export default SelfRegistration;
