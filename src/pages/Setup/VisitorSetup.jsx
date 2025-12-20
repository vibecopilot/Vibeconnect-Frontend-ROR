import React, { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import Table from "../../components/table/Table";

import AddVisitorSetupModal from "../../containers/modals/AddVisitorSetupModal";
import EditVisitorSetupModal from "../../containers/modals/EditVisitorSetupModal";

import VehicleParkingSetup from "./VehicleParkingSetupModal/VehicleParkingSetup";
import DeviceConfiguration from "./VehicleParkingSetupModal/DeviceConfiguration";

import {
  getVisitorCategory,
  deleteVisitorCategory,
} from "../../api";

/* ================================
   VISITOR SETUP MAIN COMPONENT
================================ */
function VisitorSetup() {
  const themeColor = useSelector((state) => state.theme.color);

  const [page, setPage] = useState("deviceConfig");
  const [searchText, setSearchText] = useState("");

  const [categories, setCategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [visitorSetupModal, setVisitorSetupModal] = useState(false);
  const [editVisitorSetupModal, setEditVisitorSetupModal] = useState(false);
  const [catId, setCatId] = useState("");
  const [reload, setReload] = useState(false);

  /* ================================
     FETCH VISITOR CATEGORIES
  ================================ */
  const fetchVisitorCategories = async () => {
    try {
      const res = await getVisitorCategory();
      setCategories(res.data.categories);
      setFilteredData(res.data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVisitorCategories();
  }, [reload]);

  /* ================================
     SEARCH
  ================================ */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value.trim()) {
      setFilteredData(categories);
    } else {
      setFilteredData(
        categories.filter((c) =>
          c.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  /* ================================
     DELETE CATEGORY
  ================================ */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteVisitorCategory(id);
      toast.success("Category deleted");
      setReload((p) => !p);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  /* ================================
     TABLE COLUMNS
  ================================ */
  const categoryColumns = [
    {
      name: "Sr No",
      selector: (_, index) => index + 1,
    },
    {
      name: "Category Name",
      selector: (row) => row.name,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="flex gap-3">
          <button onClick={() => handleEdit(row.id)}>
            <BiEdit size={16} />
          </button>
          <button onClick={() => handleDelete(row.id)}>
            <RiDeleteBin5Line size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (id) => {
    setCatId(id);
    setEditVisitorSetupModal(true);
  };

  return (
    <section className="flex w-full">
      <SetupNavbar />

      <div className="w-full flex flex-col mx-3 overflow-hidden">
        {/* ===================== TABS ===================== */}
        <div className="flex gap-2 p-2 border-b-2 border-gray-200">
          {[
            ["deviceConfig", "Device Configuration"],
            ["visitor", "Staff Category"],
            ["vehicleParking", "Parking Slot"],
            ["visitorCategory", "Visitor Category"],
            ["visitorSubCategory", "Visitor Sub Category"],
          ].map(([key, label]) => (
            <h2
              key={key}
              className={`p-1 px-4 cursor-pointer rounded-t-md transition-all ${
                page === key
                  ? "bg-white text-blue-500 font-medium shadow-custom-all-sides"
                  : ""
              }`}
              onClick={() => setPage(key)}
            >
              {label}
            </h2>
          ))}
        </div>

        {/* ===================== BREADCRUMB ===================== */}
        <div className="flex gap-2 my-2">
          <Link className="font-medium text-gray-600" to="/setup">
            Setup
          </Link>
          <span>{">"}</span>
          <Link className="font-medium text-gray-600" to="/setup/visitor-setup">
            Visitor Setup
          </Link>
        </div>

        {/* ===================== VISITOR CATEGORY ===================== */}
        {(page === "visitor" || page === "visitorCategory") && (
          <>
            <div className="flex justify-between my-3">
              <input
                value={searchText}
                onChange={handleSearch}
                placeholder="Search category"
                className="border p-2 rounded-md w-96"
              />
              <button
                onClick={() => setVisitorSetupModal(true)}
                className="text-white px-4 py-2 rounded-md flex items-center gap-2"
                style={{ background: themeColor }}
              >
                <IoAddCircleOutline size={20} /> Add
              </button>
            </div>

            <Table
              columns={categoryColumns}
              data={filteredData}
              isPagination
            />
          </>
        )}

        {/* ===================== VISITOR SUB CATEGORY ===================== */}
        {page === "visitorSubCategory" && (
          <div className="p-4">
            <button
              className="px-4 py-2 text-white rounded-md"
              style={{ background: themeColor }}
            >
              Add Sub Category
            </button>
          </div>
        )}

        {/* ===================== VEHICLE PARKING ===================== */}
        {page === "vehicleParking" && <VehicleParkingSetup />}

        {/* ===================== DEVICE CONFIG ===================== */}
        {page === "deviceConfig" && <DeviceConfiguration />}

        {/* ===================== MODALS ===================== */}
        {visitorSetupModal && (
          <AddVisitorSetupModal
            setAdded={() => setReload((p) => !p)}
            onclose={() => setVisitorSetupModal(false)}
          />
        )}

        {editVisitorSetupModal && (
          <EditVisitorSetupModal
            catId={catId}
            setAdded={() => setReload((p) => !p)}
            onclose={() => setEditVisitorSetupModal(false)}
          />
        )}
      </div>
    </section>
  );
}

export default VisitorSetup;
