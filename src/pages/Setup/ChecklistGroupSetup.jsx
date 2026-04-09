import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import Table from "../../components/table/Table";
import Switch from "../../Buttons/Switch";
import CheckListAddGroupModal from "../../containers/modals/ChecklistAddGroupModal";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function CheckListGroupSetup() {
  const [addGroup, showAddGroup] = useState(false);
  
  const [groups, setGroups] = useState([
    { id: 1, groupName: "Cleaning", status: true },
    { id: 2, groupName: "Hygiene", status: true },
    { id: 3, groupName: "Painting", status: false },
    { id: 4, groupName: "Electrical", status: true },
  ]);

  const [editData, setEditData] = useState(null);

  // ✅ ADD GROUP
  const handleSaveGroup = (groupName) => {
  if (editData) {
    // ✏️ UPDATE
    const updated = groups.map((item) =>
      item.id === editData.id
        ? { ...item, groupName }
        : item
    );
    setGroups(updated);
    setEditData(null);
  } else {
    // ➕ ADD
    const newGroup = {
      id: Date.now(),
      groupName,
      status: true,
    };
    setGroups([...groups, newGroup]);
  }

  showAddGroup(false);
};

  // ✅ DELETE GROUP
 const handleDelete = (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete?");
  if (confirmDelete) {
    const filtered = groups.filter((item) => item.id !== id);
    setGroups(filtered);
  }
};

  // ✅ TOGGLE STATUS
  const handleToggle = (id) => {
    const updated = groups.map((item) =>
      item.id === id ? { ...item, status: !item.status } : item
    );
    setGroups(updated);
  };

  // ✅ EDIT GROUP
  const handleEdit = (row) => {
  setEditData(row);       // store selected row
  showAddGroup(true);     // open modal
};

  // ✅ TABLE COLUMN
  const columnGroup = [
    {
      name: "Sr.No",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Group Name",
      selector: (row) => row.groupName,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <Switch
          checked={row.status}
          onChange={() => handleToggle(row.id)}
        />
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
        <FaEdit
        className="cursor-pointer text-blue-500 hover:text-blue-700 w-5 h-3"
        onClick={() => handleEdit(row)}
        title="Edit"
      />
      <MdDelete
        className="cursor-pointer text-red-500 hover:text-red-700 w-5 h-4"
        onClick={() => handleDelete(row.id)}
        title="Delete"
      />
        </div>
      ),
    },
  ];

  return (
    <section className="flex">
      <SetupNavbar />

      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <h2 className="text-lg font-semibold my-5">
          Group CheckList
        </h2>

        <div className="flex flex-col sm:flex-row md:justify-end gap-3">
          <div className="flex gap-3 sm:flex-row flex-col">
            <button
              className="font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center rounded-md"
              onClick={() => showAddGroup(true)}
            >
              <IoMdAdd /> Add Group
            </button>
          </div>
        </div>

        <div className="my-2">
          <h2 className="text-lg font-semibold my-5">Group</h2>

          <Table
            columns={columnGroup}
            data={groups}
            isPagination={true}
          />
        </div>

        {/* ✅ MODAL */}
        {addGroup && (
  <CheckListAddGroupModal
    onclose={() => {
      showAddGroup(false);
      setEditData(null);
    }}
    onSave={handleSaveGroup}
    editData={editData}   // 👈 pass this
  />
)}
      </div>
    </section>
  );
}

export default CheckListGroupSetup;