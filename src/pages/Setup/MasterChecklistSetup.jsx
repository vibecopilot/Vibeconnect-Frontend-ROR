import React, { useEffect, useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { useSelector } from "react-redux";

import Table from "../../components/table/Table";
import Navbar from "../../components/Navbar";
import SiteHeader from "../../components/SiteHeader";

import { getMasterChecklist } from "../../api";
import SetupNavbar from "../../components/navbars/SetupNavbar";

function MasterCheckListSetup() {
  const themeColor = useSelector((state) => state.theme.color);

  const [masterchecklists, setmasterChecklists] = useState([]);

  // ✅ Site State
  const [activeSiteId, setActiveSiteId] = useState("");

  // ✅ Search States
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ✅ Fetch Checklists
  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const checklist = await getMasterChecklist(activeSiteId);

        const sortedChecklists = (
          checklist?.data?.checklists || []
        ).sort(
          (a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        );

        setmasterChecklists(sortedChecklists);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChecklist();
  }, [activeSiteId]);

  // ✅ Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // ✅ Search Filter
  const filteredChecklists = useMemo(() => {
    if (!debouncedSearch.trim()) return masterchecklists;

    return masterchecklists.filter((row) => {
      const searchableText = [
        row?.id,
        row?.name,
        row?.meterCategory,
        row?.scheduledFor,
        row?.site_name,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        debouncedSearch.toLowerCase()
      );
    });
  }, [debouncedSearch, masterchecklists]);

  // ✅ Table Columns
  const column = [
    {
      name: "Actions",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/edit-master-checklist-setup/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
      width: "100px",
    },

    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },

    {
      name: "Site",
      selector: (row) => row.site_name || "-",
      sortable: true,
      wrap: true,
    },

    {
      name: "Activity Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },

    {
      name: "Meter Category",
      selector: (row) => row.meterCategory || "-",
      sortable: true,
      wrap: true,
    },

    {
      name: "Scheduled For",
      selector: (row) => row.scheduledFor || "-",
      sortable: true,
      wrap: true,
    },
  ];

  return (
    <section className="flex">
      <SetupNavbar />

      <div className="w-full flex mx-3 flex-col overflow-hidden">
        {/* ✅ Site Header */}
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id);

            // reset search on site change
            setSearchText("");
            setDebouncedSearch("");
          }}
        />
        {/* ✅ Search + Add Button */}
        <div className="flex flex-col sm:flex-row md:justify-between gap-3 my-3">
          <input
            type="text"
            placeholder="Search by Activity Name, Site, Category..."
            className="border-2 p-2 w-full border-gray-300 rounded-lg outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <div className="flex gap-3 sm:flex-row flex-col">
            <Link
              to={`/admin/add-master-checklist-setup`}
              style={{ background: themeColor }}
              className="font-semibold px-4 py-2 flex gap-2 items-center rounded-md text-white whitespace-nowrap"
            >
              <IoMdAdd />
              Add
            </Link>
          </div>
        </div>

        {/* ✅ Table */}
        <div className="my-3">
          <Table
            columns={column}
            data={filteredChecklists}
            isPagination={true}
          />
        </div>
      </div>
    </section>
  );
}

export default MasterCheckListSetup;