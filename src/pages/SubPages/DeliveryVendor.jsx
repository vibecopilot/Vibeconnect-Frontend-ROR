import React, { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { BiEdit, BiTrash } from "react-icons/bi";
import DeliveryVendorModal from "../../containers/modals/DeliveryVendorModal";
import Table from "../../components/table/Table";
import toast from "react-hot-toast";
import axios from "axios";
import {
  getVendors,
  removeVendor,
  postVendors,
  EditVendors,
} from "../../api/index";

const DeliveryVendor = () => {
  const [modal, showModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [deliveryVendors, setDeliveryVendors] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState(null);

  // Fetch vendors function
  const fetchVendors = async () => {
    try {
      const response = await getVendors();
      const transformedData = response.data.map((vendor) => ({
        id: vendor.id,
        vendor_id: vendor.vendor_supplier_id,
        vendor_name: vendor.vendor_name,
        website_url: vendor.website_url,
        address: vendor.address,
        email: vendor.email,
        mobile: vendor.mobile,
        spoc_person: vendor.spoc_person,
        aggrement_start_date: vendor.aggrement_start_date,
        aggremenet_end_date: vendor.aggremenet_end_date,
        status: vendor.status,
        created_by: new Date(vendor.created_at).toLocaleDateString(),
      }));

      setDeliveryVendors(transformedData);
      setFilteredData(transformedData);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setError("Failed to fetch vendors. Please try again.");
    }
  };

  // Fetch vendors on component mount
  useEffect(() => {
    fetchVendors();
  }, []);

  // Handle edit button click
  const handleEditClick = async (vendor) => {
    setSelectedVendor(vendor);
    showModal(true);
  };

  // Handle vendor submission (add/edit)
  const handleVendorSubmit = async (vendorData) => {
    try {
      let updatedVendors;
      if (selectedVendor) {
        // Update existing vendor
        await EditVendors(id, vendorData);
        updatedVendors = deliveryVendors.map((vendor) =>
          vendor.id === selectedVendor.id
            ? { ...vendor, ...vendorData }
            : vendor
        );
      } else {
        // Create new vendor
        const response = await postVendors(data);
        updatedVendors = [
          ...deliveryVendors,
          { ...vendorData, id: response.data.id },
        ];
      }

      // setDeliveryVendors(updatedVendors);
      setFilteredData(updatedVendors);
      console.log("Vendor saved successfully!");
      toast.success("Vendor saved successfully");
      // showModal(false);
      setSelectedVendor(null);
      // console.log("Vendor saved successfully!");
    } catch (error) {
      console.error("Error saving vendor:", error);
      setError("Failed to save vendor. Please try again.");
    }
    finally{showModal(false)}
  };


  const handleRemoveVendor = async (id) => {
    try {
      const deleteRec = await removeVendor(id);
      console.log(deleteRec);
      toast.success("Vendor deleted successfully");
      fetchVendors();
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast.error("Failed to delete the vendor");
    }
    // fetchVendors();
  };

  // Column definition
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <button onClick={() => handleEditClick(row)}>
          <BiEdit />
        </button>
      ),
      sortable: false,
    },
    { name: "ID", selector: (row) => row.id, sortable: true },
    // {
    //   name: "Vendor ID",
    //   selector: (row) => row.vendor_supplier_id,
    //   sortable: true,
    // },
    { name: "Name", selector: (row) => row.vendor_name, sortable: true },
    {
      name: "Website Url",
      selector: (row) => row.website_url,
      sortable: true,
    },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Phone", selector: (row) => row.mobile, sortable: true },
    { name: "SPOC Person", selector: (row) => row.spoc_person, sortable: true },
    {
      name: "Agreement Start Date",
      selector: (row) => row.aggrement_start_date,
      sortable: true,
    },
    {
      name: "Agreement End Date",
      selector: (row) => row.aggremenet_end_date,
      sortable: true,
    },
    { name: "Status", selector: (row) => row.status, sortable: true },
    { name: "Created On", selector: (row) => row.created_by, sortable: true },
    {
      name: "Remove Vendor",
      cell: (row) => (
        <button onClick={() => handleRemoveVendor(row.id)}>
          <BiTrash />
        </button>
      ),
      sortable: true,
    },
  ];

  // Search handler
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchText(searchValue);
    const filteredResults = deliveryVendors.filter((item) =>
      item.vendor_name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filteredResults);
  };

  return (
    <div>
      <div className="justify-between flex item-center my-2">
        {/* <h1 className="text-2xl font-bold"></h1> */}
        <input
          type="text"
          placeholder="Search by Vendor name..."
          value={searchText}
          onChange={handleSearch}
          className="border-2 p-1 w-96 border-gray-300 rounded-lg"
        />
        <div className="flex justify-end my-1">
          <button
            onClick={() => showModal(true)}
            className="flex items-center bg-black text-white p-2 rounded justify-end"
          >
            <IoAddCircleOutline className="mr-2" /> Add Vendor
          </button>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Table data={filteredData} columns={columns} />
      {modal && (
        <DeliveryVendorModal
          onclose={() => showModal(false)}
          title={selectedVendor ? "Edit" : "Add"}
          vendor={selectedVendor}
          onSubmit={handleVendorSubmit}
          
        />
      )}
    </div>
  );
};

export default DeliveryVendor;
