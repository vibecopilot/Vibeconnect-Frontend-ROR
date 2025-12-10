import React, { useEffect, useState } from "react";
import RVehiclesTable from "./RVehiclesTable";
import Navbar from "../../components/Navbar";
import Passes from "../Passes";
import { getRegisteredVehicle } from "../../api"; 

const RVehicles = () => {
    const [page, setPage] = useState("All");
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentPageNum, setCurrentPageNum] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPageNum(newPage);
      }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setVehicles([]); 

            try {
                let response;
                let data;
                let listKey; 

               
                let params = {
                    page: currentPageNum,
                    per_page: 10,
                };
    
                if (page === "Visitor In") {
                    params["q[entry_exit_status_eq]"] = "IN";
                }
                if (page === "Visitor Out") {
                    params["q[entry_exit_status_eq]"] = "OUT";
                }
                
                // API Call
                response = await getRegisteredVehicle(params);
                data = response?.data || {};

               
                listKey = "visitor_device_logs"; 
             
                
                let list = data[listKey] || [];
                
                // Sort by date newest first
                list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                setVehicles(list);
                // **IMP:** total_pages को API रिस्पॉन्स से सेट करें
                setTotalPages(data.total_pages || 1); 

            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to fetch visitor device logs.");
                setVehicles([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, currentPageNum]); 

    return (
        <div className="visitors-page">
            <section className="flex">
                <Navbar />

                <div className="w-full flex mx-3 flex-col overflow-hidden">
                    <Passes />

                    {/* Tabs */}
                    <div className="flex m-2 w-full border-b border-gray-300">
                        {["All", "Visitor In", "Visitor Out", "History"].map((tab) => (
                            <h2
                                key={tab}
                                className={`p-2 px-4 text-sm cursor-pointer ${
                                    page === tab
                                        ? "text-blue-500 bg-white shadow-custom-all-sides rounded-t-md"
                                        : "text-black"
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

                    {/* Table View */}
                    <RVehiclesTable
                        data={vehicles}
                        loading={loading}
                        error={error}
                        currentPageNum={currentPageNum}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </section>
        </div>
    );
};

export default RVehicles;