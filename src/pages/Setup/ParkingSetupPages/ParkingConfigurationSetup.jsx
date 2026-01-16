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

        // keep current search applied
        const v = searchText.trim().toLowerCase();
        if (!v) setFilteredData(sorted);
        else {
          setFilteredData(
            sorted.filter((item) => {
              const n = (item?.name || "").toLowerCase();
              const bn = (item?.building_name || "").toLowerCase();
              const fn = (item?.floor_name || "").toLowerCase();
              const vt = (item?.vehicle_type || "").toLowerCase();
              return (
                n.includes(v) || bn.includes(v) || fn.includes(v) || vt.includes(v)
              );
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

    // reset UI before loading
    setLocation("");
    setFloor("");
    setFloors([]);
    setParkname("");
    setEditVehicleType("");

    setEditLoading(true);
    try {
      const res = await getParkingConfigurationDetails(id);
      const d = res?.data || {};

      // ✅ select needs string value
      const bId = d?.building_id != null ? String(d.building_id) : "";
      const fId = d?.floor_id != null ? String(d.floor_id) : "";

      setLocation(bId);
      setParkname(d?.name || "");
      setEditVehicleType(d?.vehicle_type || "");

      // ✅ fetch floors first, then set floor (so dropdown has options)
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
      // close if failed
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

  /** ---------------- add submit ---------------- */
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!addLocation) return toast.error("Please select Location");
    if (!addFloor) return toast.error("Please select Floor");
    if (!addParkname.trim()) return toast.error("Please enter Parking Name");

    setSaving(true);

    const form = new FormData();
    form.append("parking_configuration[building_id]", addLocation);
    form.append("parking_configuration[floor_id]", addFloor);
    form.append("parking_configuration[name]", addParkname.trim());
    if (vehicleType) form.append("parking_configuration[vehicle_type]", vehicleType);

    try {
      await createParkingConfiguration(form);
      toast.success("Parking configuration added successfully!");
      closeAddModal();
      setUpdate(true);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to add configuration");
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

    const form = new FormData();
    form.append("parking_configuration[building_id]", location);
    form.append("parking_configuration[floor_id]", floor);
    form.append("parking_configuration[name]", parkname.trim());
    if (editVehicleType) form.append("parking_configuration[vehicle_type]", editVehicleType);

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
              Buildings list is empty. Check localStorage key <b>Building</b> (should be JSON array).
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
              <div className="fixed inset-0 bg-black bg-opacity-60" onClick={closeEditModal} />

              <div className="bg-white w-[420px] p-4 rounded-md relative z-50">
                <button className="absolute top-3 right-3" onClick={closeEditModal}>
                  <FaTimes />
                </button>

                <h2 className="text-lg font-semibold mb-4">Edit Parking Configuration</h2>

                {editLoading ? (
                  <div className="text-sm">Loading details...</div>
                ) : (
                  <>
                    <select
                      className="border p-2 w-full mb-2 rounded-md"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setFloor(""); // ✅ reset floor on building change
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
                      <option value="2-wheeler">2-wheeler</option>
                      <option value="4-wheeler">4-wheeler</option>
                    </select>

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
              <div className="fixed inset-0 bg-black bg-opacity-60" onClick={closeAddModal} />

              <div className="bg-white w-[420px] p-4 rounded-md relative z-50">
                <button className="absolute top-3 right-3" onClick={closeAddModal}>
                  <FaTimes />
                </button>

                <h2 className="text-lg font-semibold mb-4">Add Parking Configuration</h2>

                <form onSubmit={handleAddSubmit} className="space-y-3">
                  <div>
                    <label className="text-sm font-medium block mb-1">Location *</label>
                    <select
                      className="border p-2 w-full rounded-lg"
                      value={addLocation}
                      onChange={(e) => {
                        setAddLocation(e.target.value);
                        setAddFloor(""); // ✅ reset floor on building change
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
                    <label className="text-sm font-medium block mb-1">Floor *</label>
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
                    <label className="text-sm font-medium block mb-1">Parking Name *</label>
                    <input
                      className="border p-2 w-full rounded-lg"
                      value={addParkname}
                      onChange={(e) => setAddParkname(e.target.value)}
                      placeholder="Enter parking name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">Parking Type</label>
                    <select
                      className="border p-2 w-full rounded-lg"
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="2-wheeler">2-wheeler</option>
                      <option value="4-wheeler">4-wheeler</option>
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
