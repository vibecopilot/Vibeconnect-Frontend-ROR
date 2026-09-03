import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import Table from "../../components/table/Table";
import Switch from "../../Buttons/Switch";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import SiteHeader from "../../components/SiteHeader";

import CheckListAddGroupModal from "../../containers/modals/ChecklistAddGroupModal";

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

  // ✅ Site Change State
  const [activeSiteId, setActiveSiteId] = useState(
    getItemInLocalStorage("SITEID") || 47
  );

  // ✅ Fetch Groups
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
            status:
              item.status !== undefined ? item.status : true,
          }))
          : [];

        // ✅ Sort latest first
        const sortedGroups = mapped.sort(
          (a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        );

        setGroups(sortedGroups);
      } catch (error) {
        console.error("Unable to load Checklist Groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [activeSiteId]); // ✅ Re-fetch on site change

  // ✅ ADD / UPDATE GROUP
  const handleSaveGroup = async (groupName) => {
    if (!groupName.trim()) {
      toast.error("Group name is required");
      return;
    }

    setLoading(true);

    try {
      if (editData) {
        // ✅ UPDATE
        const payload = {
          name: groupName,
          site_id: activeSiteId,
          info_type: "ChecklistGroup",
        };

        const resp = await editChecklistGroup(
          editData.id,
          payload
        );

        const updatedGroup = {
          ...resp?.data,
          groupName:
            resp?.data?.name || groupName,
          status:
            resp?.data?.status !== undefined
              ? resp?.data?.status
              : editData.status,
        };

        setGroups((prev) =>
          prev.map((item) =>
            item.id === editData.id
              ? updatedGroup
              : item
          )
        );

        toast.success("Group updated successfully");
      } else {
        // ✅ CREATE
        const payload = {
          name: groupName,
          site_id: activeSiteId,
          info_type: "ChecklistGroup",
        };

        const resp = await postChecklistGroup(payload);

        const newGroup = {
          ...resp?.data,
          groupName:
            resp?.data?.name || groupName,
          status:
            resp?.data?.status !== undefined
              ? resp?.data?.status
              : true,
        };

        setGroups((prev) => [newGroup, ...prev]);

        toast.success("Group added successfully");
      }

      showAddGroup(false);
      setEditData(null);
    } catch (error) {
      console.error("Error saving group:", error);

      toast.error("Failed to save group");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE GROUP
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete?"
    );

    if (!confirmDelete) return;

    try {
      await deleteChecklistGroup(id);

      setGroups((prev) =>
        prev.filter((item) => item.id !== id)
      );

      toast.success("Group deleted successfully");
    } catch (error) {
      console.error("Error deleting group:", error);

      toast.error("Failed to delete group");
    }
  };

  // ✅ TOGGLE STATUS
  const handleToggle = async (id) => {
    const row = groups.find((item) => item.id === id);

    if (!row) return;

    const updatedStatus = !row.status;

    // optimistic update
    setGroups((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: updatedStatus }
          : item
      )
    );

    try {
      const payload = {
        name: row.groupName,
        site_id: activeSiteId,
        info_type: "ChecklistGroup",
        status: updatedStatus,
      };

      await editChecklistGroup(id, payload);

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);

      // rollback
      setGroups((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: row.status }
            : item
        )
      );

      toast.error("Failed to update status");
    }
  };

  // ✅ EDIT GROUP
  const handleEdit = (row) => {
    setEditData(row);

    showAddGroup(true);
  };

  // ✅ TABLE COLUMNS
  const columnGroup = [
    {
      name: "Sr.No",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "300px",
    },
    {
      name: "Group Name",
      selector: (row) => row.groupName || "-",
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
      width: "300px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-3">
          <FaEdit
            className="cursor-pointer text-blue-500 hover:text-blue-700 w-5 h-4"
            onClick={() => handleEdit(row)}
            title="Edit"
          />

          <MdDelete
            className="cursor-pointer text-red-500 hover:text-red-700 w-5 h-5"
            onClick={() => handleDelete(row.id)}
            title="Delete"
          />
        </div>
      ),
      width: "300px",
    },
  ];

  return (
    <section className="flex">
      <SetupNavbar />

      <div className="w-full flex mx-3 flex-col overflow-hidden">
        {/* ✅ Site Header Added */}
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id);

            // reset states
            setGroups([]);
            setEditData(null);

            showAddGroup(false);
          }}
        />

        {/* Header */}
        <div className="flex justify-between items-center my-5 flex-wrap gap-3">
          <h2 className="text-lg font-semibold">
            Group CheckList
          </h2>

          <button
            className="font-semibold border-2 border-black px-4 py-2 flex gap-2 items-center rounded-md hover:bg-black hover:text-white transition-all duration-300"
            onClick={() => {
              setEditData(null);
              showAddGroup(true);
            }}
          >
            <IoMdAdd />
            Add Group
          </button>
        </div>

        {/* Table */}
        <div className="my-2 bg-white rounded-lg">
          <Table
            columns={columnGroup}
            data={groups}
            isPagination={true}
            loading={loading}
          />
        </div>

        {/* Modal */}
        {addGroup && (
          <CheckListAddGroupModal
            onclose={() => {
              showAddGroup(false);
              setEditData(null);
            }}
            onSave={handleSaveGroup}
            editData={editData}
          />
        )}
      </div>
    </section>
  );
}

export default CheckListGroupSetup;