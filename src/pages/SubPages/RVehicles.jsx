import React, { useEffect, useState } from "react";
import RVehiclesTable from "./RVehiclesTable";
import Navbar from "../../components/Navbar";
import Passes from "../Passes";
import { getRegisteredVehicle, getVehicleHistory } from "../../api";
import { FaSearch } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5"; // ✅ ADDED
import { useNavigate } from "react-router-dom"; // ✅ ADDED

const RVehicles = () => {
    const navigate = useNavigate(); // ✅ ADDED

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

    // ==============================
    // ✅ APPROVAL ACTIONS (ADDED)
    // ==============================
    const handleApprove = async (id) => {
        try {
            await fetch(
                `https://admin.vibecopilot.ai/registered_vehicles/${id}/approve.json?token=e6fbf77f4fbb5a72c4150e495c961972f0f14059d8a6670f`,
                { method: "POST" }
            );
            setVehicles((prev) => prev.filter((v) => v.id !== id));
        } catch (err) {
            console.error("Approve failed", err);
        }
    };

    const handleReject = async (id) => {
        try {
            await fetch(
                `https://admin.vibecopilot.ai/registered_vehicles/${id}/reject.json?token=e6fbf77f4fbb5a72c4150e495c961972f0f14059d8a6670f`,
                { method: "POST" }
            );
            setVehicles((prev) => prev.filter((v) => v.id !== id));
        } catch (err) {
            console.error("Reject failed", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setVehicles([]);

            try {
                let params = {
                    page: currentPageNum,
                    per_page: 10,
                };

                if (searchTerm.trim()) {
                    params["q[name_or_vehicle_number_cont]"] = searchTerm.trim();
                }

                let response;
                let data = {};
                let list = [];

                // 🔹 ALL
                if (page === "All") {
                    response = await getRegisteredVehicle(params);
                    data = response?.data || {};
                    list = data.registered_vehicles || [];
                }

                // 🔹 VEHICLE IN
                else if (page === "Vehicle In") {
                    params["q[check_out_not_null]"] = false;
                    response = await getVehicleHistory(params);
                    data = response?.data || {};
                    list = data.vehicle_logs || [];
                }

                // 🔹 VEHICLE OUT
                else if (page === "Vehicle Out") {
                    params["q[check_out_not_null]"] = true;
                    response = await getVehicleHistory(params);
                    data = response?.data || {};
                    list = data.vehicle_logs || [];
                }

                // 🔹 HISTORY
                else if (page === "History") {
                    response = await getVehicleHistory(params);
                    data = response?.data || {};
                    list = data.vehicle_logs || [];
                }

                // 🔹 APPROVALS
                else if (page === "Approvals") {
                    const approvalResp = await fetch(
                        `https://admin.vibecopilot.ai/registered_vehicles/pending_approvals.json?token=e6fbf77f4fbb5a72c4150e495c961972f0f14059d8a6670f`
                    );
                    const approvalData = await approvalResp.json();
                    list = approvalData.approvals || [];
                    setTotalPages(approvalData.total_pages || 1);
                    setVehicles(list);
                    setLoading(false);
                    return;
                }

                list.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );

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

                    {/* ✅ HEADER + ADD BUTTON (ONLY ADDED, NOTHING REMOVED) */}
                    <div className="flex justify-between items-center px-2 mt-2">
                        <h2 className="font-semibold text-lg">Registered Vehicles</h2>

                        <button
                            onClick={() => navigate("/admin/add-rvehicles")}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            <IoAddCircleOutline size={20} />
                            Add Vehicle
                        </button>
                    </div>

                    <div className="flex justify-between items-end border-b border-gray-300 m-2">
                        <div className="flex -mb-px">
                            {["All", "Vehicle In", "Vehicle Out", "Approvals", "History"].map(
                                (tab) => (
                                    <h2
                                        key={tab}
                                        className={`p-2 px-4 text-sm cursor-pointer border-r border-l border-t ${
                                            page === tab
                                                ? "text-blue-600 bg-white border-gray-300 rounded-t-lg font-semibold"
                                                : "text-gray-600 border-transparent"
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
                                )
                            )}
                        </div>

                        <div className="relative mb-1 mr-2 flex items-center">
                            <input
                                type="text"
                                placeholder="Search name or vehicle..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-64"
                            />
                            <FaSearch className="absolute left-3 text-gray-400 h-4 w-4" />
                        </div>
                    </div>

                    <RVehiclesTable
                        data={vehicles}
                        loading={loading}
                        error={error}
                        currentPageNum={currentPageNum}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        pageType={page}
                        onApprove={page === "Approvals" ? handleApprove : undefined}
                        onReject={page === "Approvals" ? handleReject : undefined}
                    />
                </div>
            </section>
        </div>
    );
};

export default RVehicles;
