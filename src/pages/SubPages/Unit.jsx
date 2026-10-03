import React, { useEffect, useMemo, useState, useCallback } from "react";
import Account from "./Account";
import { PiPlusCircle } from "react-icons/pi";
import { BiEdit } from "react-icons/bi";
import {
  getAllUnits,
  getBuildings,
  getFloors,
  postNewUnit,
} from "../../api";
import Table from "../../components/table/Table";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import EditUnitModal from "../../containers/modals/EditUnitModal";
import Navbar from "../../components/Navbar";
import SiteHeader from "../../components/SiteHeader";

const Unit = () => {
  // ✅ Site Change State
  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [units, setUnits] = useState([]);
  const [unit, setUnit] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [unitAdded, setUnitAdded] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [id, setId] = useState("");

  // ✅ Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const themeColor = useSelector((state) => state.theme.color);

  /* ---------------- FETCH BUILDINGS ---------------- */
  const fetchBuildings = useCallback(async () => {
    try {
      const buildingResp = await getBuildings();

      // ✅ Site wise filter
      const filteredBuildings = buildingResp.data.filter(
        (item) => String(item.site_id) === String(activeSiteId)
      );

      setBuildings(filteredBuildings);
    } catch (error) {
      console.log(error);
    }
  }, [activeSiteId]);

  /* ---------------- FETCH UNITS ---------------- */
  const fetchAllUnits = useCallback(async () => {
    try {
      const unitsResp = await getAllUnits();

      // ✅ Site wise filter
      const filteredUnits = unitsResp.data.filter(
        (item) => String(item.site_id) === String(activeSiteId)
      );

      const sortedUnits = filteredUnits.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setUnits(sortedUnits);
    } catch (error) {
      console.log(error);
    }
  }, [activeSiteId]);

  /* ---------------- USE EFFECT ---------------- */
  useEffect(() => {
    fetchBuildings();
    fetchAllUnits();
  }, [fetchBuildings, fetchAllUnits, unitAdded, activeSiteId]);

  /* ---------------- SEARCH DEBOUNCE ---------------- */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredUnits = useMemo(() => {
    if (!debouncedSearch.trim()) return units;

    return units.filter((row) => {
      const searchString = [
        row?.building_name || "",
        row?.floor_name || "",
        row?.name || "",
      ]
        .join(" ")
        .toLowerCase();

      return searchString.includes(debouncedSearch.toLowerCase());
    });
  }, [debouncedSearch, units]);

  /* ---------------- BUILDING CHANGE ---------------- */
  const handleBuildingChange = async (e) => {
    const buildID = Number(e.target.value);

    setBuilding(buildID);
    setFloor("");

    try {
      const build = await getFloors(buildID);

      // ✅ Site wise floor filter
      const filteredFloors = build.data.filter(
        (item) => String(item.site_id) === String(activeSiteId)
      );

      setFloors(
        filteredFloors.map((item) => ({
          name: item.name,
          id: item.id,
        }))
      );
    } catch (e) {
      console.log(e);
    }
  };

  /* ---------------- EDIT ---------------- */
  const handleEditClick = (id) => {
    setEditModal(true);
    setId(id);
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const unitColumns = [
    {
      name: "Site",
      selector: (row) => row.site_name,
      sortable: true,
    },
    {
      name: "Building",
      selector: (row) => row.building_name,
      sortable: true,
    },
    {
      name: "Floors",
      selector: (row) => row.floor_name,
      sortable: true,
    },
    {
      name: "Units",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => handleEditClick(row.id)}>
            <BiEdit size={15} />
          </button>
        </div>
      ),
    },
  ];

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!building || !floor || !unit) {
      toast.error("Please fill all fields");
      return;
    }

    const formData = new FormData();

    formData.append("unit[site_id]", activeSiteId);
    formData.append("unit[building_id]", building);
    formData.append("unit[floor_id]", floor);
    formData.append("unit[name]", unit);

    try {
      await postNewUnit(formData);

      toast.success("Unit created successfully");

      // ✅ reset form
      setBuilding("");
      setFloor("");
      setUnit("");
      setFloors([]);
      setShowFields(false);

      // ✅ refresh data
      setUnitAdded((prev) => !prev);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create unit");
    }
  };

  return (
    <div className="flex">
      <Navbar />

      <div className="w-full flex lg:mx-3 flex-col overflow-hidden">
        {/* ✅ SITE HEADER */}
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id);

            // ✅ reset all states on site change
            setBuilding("");
            setFloor("");
            setUnit("");
            setFloors([]);
            setUnits([]);
          }}
        />

        <Account />

        <div className="flex flex-col m-2 gap-2">
          {/* TOP BAR */}
          <div className="flex justify-between items-center flex-wrap gap-3">
            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search by Building, Floor, Unit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-400 rounded-md p-2 w-[500px]"
            />

            {/* ADD BUTTON */}
            <h2
              className="font-semibold hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2"
              onClick={() => setShowFields(!showFields)}
              style={{ background: themeColor }}
            >
              <PiPlusCircle size={20} />
              Add Unit
            </h2>
          </div>

          {/* ADD FORM */}
          {showFields && (
            <div>
              <div className="flex gap-3 md:flex-row flex-col">
                {/* BUILDING */}
                <select
                  name="building"
                  value={building}
                  onChange={handleBuildingChange}
                  className="border border-gray-500 rounded-md p-2 md:w-48"
                >
                  <option value="">Select Building</option>

                  {buildings.map((build) => (
                    <option value={build.id} key={build.id}>
                      {build.name}
                    </option>
                  ))}
                </select>

                {/* FLOOR */}
                <select
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="border border-gray-500 rounded-md p-2 md:w-48"
                >
                  <option value="">Select Floor</option>

                  {floors.map((fl) => (
                    <option value={fl.id} key={fl.id}>
                      {fl.name}
                    </option>
                  ))}
                </select>

                {/* UNIT */}
                <input
                  type="text"
                  placeholder="Enter Unit Name"
                  className="border border-gray-500 rounded-md p-2"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />

                {/* BUTTONS */}
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  >
                    Submit
                  </button>

                  <button
                    onClick={() => setShowFields(false)}
                    className="bg-red-500 text-white py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TABLE */}
          <div className="flex justify-center items-center">
            <div className="w-screen">
              <Table columns={unitColumns} data={filteredUnits} />
            </div>
          </div>
        </div>

        {/* EDIT MODAL */}
        {editModal && (
          <EditUnitModal
            onclose={() => {
              setEditModal(false);
              setUnitAdded((prev) => !prev);
            }}
            id={id}
          />
        )}
      </div>
    </div>
  );
};

export default Unit;