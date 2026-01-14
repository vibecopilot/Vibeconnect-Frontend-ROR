import React, { useEffect, useMemo, useState } from "react";
import Table from "../../components/table/Table";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import { getPermits } from "../../api";
import { dateFormat, formatTime } from "../../utils/dateUtils";

const PermitList = () => {
  const themeColor = useSelector((state) => state.theme.color);

  document.title = `Permit - Vibe Connect`;

  const [permits, setPermits] = useState([]);
  const [filteredPermits, setFilteredPermits] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [permitStats, setPermitStats] = useState({
    total_approved: 0,
    total_closed: 0,
    total_drafts: 0,
    total_extended: 0,
    total_open: 0,
    total_permits: 0,
    total_rejected: 0,
  });

  const columns = useMemo(
    () => [
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex items-center gap-4">
            <Link to={`/admin/permit-details/${row.id}`}>
              <BsEye size={15} />
            </Link>
            <Link to={`/admin/edit-permit/${row.id}`}>
              <BiEdit size={15} />
            </Link>
          </div>
        ),
      },

      { name: "ID", selector: (row) => row.id, sortable: true },
      {
        name: "Permit Type",
        selector: (row) => row.permit_type || "No Type",
        sortable: true,
      },
      { name: "Permit For", selector: (row) => row.permit_for || "-", sortable: true },
      { name: "Created By", selector: (row) => row.created_by || row.name || "-", sortable: true },
      { name: "Status", selector: (row) => row.permit_status || "-", sortable: true },
      { name: "Building Name", selector: (row) => row.building_name || "-", sortable: true },
      { name: "Floor Name", selector: (row) => row.floor_name || "-", sortable: true },
      { name: "Unit Name", selector: (row) => row.unit_name || "-", sortable: true },

      {
        name: "Created Date",
        selector: (row) => (row.created_at ? dateFormat(row.created_at) : "-"),
        sortable: true,
      },
      {
        name: "Created On",
        selector: (row) => (row.created_at ? formatTime(row.created_at) : "-"),
        sortable: true,
      },
      {
        name: "Permit Expiry Date",
        selector: (row) =>
          row.expiry_date_and_time ? dateFormat(row.expiry_date_and_time) : "-",
        sortable: true,
      },
      {
        name: "Permit Expiry Time",
        selector: (row) =>
          row.expiry_date_and_time ? formatTime(row.expiry_date_and_time) : "-",
        sortable: true,
      },
    ],
    []
  );

  const fetchPermits = async () => {
    try {
      const res = await getPermits();

      // ✅ API returns { permits: [] }
      const list = Array.isArray(res?.data?.permits) ? res.data.permits : [];

      // ✅ sort by created_at desc
      const sorted = [...list].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setPermits(sorted);
      setFilteredPermits(sorted);

      // ✅ stats are present inside permit objects (same values), so pick first safely
      const first = sorted[0] || {};
      setPermitStats({
        total_approved: first.total_approved ?? 0,
        total_closed: first.total_closed ?? 0,
        total_drafts: first.total_drafts ?? 0,
        total_extended: first.total_extended ?? 0,
        total_open: first.total_open ?? 0,
        total_permits: first.total_permits ?? 0,
        total_rejected: first.total_rejected ?? 0,
      });
    } catch (error) {
      console.log("Permits fetch error:", error);
      setPermits([]);
      setFilteredPermits([]);
      setPermitStats({
        total_approved: 0,
        total_closed: 0,
        total_drafts: 0,
        total_extended: 0,
        total_open: 0,
        total_permits: 0,
        total_rejected: 0,
      });
    }
  };

  useEffect(() => {
    fetchPermits();
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value || "";
    setSearchText(searchValue);

    if (!searchValue.trim()) {
      setFilteredPermits(permits);
      return;
    }

    const q = searchValue.toLowerCase();

    const filtered = permits.filter((item) => {
      const idStr = item?.id ? String(item.id).toLowerCase() : "";
      const permitFor = (item?.permit_for || "").toLowerCase();
      const building = (item?.building_name || "").toLowerCase();
      const createdBy = (item?.created_by || item?.name || "").toLowerCase();

      return (
        idStr.includes(q) ||
        permitFor.includes(q) ||
        building.includes(q) ||
        createdBy.includes(q)
      );
    });

    setFilteredPermits(filtered);
  };

  return (
    <section className="flex">
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        {/* STATS */}
        <div className="flex flex-col flex-wrap flex-shrink md:flex-row justify-start gap-2 my-2">
          <div className="shadow-xl rounded-full border-4 border-gray-400 w-52 flex flex-col items-center">
            <p className="font-semibold">Total Permits</p>
            <p className="text-center font-semibold">{permitStats.total_permits}</p>
          </div>

          <div className="shadow-xl rounded-full border-4 border-green-400 w-52 px-6 flex flex-col items-center">
            <p className="font-semibold">Draft Permits</p>
            <p className="text-center font-semibold">{permitStats.total_drafts}</p>
          </div>

          <div className="shadow-xl rounded-full border-4 border-red-400 w-52 px-6 flex flex-col items-center">
            <p className="font-semibold">Open Permits</p>
            <p className="text-center font-semibold">{permitStats.total_open}</p>
          </div>

          <div className="shadow-xl rounded-full border-4 border-orange-400 w-52 px-6 flex flex-col items-center">
            <p className="font-semibold">Approved Permits</p>
            <p className="text-center font-semibold">{permitStats.total_approved}</p>
          </div>

          <div className="shadow-xl rounded-full border-4 border-indigo-400 w-52 px-6 flex flex-col items-center">
            <p className="font-semibold">Rejected Permits</p>
            <p className="text-center font-semibold">{permitStats.total_rejected}</p>
          </div>

          <div className="shadow-xl rounded-full border-4 border-blue-400 w-52 px-6 flex flex-col items-center">
            <p className="font-semibold">Extended Permits</p>
            <p className="text-center font-semibold">{permitStats.total_extended}</p>
          </div>

          <div className="shadow-xl rounded-full border-4 border-yellow-400 w-52 px-6 flex flex-col items-center">
            <p className="font-semibold">Closed Permits</p>
            <p className="text-center font-semibold">{permitStats.total_closed}</p>
          </div>
        </div>

        {/* SEARCH + ADD */}
        <div className="flex my-2 flex-col">
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search by Permit for / Building / ID / Created By"
              value={searchText}
              onChange={handleSearch}
              className="border p-2 w-96 border-gray-300 rounded-lg"
            />

            <Link
              to={"/admin/permit/add-new-permit"}
              className="border-2 font-semibold transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
              style={{ background: themeColor }}
            >
              <PiPlusCircle size={20} />
              Add
            </Link>
          </div>
        </div>

        {/* TABLE */}
        <Table columns={columns} data={filteredPermits} />
      </div>
    </section>
  );
};

export default PermitList;
