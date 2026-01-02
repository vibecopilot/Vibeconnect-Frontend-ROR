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
import { getItemInLocalStorage } from "../../utils/localStorage";

const BASE_URL = "https://admin.vibecopilot.ai";
const token = getItemInLocalStorage("TOKEN");

/* =========================
   ICON HELPERS
========================= */

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

  /* =========================
      STATE
  ========================= */

  const [page, setPage] = useState("deviceConfig");
  const [reload, setReload] = useState(false);

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

  // ✅ Missing state added for parking configurations
  const [parkingConfigurations, setParkingConfigurations] = useState([]);

  /* =========================
      DATA FETCH
  ========================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, catRes, subRes] = await Promise.all([
          axios.get(
            `${BASE_URL}/visitor_staff_categories.json?token=${token}`
          ),
          axios.get(`${BASE_URL}/visitor_categories.json?token=${token}`),
          axios.get(`${BASE_URL}/visitor_sub_categories.json?token=${token}`),
        ]);

        setStaffCategories(
          Array.isArray(staffRes.data)
            ? staffRes.data
            : staffRes.data?.staff_categories || []
        );

        setVisitorCategories(
          Array.isArray(catRes.data)
            ? catRes.data
            : catRes.data?.visitor_categories || []
        );

        setSubCategories(
          Array.isArray(subRes.data)
            ? subRes.data
            : subRes.data?.visitor_sub_categories || []
        );
      } catch (err) {
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, [reload]);

  useEffect(() => {
    const fetchParking = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/parking_configurations.json?token=${token}`
        );

        // ✅ Ensure safe default (array)
        setParkingConfigurations(res.data?.parking_configuration ?? []);
      } catch (error) {
        toast.error("Failed to load parking configurations");
      }
    };

    fetchParking();
  }, []);

  /* =========================
      SEARCH
  ========================= */

  const handleSearch = (e) => setSearchText(e.target.value.toLowerCase());

  const filteredStaffCategories = Array.isArray(staffCategories)
    ? staffCategories.filter((i) =>
        i.name?.toLowerCase().includes(searchText)
      )
    : [];

  const filteredVisitorCategories = Array.isArray(visitorCategories)
    ? visitorCategories.filter((i) =>
        i.name?.toLowerCase().includes(searchText)
      )
    : [];

  const filteredSubCategories = Array.isArray(subCategories)
    ? subCategories.filter((i) =>
        i.name?.toLowerCase().includes(searchText)
      )
    : [];

  const visitorCategoryMap = useMemo(() => {
    const map = {};
    visitorCategories.forEach((cat) => {
      map[cat.id] = cat.name;
    });
    return map;
  }, [visitorCategories]);

  /* =========================
      TABLE COLUMNS
  ========================= */

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
                await axios.delete(
                  `${BASE_URL}/visitor_staff_categories/${row.id}.json?token=${token}`
                );
                toast.success("Deleted");
                setReload((p) => !p);
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
                await axios.delete(
                  `${BASE_URL}/visitor_categories/${row.id}.json?token=${token}`
                );
                toast.success("Deleted");
                setReload((p) => !p);
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
                await axios.delete(
                  `${BASE_URL}/visitor_sub_categories/${row.id}.json?token=${token}`
                );
                toast.success("Deleted");
                setReload((p) => !p);
              }}
            />
          </div>
        ),
      },
    ],
    [visitorCategoryMap]
  );

  /* =========================
      RENDER
  ========================= */

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
          page === "visitorSubCategory") && (
          <div className="flex justify-between my-4">
            <input
              value={searchText}
              onChange={handleSearch}
              className="border p-3 rounded w-96"
              placeholder="Search..."
            />
            <button
              onClick={() => {
                if (page === "visitor") setVisitorSetupModal(true);
                if (page === "visitorCategory")
                  setAddVisitorCategoryModal(true);
                if (page === "visitorSubCategory")
                  setAddVisitorSubCategoryModal(true);
              }}
              style={{ background: themeColor }}
              className="text-white px-5 py-3 rounded flex gap-2"
            >
              <IoAddCircleOutline size={22} /> Add
            </button>
          </div>
        )}

        <div className="bg-white p-6 rounded border">
          {page === "visitor" && (
            <Table
              columns={staffCategoryColumns}
              data={filteredStaffCategories}
            />
          )}
          {page === "visitorCategory" && (
            <Table
              columns={visitorCategoryColumns}
              data={filteredVisitorCategories}
            />
          )}
          {page === "visitorSubCategory" && (
            <Table
              columns={subCategoryColumns}
              data={filteredSubCategories}
            />
          )}
          {page === "vehicleParking" && (
            <VehicleParkingSetup
              parkingConfigurations={parkingConfigurations}
              setParkingConfigurations={setParkingConfigurations}
            />
          )}
          {page === "deviceConfig" && <DeviceConfiguration />}
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
      </div>
    </section>
  );
}

export default VisitorSetup;
