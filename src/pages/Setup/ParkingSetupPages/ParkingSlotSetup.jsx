import React, { useMemo, useState } from "react";
import Table from "../../../components/table/Table";
import { useSelector } from "react-redux";
import { BiEdit, BiTrash } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";

const ParkingSlotSetup = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // form states
  const [createForm, setCreateForm] = useState({ start: "", end: "" });
  const [editForm, setEditForm] = useState({ start: "", end: "" });

  // table data as state
  const [data, setData] = useState([
    {
      id: 1,
      start: "02:00",
      end: "03:00",
      time: "02:00 AM to 03:00 AM",
      create: "23/04/2024",
    },
  ]);

  const openCreate = () => {
    setCreateForm({ start: "", end: "" });
    setIsCreateOpen(true);
  };
  const closeCreate = () => setIsCreateOpen(false);

  const openEdit = (row) => {
    setSelectedRow(row);
    setEditForm({ start: row.start || "", end: row.end || "" });
    setIsEditOpen(true);
  };
  const closeEdit = () => {
    setSelectedRow(null);
    setIsEditOpen(false);
  };

  const handleCreate = () => {
    if (!createForm.start || !createForm.end) return;

    const newId = Date.now();
    const newRow = {
      id: newId,
      start: createForm.start,
      end: createForm.end,
      time: `${createForm.start} to ${createForm.end}`,
      create: new Date().toLocaleDateString("en-GB"),
    };

    setData((prev) => [newRow, ...prev]);
    closeCreate();
  };

  const handleUpdate = () => {
    if (!selectedRow) return;
    if (!editForm.start || !editForm.end) return;

    setData((prev) =>
      prev.map((r) =>
        r.id === selectedRow.id
          ? {
              ...r,
              start: editForm.start,
              end: editForm.end,
              time: `${editForm.start} to ${editForm.end}`,
            }
          : r
      )
    );

    closeEdit();
  };

  const handleDelete = (row) => {
    setData((prev) => prev.filter((r) => r.id !== row.id));
  };

  const columns = useMemo(
    () => [
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex items-center gap-3">
            <button onClick={() => openEdit(row)} title="Edit">
              <BiEdit size={16} />
            </button>
            <button onClick={() => handleDelete(row)} title="Delete">
              <BiTrash size={16} />
            </button>
          </div>
        ),
      },
      { name: "Timings", selector: (row) => row.time, sortable: true },
      { name: "Created On", selector: (row) => row.create, sortable: true },
    ],
    []
  );

  const customStyle = {
    headRow: {
      style: {
        backgroundColor: themeColor,
        color: "white",
        fontSize: "14px",
      },
    },
  };

  document.title = `Permit - My Citi Life`;

  return (
    <section className="flex">
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex m-3 flex-row">
          <button
            className="border-2 font-semibold hover:bg-black hover:text-white transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
            style={{ height: "1cm" }}
            onClick={openCreate}
          >
            <PiPlusCircle size={20} />
            Add
          </button>
        </div>

        <Table
          columns={columns}
          data={data}
          customStyles={customStyle}
          responsive
          fixedHeader
          fixedHeaderScrollHeight="500px"
          pagination
          selectableRowsHighlight
          highlightOnHover
        />

        {/* ✅ Create Modal (outside table) */}
        {isCreateOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={closeCreate}
            />
            <div className="bg-white w-[400px] rounded-lg shadow-lg p-4 relative z-10">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={closeCreate}
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Create Slot</h2>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Start Time
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  type="time"
                  value={createForm.start}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, start: e.target.value }))
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  End Time
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  type="time"
                  value={createForm.end}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, end: e.target.value }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={handleCreate}
                >
                  Create
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={closeCreate}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Edit Modal (outside table) */}
        {isEditOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={closeEdit}
            />
            <div className="bg-white w-[400px] rounded-lg shadow-lg p-4 relative z-10">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={closeEdit}
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Edit Slot</h2>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Start Time
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  type="time"
                  value={editForm.start}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, start: e.target.value }))
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  End Time
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  type="time"
                  value={editForm.end}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, end: e.target.value }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={handleUpdate}
                >
                  Update
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={closeEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ParkingSlotSetup;
