import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { IoMdAdd } from 'react-icons/io';
import Table from '../../components/table/Table';
import { BiEdit } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { EditSiteOwner, getAssignedTo, getChecklistGroupReading, getGDNPurposeSetup, getSiteOwner, getSiteOwnerDetails, postSiteOwner } from '../../api';
import { PiPlusCircle } from 'react-icons/pi';
import toast from "react-hot-toast";
import {
  getItemInLocalStorage,
  setItemInLocalStorage,
} from "../../utils/localStorage";

function GDNPurpose() {
  const COMPANYID = getItemInLocalStorage("COMPANYID");
  const SITEID = getItemInLocalStorage("SITEID");
  const[added,setadded]=useState(false);
  const [assignedUser, setAssignedUser] = useState([]);
  const [site, setSites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIsModalOpen, setEditIsModalOpen] = useState(false);
  const [siteOwnerId, setSiteOwnerId] = useState();

  const [formData, setFormData] = useState({
    name: "",
    company_id: "",
    site_id: "",
    info_type: "SiteOwner",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
  });

  const navigate = useNavigate();

  // Fetch all site owners
  useEffect(() => {
    const fetchSiteOwners = async () => {
      try {
        const resp = await getGDNPurposeSetup();
        setSites(resp.data);
      } catch (error) {
        console.log("Error fetching site owners:", error);
      }
    };
    fetchSiteOwners();
  }, [added]);

  // Fetch assigned users for the dropdown
  useEffect(() => {
    const fetchAssignedTo = async () => {
      try {
        const response = await getAssignedTo();
        setAssignedUser(response.data);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };
    fetchAssignedTo();
  }, []);

  // Fetch details of a single site owner for editing
  const fetchSiteOwnerDetails = async (id) => {
    try {
      const resp = await getSiteOwnerDetails(id);
      setEditFormData({ name: resp.data.name });
    } catch (error) {
      console.log("Error fetching site owner details:", error);
    }
  };

  const handleCreateSiteOwner = async () => {
    const sendData = new FormData();
    sendData.append("generic_info[company_id]", COMPANYID);
    sendData.append("generic_info[name]", formData.name);
    sendData.append("generic_info[site_id]", SITEID);
    sendData.append("generic_info[info_type]", "GdnPurpose");

    try {
      const resp = await postSiteOwner(sendData);
      toast.success("GDN Purpose created successfully");
      setIsModalOpen(false);
      setadded(true);
      navigate("/admin/gdn-purpose-setup");
    } catch (error) {
      console.log(error);
      toast.error("Site Owner already exists for this site");
    }
  };

  const handleEditSiteOwner = async () => {
    const sendData = new FormData();
    sendData.append("generic_info[company_id]", COMPANYID);
    sendData.append("generic_info[name]", editFormData.name);
    sendData.append("generic_info[site_id]", SITEID);
    sendData.append("generic_info[info_type]", "SiteOwner");
    try {
      await EditSiteOwner(siteOwnerId, sendData);
      toast.success("Site owner updated successfully");
      setEditIsModalOpen(false);
    } catch (error) {
      console.error("Error updating site owner:", error);
      toast.error("Failed to update site owner");
    }
  };

  const column = [
    // {
    //   name: "Actions",
    //   cell: (row) => (
    //     <div className="flex items-center gap-4">
    //       <button
    //         onClick={() => {
    //           setSiteOwnerId(row.id);
    //           fetchSiteOwnerDetails(row.id);
    //           setEditIsModalOpen(true);
    //         }}
    //       >
    //         <BiEdit size={15} />
    //       </button>
    //     </div>
    //   ),
    // },
    { name: 'Id', selector: (row) => row.id, sortable: true },
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'Company ID', selector: (row) => row.company_id, sortable: true },
    { name: 'Site ID', selector: (row) => row.site_id, sortable: true },
    { name: 'Info Type', selector: (row) => row.info_type, sortable: true },
  ];

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex justify-between my-3">
          <input
            type="text"
            placeholder="search"
            className="border-2 p-2 w-70 border-gray-300 rounded-lg"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center rounded-md"
          >
            <PiPlusCircle size={15} />
            Add
          </button>
        </div>
        <Table columns={column} data={site} />

        {/* Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-bold mb-4">Add GDN Purpose</h2>

              <input
                value={formData.name || ""}
                placeholder='Enter Purpose '
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border p-1 px-4 w-full mb-4 border-gray-500 rounded-md"
              >
                
              </input>
              <div className='flex gap-2'>
              <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              <button onClick={handleCreateSiteOwner} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Add
              </button></div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editIsModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center gap-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-bold mb-4">Edit Site Owner</h2>
              {/* <input
                value={editFormData.name || ""}
                onChange={(e) => setEditFormData({ name: e.target.value })}
                className="border p-1 px-4 w-full mb-4 border-gray-500 rounded-md"
              /> */}
              <select
                value={editFormData.name || ""}
                onChange={(e) => setEditFormData({ name: e.target.value })}
                className="border p-1 px-4 w-full mb-4 border-gray-500 rounded-md"
              >
                <option value="">Select Name</option>
                {assignedUser?.map((assign) => (
                  <option key={assign.id} value={assign.id}>
                    {assign.firstname} {assign.lastname}
                  </option>
                ))}
              </select><div className='flex gap-2'>
              <button
                  onClick={() => setEditIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              <button onClick={handleEditSiteOwner} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Update
              </button></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default GDNPurpose;
