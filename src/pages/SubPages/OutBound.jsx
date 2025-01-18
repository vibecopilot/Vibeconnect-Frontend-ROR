import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { IoAddCircleOutline } from "react-icons/io5";
import DeliveryVendorModal from "../../containers/modals/DeliveryVendorModal";
import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import Table from "../../components/table/Table";
import { BiTrash, BiEdit } from "react-icons/bi";

import { getoutbound, deleteOutbound } from "../../api";
const OutBound = () => {
  const [modal, showModal] = useState(false);
  const [add, setAdd] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [ouboundRecord, setOutboundRecord] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleButtonClick = () => {
    showModal(true);
  };

  const fetchOutboundRecord = async () => {
    try {
      const res = await getoutbound();
      console.log("API response:", res);
      const transformedData = res.data.map((item) => ({
        Id: item.id,
        vendor_id: item.vendor_id,
        vendor_name: item.vendor_name,
        recipient: item.recipient_name,
        mobile_number: item.mobile_number,
        unit: item.unit,
        sending_date: item.sending_date,
        sender: item.sender,
        company: item.company,
        receivedOn: new Date(item.receiving_date).toLocaleDateString(),
        AWB: item.awb_number,
        recipient_address_1: item.recipient_address_1,
        recipient_address_2: item.recipient_address_2,
        collectedBy: item.collect_by,
        entity: item.entity,
        created_by_id: item.created_by_id,
        created_by: item.created_by_name
          ? `${item.created_by_name.firstname || "Unknown"} ${
              item.created_by_name.lastname || ""
            }`.trim()
          : "Unknown",
        collect_by_id: item.collect_by_id,
        mail_outbound_type: item.mail_outbound_type,
      }));

      setOutboundRecord(transformedData);
      setFilteredData(transformedData);
    } catch (error) {
      console.error("Error fetching inbound records:", error);
    }
  };

  // Handle delete / remove record of inbound
  const handleRemovePackage = async (id) => {
    try {
      const deleteRec = await deleteOutbound(id);
      console.log(deleteRec);
      toast.success("Package deleted successfully");
      fetchOutboundRecord(); // Refresh the data after deletion
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete the package");
    }
  };

  useEffect(() => {
    fetchOutboundRecord();
  }, []);

  const column = [
    {
      name: "View",
      cell: (row) => {
        return (
          <Link to={`/mail-room/outbound/outbound-details/${row.Id}`}>
            <BsEye />
          </Link>
        );
      },
      sortable: true,
    },
    { name: "ID", selector: (row) => row.Id, sortable: true },
    { name: "Recipient", selector: (row) => row.recipient, sortable: true },
    { name: "Unit", selector: (row) => row.unit, sortable: true },
    {
      name: "Entity",
      selector: (row) => row.entity,
      sortable: true,
    },
    // {
    //   name: "Company",
    //   selector: (row) => row.company,
    //   sortable: true,
    // },
    {
      name: "Vendor Id",
      selector: (row) => row.vendor_id,
      sortable: true,
    },
    // {
    //   name: "Vendor Name ",
    //   selector: (row) => row.vendor_name,
    //   sortable: true,
    // },
    {
      name: "AWB Number",
      selector: (row) => row.AWB,
      sortable: true,
    },
    {
      name: " Package Type",
      selector: (row) => row.mail_outbound_type,
      sortable: true,
    },

    {
      name: "Sending Date",
      selector: (row) => row.sending_date,
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

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchText(searchValue);
    const filteredResults = ouboundRecord.filter((item) =>
      item.recipient.toLowerCase().includes(searchValue.toLowerCase())
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
    <div className="my-5 ">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search By Sender name"
          className="border-2 p-2 w-96 border-gray-300 rounded-lg"
          value={searchText}
          onChange={handleSearch}
        />

        <Link
          to={"/mail-room/outbound/create-outbound"}
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
      />
      {modal && <DeliveryVendorModal onclose={() => showModal(false)} />}
      {add && (
        <DeliveryVendorModal title={"Add"} onclose={() => setAdd(false)} />
      )}
    </div>
  );
};

export default OutBound;
