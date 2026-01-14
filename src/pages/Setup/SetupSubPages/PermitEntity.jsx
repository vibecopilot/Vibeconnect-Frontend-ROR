import React, { useEffect, useMemo, useState } from "react";
import Table from "../../../components/table/Table";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";
import { MdClose } from "react-icons/md";
import { FaTimes, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { getPermitType } from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";

const PermitEntity = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const siteId = useMemo(() => getItemInLocalStorage("SITEID"), []);
  const token = useMemo(() => getItemInLocalStorage("TOKEN"), []);

  // Base URL (fallback production)
  const BASE_URL = useMemo(
    () => import.meta.env.VITE_API_BASE_URL || "https://admin.vibecopilot.ai",
    []
  );

  const [loading, setLoading] = useState(false);

  const [permitTypes, setPermitTypes] = useState([]); // for Permit Id dropdown
  const [entities, setEntities] = useState([]); // table data (always array)

  const [update, setUpdate] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    permit_id: "",
    active: true,
  });

  const qs = useMemo(() => {
    // token query string
    return token ? `?token=${encodeURIComponent(token)}` : "";
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchPermitTypes = async () => {
    try {
      const invResp = await getPermitType();
      const sorted = (invResp?.data || []).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setPermitTypes(sorted);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEntities = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/permit_entities.json${qs}`, {
        method: "GET",
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `HTTP ${resp.status}`);
      }

      const data = await resp.json();
      setEntities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("error fetching permit entities", err);
      toast.error("Permit Entities load failed");
      setEntities([]);
    } finally {
      setLoading(false);
      setUpdate(false);
    }
  };

  const fetchEntityDetails = async (id) => {
    try {
      const resp = await fetch(`${BASE_URL}/permit_entities/${id}.json${qs}`);
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `HTTP ${resp.status}`);
      }
      const data = await resp.json();

      setFormData({
        name: data?.name || "",
        permit_id: data?.permit_id ? String(data.permit_id) : "",
        active: !!data?.active,
      });
    } catch (err) {
      console.log("Error fetching entity details:", err);
      toast.error("Entity details load failed");
    }
  };

  const openModal = async (id) => {
    setEditingId(id);
    await fetchEntityDetails(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", permit_id: "", active: true });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return toast.error("Entity Name required");
    if (!formData.permit_id) return toast.error("Permit Id required");

    const tid = toast.loading("Creating...");
    try {
      const sendData = new FormData();
      sendData.append("permit_entity[name]", formData.name.trim());
      sendData.append("permit_entity[permit_id]", formData.permit_id);
      sendData.append("permit_entity[active]", String(!!formData.active));
      sendData.append("permit_entity[site_id]", String(siteId));

      const resp = await fetch(`${BASE_URL}/permit_entities.json${qs}`, {
        method: "POST",
        body: sendData,
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `HTTP ${resp.status}`);
      }

      toast.success("Permit Entity Created");
      setShowAdd(false);
      setFormData({ name: "", permit_id: "", active: true });
      setUpdate(true);
    } catch (err) {
      console.log(err);
      toast.error("Create failed");
    } finally {
      toast.dismiss(tid);
    }
  };

  const handleEdit = async () => {
    if (!editingId) return;
    if (!formData.name.trim()) return toast.error("Entity Name required");
    if (!formData.permit_id) return toast.error("Permit Id required");

    const tid = toast.loading("Updating...");
    try {
      const sendData = new FormData();
      sendData.append("permit_entity[name]", formData.name.trim());
      sendData.append("permit_entity[permit_id]", formData.permit_id);
      sendData.append("permit_entity[active]", String(!!formData.active));
      sendData.append("permit_entity[site_id]", String(siteId));

      const resp = await fetch(`${BASE_URL}/permit_entities/${editingId}.json${qs}`, {
        method: "PATCH",
        body: sendData,
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `HTTP ${resp.status}`);
      }

      toast.success("Permit Entity Updated");
      closeModal();
      setUpdate(true);
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    } finally {
      toast.dismiss(tid);
    }
  };

  const deleteEntity = async (id) => {
    const tid = toast.loading("Deleting...");
    try {
      const resp = await fetch(`${BASE_URL}/permit_entities/${id}.json${qs}`, {
        method: "DELETE",
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `HTTP ${resp.status}`);
      }

      toast.success("Permit Entity Deleted");
      setUpdate(true);
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    } finally {
      toast.dismiss(tid);
    }
  };

  const toggleStatus = async (row) => {
    const next = !row.active;

    // optimistic UI
    setEntities((prev) =>
      prev.map((x) => (x.id === row.id ? { ...x, active: next } : x))
    );

    try {
      const sendData = new FormData();
      sendData.append("permit_entity[active]", String(next));
      sendData.append("permit_entity[site_id]", String(siteId));

      const resp = await fetch(`${BASE_URL}/permit_entities/${row.id}.json${qs}`, {
        method: "PATCH",
        body: sendData,
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `HTTP ${resp.status}`);
      }

      toast.success(`Status: ${next ? "Active" : "Inactive"}`);
    } catch (err) {
      console.log(err);
      toast.error("Status update failed");

      // revert if failed
      setEntities((prev) =>
        prev.map((x) => (x.id === row.id ? { ...x, active: row.active } : x))
      );
    }
  };

  useEffect(() => {
    fetchPermitTypes();
    fetchEntities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  document.title = `Permit Setup - Vibe Connect`;

  const columns = [
    { name: "Entity Name", selector: (row) => row.name || "-", sortable: true },
    { name: "Permit Id", selector: (row) => row.permit_id ?? "-", sortable: true },
    { name: "Site Id", selector: (row) => row.site_id ?? "-", sortable: true },
    {
      name: "Status",
      sortable: true,
      cell: (row) => (
        <button
          onClick={() => toggleStatus(row)}
          style={{
            padding: "5px 10px",
            backgroundColor: row.active ? "blueviolet" : "lightgray",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            minWidth: 80,
          }}
        >
          {row.active ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => openModal(row.id)} title="Edit">
            <BiEdit size={15} />
          </button>
          <button onClick={() => deleteEntity(row.id)} title="Delete">
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="flex">
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        {/* Add form */}
        {showAdd ? (
          <div className="grid grid-cols-4 gap-2 items-center my-2">
            <input
              type="text"
              placeholder="Enter Entity Name"
              name="name"
              onChange={handleChange}
              value={formData.name}
              className="border p-2 border-gray-300 rounded-md w-full"
            />

            <select
              name="permit_id"
              className="border p-2 border-gray-300 rounded-md w-full"
              onChange={handleChange}
              value={formData.permit_id}
            >
              <option value="">Select Permit</option>
              {permitTypes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 border p-2 border-gray-300 rounded-md w-full">
              <input
                type="checkbox"
                name="active"
                checked={!!formData.active}
                onChange={handleChange}
              />
              Active
            </label>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSubmit}
                className="bg-green-400 text-white rounded-md flex items-center justify-center gap-2 p-2 font-medium w-full"
              >
                <PiPlusCircle size={20} />
                Submit
              </button>
              <button
                className="bg-red-400 text-white rounded-md flex items-center justify-center gap-2 p-2 font-medium w-full"
                onClick={() => {
                  setShowAdd(false);
                  setFormData({ name: "", permit_id: "", active: true });
                }}
              >
                <MdClose size={20} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end my-2">
            <button
              className="bg-green-400 text-white rounded-md flex items-center gap-2 p-2 font-medium"
              onClick={() => setShowAdd(true)}
            >
              <PiPlusCircle size={20} />
              Add
            </button>
          </div>
        )}

        <Table
          columns={columns}
          data={Array.isArray(entities) ? entities : []}
          progressPending={loading}
          responsive
          fixedHeader
          fixedHeaderScrollHeight="500px"
          pagination
          selectableRowsHighlight
          highlightOnHover
        />

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="fixed inset-0 bg-black bg-opacity-90"
              onClick={closeModal}
            />
            <div className="bg-white w-96 rounded-lg shadow-lg p-4 relative z-10">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                onClick={closeModal}
              >
                <FaTimes />
              </button>

              <h2 className="text-xl font-semibold mb-4">Edit Permit Entity</h2>

              <div className="flex flex-col gap-4">
                <input
                  name="name"
                  className="border p-2 w-full border-gray-300 rounded-md"
                  onChange={handleChange}
                  value={formData.name}
                  type="text"
                  placeholder="Enter Entity Name"
                />

                <select
                  name="permit_id"
                  className="border p-2 border-gray-300 rounded-md w-full"
                  onChange={handleChange}
                  value={formData.permit_id}
                >
                  <option value="">Select Permit</option>
                  {permitTypes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={!!formData.active}
                    onChange={handleChange}
                  />
                  Active
                </label>

                <div className="flex items-center justify-center">
                  <button
                    className="text-white rounded-md flex items-center gap-2 p-2 font-medium"
                    type="button"
                    style={{ background: themeColor }}
                    onClick={handleEdit}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PermitEntity;
