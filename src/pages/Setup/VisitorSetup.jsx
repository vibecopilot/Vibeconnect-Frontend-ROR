import React, { useEffect, useMemo, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

import {
  getVisitorCategories,
} from "../../api";

import SetupNavbar from "../../components/navbars/SetupNavbar";
import Table from "../../components/table/Table";
import SiteHeader from "../../components/SiteHeader";

import AddVisitorSetupModal from "../../containers/modals/AddVisitorSetupModal";
import EditVisitorSetupModal from "../../containers/modals/EditVisitorSetupModal";

import DeviceConfiguration from "./VehicleParkingSetupModal/DeviceConfiguration";
import AddVehicleParkingModal from "./VehicleParkingSetupModal/AddVehicleParkingModal";

import { getItemInLocalStorage } from "../../utils/localStorage";

const BASE_URL = "https://admin.vibecopilot.ai";

const resolveIconUrl = (iconPath) => {
  if (!iconPath) return null;

  if (iconPath.startsWith("http")) return iconPath;

  const normalized = iconPath.startsWith("/")
    ? iconPath
    : `/${iconPath}`;

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
        <span className="text-xs text-gray-400">
          No Icon
        </span>
      )}
    </div>
  );
};

function VisitorSetup() {
  const themeColor = useSelector((state) => state.theme.color);

  const token = getItemInLocalStorage("TOKEN");

  const [page, setPage] = useState("deviceConfig");

  const [reload, setReload] = useState(false);

  const [loading, setLoading] = useState(true);

  // ✅ SITE CHANGE STATE
  const [activeSiteId, setActiveSiteId] = useState("");

  const [visitorCategories, setVisitorCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [staffCategories, setStaffCategories] = useState([]);

  const [parkingConfigurations, setParkingConfigurations] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [visitorSetupModal, setVisitorSetupModal] =
    useState(false);

  const [addVisitorCategoryModal, setAddVisitorCategoryModal] =
    useState(false);

  const [
    addVisitorSubCategoryModal,
    setAddVisitorSubCategoryModal,
  ] = useState(false);

  const [editVisitorSetupModal, setEditVisitorSetupModal] =
    useState(false);

  const [addParkingModal, setAddParkingModal] =
    useState(false);

  const [catId, setCatId] = useState(null);

  const [editType, setEditType] = useState("");

  // =========================================
  // ✅ FETCH ALL DATA
  // =========================================

  useEffect(() => {
    fetchData();
  }, [reload, token, activeSiteId]);

  const fetchData = async () => {
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      setLoading(true);

      // ================= STAFF CATEGORY =================

      const fetchStaffCategories = async () => {
        try {
          const res = await axios.get(
            `${BASE_URL}/visitor_staff_categories.json?token=${token}`
          );

          let data =
            res.data?.staff_categories ||
            res.data?.data?.staff_categories ||
            (Array.isArray(res.data)
              ? res.data
              : []) ||
            [];

          // ✅ SITE FILTER
          if (activeSiteId) {
            data = data.filter(
              (item) =>
                String(item.site_id) ===
                String(activeSiteId)
            );
          }

          data = data
            .map((item) => ({
              ...item,
              name: item.name || "",
            }))
            .sort((a, b) => b.id - a.id);

          setStaffCategories(data);
        } catch (error) {
          console.log(error);
          setStaffCategories([]);
        }
      };

      // ================= VISITOR CATEGORY =================

      const fetchVisitorCategoriesData = async () => {
        try {
          const res = await getVisitorCategories(
            1,
            100
          );

          let data =
            res.data?.visitor_categories ||
            res.data?.data?.visitor_categories ||
            (Array.isArray(res.data)
              ? res.data
              : []) ||
            [];

          // ✅ SITE FILTER
          if (activeSiteId) {
            data = data.filter(
              (item) =>
                String(item.site_id) ===
                String(activeSiteId)
            );
          }

          setVisitorCategories(
            Array.isArray(data) ? data : []
          );
        } catch (error) {
          console.log(error);
          setVisitorCategories([]);
        }
      };

      // ================= SUB CATEGORY =================

      const fetchSubCategories = async () => {
        try {
          const res = await axios.get(
            `${BASE_URL}/visitor_sub_categories.json?token=${token}`
          );

          let data =
            res.data?.visitor_sub_categories ||
            res.data?.data
              ?.visitor_sub_categories ||
            (Array.isArray(res.data)
              ? res.data
              : []) ||
            [];

          // ✅ SITE FILTER
          if (activeSiteId) {
            data = data.filter(
              (item) =>
                String(item.site_id) ===
                String(activeSiteId)
            );
          }

          setSubCategories(
            Array.isArray(data) ? data : []
          );
        } catch (error) {
          console.log(error);
          setSubCategories([]);
        }
      };

      // ================= PARKING =================

      const fetchParking = async () => {
        try {
          const res = await axios.get(
            `${BASE_URL}/parking_configurations.json?token=${token}`
          );

          let data =
            res.data?.parking_configurations ||
            res.data?.data
              ?.parking_configurations ||
            (Array.isArray(res.data)
              ? res.data
              : []) ||
            [];

          // ✅ SITE FILTER
          if (activeSiteId) {
            data = data.filter(
              (item) =>
                String(item.site_id) ===
                String(activeSiteId)
            );
          }

          setParkingConfigurations(
            Array.isArray(data) ? data : []
          );
        } catch (error) {
          console.log(error);
          setParkingConfigurations([]);
        }
      };

      await Promise.allSettled([
        fetchStaffCategories(),
        fetchVisitorCategoriesData(),
        fetchSubCategories(),
        fetchParking(),
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // ✅ SEARCH
  // =========================================

  const handleSearch = (e) => {
    setSearchText(
      e.target.value.toLowerCase()
    );
  };

  // =========================================
  // ✅ FILTERED DATA
  // =========================================

  const filteredStaffCategories =
    Array.isArray(staffCategories)
      ? staffCategories.filter((item) =>
        (item?.name || "")
          .toLowerCase()
          .includes(searchText)
      )
      : [];

  const filteredVisitorCategories =
    Array.isArray(visitorCategories)
      ? visitorCategories.filter((item) =>
        (item?.name || "")
          .toLowerCase()
          .includes(searchText)
      )
      : [];

  const filteredSubCategories =
    Array.isArray(subCategories)
      ? subCategories.filter((item) =>
        (item?.name || "")
          .toLowerCase()
          .includes(searchText)
      )
      : [];

  // =========================================
  // ✅ MAP
  // =========================================

  const visitorCategoryMap = useMemo(() => {
    const map = {};

    visitorCategories.forEach((cat) => {
      map[cat.id] = cat.name;
    });

    return map;
  }, [visitorCategories]);

  // =========================================
  // ✅ TABLE COLUMNS
  // =========================================

  const staffCategoryColumns = [
    {
      name: "Sr No",
      selector: (_, i) => i + 1,
      width: "80px",
    },
    {
      name: "Category Name",
      selector: (row) => row?.name || "-",
      sortable: true,
    },
    {
      name: "Staff Count",
      selector: (row) =>
        row?.staffs_count || 0,
      sortable: true,
    },
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
              if (
                !window.confirm(
                  "Are you sure?"
                )
              )
                return;

              try {
                await axios.delete(
                  `${BASE_URL}/visitor_staff_categories/${row.id}.json?token=${token}`
                );

                toast.success("Deleted");

                setReload((prev) => !prev);
              } catch (error) {
                console.log(error);

                toast.error(
                  "Failed to delete"
                );
              }
            }}
          />
        </div>
      ),
    },
  ];

  const visitorCategoryColumns = [
    {
      name: "Sr No",
      selector: (_, i) => i + 1,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row?.name || "-",
      sortable: true,
    },
    {
      name: "Code",
      selector: (row) => row?.code || "-",
      sortable: true,
    },
    {
      name: "Icon",
      cell: (row) => (
        <IconCell icon={row?.icon} />
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <BiEdit
            size={20}
            className="cursor-pointer text-blue-600"
            onClick={() => {
              setEditType(
                "visitorCategory"
              );

              setCatId(row.id);

              setEditVisitorSetupModal(
                true
              );
            }}
          />

          <RiDeleteBin5Line
            size={20}
            className="cursor-pointer text-red-600"
            onClick={async () => {
              if (
                !window.confirm(
                  "Delete this category?"
                )
              )
                return;

              try {
                await axios.delete(
                  `${BASE_URL}/visitor_categories/${row.id}.json?token=${token}`
                );

                toast.success("Deleted");

                setReload((prev) => !prev);
              } catch (error) {
                console.log(error);

                toast.error(
                  "Failed to delete"
                );
              }
            }}
          />
        </div>
      ),
    },
  ];

  const subCategoryColumns = [
    {
      name: "Sr No",
      selector: (_, i) => i + 1,
      width: "80px",
    },
    {
      name: "Sub Category",
      selector: (row) =>
        row?.name || "-",
      sortable: true,
    },
    {
      name: "Parent Category",
      selector: (row) =>
        visitorCategoryMap?.[
        row.visitor_category_id
        ] || "-",
      sortable: true,
    },
    {
      name: "Icon",
      cell: (row) => (
        <IconCell icon={row?.iconv2} />
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <BiEdit
            size={20}
            className="cursor-pointer text-blue-600"
            onClick={() => {
              setEditType(
                "visitorSubCategory"
              );

              setCatId(row.id);

              setEditVisitorSetupModal(
                true
              );
            }}
          />

          <RiDeleteBin5Line
            size={20}
            className="cursor-pointer text-red-600"
            onClick={async () => {
              if (
                !window.confirm(
                  "Delete this sub category?"
                )
              )
                return;

              try {
                await axios.delete(
                  `${BASE_URL}/visitor_sub_categories/${row.id}.json?token=${token}`
                );

                toast.success("Deleted");

                setReload((prev) => !prev);
              } catch (error) {
                console.log(error);

                toast.error(
                  "Failed to delete"
                );
              }
            }}
          />
        </div>
      ),
    },
  ];

  const parkingConfigColumns = [
    {
      name: "Sr No",
      selector: (_, i) => i + 1,
      width: "80px",
    },
    {
      name: "Parking Slot",
      selector: (row) =>
        row?.name || "-",
      sortable: true,
    },
    {
      name: "Building Name",
      selector: (row) =>
        row?.building_name || "-",
      sortable: true,
    },
    {
      name: "Floor Name",
      selector: (row) =>
        row?.floor_name || "-",
      sortable: true,
    },
    {
      name: "Vehicle Type",
      selector: (row) =>
        row?.vehicle_type || "-",
      sortable: true,
    },
    {
      name: "Site Name",
      selector: (row) =>
        row?.site_name || "-",
      sortable: true,
    },
  ];

  return (
    <section className="flex w-full">
      <SetupNavbar />

      <div className="w-full mx-3 mb-5 flex flex-col gap-4 overflow-hidden">

        {/* ✅ SITE HEADER — reactive site switching */}
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id);
            setSearchText("");
            setPage("deviceConfig"); // reset to first tab on site change
          }}
        />

        {/* ✅ TABS */}

        <div className="flex gap-2 border-b p-2 bg-gray-50 rounded-t-lg overflow-x-auto">

          {[
            [
              "deviceConfig",
              "Device Configuration",
            ],
            [
              "visitor",
              "Staff Categories",
            ],
            [
              "vehicleParking",
              "Parking Slot",
            ],
            [
              "visitorCategory",
              "Visitor Categories",
            ],
            [
              "visitorSubCategory",
              "Visitor Sub Category",
            ],
          ].map(([key, label]) => (
            <h2
              key={key}
              onClick={() => setPage(key)}
              className={`px-6 py-2 cursor-pointer rounded-lg whitespace-nowrap transition-all duration-300 ${page === key
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
                }`}
            >
              {label}
            </h2>
          ))}
        </div>

        {/* ✅ SEARCH + ADD */}

        {(page === "visitor" ||
          page === "visitorCategory" ||
          page === "visitorSubCategory" ||
          page === "vehicleParking") && (
            <div className="flex md:flex-row flex-col justify-between gap-4">

              {(page === "visitor" ||
                page === "visitorCategory" ||
                page ===
                "visitorSubCategory") && (
                  <input
                    value={searchText}
                    onChange={handleSearch}
                    className="border p-3 rounded-lg w-full md:w-[600px] border-gray-300 outline-none"
                    placeholder="Search Here..."
                  />
                )}

              <button
                onClick={() => {
                  if (page === "visitor")
                    setVisitorSetupModal(
                      true
                    );

                  if (
                    page ===
                    "visitorCategory"
                  )
                    setAddVisitorCategoryModal(
                      true
                    );

                  if (
                    page ===
                    "visitorSubCategory"
                  )
                    setAddVisitorSubCategoryModal(
                      true
                    );

                  if (
                    page ===
                    "vehicleParking"
                  )
                    setAddParkingModal(true);
                }}
                style={{
                  background: themeColor,
                }}
                className="text-white px-5 py-3 rounded-lg flex gap-2 items-center whitespace-nowrap"
              >
                <IoAddCircleOutline
                  size={22}
                />
                Add
              </button>
            </div>
          )}

        {/* ✅ TABLE */}

        <div className="bg-white p-4 rounded-xl shadow-sm border">

          {page === "deviceConfig" ? (
            <DeviceConfiguration />
          ) : loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="text-gray-500">
                Loading data...
              </div>
            </div>
          ) : (
            <>
              {page === "visitor" && (
                <Table
                  columns={
                    staffCategoryColumns
                  }
                  data={
                    filteredStaffCategories
                  }
                />
              )}

              {page ===
                "visitorCategory" && (
                  <Table
                    columns={
                      visitorCategoryColumns
                    }
                    data={
                      filteredVisitorCategories
                    }
                  />
                )}

              {page ===
                "visitorSubCategory" && (
                  <Table
                    columns={
                      subCategoryColumns
                    }
                    data={
                      filteredSubCategories
                    }
                  />
                )}

              {page ===
                "vehicleParking" && (
                  <Table
                    columns={
                      parkingConfigColumns
                    }
                    data={
                      parkingConfigurations
                    }
                  />
                )}
            </>
          )}
        </div>

        {/* ✅ MODALS */}

        {visitorSetupModal && (
          <AddVisitorSetupModal
            type="staffCategory"
            setAdded={() =>
              setReload((p) => !p)
            }
            onclose={() =>
              setVisitorSetupModal(false)
            }
          />
        )}

        {addVisitorCategoryModal && (
          <AddVisitorSetupModal
            type="visitorCategory"
            setAdded={() =>
              setReload((p) => !p)
            }
            onclose={() =>
              setAddVisitorCategoryModal(
                false
              )
            }
          />
        )}

        {addVisitorSubCategoryModal && (
          <AddVisitorSetupModal
            type="visitorSubCategory"
            visitorCategories={
              visitorCategories
            }
            setAdded={() =>
              setReload((p) => !p)
            }
            onclose={() =>
              setAddVisitorSubCategoryModal(
                false
              )
            }
          />
        )}

        {editVisitorSetupModal && (
          <EditVisitorSetupModal
            catId={catId}
            editType={editType}
            setAdded={() =>
              setReload((p) => !p)
            }
            onclose={() =>
              setEditVisitorSetupModal(
                false
              )
            }
          />
        )}

        {addParkingModal && (
          <AddVehicleParkingModal
            setAdded={() =>
              setReload((p) => !p)
            }
            onclose={() =>
              setAddParkingModal(false)
            }
          />
        )}
      </div>
    </section>
  );
}

export default VisitorSetup;