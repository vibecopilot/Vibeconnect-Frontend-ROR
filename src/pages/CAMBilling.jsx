import React, { useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Table from "../components/table/Table";
import { useSelector } from "react-redux";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaDownload, FaUpload } from "react-icons/fa";
import { BiFilterAlt } from "react-icons/bi";
import InvoiceImportModal from "../containers/modals/InvoiceImportModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getCamBillingData,
  getCamBillingDownload,
  getFloors,
  getUnits,
  gatCamBillFilter,
} from "../api";
import toast from "react-hot-toast";
import { getItemInLocalStorage } from "../utils/localStorage";
import CamBillingHeader from "./SubPages/CamBillingHeader";

function CAMBilling() {
  const themeColor = useSelector((state) => state.theme.color);
  const [billingPeriod, setBillingPeriod] = useState([null, null]);
  const [importModal, setImportModal] = useState(false);
  const [filter, setFilter] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);
  const [camBilling, setCamBilling] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);


  const RECORDS_PER_PAGE = 10;

// ✅ Proper server-side fetch
   const fetchCamBilling = async (pageNo = 1) => {
    try {
      setLoading(true);
      const response = await getCamBillingData(pageNo, RECORDS_PER_PAGE);
      const data = response.data;

      setCamBilling(data?.cam_bills || []);
      setTotalRecords(data?.total_count || 0);
      setIsFiltered(false);

    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }  };

  useEffect(() => {
    fetchCamBilling(page);
  }, [page]);

   const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/cam_bill/details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: "Flat",
      // Safe navigation for nested flat object
      selector: (row) => row?.flat?.name || "N/A",
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => row.bill_period_start_date,
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.bill_period_end_date,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.total_amount,
      sortable: true,
    },
    {
      name: "Due Date",
      selector: (row) => row.due_date,
      sortable: true,
    },
    {
      name: "Invoice No.",
      selector: (row) => row.invoice_number,
      sortable: true,
    },
    {
        name: "Amount Paid",
    selector: (row) => {
      // If payments array exists, calculate total paid
      if (row?.payments?.length > 0) {
        return row.payments.reduce(
          (sum, payment) => sum + (payment.paid_amount || 0),
          0
        );
      }

      // Otherwise fallback to amount_paid field
      return row.amount_paid || 0;
    },
    sortable: true,
  },


    {
      name: "Payment Status",
      selector: (row) => row.payment_status || "-",
      sortable: true,
    },
    {
      name: "Recall",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Created On",
      selector: (row) => row.created_at,
      sortable: true,
    },
  ];

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setBillingPeriod([start, end]);
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const handleSelectedRows = (rows) => {
    const selectedId = rows.map((row) => row.id);
    console.log(selectedId);
    setSelectedRows(selectedId);
  };

  const handleDownload = async () => {
    if (!selectedRows.length) {
      return toast.error("Please select at least one data.");
    }

    toast.loading("Cam Billing Invoice downloading, please wait!");

    try {
      const response = await getCamBillingDownload(selectedRows);
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "cam_invoice_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Cam Billing Invoice downloaded successfully");
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading :", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const buildings = getItemInLocalStorage("Building");
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    block: "",
    floor_name: "",
    flat: "",
    status: "",
    dueDate: "",
  });

  const handleChange = async (e) => {
    const { name, value, type } = e.target;

    const fetchFloor = async (buildingID) => {
      try {
        const response = await getFloors(buildingID);
        setFloors(
          response.data.map((item) => ({ name: item.name, id: item.id }))
        );
      } catch (error) {
        console.error("Error fetching floors:", error);
      }
    };

    const fetchUnit = async (floorID) => {
      try {
        const response = await getUnits(floorID);
        setUnits(
          response.data.map((item) => ({ name: item.name, id: item.id }))
        );
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    if (type === "select-one" && name === "block") {
      const buildingID = Number(value);
      await fetchFloor(buildingID);
      setFormData((prev) => ({
        ...prev,
        building_id: buildingID,
        block: value,
        floor_id: "",
        flat: "",
      }));
    } else if (type === "select-one" && name === "floor_name") {
      const floorID = Number(value);
      await fetchUnit(floorID);
      setFormData((prev) => ({
        ...prev,
        floor_id: floorID,
        floor_name: value,
        flat: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const isFlatDisabled =
    !formData.block || !formData.floor_name || !units.length;
  const navigate = useNavigate();

   const handleFilterData = async () => {
    try {
      setLoading(true);

      const [startDate, endDate] = billingPeriod;

      const formattedStart = startDate
        ? new Date(startDate).toISOString().split("T")[0]
        : "";

      const formattedEnd = endDate
        ? new Date(endDate).toISOString().split("T")[0]
        : "";

      const resp = await gatCamBillFilter(
        formData.block || "",
        formData.floor_name || "",
        formData.flat || "",
        formData.status || "",
        formattedStart,
        formattedEnd,
        formData.dueDate || ""
      );

      const filteredList = Array.isArray(resp.data?.cam_bills)
        ? resp.data.cam_bills
        : [];

      setFilteredData(filteredList);
      setIsFiltered(true);
      setTotalRecords(filteredList.length); // important

      if (filteredList.length === 0) {
        toast("No records found");
      }

    } catch (error) {
      toast.error("Error filtering data");
    } finally {
      setLoading(false);
    }
  };


    const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value.trim()) {
      setIsFiltered(false);
      return;
    }

    const sourceData = isFiltered ? filteredData : camBilling;

    const result = sourceData.filter(
      (item) =>
        item?.invoice_number?.toLowerCase().includes(value.toLowerCase()) ||
        item?.payment_status?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(result);
    setIsFiltered(true);
    setTotalRecords(result.length);
  };

   const handleReset = () => {
    setFormData({
      block: "",
      floor_name: "",
      flat: "",
      status: "",
      dueDate: "",
    });

    setBillingPeriod([null, null]);
    setFloors([]);
    setUnits([]);
    setSearchText("");
    setFilteredData(camBilling); // restore original data
  };
  const tableData = isFiltered ? filteredData : camBilling;


  const getStatusButton = (status) => {
    if (status === "pending" || status === "recall" || status === null) {
      return <button className="text-black">Unpaid</button>;
    } else {
      return <button className="text-green-500">Paid</button>;
    }
  };

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <CamBillingHeader />
        <div className="flex md:flex-row flex-col justify-between md:items-center my-2 gap-2">
          <input
            type="text"
            onChange={handleSearch}
            value={searchText}
            placeholder="Search By Invoice No, Payment Status"
            className="p-2 md:w-96 border-gray-300 rounded-md placeholder:text-sm outline-none border"
          />
          <div className="md:flex grid grid-cols-2 sm:flex-row my-2 flex-col gap-2">
            <Link
              to={`/cam_bill/add`}
              style={{ background: themeColor }}
              className="px-4 py-2 font-medium text-white rounded-md flex gap-2 items-center justify-center"
            >
              <IoAddCircleOutline />
              Add
            </Link>
            <button
              className="font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md"
              style={{ background: themeColor }}
              onClick={() => setImportModal(true)}
            >
              <FaUpload />
              Import
            </button>
            <button
              className="font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md"
              style={{ background: themeColor }}
              onClick={handleDownload}
            >
              <FaDownload />
              Export
            </button>
            <button
              className="font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md"
              style={{ background: themeColor }}
              onClick={() => setFilter(!filter)}
            >
              <BiFilterAlt />
              Filter
            </button>
          </div>
        </div>

        {filter && (
          <div className="flex flex-col md:flex-row mt-1 items-center justify-center gap-2 my-3">
            <div className="flex flex-col">
              <select
                className="border p-1 px-4 border-gray-500 rounded-md"
                onChange={handleChange}
                value={formData.block}
                name="block"
              >
                <option value="">Select Building</option>
                {buildings?.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <select
                className="border p-1 px-4 border-gray-500 rounded-md"
                onChange={handleChange}
                value={formData.floor_name}
                name="floor_name"
                disabled={!floors.length}
              >
                <option value="">Select Floor</option>
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <select
                name="flat"
                value={formData.flat}
                onChange={handleChange}
                disabled={isFlatDisabled}
                className="border p-1 px-4 border-gray-500 rounded-md"
              >
                <option value="">Select Flat</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border p-1 px-4 border-gray-500 rounded-md"
              >
                <option value="">
                  Select Payment Status
                </option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="Partially Paid">Partially Paid</option>
              </select>
            </div>
            <div className="flex flex-col">
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="border p-1 px-4 border-gray-500 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <DatePicker
                selectsRange
                startDate={billingPeriod[0]}
                endDate={billingPeriod[1]}
                onChange={handleDateChange}
                placeholderText="Select Billing Period"
                className="border p-1 px-4 border-gray-500 rounded-md w-full z-20"
                isClearable
              />
            </div>
            <button
              onClick={() => {
                handleFilterData();
                setFilter(!filter);
              }}
              className="p-1 px-4 text-white rounded-md"
              style={{ background: themeColor }}
            >
              Apply
            </button>
            <button
              className="bg-red-400 p-1 px-4 text-white rounded-md"
              onClick={handleReset}>
              Reset
            </button>
          </div>
        )}

        {/* ✅ TABLE WITH CORRECT PAGINATION */}
           <Table
          columns={columns}
          data={tableData}
          selectableRow={true}
          onSelectedRows={handleSelectedRows}
          progressPending={loading}
          pagination
          paginationServer   // 🔥 VERY IMPORTANT
          paginationTotalRows={totalRecords}  // 🔥 This shows 58 total
          paginationPerPage={RECORDS_PER_PAGE}
          onChangePage={(page) => setPage(page)}
        />


        {importModal && (
          <InvoiceImportModal
            onclose={() => setImportModal(false)}
            fetchCamBilling={() => fetchCamBilling(page)}
          />
        )}
      </div>
    </section>
  );
}

export default CAMBilling;