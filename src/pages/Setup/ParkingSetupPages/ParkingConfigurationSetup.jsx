import React, { useEffect, useMemo, useState } from "react";
import Table from "../../../components/table/Table";
import { BiEdit } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";
import {
  editParkingConfiguration,
  getFloors,
  getParkingConfiguration,
  getParkingConfigurationDetails,
  createParkingConfiguration,
} from "../../../api";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import toast from "react-hot-toast";

const safeJsonParse = (val) => {
  if (typeof val !== "string") return val;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

// ✅ normalize API response (array OR wrapped)
const normalizeParkingList = (respData) => {
  if (Array.isArray(respData)) return respData;
  if (Array.isArray(respData?.parking_configurations))
    return respData.parking_configurations;
  if (Array.isArray(respData?.all_parking)) return respData.all_parking;
  if (Array.isArray(respData?.data)) return respData.data;
  return [];
};

const ParkingConfigurationSetup = () => {
  const themeColor = useSelector((state) => state.theme.color);

  /** ---------------- buildings ---------------- */
  const buildingsRaw = getItemInLocalStorage("Building");
  const buildingsParsed = safeJsonParse(buildingsRaw);
  const buildings = useMemo(() => {
    if (Array.isArray(buildingsParsed)) return buildingsParsed;
    if (Array.isArray(buildingsParsed?.data)) return buildingsParsed.data;
    return [];
  }, [buildingsParsed]);

  /** ---------------- API token (query param) ---------------- */
  // ✅ token should be present in localStorage (recommended), otherwise you can hardcode for testing
  const apiTokenRaw =
    getItemInLocalStorage("token") ||
    getItemInLocalStorage("api_token") ||
    getItemInLocalStorage("auth_token") ||
    "";
  const apiToken = typeof apiTokenRaw === "string" ? apiTokenRaw : String(apiTokenRaw || "");

  /** ---------------- listing ---------------- */
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [update, setUpdate] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  /** ---------------- edit modal ---------------- */
  const [editId, setEditId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [location, setLocation] = useState(""); // building_id (string)
  const [floor, setFloor] = useState(""); // floor_id (string)
  const [floors, setFloors] = useState([]);
  const [parkname, setParkname] = useState("");
  const [editVehicleType, setEditVehicleType] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  // ✅ reserved fields
  const [editIsReserved, setEditIsReserved] = useState(false);
  const [editReservedForUserId, setEditReservedForUserId] = useState("");

  /** ---------------- add modal ---------------- */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLocation, setAddLocation] = useState("");
  const [addFloor, setAddFloor] = useState("");
  const [addFloors, setAddFloors] = useState([]);
  const [addParkname, setAddParkname] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [saving, setSaving] = useState(false);

  /** ---------------- fetch listing ---------------- */
  useEffect(() => {
    const fetchParking = async () => {
      setListLoading(true);
      try {
        const res = await getParkingConfiguration();
        const list = normalizeParkingList(res?.data);

        const sorted = [...list].sort((a, b) => {
          const ad = new Date(a?.updated_at || a?.created_at || 0).getTime();
          const bd = new Date(b?.updated_at || b?.created_at || 0).getTime();
          return bd - ad;
        });

        setData(sorted);

        const v = searchText.trim().toLowerCase();
        if (!v) setFilteredData(sorted);
        else {
          setFilteredData(
            sorted.filter((item) => {
              const n = (item?.name || "").toLowerCase();
              const bn = (item?.building_name || "").toLowerCase();
              const fn = (item?.floor_name || "").toLowerCase();
              const vt = (item?.vehicle_type || "").toLowerCase();
              return n.includes(v) || bn.includes(v) || fn.includes(v) || vt.includes(v);
            })
          );
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch parking configurations");
      } finally {
        setListLoading(false);
        setUpdate(false);
      }
    };

    fetchParking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  /** ---------------- search ---------------- */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const v = value.trim().toLowerCase();
    if (!v) return setFilteredData(data);

    setFilteredData(
      data.filter((item) => {
        const n = (item?.name || "").toLowerCase();
        const bn = (item?.building_name || "").toLowerCase();
        const fn = (item?.floor_name || "").toLowerCase();
        const vt = (item?.vehicle_type || "").toLowerCase();
        return n.includes(v) || bn.includes(v) || fn.includes(v) || vt.includes(v);
      })
    );
  };

  /** ---------------- open/close add ---------------- */
  const openAddModal = () => setIsAddModalOpen(true);

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setAddLocation("");
    setAddFloor("");
    setAddFloors([]);
    setAddParkname("");
    setVehicleType("");
    setSaving(false);
  };

  /** ---------------- open/close edit ---------------- */
  const openEditModal = async (id) => {
    setEditId(id);
    setIsEditModalOpen(true);

    setLocation("");
    setFloor("");
    setFloors([]);
    setParkname("");
    setEditVehicleType("");

    setEditIsReserved(false);
    setEditReservedForUserId("");

    setEditLoading(true);
    try {
      const res = await getParkingConfigurationDetails(id);
      const d = res?.data || {};

      const bId = d?.building_id != null ? String(d.building_id) : "";
      const fId = d?.floor_id != null ? String(d.floor_id) : "";

      setLocation(bId);
      setParkname(d?.name || "");
      setEditVehicleType(d?.vehicle_type || "");

      setEditIsReserved(!!d?.is_reserved);
      setEditReservedForUserId(
        d?.reserved_for_user_id != null ? String(d.reserved_for_user_id) : ""
      );

      if (bId) {
        const floorRes = await getFloors(bId);
        const floorList = Array.isArray(floorRes?.data) ? floorRes.data : [];
        setFloors(floorList);
        setFloor(fId);
      } else {
        setFloors([]);
        setFloor("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch configuration details");
      setIsEditModalOpen(false);
      setEditId(null);
    } finally {
      setEditLoading(false);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditId(null);
    setLocation("");
    setFloor("");
    setFloors([]);
    setParkname("");
    setEditVehicleType("");
    setEditLoading(false);
    setEditSaving(false);

    setEditIsReserved(false);
    setEditReservedForUserId("");
  };

  /** ---------------- floors for add ---------------- */
  useEffect(() => {
    const fetchAddFloorsData = async () => {
      if (!isAddModalOpen) return;
      if (!addLocation) {
        setAddFloors([]);
        setAddFloor("");
        return;
      }
      try {
        const res = await getFloors(addLocation);
        setAddFloors(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch floors");
      }
    };
    fetchAddFloorsData();
  }, [addLocation, isAddModalOpen]);

  /** ---------------- floors for edit (building change) ---------------- */
  useEffect(() => {
    const fetchFloorsData = async () => {
      if (!isEditModalOpen) return;
      if (!location) {
        setFloors([]);
        setFloor("");
        return;
      }
      try {
        const res = await getFloors(location);
        setFloors(Array.isArray(res?.data) ? res.data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch floors");
      }
    };
    fetchFloorsData();
  }, [location, isEditModalOpen]);

  /** ---------------- add submit (✅ FIXED for /parking_configurations.json?token=...) ---------------- */
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!addLocation) return toast.error("Please select Location");
    if (!addFloor) return toast.error("Please select Floor");
    if (!addParkname.trim()) return toast.error("Please enter Parking Name");
    if (!vehicleType) return toast.error("Please select Vehicle Type");

    setSaving(true);

    // ✅ Payload for /parking_configurations.json endpoint
    const payload = {
      all_parking: [
        {
          name: addParkname.trim(),
          building_id: Number(addLocation),
          floor_id: Number(addFloor),
          vehicle_type: vehicleType,
          is_reserved: false,
        },
      ],
    };

    try {
      const token = "e6fbf77f4fbb5a72c4150e495c961972f0f14059d8a6670f"; // ✅ use token from endpoint
      const response = await fetch(
        `https://admin.vibecopilot.ai/parking_configurations.json?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      toast.success("Parking created successfully!");
      closeAddModal();
      setUpdate(true);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to add configuration");
    } finally {
      setSaving(false);
    }
  };

  /** ---------------- edit submit ---------------- */
  const handleEdit = async () => {
    if (!editId) return toast.error("Invalid edit id");
    if (!location) return toast.error("Please select Location");
    if (!floor) return toast.error("Please select Floor");
    if (!parkname.trim()) return toast.error("Please enter Parking Name");
    if (!editVehicleType) return toast.error("Please select Vehicle Type");

    if (editIsReserved && !editReservedForUserId) {
      return toast.error("Please enter Reserved For User ID");
    }

    const form = new FormData();
    form.append("parking_configuration[building_id]", location);
    form.append("parking_configuration[floor_id]", floor);
    form.append("parking_configuration[name]", parkname.trim());
    form.append("parking_configuration[vehicle_type]", editVehicleType);

    form.append("parking_configuration[is_reserved]", String(!!editIsReserved));
    form.append(
      "parking_configuration[reserved_for_user_id]",
      editIsReserved ? editReservedForUserId : ""
    );

    try {
      setEditSaving(true);
      await editParkingConfiguration(editId, form);
      toast.success("Parking configuration updated successfully");
      closeEditModal();
      setUpdate(true);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Update failed");
    } finally {
      setEditSaving(false);
    }
  };

  /** ---------------- table columns ---------------- */
  const columns = useMemo(
    () => [
      {
        name: "Actions",
        cell: (row) => (
          <button onClick={() => openEditModal(row.id)} title="Edit">
            <BiEdit size={15} />
          </button>
        ),
        width: "90px",
      },
      { name: "Name", selector: (row) => row?.name || "-" },
      { name: "Location", selector: (row) => row?.building_name || "-" },
      { name: "Floor", selector: (row) => row?.floor_name || "-" },
      { name: "Parking Type", selector: (row) => row?.vehicle_type || "-" },
      {
        name: "Reserved",
        selector: (row) => (row?.is_reserved ? "Yes" : "No"),
        width: "110px",
      },
      {
        name: "Reserved For",
        selector: (row) => row?.reserved_for_user_id ?? "-",
        width: "140px",
      },
    ],
    []
  );

  return (
    <section className="flex relative">
      <div className="w-full mx-3 flex-col">
        <div className="flex flex-col m-3">
          {/* TOP BAR */}
          <div className="flex items-center justify-between my-2 relative z-10">
            <input
              type="text"
              placeholder="Search by name / building / floor / type"
              value={searchText}
              onChange={handleSearch}
              className="border-2 p-2 w-96 border-gray-300 rounded-lg"
            />

            <button
              onClick={openAddModal}
              className="border-2 font-semibold border-black px-4 py-2 rounded-md
                         flex items-center gap-2 hover:bg-black hover:text-white"
            >
              <PiPlusCircle size={20} />
              Add
            </button>
          </div>

          {buildings.length === 0 && (
            <div className="text-sm text-red-600 mb-2">
              Buildings list is empty. Check localStorage key <b>Building</b>{" "}
              (should be JSON array).
            </div>
          )}

          {/* TABLE */}
          <div className="relative">
            {listLoading && (
              <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                <div className="text-sm font-medium">Loading...</div>
              </div>
            )}
            <Table
              columns={columns}
              data={filteredData}
              pagination
              fixedHeader
              fixedHeaderScrollHeight="500px"
              highlightOnHover
            />
          </div>

          {/* ======================= EDIT MODAL ======================= */}
          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="fixed inset-0 bg-black bg-opacity-60"
                onClick={closeEditModal}
              />

              <div className="bg-white w-[420px] p-4 rounded-md relative z-50">
                <button
                  className="absolute top-3 right-3"
                  onClick={closeEditModal}
                >
                  <FaTimes />
                </button>

                <h2 className="text-lg font-semibold mb-4">
                  Edit Parking Configuration
                </h2>

                {editLoading ? (
                  <div className="text-sm">Loading details...</div>
                ) : (
                  <>
                    <select
                      className="border p-2 w-full mb-2 rounded-md"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setFloor("");
                      }}
                    >
                      <option value="">Select Location</option>
                      {buildings.map((b) => (
                        <option key={b.id} value={String(b.id)}>
                          {b.name}
                        </option>
                      ))}
                    </select>

                    <select
                      className="border p-2 w-full mb-2 rounded-md"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      disabled={!location}
                    >
                      <option value="">Select Floor</option>
                      {floors.map((f) => (
                        <option key={f.id} value={String(f.id)}>
                          {f.name}
                        </option>
                      ))}
                    </select>

                    <input
                      className="border p-2 w-full mb-2 rounded-md"
                      value={parkname}
                      onChange={(e) => setParkname(e.target.value)}
                      placeholder="Parking Name"
                    />

                    <select
                      className="border p-2 w-full mb-3 rounded-md"
                      value={editVehicleType}
                      onChange={(e) => setEditVehicleType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="4-wheeler">4-wheeler</option>
                      <option value="2-wheeler">2-wheeler</option>
                    </select>

                    {/* reserved fields */}
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={editIsReserved}
                        onChange={(e) => {
                          setEditIsReserved(e.target.checked);
                          if (!e.target.checked) setEditReservedForUserId("");
                        }}
                      />
                      <label className="text-sm font-medium">Is Reserved?</label>
                    </div>

                    <input
                      className="border p-2 w-full mb-3 rounded-md"
                      value={editReservedForUserId}
                      onChange={(e) => setEditReservedForUserId(e.target.value)}
                      placeholder="Reserved For User ID"
                      disabled={!editIsReserved}
                    />

                    <button
                      onClick={handleEdit}
                      disabled={editSaving}
                      className="text-white w-full p-2 rounded-md font-semibold disabled:opacity-60"
                      style={{ background: themeColor }}
                    >
                      {editSaving ? "Updating..." : "Update"}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ======================= ADD MODAL ======================= */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="fixed inset-0 bg-black bg-opacity-60"
                onClick={closeAddModal}
              />

              <div className="bg-white w-[420px] p-4 rounded-md relative z-50">
                <button
                  className="absolute top-3 right-3"
                  onClick={closeAddModal}
                >
                  <FaTimes />
                </button>

                <h2 className="text-lg font-semibold mb-4">
                  Add Parking Configuration
                </h2>

                <form onSubmit={handleAddSubmit} className="space-y-3">
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Location *
                    </label>
                    <select
                      className="border p-2 w-full rounded-lg"
                      value={addLocation}
                      onChange={(e) => {
                        setAddLocation(e.target.value);
                        setAddFloor("");
                      }}
                    >
                      <option value="">Select Location</option>
                      {buildings.map((b) => (
                        <option key={b.id} value={String(b.id)}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Floor *
                    </label>
                    <select
                      className="border p-2 w-full rounded-lg"
                      value={addFloor}
                      onChange={(e) => setAddFloor(e.target.value)}
                      disabled={!addLocation}
                    >
                      <option value="">Select Floor</option>
                      {addFloors.map((f) => (
                        <option key={f.id} value={String(f.id)}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Parking Name *
                    </label>
                    <input
                      className="border p-2 w-full rounded-lg"
                      value={addParkname}
                      onChange={(e) => setAddParkname(e.target.value)}
                      placeholder="Enter parking name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Parking Type *
                    </label>
                    <select
                      className="border p-2 w-full rounded-lg"
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="4-wheeler">4-wheeler</option>
                      <option value="2-wheeler">2-wheeler</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="text-white w-full p-2 rounded-md font-semibold disabled:opacity-60"
                    style={{ background: themeColor }}
                  >
                    {saving ? "Saving..." : "Create"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ParkingConfigurationSetup;
