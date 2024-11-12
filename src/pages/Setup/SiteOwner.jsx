import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { IoMdAdd } from 'react-icons/io';
import Table from '../../components/table/Table';
import { BiEdit } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { getAssignedTo, getMasterChecklist, getSiteOwner, postSiteOwner } from '../../api';
import { PiPlusCircle } from 'react-icons/pi';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
    getItemInLocalStorage,
    setItemInLocalStorage,
  } from "../../utils/localStorage";
  
function SiteOwner() {
  // State for the modal visibility and input field
  const COMPANYID = getItemInLocalStorage("COMPANYID");
  const SITEID = getItemInLocalStorage("SITEID");
  const [assignedUser, setAssignedUser] = useState([]);
  const [site, setsites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputName, setInputName] = useState('');
  const [formData, setFormData] = useState({
    name:"",
    company_id: "",
    site_id: "",
    info_type: "",
    
    
  });
  useEffect(() => {
    const fetchGRN = async () => {
      try {
        const resp = await getSiteOwner();
        console.log("GRN",resp)
        setsites(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGRN();
  }, []);
  useEffect(() => {
   

    const fetchAssignedTo = async () => {
      try {
        const response = await getAssignedTo();
        setAssignedUser(response.data);
        // setEditTicketInfo(response.data);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };

   

   
    fetchAssignedTo();
    
  }, []);
  const navigate = useNavigate()
  const handleCreateSiteOwner = async () => {
    
    
    const sendData = new FormData();
    sendData.append("generic_info[company_id]",COMPANYID );
    sendData.append("generic_info[name]", formData.name );
    sendData.append("generic_info[site_id]",SITEID);
    sendData.append("generic_info[info_type]", "SiteOwner");

    try {
      const resp = await postSiteOwner(sendData);
      console.log(resp);
      setIsModalOpen(false)
      toast.success("Site owner created successfully")
      navigate("/admin/site-owner-setup")
    } catch (error) {
      console.log(error);
      setIsModalOpen(false)
      toast.error("SiteOwner already exists for this site");
    }
  };
  const column = [
    { name: 'Id', selector: (row) => row.id, sortable: true },
    { name: 'Name', selector: (row) => row.user, sortable: true },
    { name: 'Company ID', selector: (row) => row.company_id, sortable: true },
    { name: 'Site ID', selector: (row) => row.site, sortable: true },
    { name: 'Info_type', selector: (row) => row.info_type, sortable: true },
  ];

  const data = [
    {
      id: 1,
      Id: '544',
      activityName: 'Mittu',
      meterCategory: '',
      numberOfQuestions: '1',
      scheduledFor: 'Asset',
    },
  ];

  

  
 

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row md:justify-between gap-3 my-3">
          <input
            type="text"
            placeholder="search"
            className="border-2 p-2 w-70 border-gray-300 rounded-lg"
          />
          <div className="flex gap-3 sm:flex-row flex-col">
            <button
              onClick={() => setIsModalOpen(true)}
              className="font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center rounded-md"
            >
              <PiPlusCircle size={15} />
              Add
            </button>
          </div>
        </div>
        <div className="my-3">
          <Table columns={column} data={site}  />
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-bold mb-4">Add Site Owner</h2>
              <label htmlFor="" className='font-semibold'>Name</label>
              <select
                  value={formData.name || ""}
                  name="name"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border p-1 px-4 w-full mb-4 border-gray-500 rounded-md"
                >
                  <option value="">Select Name</option>
                  {assignedUser?.map((assign) => (
                    <option key={assign.id} value={assign.id}>
                      {assign.firstname} {assign.lastname}
                    </option>
                  ))}
                </select>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSiteOwner}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SiteOwner;
