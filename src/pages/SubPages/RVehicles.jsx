// import React, { useEffect, useState } from "react";
// import RVehiclesTable from "./RVehiclesTable";
// import Navbar from "../../components/Navbar";
// import Passes from "../Passes";
// import { getRegisteredVehicle } from "../../api"; 
// import { FaSearch } from "react-icons/fa";

// const RVehicles = () => {
//     const [page, setPage] = useState("All");  
//     const [vehicles, setVehicles] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const [currentPageNum, setCurrentPageNum] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [searchTerm, setSearchTerm] = useState("");

//     const handlePageChange = (newPage) => {
//         if (newPage >= 1 && newPage <= totalPages) {
//             setCurrentPageNum(newPage);
//         }
//     };

//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//         setCurrentPageNum(1);
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             setError(null);
//             setVehicles([]);

//             try {
//                 let response;
//                 let data;
//                 let list = [];

//                 // Common Params
//                 let params = {
//                     page: currentPageNum,
//                     per_page: 10,
//                 };

//                 // Search filter
//                 if (searchTerm.trim()) {
//                     params["q[name_or_vehicle_number_cont]"] = searchTerm.trim();
//                 }

//                 // -------------------------------
//                 // HISTORY API CALL
//                 // -------------------------------
//                 if (page === "History") {
//                     response = await getVehicleHistory(params);
//                     data = response?.data || {};

//                     // API returns: vehicle_logs
//                     list = data.vehicle_logs || [];
//                 } else {
//                     response = await getRegisteredVehicle(params);
//                     data = response?.data || {};

//                     // API returns: visitor_device_logs
//                     list = data.visitor_device_logs || [];
//                 }

//                 // Sort newest -> oldest
//                 list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

//                 setVehicles(list);
//                 setTotalPages(data.total_pages || 1);

//             } catch (err) {
//                 console.error("Fetch error:", err);
//                 setError("Failed to fetch data.");
//                 setVehicles([]);
//                 setTotalPages(1);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [page, currentPageNum, searchTerm]);

//     return (
//         <div className="visitors-page">
//             <section className="flex">
//                 <Navbar />

//                 <div className="w-full flex mx-3 flex-col overflow-hidden">
//                     <Passes />

//                     {/* Header Row */}
//                     <div className="flex justify-between items-end border-b border-gray-300 m-2">
                        
//                         {/* Tabs */}
//                         <div className="flex -mb-px">
//                             {["All", "History"].map((tab) => (
//                                 <h2
//                                     key={tab}
//                                     className={`p-2 px-4 text-sm cursor-pointer border-r border-l border-t transition-colors ${
//                                         page === tab
//                                             ? "text-blue-600 bg-white border-gray-300 rounded-t-lg font-semibold"
//                                             : "text-gray-600 border-transparent hover:text-blue-500 hover:border-gray-200"
//                                     }`}
//                                     onClick={() => {
//                                         if (page !== tab) {
//                                             setPage(tab);
//                                             setCurrentPageNum(1);
//                                         }
//                                     }}
//                                 >
//                                     {tab}
//                                 </h2>
//                             ))}
//                         </div>

//                         {/* Search Input */}
//                         <div className="relative mb-1 mr-2 flex items-center">
//                             <input
//                                 type="text"
//                                 placeholder="Search name or vehicle..."
//                                 value={searchTerm}
//                                 onChange={handleSearchChange}
//                                 className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-64 transition duration-150"
//                             />
//                             <FaSearch className="absolute left-3 text-gray-400 h-4 w-4" />
//                         </div>
//                     </div>

//                     {/* Table View */}
//                     <RVehiclesTable
//                         data={vehicles}
//                         loading={loading}
//                         error={error}
//                         currentPageNum={currentPageNum}
//                         totalPages={totalPages}
//                         onPageChange={handlePageChange}
//                     />
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default RVehicles;


import React, { useEffect, useState } from "react";
import RVehiclesTable from "./RVehiclesTable";
import Navbar from "../../components/Navbar";
import Passes from "../Passes";
import { getRegisteredVehicle, getVehicleHistory } from "../../api";
import { FaSearch } from "react-icons/fa";

const RVehicles = () => {
    const [page, setPage] = useState("All");
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentPageNum, setCurrentPageNum] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPageNum(newPage);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPageNum(1);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setVehicles([]);

            try {
                let response;
                let data = {};
                let list = [];

                let params = {
                    page: currentPageNum,
                    per_page: 10,
                };

                // Search
                if (searchTerm.trim()) {
                    params["q[name_or_vehicle_number_cont]"] = searchTerm.trim();
                }

                // HISTORY API CALL
                if (page === "History") {
                    response = await getVehicleHistory(params);
                    data = response?.data || {};
                    list = data.vehicle_logs || [];
                } else {
                    response = await getRegisteredVehicle(params);
                    data = response?.data || {};
                    list = data.visitor_device_logs || [];
                }

                // Sort newest first
                list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                setVehicles(list);
                setTotalPages(data.total_pages || 1);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to fetch data.");
                setVehicles([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, currentPageNum, searchTerm]);

    return (
        <div className="visitors-page">
            <section className="flex">
                <Navbar />

                <div className="w-full flex mx-3 flex-col overflow-hidden">
                    <Passes />

                    {/* Header */}
                    <div className="flex justify-between items-end border-b border-gray-300 m-2">
                        
                        {/* Tabs */}
                        <div className="flex -mb-px">
                            {["All", "History"].map((tab) => (
                                <h2
                                    key={tab}
                                    className={`p-2 px-4 text-sm cursor-pointer border-r border-l border-t transition-colors ${
                                        page === tab
                                            ? "text-blue-600 bg-white border-gray-300 rounded-t-lg font-semibold"
                                            : "text-gray-600 border-transparent hover:text-blue-500 hover:border-gray-200"
                                    }`}
                                    onClick={() => {
                                        if (page !== tab) {
                                            setPage(tab);
                                            setCurrentPageNum(1);
                                        }
                                    }}
                                >
                                    {tab}
                                </h2>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative mb-1 mr-2 flex items-center">
                            <input
                                type="text"
                                placeholder="Search name or vehicle..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 w-64 transition duration-150"
                            />
                            <FaSearch className="absolute left-3 text-gray-400 h-4 w-4" />
                        </div>
                    </div>

                    {/* TABLE */}
                    <RVehiclesTable
                        data={vehicles}
                        loading={loading}
                        error={error}
                        currentPageNum={currentPageNum}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        pageType={page}
                    />
                </div>
            </section>
        </div>
    );
};

export default RVehicles;
