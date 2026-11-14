import React, { useState, useEffect } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { BiEdit } from "react-icons/bi";

import SetupNavbar from "../../components/navbars/SetupNavbar";
import Table from "../../components/table/Table";
import SiteHeader from "../../components/SiteHeader";

import AssetGroupModal from "../../containers/modals/AssetGroupModal";
import AssetSubGroupModal from "../../containers/modals/AssetSubGroupModal";
import EditAssetGroup from "../../containers/modals/EditAssetGroup";

import {
  getAssetGroups,
  getStockGroupsList,
  getSubGroupsList,
} from "../../api";

const AssetGroup = () => {
  const [groupModal, setGroupModal] = useState(false);
  const [subGroupModal, setsubGroupModal] = useState(false);

  const [group, setGroup] = useState([]);
  const [stockGroup, setStockGroup] = useState([]);
  const [subGroup, setSubGroup] = useState([]);

  const [page, setPage] = useState("asset");

  const [editGroup, setEditGroup] = useState(false);
  const [assetId, setAssetId] = useState("");

  // ✅ Site Change State
  const [activeSiteId, setActiveSiteId] = useState(
    localStorage.getItem("SITEID")
  );

  // ✅ Fetch Data
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupResponse = await getAssetGroups();

        const sortedGroups = (groupResponse.data || []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setGroup(sortedGroups);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSubGroups = async () => {
      try {
        const subGroupResponse = await getSubGroupsList();

        const sortedSubGroups = (subGroupResponse.data || []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setSubGroup(sortedSubGroups);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchStockGroups = async () => {
      try {
        const stockGroupResponse = await getStockGroupsList();

        const sortedStockGroups = (stockGroupResponse.data || []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setStockGroup(sortedStockGroups);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGroups();
    fetchSubGroups();
    fetchStockGroups();
  }, [activeSiteId]); // ✅ Re-fetch on site change

  // ✅ Edit Group
  const handleAssetGroupEdit = (id) => {
    setEditGroup(true);
    setAssetId(id);
  };

  // ✅ Asset Group Columns
  const groupColumns = [
    {
      name: "Sr. No",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Group Name",
      selector: (row) => row.name || "-",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => handleAssetGroupEdit(row.id)}>
            <BiEdit size={16} />
          </button>
        </div>
      ),
      width: "120px",
    },
  ];

  // ✅ Stock Group Columns
  const stockGroupColumns = [
    {
      name: "Sr. No",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Group Name",
      selector: (row) => row.name || "-",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description || "-",
      sortable: true,
      wrap: true,
    },
  ];

  // ✅ Sub Group Columns
  const subGroupColumns = [
    {
      name: "Sr. No",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Group Name",
      selector: (row) => row.group_name || "-",
      sortable: true,
    },
    {
      name: "Sub Group Name",
      selector: (row) => row.name || "-",
      sortable: true,
    },
  ];

  return (
    <section className="flex">
      <SetupNavbar />

      <div className="w-full flex mx-3 mb-5 flex-col overflow-hidden">
        {/* ✅ Site Header Added */}
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id);

            // reset states
            setGroup([]);
            setStockGroup([]);
            setSubGroup([]);

            setPage("asset");
          }}
        />

        {/* Tabs */}
        <div className="flex gap-2 p-2 pb-0 border-b-2 border-gray-200 w-full">
          <h2
            className={`p-1 ${page === "asset"
                ? "bg-white font-medium text-blue-500 shadow-custom-all-sides"
                : ""
              } rounded-t-md px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
            onClick={() => setPage("asset")}
          >
            Asset
          </h2>

          <h2
            className={`p-1 ${page === "stock"
                ? "bg-white font-medium text-blue-500 shadow-custom-all-sides"
                : ""
              } rounded-t-md px-4 cursor-pointer transition-all duration-300 ease-linear`}
            onClick={() => setPage("stock")}
          >
            Stock
          </h2>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex justify-end items-center gap-4 flex-wrap">
          <button
            onClick={() => setGroupModal(true)}
            className="border-2 font-semibold hover:bg-black hover:text-white duration-300 ease-in-out transition-all border-black p-2 px-4 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
          >
            <PiPlusCircle size={20} />
            Add Group
          </button>

          <button
            onClick={() => setsubGroupModal(true)}
            className="border-2 font-semibold hover:bg-black hover:text-white duration-300 ease-in-out transition-all border-black p-2 px-4 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
          >
            <PiPlusCircle size={20} />
            Add Sub Group
          </button>
        </div>

        {/* Asset Tables */}
        {page === "asset" && (
          <div className="my-2 flex flex-col gap-5">
            <Table
              columns={groupColumns}
              data={group}
              isPagination={true}
              height={"300px"}
              title={"Asset Groups"}
            />

            <Table
              columns={subGroupColumns}
              data={subGroup}
              isPagination={true}
              height={"300px"}
              title={"Asset Sub Groups"}
            />
          </div>
        )}

        {/* Stock Tables */}
        {page === "stock" && (
          <div className="my-2 flex flex-col gap-5">
            <Table
              columns={stockGroupColumns}
              data={stockGroup}
              isPagination={true}
              height={"300px"}
              title={"Stock Groups"}
            />

            <Table
              columns={subGroupColumns}
              data={subGroup}
              isPagination={true}
              height={"300px"}
              title={"Stock Sub Groups"}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {groupModal && (
        <AssetGroupModal onclose={() => setGroupModal(false)} />
      )}

      {subGroupModal && (
        <AssetSubGroupModal
          assetGroup={group}
          stockGroup={stockGroup}
          onclose={() => setsubGroupModal(false)}
        />
      )}

      {editGroup && (
        <EditAssetGroup
          id={assetId}
          onclose={() => setEditGroup(false)}
        />
      )}
    </section>
  );
};

export default AssetGroup;