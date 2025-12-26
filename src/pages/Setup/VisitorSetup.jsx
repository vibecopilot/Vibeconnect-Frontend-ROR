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
      const list = Array.isArray(res?.data) ? res.data : [];
      setVisitorCategories(list);
      setFilteredVisitorCategories(list);
    } catch {
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
      const list = Array.isArray(res?.data) ? res.data : [];
      setSubCategories(list);
      setFilteredSubCategories(list);
    } catch {
      setSubCategories([]);
      setFilteredSubCategories([]);
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (page === "visitor") fetchStaffCategories();

    if (page === "visitorCategory") fetchVisitorCategories();

    if (page === "visitorSubCategory") {
      fetchVisitorCategories();       // ✅ REQUIRED FIX
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
          <BiEdit onClick={() => {
            setEditType("staffCategory");
            setCatId(row.id);
            setEditVisitorSetupModal(true);
          }} />
          <RiDeleteBin5Line onClick={async () => {
            if (!window.confirm("Are you sure?")) return;
            await axios.delete(
              `https://admin.vibecopilot.ai/visitor_staff_categories/${row.id}.json?token=e6fbf77f4fbb5a72c4150e495c961972f0f14059d8a6670f`
            );
            toast.success("Staff category deleted");
            setReload((p) => !p);
          }} />
        </div>
      ),
    },
  ];

  const visitorCategoryColumns = [
    { name: "Sr No", selector: (_, i) => i + 1 },
    { name: "Name", selector: (row) => row?.name },
    { name: "Code", selector: (row) => row?.code },
    {
      name: "Icon",
      cell: (row) =>
        row?.icon ? (
          <img src={row.icon} className="w-8 h-8 object-contain" />
        ) : (
          "-"
        ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-3">
          <BiEdit onClick={() => {
            setEditType("visitorCategory");
            setCatId(row.id);
            setEditVisitorSetupModal(true);
          }} />
          <RiDeleteBin5Line onClick={async () => {
            if (!window.confirm("Are you sure?")) return;
            await axios.delete(
              `https://admin.vibecopilot.ai/visitor_categories/${row.id}.json?token=140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35`
            );
            toast.success("Visitor category deleted");
            setReload((p) => !p);
          }} />
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
      cell: (row) =>
        row?.iconv2 ? (
          <img src={row.iconv2} className="w-8 h-8 object-contain" />
        ) : (
          "-"
        ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-3">
          <BiEdit onClick={() => {
            setEditType("visitorSubCategory");
            setCatId(row.id);
            setEditVisitorSetupModal(true);
          }} />
          <RiDeleteBin5Line onClick={async () => {
            if (!window.confirm("Are you sure?")) return;
            await axios.delete(
              `https://admin.vibecopilot.ai/visitor_sub_categories/${row.id}.json?token=140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35`
            );
            toast.success("Sub category deleted");
            setReload((p) => !p);
          }} />
        </div>
      ),
    },
  ];

  return (
    <section className="flex w-full">
      <SetupNavbar />

      <div className="w-full mx-3">
        <div className="flex gap-2 border-b p-2">
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
              className={`px-4 py-1 cursor-pointer ${
                page === key ? "bg-white text-blue-500 font-semibold" : ""
              }`}
            >
              {label}
            </h2>
          ))}
        </div>

        {(page === "visitor" || page === "visitorCategory" || page === "visitorSubCategory") && (
          <div className="flex justify-between my-3">
            <input
              value={searchText}
              onChange={handleSearch}
              className="border p-2 rounded-md w-96"
              placeholder="Search..."
            />

            {page === "visitor" && (
              <button
                onClick={() => setVisitorSetupModal(true)}
                style={{ background: themeColor }}
                className="text-white px-4 py-2 rounded flex gap-2"
              >
                <IoAddCircleOutline size={20} /> Add Staff
              </button>
            )}

            {page === "visitorCategory" && (
              <button
                onClick={() => setAddVisitorCategoryModal(true)}
                style={{ background: themeColor }}
                className="text-white px-4 py-2 rounded flex gap-2"
              >
                <IoAddCircleOutline size={20} /> Add Visitor
              </button>
            )}
          </div>
        )}

        {page === "visitor" && (
          <Table columns={staffCategoryColumns} data={filteredStaffCategories} />
        )}

        {page === "visitorCategory" && (
          <Table columns={visitorCategoryColumns} data={filteredVisitorCategories} />
        )}

        {page === "visitorSubCategory" && (
          <Table columns={subCategoryColumns} data={filteredSubCategories} />
        )}

        {page === "vehicleParking" && <VehicleParkingSetup />}
        {page === "deviceConfig" && <DeviceConfiguration />}

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
