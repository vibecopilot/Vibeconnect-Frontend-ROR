import React, { useEffect, useState, useCallback } from "react";
import Account from "./Account";
import { PiPlusCircle } from "react-icons/pi";
import { useSelector } from "react-redux";
import Table from "../../components/table/Table";
import { BiEdit } from "react-icons/bi";
import { getAllFloors, getBuildings, postNewFloor } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import EditFloorModal from "../../containers/modals/EditFloorModal";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import SiteHeader from "../../components/SiteHeader";

const Floor = () => {
  const [building, setBuilding] = useState("");
  const [floors, setFloors] = useState([]);
  const [floor, setFloor] = useState("");
  const [floorAdded, setFloorAdded] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [id, setId] = useState("");

  // ✅ Site change state
  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  const themeColor = useSelector((state) => state.theme.color);

  /* ---------------- FETCH FLOORS ---------------- */
  const fetchAllFloors = useCallback(async () => {
    try {
      const floorsResp = await getAllFloors();

      // ✅ Site wise filter
      const filteredFloors = floorsResp.data.filter(
        (item) => String(item.site_id) === String(activeSiteId)
      );

      const sortedFloor = filteredFloors.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setFloors(sortedFloor);
    } catch (error) {
      console.log(error);
    }
  }, [activeSiteId]);

  /* ---------------- FETCH BUILDINGS ---------------- */
  const fetchBuilding = useCallback(async () => {
    try {
      const buildingResp = await getBuildings();

      // ✅ Site wise building filter
      const filteredBuildings = buildingResp.data.filter(
        (item) => String(item.site_id) === String(activeSiteId)
      );

      setBuildings(filteredBuildings);
    } catch (error) {
      console.log(error);
    }
  }, [activeSiteId]);

  /* ---------------- USE EFFECT ---------------- */
  useEffect(() => {
    fetchAllFloors();
    fetchBuilding();
  }, [fetchAllFloors, fetchBuilding, floorAdded, activeSiteId]);

  /* ---------------- EDIT ---------------- */
  const handleEditClick = (id) => {
    setEditModal(true);
    setId(id);
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const floorColumns = [
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

    if (!building || !floor) {
      toast.error("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("floor[name]", floor);
    formData.append("floor[site_id]", activeSiteId);
    formData.append("floor[building_id]", building);

    try {
      await postNewFloor(formData);

      toast.success("Floor created successfully");

      setFloor("");
      setBuilding("");
      setShowFields(false);

      // ✅ refresh table
      setFloorAdded((prev) => !prev);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create floor");
    }
  };

  return (
    <div className="flex">
      <SetupNavbar />

      <div className="w-full flex lg:mx-3 flex-col overflow-hidden">
        {/* ✅ Site Header Added */}
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id);

            // reset form/data on site change
            setBuilding("");
            setFloor("");
            setFloors([]);
          }}
        />
        <Account />

        <div className="flex flex-col m-2 gap-2">
          {/* ADD BUTTON */}
          <div className="flex justify-end">
            <h2
              className="font-semibold hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2"
              onClick={() => setShowFields(!showFields)}
              style={{ background: themeColor }}
            >
              <PiPlusCircle size={20} />
              Add Floor
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
                  onChange={(e) => setBuilding(e.target.value)}
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
                <input
                  type="text"
                  placeholder="Enter Floor"
                  className="border border-gray-500 rounded-md p-2"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                />

                {/* SUBMIT */}
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Submit
                </button>

                {/* CANCEL */}
                <button
                  onClick={() => setShowFields(false)}
                  className="bg-red-500 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* TABLE */}
          <div className="flex justify-center items-center">
            <div className="w-screen">
              <Table columns={floorColumns} data={floors} />
            </div>
          </div>
        </div>

        {/* EDIT MODAL */}
        {editModal && (
          <EditFloorModal
            id={id}
            onclose={() => {
              setEditModal(false);
              setFloorAdded((prev) => !prev);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Floor;