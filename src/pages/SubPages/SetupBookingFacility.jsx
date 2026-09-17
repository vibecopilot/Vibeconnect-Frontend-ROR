import React, { useEffect, useMemo, useState } from "react";
import { BiEdit, BiExport } from "react-icons/bi";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { useSelector } from "react-redux";

import Table from "../../components/table/Table";
import SetupSeatBooking from "./SetupSeatBooking";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import SiteHeader from "../../components/SiteHeader";

import {
  getFacitilitySetup,
  getSetupAmenityExport,
} from "../../api";

import { getItemInLocalStorage } from "../../utils/localStorage";

const SetupBookingFacility = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const [setupData, setSetupData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState("facility");

  // ✅ Site Change State
  const [activeSiteId, setActiveSiteId] = useState(
    getItemInLocalStorage("SITEID")
  );

  const token = getItemInLocalStorage("TOKEN");

  // ✅ Fetch Facilities
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await getFacitilitySetup(activeSiteId);

        const mappedData = (res?.data?.amenities || []).map((item) => ({
          id: item.id,
          site_name: item.site_id || "-",
          fac_name: item.fac_name || "-",
          fac_type: item.fac_type || "-",
          bookBefore: item.book_before?.[0] || "-",
          cancelBefore: item.cancel_before?.[0] || "-",
          advBooking: item.advance_booking?.[0] || "-",
          created_at: item.created_at
            ? new Date(item.created_at).toLocaleString()
            : "-",
          status: item.status || "-",
        }));

        const sortedData = mappedData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setSetupData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        console.log("Facility Fetch Error:", error);
      }
    };

    fetchFacilities();
  }, [activeSiteId]);

  // ✅ Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // ✅ Search Filter
  const searchedFacilities = useMemo(() => {
    if (!debouncedSearch.trim()) return setupData;

    return setupData.filter((item) => {
      const searchableText = [
        item.site_name,
        item.fac_name,
        item.fac_type,
        item.bookBefore,
        item.cancelBefore,
        item.advBooking,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        debouncedSearch.toLowerCase()
      );
    });
  }, [debouncedSearch, setupData]);

  // ✅ Table Columns
  const setupColumn = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-3 px-2 py-2">
          <Link to={`/setup/facility-details/${row.id}`}>
            <BsEye size={16} />
          </Link>

          <Link to={`/setup/facility-details/edit/${row.id}`}>
            <BiEdit size={16} />
          </Link>
        </div>
      ),
      sortable: false,
      width: "120px",
    },

    {
      name: "Site",
      selector: (row) => row.site_name,
      sortable: true,
      wrap: true,
    },

    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },

    {
      name: "Facility Name",
      selector: (row) => row.fac_name,
      sortable: true,
      wrap: true,
    },

    {
      name: "Facility Type",
      selector: (row) => row.fac_type,
      sortable: true,
      wrap: true,
    },

    {
      name: "Book Before",
      selector: (row) => row.bookBefore,
      sortable: true,
    },

    {
      name: "Cancel Before",
      selector: (row) => row.cancelBefore,
      sortable: true,
    },

    {
      name: "Advance Booking",
      selector: (row) => row.advBooking,
      sortable: true,
    },

    {
      name: "Created On",
      selector: (row) => row.created_at,
      sortable: true,
      wrap: true,
    },
  ];

  // ✅ Export
  const handleExport = async () => {
    try {
      const response = await getSetupAmenityExport(
        activeSiteId,
        token
      );

      const blob = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "facility_setup.xlsx");

      document.body.appendChild(link);
      link.click();

      link.remove();
    } catch (error) {
      console.error("Export Error:", error);
    }
  };

  return (
    <div className="flex">
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

        {/* ✅ Tabs */}
        <div className="flex justify-center my-2">
          <div className="sm:flex grid grid-cols-2 sm:flex-row gap-5 font-medium p-2 sm:rounded-full rounded-md opacity-90 bg-gray-200">
            <h2
              className={`p-1 ${page === "facility"
                  ? "bg-white text-blue-500 shadow-custom-all-sides"
                  : ""
                } rounded-full px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
              onClick={() => setPage("facility")}
            >
              Workspace booking
            </h2>

            <h2
              className={`p-1 ${page === "seatBooking"
                  ? "bg-white text-blue-500 shadow-custom-all-sides"
                  : ""
                } rounded-full px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
              onClick={() => setPage("seatBooking")}
            >
              Seat
            </h2>
          </div>
        </div>

        {/* ✅ Facility Page */}
        {page === "facility" && (
          <>
            <div className="flex md:flex-row flex-col gap-3 items-center w-full my-2">
              {/* ✅ Search */}
              <input
                type="text"
                placeholder="Search by Site, Facility Name, Type..."
                className="border p-2 border-gray-300 rounded-md w-full outline-none"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              {/* ✅ Buttons */}
              <div className="flex gap-2 justify-end">
                <Link
                  style={{ background: themeColor }}
                  to={"/setup/facility/setup-facility"}
                  className="rounded-lg flex font-semibold items-center gap-2 text-white px-4 py-2 whitespace-nowrap"
                >
                  <IoAddCircleOutline size={20} />
                  Add
                </Link>

                <button
                  onClick={handleExport}
                  style={{ background: themeColor }}
                  className="rounded-lg flex font-semibold items-center gap-2 text-white px-4 py-2 whitespace-nowrap"
                >
                  <BiExport size={20} />
                  Export
                </button>
              </div>
            </div>

            {/* ✅ Table */}
            <Table
              columns={setupColumn}
              data={searchedFacilities}
              isPagination={true}
            />
          </>
        )}

        {/* ✅ Seat Booking */}
        {page === "seatBooking" && <SetupSeatBooking />}
      </div>
    </div>
  );
};

export default SetupBookingFacility;