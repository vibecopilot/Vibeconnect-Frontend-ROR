import React, { useCallback, useEffect, useState } from "react";
import Account from "./Account";
import { PiPlusCircle } from "react-icons/pi";
import { BiEdit } from "react-icons/bi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Table from "../../components/table/Table";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import SiteHeader from "../../components/SiteHeader";
import { getBuildings, postBuilding, updateBuilding } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";

const Building = () => {
  const [buildings, setBuildings] = useState([]);
  const [name, setName] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [activeSiteId, setActiveSiteId] = useState(() => getItemInLocalStorage("SITEID"));

  const themeColor = useSelector((state) => state.theme.color);

  const fetchBuildings = useCallback(async () => {
    try {
      const resp = await getBuildings();
      const siteBuildings = resp.data.filter(
        (item) => String(item.site_id) === String(activeSiteId)
      );
      setBuildings(siteBuildings);
    } catch (error) {
      console.log(error);
    }
  }, [activeSiteId]);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings, refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter building name");
      return;
    }

    const formData = new FormData();
    formData.append("building[name]", name.trim());
    formData.append("building[site_id]", activeSiteId);

    try {
      await postBuilding(formData);
      toast.success("Building created successfully");
      setName("");
      setShowFields(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create building");
    }
  };

  const openEdit = (row) => {
    setEditId(row.id);
    setEditName(row.name || "");
  };

  const closeEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Please enter building name");
      return;
    }

    const formData = new FormData();
    formData.append("building[name]", editName.trim());

    try {
      await updateBuilding(editId, formData);
      toast.success("Building updated successfully");
      closeEdit();
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update building");
    }
  };

  const buildingColumns = [
    {
      name: "Site",
      selector: (row) => row.site_name,
      sortable: true,
    },
    {
      name: "Building",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => openEdit(row)}>
            <BiEdit size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex">
      <SetupNavbar />

      <div className="w-full flex lg:mx-3 flex-col overflow-hidden">
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id);
            setName("");
            setBuildings([]);
            closeEdit();
          }}
        />
        <Account />

        <div className="flex flex-col m-2 gap-2">
          <div className="flex justify-end">
            <h2
              className="font-semibold hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2"
              onClick={() => setShowFields(!showFields)}
              style={{ background: themeColor }}
            >
              <PiPlusCircle size={20} />
              Add Building
            </h2>
          </div>

          {showFields && (
            <div className="flex gap-3 md:flex-row flex-col">
              <input
                type="text"
                placeholder="Enter Building Name"
                className="border border-gray-500 rounded-md p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowFields(false);
                  setName("");
                }}
                className="bg-red-500 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex justify-center items-center">
            <div className="w-screen">
              <Table columns={buildingColumns} data={buildings} />
            </div>
          </div>
        </div>

        {editId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-md p-5 w-full max-w-sm">
              <h2 className="font-semibold text-lg mb-4">Edit Building</h2>
              <input
                type="text"
                placeholder="Enter Building Name"
                className="border border-gray-500 rounded-md p-2 w-full"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={closeEdit}
                  className="bg-red-500 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Building;
