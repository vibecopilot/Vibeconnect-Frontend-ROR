import React, { useEffect, useMemo, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { getVisitorCategories } from "../../api";


import SetupNavbar from "../../components/navbars/SetupNavbar";
import Table from "../../components/table/Table";

import AddVisitorSetupModal from "../../containers/modals/AddVisitorSetupModal";
import EditVisitorSetupModal from "../../containers/modals/EditVisitorSetupModal";

import VehicleParkingSetup from "./VehicleParkingSetupModal/VehicleParkingSetup";
import DeviceConfiguration from "./VehicleParkingSetupModal/DeviceConfiguration";
import AddVehicleParkingModal from "./VehicleParkingSetupModal/AddVehicleParkingModal";
import { getItemInLocalStorage } from "../../utils/localStorage";

const BASE_URL = "https://admin.vibecopilot.ai";

const resolveIconUrl = (iconPath) => {
  if (!iconPath) return null;
  if (iconPath.startsWith("http")) return iconPath;
  const normalized = iconPath.startsWith("/") ? iconPath : `/${iconPath}`;
  return `${BASE_URL}${normalized}`;
};

const IconCell = ({ icon }) => {
  const url = resolveIconUrl(icon);
  return (
    <div className="flex justify-center py-1">
      {url ? (
        <img
          src={url}
          alt="icon"
          className="w-10 h-10 object-contain rounded border"
        />
      ) : (
        <span className="text-xs text-gray-400">No Icon</span>
      )}
    </div>
  );
};

 


function VisitorSetup() {
  const themeColor = useSelector((state) => state.theme.color);

  const [page, setPage] = useState("deviceConfig");
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);

  const [visitorCategories, setVisitorCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [staffCategories, setStaffCategories] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [visitorSetupModal, setVisitorSetupModal] = useState(false);
  const [addVisitorCategoryModal, setAddVisitorCategoryModal] = useState(false);
  const [addVisitorSubCategoryModal, setAddVisitorSubCategoryModal] =
    useState(false);
  const [editVisitorSetupModal, setEditVisitorSetupModal] = useState(false);

  const [catId, setCatId] = useState(null);
  const [editType, setEditType] = useState("");

  const [parkingConfigurations, setParkingConfigurations] = useState([]);
  const [addParkingModal, setAddParkingModal] = useState(false);

  const token = getItemInLocalStorage("TOKEN");

useEffect(() => {
  const fetchData = async () => {
    if (!token) {
      console.error("Token not found");
      toast.error("Authentication token not found");
      setLoading(false);
      return;
    }

    setLoading(true);


const fetchStaffCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/visitor_staff_categories.json?token=${token}`);
        console.log("Staff Categories Response:", res.data);
        const staffData = res.data?.staff_categories || 
                         res.data?.data?.staff_categories || 
                         (Array.isArray(res.data) ? res.data : []) ||
                         [];
        setStaffCategories(Array.isArray(staffData) ? staffData : []);
      } catch (err) {
        console.error("Error fetching staff categories:", err);
        setStaffCategories([]);
        toast.error("Failed to load staff categories");
      }
    };

  const fetchVisitorCategories = async () => {
    try {
       const res = await getVisitorCategories(1, 100); // page, perpage

    console.log("Visitor Categories Response:", res.data);

    const visitorData =
      res.data?.visitor_categories ||
      res.data?.data?.visitor_categories ||
      (Array.isArray(res.data) ? res.data : []) ||
      [];

    setVisitorCategories(Array.isArray(visitorData) ? visitorData : []);
     console.log("After setVisitorCategories:", visitorData);
     console.log("Final Visitor Data:", visitorData);

  } catch (err) {
    console.error("Error fetching visitor categories:", err);
    setVisitorCategories([]);
    toast.error("Failed to load visitor categories");
  }
};


    const fetchSubCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/visitor_sub_categories.json?token=${token}`);
        console.log("Sub Categories Response:", res.data);
        const subData = res.data?.visitor_sub_categories || 
                       res.data?.data?.visitor_sub_categories || 
                       (Array.isArray(res.data) ? res.data : []) ||
                       [];
        setSubCategories(Array.isArray(subData) ? subData : []);
      } catch (err) {
        console.error("Error fetching sub categories:", err);
        setSubCategories([]);
        toast.error("Failed to load sub categories");
      }
    };

    await Promise.allSettled([
      fetchStaffCategories(),
      fetchVisitorCategories(),
      fetchSubCategories()
    ]);

    setLoading(false);
  };

  fetchData();
}, [reload, token]);


useEffect(() => {
  console.log("Reload changed:", reload);
}, [reload]);




useEffect(() => {
  const fetchParking = async () => {
    if (!token) return;
    
    try {
      const res = await axios.get(
        `${BASE_URL}/parking_configurations.json?token=${token}`
      );
      console.log("Parking Configurations Response:", res.data);
      const parkingData = res.data?.parking_configurations || 
                         res.data?.data?.parking_configurations || 
                         (Array.isArray(res.data) ? res.data : []) ||
                         [];
      console.log("Processed Parking Configurations:", parkingData);
      setParkingConfigurations(Array.isArray(parkingData) ? parkingData : []);
    } catch (error) {
      console.error("Error fetching parking configurations:", error);
      toast.error(error.response?.data?.message || "Failed to load parking configurations");
      setParkingConfigurations([]);
    }
  };

  fetchParking();
}, [token, reload]);

  const handleSearch = (e) => setSearchText(e.target.value.toLowerCase());

  const filteredStaffCategories = Array.isArray(staffCategories)
    ? staffCategories.filter((i) =>
        i?.name?.toLowerCase().includes(searchText)
      )
    : [];

  const filteredVisitorCategories = Array.isArray(visitorCategories)
    ? visitorCategories.filter((i) =>
        i?.name?.toLowerCase().includes(searchText)
      )
    : [];

  const filteredSubCategories = Array.isArray(subCategories)
    ? subCategories.filter((i) =>
        i?.name?.toLowerCase().includes(searchText)
      )
    : [];

  useEffect(() => {
    console.log("Current Page:", page);
    console.log("Staff Categories:", staffCategories);
    console.log("Visitor Categories:", visitorCategories);
    console.log("Sub Categories:", subCategories);
    console.log("Filtered Staff:", filteredStaffCategories);
    console.log("Filtered Visitor:", filteredVisitorCategories);
    console.log("Filtered Sub:", filteredSubCategories);
  }, [page, staffCategories, visitorCategories, subCategories, searchText]);

  const visitorCategoryMap = useMemo(() => {
    const map = {};
    visitorCategories.forEach((cat) => {
      map[cat.id] = cat.name;
    });
    return map;
  }, [visitorCategories]);

  const staffCategoryColumns = useMemo(
    () => [
      { name: "Sr No", selector: (_, i) => i + 1, width: "70px" },
      { name: "Category Name", selector: (row) => row?.name },
      { name: "Staff Count", selector: (row) => row?.staffs_count || 0 },
      {
        name: "Action",
        cell: (row) => (
          <div className="flex gap-3">
            <BiEdit
              size={20}
              className="cursor-pointer text-blue-600"
              onClick={() => {
                setEditType("staffCategory");
                setCatId(row.id);
                setEditVisitorSetupModal(true);
              }}
            />
            <RiDeleteBin5Line
              size={20}
              className="cursor-pointer text-red-600"
              onClick={async () => {
                if (!window.confirm("Are you sure?")) return;
                try {
                  await axios.delete(
                    `${BASE_URL}/visitor_staff_categories/${row.id}.json?token=${token}`
                  );
                  toast.success("Deleted");
                  setReload((p) => !p);
                } catch (error) {
                  console.error("Delete error:", error);
                  toast.error("Failed to delete");
                }
              }}
            />
          </div>
        ),
      },
    ],
    []
  );

  const visitorCategoryColumns = useMemo(
    () => [
      { name: "Sr No", selector: (_, i) => i + 1, width: "70px" },
      { name: "Name", selector: (row) => row?.name },
      { name: "Code", selector: (row) => row?.code },
      {
        name: "Icon",
        cell: (row) => <IconCell icon={row?.icon} />,
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="flex gap-2">
            <BiEdit
              size={22}
              className="cursor-pointer text-blue-600"
              onClick={() => {
                setEditType("visitorCategory");
                setCatId(row.id);
                setEditVisitorSetupModal(true);
              }}
            />
            <RiDeleteBin5Line
              size={22}
              className="cursor-pointer text-red-600"
              onClick={async () => {
                if (!window.confirm("Delete this category?")) return;
                try {
                  await axios.delete(
                    `${BASE_URL}/visitor_categories/${row.id}.json?token=${token}`
                  );
                  toast.success("Deleted");
                  setReload((p) => !p);
                } catch (error) {
                  console.error("Delete error:", error);
                  toast.error("Failed to delete");
                }
              }}
            />
          </div>
        ),
      },
    ],
    []
  );

  const subCategoryColumns = useMemo(
    () => [
      { name: "Sr No", selector: (_, i) => i + 1, width: "70px" },
      { name: "Sub Category", selector: (row) => row?.name },
      {
        name: "Parent Category",
        selector: (row) =>
          visitorCategoryMap?.[row.visitor_category_id] || "-",
      },
      {
        name: "Icon",
        cell: (row) => <IconCell icon={row?.iconv2} />,
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="flex gap-2">
            <BiEdit
              size={22}
              className="cursor-pointer text-blue-600"
              onClick={() => {
                setEditType("visitorSubCategory");
                setCatId(row.id);
                setEditVisitorSetupModal(true);
              }}
            />
            <RiDeleteBin5Line
              size={22}
              className="cursor-pointer text-red-600"
              onClick={async () => {
                if (!window.confirm("Delete this sub category?")) return;
                try {
                  await axios.delete(
                    `${BASE_URL}/visitor_sub_categories/${row.id}.json?token=${token}`
                  );
                  toast.success("Deleted");
                  setReload((p) => !p);
                } catch (error) {
                  console.error("Delete error:", error);
                  toast.error("Failed to delete");
                }
              }}
            />
          </div>
        ),
      },
    ],
    [visitorCategoryMap]
  );

  const parkingConfigColumns = useMemo(
    () => [
      { name: "Sr No", selector: (_, i) => i + 1, width: "70px" },
      { name: "Parking Slot", selector: (row) => row?.name || "-" },
      { name: "Building Name", selector: (row) => row?.building_name || "-" },
      { name: "Floor Name", selector: (row) => row?.floor_name || "-" },
      { name: "Vehicle Type", selector: (row) => row?.vehicle_type || "-" },
      { name: "Site Name", selector: (row) => row?.site_name || "-" },
    ],
    []
  );

  return (
    <section className="flex w-full">
      <SetupNavbar />
      <div className="w-full mx-3">
        <div className="flex gap-2 border-b p-2 bg-gray-50 rounded-t-lg overflow-x-auto">
          {[
            ["deviceConfig", "Device Configuration"],
            ["visitor", "Staff Categories"],
            ["vehicleParking", "Parking Slot"],
            ["visitorCategory", "Visitor Categories"],
            ["visitorSubCategory", "Visitor Sub Category"],
          ].map(([key, label]) => (
            <h2
              key={key}
              onClick={() => setPage(key)}
              className={`px-6 py-2 cursor-pointer rounded-lg ${
                page === key
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {label}
            </h2>
          ))}
        </div>

        {(page === "visitor" ||
          page === "visitorCategory" ||
          page === "visitorSubCategory" ||
          page === "vehicleParking") && (
          <div className="flex justify-between my-4">
            {(page === "visitor" ||
              page === "visitorCategory" ||
              page === "visitorSubCategory") && (
              <input
                value={searchText}
                onChange={handleSearch}
                className="border p-3 rounded w-96"
                placeholder="Search..."
              />
            )}
            {page === "vehicleParking" && <div></div>}
            <button
              onClick={() => {
                if (page === "visitor") setVisitorSetupModal(true);
                if (page === "visitorCategory")
                  setAddVisitorCategoryModal(true);
                if (page === "visitorSubCategory")
                  setAddVisitorSubCategoryModal(true);
                if (page === "vehicleParking")
                  setAddParkingModal(true);
              }}
              style={{ background: themeColor }}
              className="text-white px-5 py-3 rounded flex gap-2"
            >
              <IoAddCircleOutline size={22} /> Add
            </button>
          </div>
        )}

        <div className="bg-white p-6 rounded border">
          {page === "vehicleParking" ? (
            <>
              {parkingConfigurations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No parking configurations found.
                </div>
              ) : (
                <Table
                  columns={parkingConfigColumns}
                  data={parkingConfigurations}
                />
              )}
            </>
          ) : page === "deviceConfig" ? (
            <DeviceConfiguration />
          ) : loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="text-gray-500">Loading data...</div>
            </div>
          ) : (
            <>
              {page === "visitor" && (
                <>
                  {filteredStaffCategories.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                      No staff categories found. Click "Add" to create one.
                    </div>
                  )}
                  <Table
                    columns={staffCategoryColumns}
                    data={filteredStaffCategories}
                  />
                </>
              )}
              {page === "visitorCategory" && (
                <>
                  {filteredVisitorCategories.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                      {visitorCategories.length === 0 
                        ? "No visitor categories found." 
                        : "No visitor categories match your search."}
                    </div>
                  )}
                  <Table
                    columns={visitorCategoryColumns}
                    data={filteredVisitorCategories}
                  />
                </>
              )}
              {page === "visitorSubCategory" && (
                <>
                  {filteredSubCategories.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                      No sub categories found. Click "Add" to create one.
                    </div>
                  )}
                  <Table
                    columns={subCategoryColumns}
                    data={filteredSubCategories}
                  />
                </>
              )}
            </>
          )}
        </div>

        {visitorSetupModal && (
          <AddVisitorSetupModal
            type="staffCategory"
            setAdded={() => setReload((p) => !p)}
            onclose={() => setVisitorSetupModal(false)}
          />
        )}

        {addVisitorCategoryModal && (
          <AddVisitorSetupModal
            type="visitorCategory"
            setAdded={() => setReload((p) => !p)}
            onclose={() => setAddVisitorCategoryModal(false)}
          />
        )} 

        

        {addVisitorSubCategoryModal && (
          <AddVisitorSetupModal
            type="visitorSubCategory"
            visitorCategories={visitorCategories}
            setAdded={() => setReload((p) => !p)}
            onclose={() => setAddVisitorSubCategoryModal(false)}
          />
        )}

        {editVisitorSetupModal && (
          <EditVisitorSetupModal
            catId={catId}
            editType={editType}
            setAdded={() => setReload((p) => !p)}
            onclose={() => setEditVisitorSetupModal(false)}
          />
        )}

        {addParkingModal && (
          <AddVehicleParkingModal
            setAdded={() => {
              setReload((p) => !p);
              // Also refresh parking configurations
              const fetchParking = async () => {
                if (!token) return;
                try {
                  const res = await axios.get(
                    `${BASE_URL}/parking_configurations.json?token=${token}`
                  );
                  const parkingData = res.data?.parking_configurations || 
                                     res.data?.data?.parking_configurations || 
                                     (Array.isArray(res.data) ? res.data : []) ||
                                     [];
                  setParkingConfigurations(Array.isArray(parkingData) ? parkingData : []);
                } catch (error) {
                  console.error("Error fetching parking configurations:", error);
                }
              };
              fetchParking();
            }}
            onclose={() => setAddParkingModal(false)}
          />
        )}
      </div>
    </section>
  );
}

export default VisitorSetup;




