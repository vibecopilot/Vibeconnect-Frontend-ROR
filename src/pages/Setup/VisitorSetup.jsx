import React, { useEffect, useMemo, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

import SetupNavbar from "../../components/navbars/SetupNavbar";
import Table from "../../components/table/Table";

import AddVisitorSetupModal from "../../containers/modals/AddVisitorSetupModal";
import EditVisitorSetupModal from "../../containers/modals/EditVisitorSetupModal";

import VehicleParkingSetup from "./VehicleParkingSetupModal/VehicleParkingSetup";
import DeviceConfiguration from "./VehicleParkingSetupModal/DeviceConfiguration";

function VisitorSetup() {
  const themeColor = useSelector((state) => state.theme.color);

  const [page, setPage] = useState("deviceConfig");
  const [searchText, setSearchText] = useState("");

  // ================= STAFF CATEGORIES =================
  const [staffCategories, setStaffCategories] = useState([]);
  const [filteredStaffCategories, setFilteredStaffCategories] = useState([]);

  // ================= VISITOR CATEGORIES =================
  const [visitorCategories, setVisitorCategories] = useState([]);
  const [filteredVisitorCategories, setFilteredVisitorCategories] = useState([]);

  // ================= SUB CATEGORIES =================
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  // ================= MODALS =================
  const [visitorSetupModal, setVisitorSetupModal] = useState(false);
  const [addVisitorCategoryModal, setAddVisitorCategoryModal] = useState(false);
  const [addVisitorSubCategoryModal, setAddVisitorSubCategoryModal] = useState(false);
  const [editVisitorSetupModal, setEditVisitorSetupModal] = useState(false);

  const [catId, setCatId] = useState("");
  const [editType, setEditType] = useState("");
  const [reload, setReload] = useState(false);

  /* ================= FETCH STAFF CATEGORIES ================= */
  const fetchStaffCategories = async () => {
    try {
      const res = await axios.get(
        "https://admin.vibecopilot.ai/visitor_staff_categories.json?token=e6fbf77f4fbb5a72c4150e495c961972f0f14059d8a6670f"
      );
      const list = Array.isArray(res?.data?.staff_categories)
        ? res.data.staff_categories
        : [];
      setStaffCategories(list);
      setFilteredStaffCategories(list);
    } catch {
      setStaffCategories([]);
      setFilteredStaffCategories([]);
    }
  };

  /* ================= FETCH VISITOR CATEGORIES ================= */
  const fetchVisitorCategories = async () => {
    try {
      const res = await axios.get(
        "https://admin.vibecopilot.ai/visitor_categories.json?token=140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35"
      );
      console.log("🔍 Visitor Categories API Response:", res.data);
      const list = Array.isArray(res?.data) ? res.data : [];
      setVisitorCategories(list);
      setFilteredVisitorCategories(list);
    } catch (error) {
      console.error("Visitor Categories Error:", error);
      setVisitorCategories([]);
      setFilteredVisitorCategories([]);
    }
  };

  /* ================= FETCH SUB CATEGORIES ================= */
  const fetchVisitorSubCategories = async () => {
    try {
      const res = await axios.get(
        "https://admin.vibecopilot.ai/visitor_sub_categories.json?token=140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35"
      );
      console.log("🔍 Sub Categories API Response:", res.data);
      const list = Array.isArray(res?.data) ? res.data : [];
      setSubCategories(list);
      setFilteredSubCategories(list);
    } catch (error) {
      console.error("Sub Categories Error:", error);
      setSubCategories([]);
      setFilteredSubCategories([]);
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (page === "visitor") fetchStaffCategories();

    if (page === "visitorCategory") fetchVisitorCategories();

    if (page === "visitorSubCategory") {
      fetchVisitorCategories();       
      fetchVisitorSubCategories();
    }
  }, [page, reload]);

  /* ================= SEARCH ================= */
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    if (page === "visitor") {
      setFilteredStaffCategories(
        staffCategories.filter((c) => c?.name?.toLowerCase().includes(value))
      );
    }

    if (page === "visitorCategory") {
      setFilteredVisitorCategories(
        visitorCategories.filter((c) => c?.name?.toLowerCase().includes(value))
      );
    }

    if (page === "visitorSubCategory") {
      setFilteredSubCategories(
        subCategories.filter((c) => c?.name?.toLowerCase().includes(value))
      );
    }
  };

  /* ================= LOOKUP MAP ================= */
  const visitorCategoryMap = useMemo(() => {
    const map = {};
    visitorCategories.forEach((v) => {
      map[v.id] = v.name;
    });
    return map;
  }, [visitorCategories]);

  /* ================= TABLE COLUMNS ================= */
  const staffCategoryColumns = [
    { name: "Sr No", selector: (_, i) => i + 1 },
    { name: "Category Name", selector: (row) => row?.name },
    { name: "Staff Count", selector: (row) => row?.staffs_count || 0 },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-3">
          <BiEdit 
            className="cursor-pointer hover:text-blue-500 p-1 hover:bg-blue-50 rounded-full" 
            size={20}
            onClick={() => {
              setEditType("staffCategory");
              setCatId(row.id);
              setEditVisitorSetupModal(true);
            }} 
          />
          <RiDeleteBin5Line 
            className="cursor-pointer hover:text-red-500 p-1 hover:bg-red-50 rounded-full" 
            size={20}
            onClick={async () => {
              if (!window.confirm("Are you sure?")) return;
              await axios.delete(
                `https://admin.vibecopilot.ai/visitor_staff_categories/${row.id}.json?token=e6fbf77f4fbb5a72c4150e495c961972f0f14059d8a6670f`
              );
              toast.success("Staff category deleted");
              setReload((p) => !p);
            }} 
          />
        </div>
      ),
    },
  ];

  // ✅ ICONS PERFECTLY SHOW HONGI
  const visitorCategoryColumns = [
    { name: "Sr No", selector: (_, i) => i + 1 },
    { name: "Name", selector: (row) => row?.name },
    { name: "Code", selector: (row) => row?.code },
    {
      name: "Icon",
      cell: (row) => {
        const possibleIcons = [
          row?.icon,
          row?.icon_url,
          row?.image,
          row?.image_url,
          row?.icon?.url,
          row?.image?.url,
          `https://admin.vibecopilot.ai${row?.icon}`,
          `https://admin.vibecopilot.ai${row?.image}`
        ].filter(Boolean);

        return (
          <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-lg border p-1">
            {possibleIcons[0] ? (
              <img 
                src={possibleIcons[0]} 
                alt="Icon"
                className="w-12 h-12 object-contain rounded shadow-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No Icon</div>';
                }}
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                No Icon
              </div>
            )}
          </div>
        );
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <BiEdit 
            className="cursor-pointer hover:text-blue-500 p-1 hover:bg-blue-50 rounded-full transition-all" 
            size={22}
            title="Edit Icon & Details"
            onClick={() => {
              console.log("🔧 Edit Visitor Category:", row);
              setEditType("visitorCategory");
              setCatId(row.id);
              setEditVisitorSetupModal(true);
            }} 
          />
          <RiDeleteBin5Line 
            className="cursor-pointer hover:text-red-500 p-1 hover:bg-red-50 rounded-full transition-all" 
            size={22}
            title="Delete"
            onClick={async () => {
              if (!window.confirm("Are you sure you want to delete this category?")) return;
              try {
                await axios.delete(
                  `https://admin.vibecopilot.ai/visitor_categories/${row.id}.json?token=140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35`
                );
                toast.success("Visitor category deleted successfully!");
                setReload((p) => !p);
              } catch (error) {
                toast.error("Failed to delete category");
              }
            }} 
          />
        </div>
      ),
    },
  ];

  const subCategoryColumns = [
    { name: "Sr No", selector: (_, i) => i + 1 },
    { name: "Sub Category", selector: (row) => row?.name },
    {
      name: "Visitor Category",
      selector: (row) => visitorCategoryMap[row.visitor_category_id] || "-",
    },
    {
      name: "Icon",
      cell: (row) => {
        const possibleIcons = [
          row?.iconv2,
          row?.icon,
          row?.icon_url,
          row?.image,
          row?.image_url,
          row?.iconv2?.url,
          row?.icon?.url,
          row?.image?.url,
          `https://admin.vibecopilot.ai${row?.iconv2}`,
          `https://admin.vibecopilot.ai${row?.icon}`,
          `https://admin.vibecopilot.ai${row?.image}`
        ].filter(Boolean);

        return (
          <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-lg border p-1">
            {possibleIcons[0] ? (
              <img 
                src={possibleIcons[0]} 
                alt="Icon"
                className="w-12 h-12 object-contain rounded shadow-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No Icon</div>';
                }}
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                No Icon
              </div>
            )}
          </div>
        );
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <BiEdit 
            className="cursor-pointer hover:text-blue-500 p-1 hover:bg-blue-50 rounded-full transition-all" 
            size={22}
            title="Edit Icon & Details"
            onClick={() => {
              console.log("🔧 Edit Sub Category:", row);
              setEditType("visitorSubCategory");
              setCatId(row.id);
              setEditVisitorSetupModal(true);
            }} 
          />
          <RiDeleteBin5Line 
            className="cursor-pointer hover:text-red-500 p-1 hover:bg-red-50 rounded-full transition-all" 
            size={22}
            title="Delete"
            onClick={async () => {
              if (!window.confirm("Are you sure you want to delete this sub category?")) return;
              try {
                await axios.delete(
                  `https://admin.vibecopilot.ai/visitor_sub_categories/${row.id}.json?token=140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35`
                );
                toast.success("Sub category deleted successfully!");
                setReload((p) => !p);
              } catch (error) {
                toast.error("Failed to delete sub category");
              }
            }} 
          />
        </div>
      ),
    },
  ];

  return (
    <section className="flex w-full">
      <SetupNavbar />

      <div className="w-full mx-3">
        <div className="flex gap-2 border-b p-2 bg-gray-50 rounded-t-lg">
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
              className={`px-6 py-2 cursor-pointer font-medium transition-all rounded-lg ${
                page === key 
                  ? "bg-blue-500 text-white shadow-md" 
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              {label}
            </h2>
          ))}
        </div>

        {(page === "visitor" || page === "visitorCategory" || page === "visitorSubCategory") && (
          <div className="flex justify-between items-center my-4 p-4 bg-white rounded-lg shadow-sm border">
            <input
              value={searchText}
              onChange={handleSearch}
              className="border border-gray-300 p-3 rounded-lg w-96 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="🔍 Search categories..."
            />

            {page === "visitor" && (
              <button
                onClick={() => setVisitorSetupModal(true)}
                style={{ background: themeColor }}
                className="text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all"
              >
                <IoAddCircleOutline size={22} /> Add Staff Category
              </button>
            )}

            {page === "visitorCategory" && (
              <button
                onClick={() => setAddVisitorCategoryModal(true)}
                style={{ background: themeColor }}
                className="text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all"
              >
                <IoAddCircleOutline size={22} /> Add Visitor Category
              </button>
            )}

            {page === "visitorSubCategory" && (
              <button
                onClick={() => setAddVisitorSubCategoryModal(true)}
                style={{ background: themeColor }}
                className="text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all"
              >
                <IoAddCircleOutline size={22} /> Add Sub Category
              </button>
            )}
          </div>
        )}

        {/* TABLES */}
        {page === "visitor" && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <Table columns={staffCategoryColumns} data={filteredStaffCategories} />
          </div>
        )}

        {page === "visitorCategory" && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Visitor Categories {`(${filteredVisitorCategories.length})`}
            </h3>
            <Table columns={visitorCategoryColumns} data={filteredVisitorCategories} />
          </div>
        )}

        {page === "visitorSubCategory" && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Visitor Sub Categories {`(${filteredSubCategories.length})`}
            </h3>
            <Table columns={subCategoryColumns} data={filteredSubCategories} />
          </div>
        )}

        {page === "vehicleParking" && <VehicleParkingSetup />}
        {page === "deviceConfig" && <DeviceConfiguration />}

        {/* MODALS */}
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
      </div>
    </section>
  );
}

export default VisitorSetup;
