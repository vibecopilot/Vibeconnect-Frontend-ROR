import React, { useEffect, useState } from "react";
import Table from "../components/table/Table";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaDownload, FaRegFileAlt, FaUpload } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getInvoiceReceipt, getFloors, getUnits } from "../api";
import { BiFilterAlt } from "react-icons/bi";
import { getItemInLocalStorage } from "../utils/localStorage";
import ReceiptInvoiceModal from "../containers/modals/ReceiptInvoiceModal";
function ReceiptInvoiceCam() {
  const [invoiceReceipt, setInvoiceReceipt] = useState([]);
  const themeColor = useSelector((state) => state.theme.color);
  const [filter, setFilter] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/receipt-invoice-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: "Receipt No.",
      selector: (row, index) => row.receipt_number,
      sortable: true,
    },
    {
      name: "Invoice No.",
      selector: (row) => row.invoice_number,
      sortable: true,
    },
    {
      name: "Block",
      selector: (row) => row.building_id,
      sortable: true,
    },
    {
      name: "Flat",
      selector: (row) => row.unit_id,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customer_name,
      sortable: true,
    },
    {
      name: "Amount Received",
      selector: (row) => row.amount_received,
      sortable: true,
    },
    {
      name: "Payment Mode",
      selector: (row) => row.payment_mode,
      sortable: true,
    },
    {
      name: "Transaction Number",
      selector: (row) => row.transaction_or_cheque_number,
      sortable: true,
    },
    {
      name: "Payment Date",
      selector: (row) => row.payment_date,
      sortable: true,
    },
    {
      name: "Receipt Date",
      selector: (row) => row.receipt_date,
      sortable: true,
    },
    {
      name: "Mail sent",
      selector: (row) => row.mail_sent,
      sortable: true,
    },
    {
      name: "Attachments",
      selector: (row) => (
        <div>
          <button>
            <FaRegFileAlt />
          </button>
        </div>
      ),
      sortable: true,
    },
  ];

  useEffect(() => {
    const fetchInvoiceReceipt = async () => {
      try {
        const response = await getInvoiceReceipt();
        setInvoiceReceipt(response.data); // Ensure response.data is structured as expected
      } catch (err) {
        console.error("Failed to fetch Address Setup data:", err);
      }
    };
    fetchInvoiceReceipt();
  }, []);

  const buildings = getItemInLocalStorage("Building");
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    block: "",
    floor_name: "",
    flat: "",
    receiptDate: "",
    receiptNumber: "",
    invoiceNumber: "",
  });
  const handleChange = async (e) => {
    const { name, value, type } = e.target;

    // Fetch floors based on building ID
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
    // Fetch units based on floor ID
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
      await fetchFloor(buildingID); // Fetch floors for the selected block
      setFormData((prev) => ({
        ...prev,
        building_id: buildingID,
        block: value,
        floor_id: "", // Reset floor selection
        flat: "", // Reset unit selection
      }));
    } else if (type === "select-one" && name === "floor_name") {
      const floorID = Number(value);
      await fetchUnit(floorID); // Fetch units for the selected floor
      setFormData((prev) => ({
        ...prev,
        floor_id: floorID,
        floor_name: value,
        flat: "", // Reset unit selection
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

  const handleFilterData = async () => {
    try {
      const [startDate, endDate] = billingPeriod; // Extract start and end dates from the state
      if (!startDate || !endDate) {
        console.error("Please select a valid billing period");
        return;
      }
      const resp = await gatCamBillFilter(
        formData.block,
        formData.floor_name,
        formData.flat,
        startDate,
        endDate,
        formData.dueDate
      );
      console.log(resp);
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };
  return (
    <div className="my-10">
      <div className="flex md:flex-row flex-col justify-between md:items-center my-2 gap-2  ">
        <input
          type="text"
          placeholder="Search By Invoice No, Payment Status"
          className=" p-2 md:w-96 border-gray-300 rounded-md placeholder:text-sm outline-none border "
        />
        <div className="md:flex grid grid-cols-2 sm:flex-row my-2 flex-col gap-2">
          <Link
            to={`/admin/add-receipt-invoice-cam-billing`}
            style={{ background: themeColor }}
            className="px-4 py-2  font-medium text-white rounded-md flex gap-2 items-center justify-center"
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
          >
            <FaDownload />
            Export
          </button>
          <button
            className=" font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md"
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
              disabled={!floors.length} // Disable if no floors are available
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
            <input
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              placeholder="Enter Invoice Number"
              className="border p-1 px-4 border-gray-500 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              name="receiptNumber"
              value={formData.receiptNumber}
              onChange={handleChange}
              placeholder="Enter Invoice Number"
              className="border p-1 px-4 border-gray-500 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="date"
              name="receiptDate"
              value={formData.receiptDate}
              onChange={handleChange}
              placeholder="Enter Date of supply"
              className="border p-1 px-4 border-gray-500 rounded-md"
            />
          </div>
          <button
            onClick={handleFilterData}
            className=" p-1 px-4 text-white rounded-md"
            style={{ background: themeColor }}
          >
            Apply
          </button>
          <button className="bg-red-400 p-1 px-4 text-white rounded-md">
            Reset
          </button>
        </div>
      )}
      <Table columns={columns} data={invoiceReceipt} selectableRow={true} />
      {importModal && (
        <ReceiptInvoiceModal onclose={() => setImportModal(false)} />
      )}
    </div>
  );
}

export default ReceiptInvoiceCam;
