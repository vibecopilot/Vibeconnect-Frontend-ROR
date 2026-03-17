  import React, { useEffect, useState } from "react";
  import { IoAddCircleOutline } from "react-icons/io5";
  import { Link } from "react-router-dom";
  import Table from "../../components/table/Table";
  import { BsEye } from "react-icons/bs";
  import { MdDeleteForever } from "react-icons/md";
  import { BiEdit } from "react-icons/bi";
  import { API_URL, getPPMTask, getRoutineTask, getVibeBackground } from "../../api"
  import toast from "react-hot-toast";

  import Navbar from "../../components/Navbar";
  import AssetNav from "../../components/navbars/AssetNav";
  import { getItemInLocalStorage } from "../../utils/localStorage";

  const PPMTask = () => {
    const [tasks, setTasks] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");

    useEffect(() => {
      const fetchPPMTask = async () => {
        toast.loading("Please wait");
        try {
          const taskResponse = await getPPMTask();
          toast.dismiss()
        toast.success("PPM task data fetched successfully");
          // const filteredServiceTask = taskResponse.data.activities.filter(
          //   (asset) => asset.asset_name
          // );
          const filteredServiceTask = taskResponse.data.activities
          .filter((asset) => asset.asset_name) 
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          console.log(filteredServiceTask);
          setTasks(filteredServiceTask);
          setFilteredData(filteredServiceTask);
        } catch (error) {
          console.log(error);
        }
      };
      fetchPPMTask();
      console.log(tasks);
    }, []);

    const dateFormat = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short", // or 'long' for full month names
        year: "numeric",
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   // second: '2-digit'
      //   hour12: true,
      });
    };
    const RoutineColumns = [
      {
        name: "View",
        cell: (row) => (
          <div className="flex items-center gap-4">
            <Link to={`/assets/routine-task-details/${row.asset_id}/${row.id}`}>
              <BsEye size={15} />
            </Link>
          </div>
        ),
      },
      { name: "Asset Name", selector: (row) => row.asset_name, sortable: true },
      {
        name: "Checklist",
        selector: (row) => row.checklist_name,
        sortable: true,
      },
      {
        name: "Start Date",
        selector: (row) => dateFormat(row.start_time),
        sortable: true,
      },
      // { name: "End Time", selector: (row) => row.end_time, sortable: true },

      { name: "Status", selector: (row) => row.status, sortable: true },
      {
        name: "Assigned To",
        selector: (row) => row.assigned_to_name,
        sortable: true,
      },
    ];

    const defaultImage = { index: 0, src: "" };
    let selectedImageSrc = defaultImage.src;
    let selectedImageIndex = defaultImage.index;
    const [selectedImage, setSelectedImage] = useState(defaultImage);
    const [selectedIndex, setSelectedIndex] = useState(null);
    // const Get_Background = async () => {
    //   try {
    //     // const params = {
    //     //   user_id: user_id,
    //     // };
    //     const user_id = getItemInLocalStorage("VIBEUSERID");
    //     console.log(user_id);
    //     const data = await getVibeBackground(user_id);

    //     if (data.success) {
    //       console.log("sucess");

    //       console.log(data.data);
    //       selectedImageSrc = API_URL + data.data.image;

    //       selectedImageIndex = data.data.index;

    //       // Now, you can use selectedImageSrc and selectedImageIndex as needed
    //       console.log("Received response:", data);

    //       // For example, update state or perform any other actions
    //       setSelectedImage(selectedImageSrc);
    //       setSelectedIndex(selectedImageIndex);
    //       console.log("Received selectedImageSrc:", selectedImageSrc);
    //       console.log("Received selectedImageIndex:", selectedImageIndex);
    //       console.log(selectedImage);
    //       // dispatch(setBackground(selectedImageSrc));
    //     } else {
    //       console.log("Something went wrong");
    //     }
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // };

    const Get_Background = async () => {
  try {
    const user_id = getItemInLocalStorage("VIBEUSERID");

    if (searchText) {
      url += `&q[search_cont]=${searchText}`;
    }

    /* STATUS FILTER FROM API */

    if (selectedStatus !== "all") {
      url += `&q[status_eq]=${selectedStatus}`;
    }

    /* MONTH FILTER */
if (selectedMonth) {
  const start = new Date(selectedMonth + "-01");
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

  const startDate = start.toISOString();
  const endDate = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate(),
    23,
    59,
    59
  ).toISOString();

  url += `&q[start_time_gteq]=${startDate}`;
  url += `&q[start_time_lteq]=${endDate}`;
}

    const res = await fetch(url);
    const data = await res.json();

const activities = data.activities?.filter((a) => a.asset_name) || [];
    setTasks(activities);

    setTotal(data.total_count || 0);

  } catch (error) {
    console.log(error);
    toast.error("Failed to fetch tasks");
  }
};
useEffect(() => {
  const delay = setTimeout(() => {
    fetchPPMTask();
  }, 400);

  return () => clearTimeout(delay);
}, [page, rowsPerPage, selectedStatus, selectedMonth, searchText]);

    useEffect(() => {
      // Call the function to get the background image when the component mounts
      Get_Background();
    }, []);

    const handleSearch = (e) => {
      const searchValue = e.target.value;
      setSearchText(searchValue);

      if (searchValue.trim() === "") {
        setFilteredData(tasks);
      } else {
        const filteredResults = tasks.filter(
          (item) =>
            (item.asset_name &&
              item.asset_name
                .toLowerCase()
                .includes(searchValue.toLowerCase())) ||
            (item.checklist_name &&
              item.checklist_name
                .toLowerCase()
                .includes(searchValue.toLowerCase()))
        );
        setFilteredData(filteredResults);
      }
    };
    useEffect(() => {
      filterData(); // Filter data whenever tasks, searchText, or selectedStatus change
    }, [tasks, searchText, selectedStatus]);
    const filterData = () => {
      let filteredResults = tasks;


      // Apply status filter if it's not "all"
      if (selectedStatus !== "all") {
        filteredResults = filteredResults.filter(
          (item) => item.status.toLowerCase() === selectedStatus
        );
      }

      setFilteredData(filteredResults);
    };
    const handleStatusChange = (status) => {
      setSelectedStatus(status);
    };

    return (
      <section
        className="flex"
        style={{
          background: `url(${selectedImage})no-repeat center center / cover`,
        }}
      >
        <Navbar />
        <div className="p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
          <AssetNav />
          <div className="flex md:flex-row flex-col justify-between items-center my-2 gap-2  ">
          <div className="md:flex justify-between grid grid-cols-2 items-center  gap-2 border border-gray-300 rounded-md px-3 p-2 w-auto">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="all"
                  name="status"
                  checked={selectedStatus === "all"}
                  onChange={() => handleStatusChange("all")}
                />
                <label htmlFor="all" className="text-sm">
                  All
                </label>
              </div>


      const status = task.status?.toLowerCase();

      if (status === "pending") counts.pending++;
      else if (status === "overdue") counts.overdue++;
      else if (status === "complete") counts.complete++;
    });

    setStatusCounts(counts);
  } catch (error) {
    console.log(error);
  }
};

//  useEffect(() => {
//   fetchPPMTask();
// }, [page, rowsPerPage, selectedStatus, selectedMonth]);

useEffect(() => {
  fetchStatusCounts();
}, []);

  useEffect(() => {
    Get_Background();
  }, []);

  /* ---------------- SEARCH ---------------- */

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearchText(value);

    setPage(0);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPPMTask();
    }, 500);

    return () => clearTimeout(delay);
  }, [searchText]);

  /* ---------------- CLEAR FILTER ---------------- */

  const clearFilter = () => {
    setSelectedMonth("");

    setPage(0);

    setShowFilter(false);
  };

  /* ---------------- TABLE COLUMNS ---------------- */

  const RoutineColumns = [
    {
      name: "View",
      cell: (row) => (
        <Link to={`/assets/routine-task-details/${row.asset_id}/${row.id}`}>
          <BsEye size={15} />
        </Link>
      ),
    },

    {
      name: "Asset Name",
      selector: (row) => row.asset_name,
      sortable: true,
    },

    {
      name: "Checklist",
      selector: (row) => row.checklist_name,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },

    {
      name: "Assigned To",
      selector: (row) => row.assigned_to_name,
      sortable: true,
    },

    {
      name: "Start Time",
      selector: (row) => row.start_time,
      sortable: true,
    },

    {
      name: "Created On",
      selector: (row) => row.created_at,
      sortable: true,
    },
  ];

  /* ---------------- PAGINATION ---------------- */

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));

    setPage(0);
  };

  return (
    <section
      className="flex"
      style={{
        background: `url(${selectedImage}) no-repeat center/cover`,
      }}
    >
      <Navbar />

      <div className="p-4 w-full flex flex-col">
        <AssetNav />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4">
          <div
            onClick={() => {
              setSelectedStatus("all");
              setPage(0);
            }}
            className={`cursor-pointer rounded-lg p-4 text-center shadow border 
    ${
      selectedStatus === "all"
        ? "bg-indigo-600 text-white"
        : "bg-indigo-100 border-indigo-400"
    }`}
          >
            <p className="text-sm">All</p>
            <p className="text-xl font-bold">{statusCounts.all}</p>
          </div>

          <div
            onClick={() => {
              setSelectedStatus("pending");
              setPage(0);
            }}
            className={`cursor-pointer rounded-lg p-4 text-center shadow border
    ${
      selectedStatus === "pending"
        ? "bg-yellow-500 text-white"
        : "bg-yellow-100 border-yellow-400"
    }`}
          >
            <p className="text-sm">Pending</p>
            <p className="text-xl font-bold">{statusCounts.pending}</p>
          </div>

          <div
            onClick={() => {
              setSelectedStatus("overdue");
              setPage(0);
            }}
            className={`cursor-pointer rounded-lg p-4 text-center shadow border
    ${
      selectedStatus === "overdue"
        ? "bg-red-500 text-white"
        : "bg-red-100 border-red-400"
    }`}
          >
            <p className="text-sm">Overdue</p>
            <p className="text-xl font-bold">{statusCounts.overdue}</p>
          </div>

          <div
            onClick={() => {
              setSelectedStatus("complete");
              setPage(0);
            }}
            className={`cursor-pointer rounded-lg p-4 text-center shadow border
    ${
      selectedStatus === "complete"
        ? "bg-purple-500 text-white"
        : "bg-purple-100 border-purple-400"
    }`}
          >
            <p className="text-sm">Complete</p>
            <p className="text-xl font-bold">{statusCounts.complete}</p>
          </div>
        </div>

        {/* SEARCH + FILTER */}

        <div className="flex justify-between items-center my-3 flex-wrap gap-3">
          {/* STATUS */}

          {/* <div className="flex gap-3 border p-2 rounded-md bg-white">

            <label>
              <input
                type="radio"
                checked={selectedStatus === "all"}
                onChange={() => { setSelectedStatus("all"); setPage(0); }}
              />
              <span className="ml-1">All</span>
            </label>

            <label>
              <input
                type="radio"
                checked={selectedStatus === "pending"}
                onChange={() => { setSelectedStatus("pending"); setPage(0); }}
              />
              <span className="ml-1">Pending</span>
            </label>

            <label>
              <input
                type="radio"
                checked={selectedStatus === "complete"}
                onChange={() => { setSelectedStatus("complete"); setPage(0); }}
              />
              <span className="ml-1">Completed</span>
            </label>

            <label>
              <input
                type="radio"
                checked={selectedStatus === "overdue"}
                onChange={() => { setSelectedStatus("overdue"); setPage(0); }}
              />
              <span className="ml-1">Overdue</span>
            </label>

          </div> */}

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search Asset Name or Checklist"
            className="border p-2 w-[400px] rounded-lg border border-gray-300 border-1"
            value={searchText}
            onChange={handleSearch}
          />

          {/* FILTER BUTTON */}

          <button
            onClick={() => setShowFilter(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 fw-bold"
          >
            <Filter className="w-4 h-4 fw-bold" />
            Filter
          </button>
        </div>

        {/* FILTER POPUP */}

        {showFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-semibold mb-4">Filter by Month</h2>

              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setPage(0);
                }}
                className="border p-2 rounded w-full"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={clearFilter}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Clear
                </button>

                <button
                  onClick={() => setShowFilter(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
            <div  className="flex lg:flex-row flex-col gap-2">
            <input
              type="text"
              placeholder="Search By Asset name or Checklist name"
              className="border-2 p-2 md:w-96 border-gray-300 rounded-lg placeholder:text-sm"
              value={searchText}
              onChange={handleSearch}
            />
            </div>

          </div>
          <Table
            columns={RoutineColumns}
            data={filteredData}
            isPagination={true}
          />
        </div>
      </section>
    );
  };




  export default PPMTask



  // import React, { useEffect, useState } from "react";
  // import { Link } from "react-router-dom";
  // import Table from "../../components/table/Table";
  // import { BsEye } from "react-icons/bs";
  // import { API_URL, getVibeBackground } from "../../api";
  // import toast from "react-hot-toast";
  // import Navbar from "../../components/Navbar";
  // import AssetNav from "../../components/navbars/AssetNav";
  // import { getItemInLocalStorage } from "../../utils/localStorage";
  // import TablePagination from "@mui/material/TablePagination";

  // const PPMTask = () => {
  //   const [tasks, setTasks] = useState([]);
  //   const [searchText, setSearchText] = useState("");
  //   const [debouncedSearch, setDebouncedSearch] = useState("");
  //   const [selectedStatus, setSelectedStatus] = useState("all");

  //   const [page, setPage] = useState(0);
  //   const [rowsPerPage, setRowsPerPage] = useState(10);
  //   const [total, setTotal] = useState(0);

  //   const token = getItemInLocalStorage("TOKEN");

  //   const fetchPPMTask = async () => {
  //     toast.loading("Please wait");
  //     try {
  //       let url = `https://admin.vibecopilot.ai/activities.json?q[checklist_ctype_eq]=ppm&token=${token}&page=${
  //         page + 1
  //       }&per_page=${rowsPerPage}`;

  //       if (searchText) {
  //         url += `&q[asset_name_or_checklist_name_cont]=${searchText}`;
  //       if (debouncedSearch) {
  //         url += `&q[asset_name_or_checklist_name_cont]=${debouncedSearch}`;
  //       }

  //       if (selectedStatus !== "all") {
  //         url += `&q[status_eq]=${selectedStatus}`;
  //       }

  //       const res = await fetch(url);
  //       const data = await res.json();

  //       toast.dismiss();

  //       const activities = (data.activities || []).filter(
  //         (a) => a.asset_name
  //       );

  //       setTasks(activities);
  //       setTotal(data.total_count || 0);
  //     }}catch (error) {
  //       toast.dismiss();
  //       console.log(error);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchPPMTask();
  //   }, [page, rowsPerPage, selectedStatus]);

  //   // Debounce search text
  //   useEffect(() => {
  //     const delay = setTimeout(() => {
  //       fetchPPMTask();
  //       setDebouncedSearch(searchText);
  //     }, 500);
  //     return () => clearTimeout(delay);
  //   }, [searchText]);

  //   useEffect(() => {
  //     fetchPPMTask();
  //   }, [page, rowsPerPage, selectedStatus, debouncedSearch]);

  //   const handleSearch = (e) => {
  //     setSearchText(e.target.value);
  //     setPage(0);
  //   };

  //   const RoutineColumns = [
  //     {
  //       name: "View",
  //       cell: (row) => (
  //         <Link to={`/assets/routine-task-details/${row.asset_id}/${row.id}`}>
  //           <BsEye size={15} />
  //         </Link>
  //       ),
  //     },
  //     { name: "Asset Name", selector: (row) => row.asset_name, sortable: true },
  //     { name: "Checklist", selector: (row) => row.checklist_name, sortable: true },
  //     { name: "Status", selector: (row) => row.status, sortable: true },
  //     {
  //       name: "Assigned To",
  //       selector: (row) => row.assigned_to_name,
  //       sortable: true,
  //     },
  //   ];

  //   const handleChangePage = (event, newPage) => {
  //     setPage(newPage);
  //   };

  //   const handleChangeRowsPerPage = (event) => {
  //     setRowsPerPage(parseInt(event.target.value, 10));
  //     setPage(0);
  //   };

  //   return (
  //     <section className="flex">
  //       <Navbar />
  //       <div className="p-4 w-full flex flex-col">
  //         <AssetNav />

  //         <input
  //           type="text"
  //           placeholder="Search..."
  //           className="border p-2 w-96 rounded-lg mb-3"
  //           value={searchText}
  //           onChange={handleSearch}
  //         />

  //         {/* ✅ TABLE WITHOUT INTERNAL PAGINATION */}
  //         <Table
  //           columns={RoutineColumns}
  //           data={tasks}
  //           pagination={false}
  //         />

  //         {/* ✅ ONLY ONE PAGINATION (BOTTOM ONE) */}
  //         <div className="flex justify-end bg-white border-t">
  //           <TablePagination
  //             component="div"
  //             count={total}
  //             page={page}
  //             onPageChange={handleChangePage}
  //             rowsPerPage={rowsPerPage}
  //             onRowsPerPageChange={handleChangeRowsPerPage}
  //             rowsPerPageOptions={[5, 10, 25, 50]}
  //             showFirstButton
  //             showLastButton
  //           />
  //         </div>
  //       </div>
  //     </section>
  //   );
  // };

  // export default PPMTask;