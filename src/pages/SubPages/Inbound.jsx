import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoAddCircleOutline } from "react-icons/io5";
import DeliveryVendorModal from "../../containers/modals/DeliveryVendorModal";
import { BsEye } from "react-icons/bs";
import { BiTrash, BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";
import Table from "../../components/table/Table";
import toast from "react-hot-toast";
import { getinbound, deleteInbound } from "../../api";

const Inbound = () => {
  const [modal, showModal] = useState(false);
  const [add, setAdd] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [inboundRecord, setInboundRecord] = useState([]);

  const handleButtonClick = () => {
    showModal(true);
  };
  const fetchInboundRecord = async () => {
    try {
      const res = await getinbound();
      console.log("API response:", res);
      const transformedData = res.data.map((item) => ({
        Id: item.id,
        vendor_id: item.vendor_id,
        recipient: item.receipant_name,
        mobile_number: item.mobile_number,
        unit: item.unit,
        department: item.department_name,
        sender: item.sender,
        company: item.company,
        receivedOn: new Date(item.receiving_date).toLocaleDateString(),
        ageing: item.aging,
        AWB: item.awb_number,
        company_address_1: item.company_address_1,
        company_address_2: item.company_address_2,
        collectedOn: item.collect_on
          ? new Date(item.collect_on).toLocaleDateString()
          : "N/A",
        collectedBy: item.collect_by,
        status: item.status,
        created_by_id: item.created_by_id,
        created_by: item.created_by_name
          ? `${item.created_by_name.firstname || "Unknown"} ${
              item.created_by_name.lastname || ""
            }`.trim()
          : "Unknown",
        collect_by_id: item.collect_by_id,
        mail_inbound_type: item.mail_inbound_type,
      }));

      setInboundRecord(transformedData);
      setFilteredData(transformedData);
    } catch (error) {
      console.error("Error fetching inbound records:", error);
    }
  };

  // Handle delete / remove record of inbound
  const handleRemovePackage = async (id) => {
    try {
      const deleteRec = await deleteInbound(id);
      console.log(deleteRec);
      toast.success("Package deleted successfully");
      fetchInboundRecord(); // Refresh the data after deletion
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete the package");
    }
  };

  useEffect(() => {
    fetchInboundRecord();
  }, []);

  const column = [
    {
      name: "View",
      cell: (row) => {
        return (
          <Link to={`/mail-room/inbound/inbound-details/${row.Id}`}>
            <BsEye />
          </Link>
        );
      },
      sortable: true,
    },
    { name: "ID", selector: (row) => row.Id, sortable: true },
    {
      name: "Vendor ID ",
      selector: (row) => row.vendor_id,
      sortable: true,
    },
    { name: "Recipient", selector: (row) => row.recipient, sortable: true },
    { name: "Phone No", selector: (row) => row.mobile_number, sortable: true },
    {
      name: "Package Type",
      selector: (row) => row.mail_inbound_type,
      sortable: true,
    },
    { name: "Created By", selector: (row) => row.created_by, sortable: true },
    { name: "Collected By", selector: (row) => row.collect_by, sortable: true },
    { name: "Created By", selector: (row) => row.created_by, sortable: true },
    { name: "Unit", selector: (row) => row.unit, sortable: true },
    {
      name: "Department",
      selector: (row) => row.department_name,
      sortable: true,
    },

    {
      name: "Sender",
      selector: (row) => row.sender,
      sortable: true,
    },
    {
      name: "Company",
      selector: (row) => row.company,
      sortable: true,
    },
    {
      name: "Received On",
      selector: (row) => row.receivedOn,
      sortable: true,
    },
    // {
    //   name: "Received By",
    //   selector: (row) => row.status,
    //   sortable: true,
    // },
    {
      name: "Ageing",
      selector: (row) => row.ageing,
      sortable: true,
    },
    {
      name: "Collected On",
      selector: (row) => row.collectedOn,
      sortable: true,
    },
    {
      name: "Remove Package",
      cell: (row) => (
        <button onClick={() => handleRemovePackage(row.Id)}>
          <BiTrash />
        </button>
      ),
      sortable: true,
    },
  ];

  const [filteredData, setFilteredData] = useState([]);
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchText(searchValue);
    const filteredResults = data.filter((item) =>
      item.vendor_id.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filteredResults);
  };

  const customStyle = {
    headRow: {
      style: {
        backgroundColor: "black",
        color: "white",
        fontSize: "12px",
      },
    },
  };
  return (
    <div className="my-5">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search By Vendor name"
          className="border-2 p-2 w-96 border-gray-300 rounded-lg"
          value={searchText}
          onChange={handleSearch}
        />

        <Link
          to={"/mail-room/inbound/create-inbound"}
          className="bg-black  rounded-lg flex font-semibold items-center gap-2 text-white p-2 my-5"
        >
          <IoAddCircleOutline size={20} />
          Add
        </Link>
      </div>
      <Table
        columns={column}
        data={filteredData}
        // customStyles={customStyle}
        // fixedHeader
        //   fixedHeaderScrollHeight="500px"
        //   pagination
        //   selectableRowsHighlight
        //   highlightOnHover
        //   omitColumn={column}
      />
      {modal && <DeliveryVendorModal onclose={() => showModal(false)} />}
      {add && (
        <DeliveryVendorModal title={"Add"} onclose={() => setAdd(false)} />
      )}
    </div>
  );
};

export default Inbound;
