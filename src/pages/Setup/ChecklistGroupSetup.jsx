import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import Table from "../../components/table/Table";
import Switch from "../../Buttons/Switch";
import CheckListAddGroupModal from "../../containers/modals/ChecklistAddGroupModal";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  getChecklistGroups,
  postChecklistGroup,
  editChecklistGroup,
  deleteChecklistGroup,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";

function CheckListGroupSetup() {
  const [addGroup, showAddGroup] = useState(false);
  const [groups, setGroups] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [siteId] = useState(getItemInLocalStorage("SITEID") || 47);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const resp = await getChecklistGroups();
        const items = resp?.data || resp?.data?.generic_infos || [];
        const mapped = Array.isArray(items)
          ? items.map((item) => ({
              ...item,
              groupName: item.name || item.groupName,
              status: item.status !== undefined ? item.status : true,
            }))
          : [];
        setGroups(mapped);
      } catch (error) {
        console.error("Unable to load Checklist Groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // ✅ ADD / UPDATE GROUP
  const handleSaveGroup = async (groupName) => {
    if (!groupName.trim()) {
      alert("Group name is required");
      return;
    }

    setLoading(true);

    try {
      if (editData) {
        const payload = {
          name: groupName,
          site_id: siteId,
          info_type: "ChecklistGroup",
        };
        const resp = await editChecklistGroup(editData.id, payload);
        const updatedGroup = {
          ...resp?.data,
          groupName: resp?.data?.name || groupName,
          status: resp?.data?.status !== undefined ? resp?.data?.status : editData.status,
        };
        setGroups((prev) =>
          prev.map((item) =>
            item.id === editData.id ? updatedGroup : item
          )
        );
         toast.success("Group updated successfully");
        setEditData(null);
      } else {
        const payload = {
          name: groupName,
          site_id: siteId,
          info_type: "ChecklistGroup",
        };
        const resp = await postChecklistGroup(payload);
        const newGroup = {
          ...resp?.data,
          groupName: resp?.data?.name || groupName,
          status: resp?.data?.status !== undefined ? resp?.data?.status : true,
        };
        setGroups((prev) => [...prev, newGroup]);
      }
       toast.success("Group Added successfully");
      showAddGroup(false);
    } catch (error) {
      console.error("Error saving group:", error);
      alert("Failed to save group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE GROUP
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await deleteChecklistGroup(id);
      setGroups((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Failed to delete group. Please try again.");
    }
  };

  // ✅ TOGGLE STATUS
  const handleToggle = async (id) => {
    const row = groups.find((item) => item.id === id);
    if (!row) return;

    const updatedStatus = !row.status;
    setGroups((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: updatedStatus } : item
      )
    );

    try {
      const payload = {
        name: row.groupName,
        site_id: siteId,
        info_type: "ChecklistGroup",
        status: updatedStatus,
      };
      await editChecklistGroup(id, payload);
    } catch (error) {
      console.error("Error updating status:", error);
      setGroups((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: row.status } : item
        )
      );
    }
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