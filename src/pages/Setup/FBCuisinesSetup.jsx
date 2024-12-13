import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { BsEye } from "react-icons/bs";
import { useSelector } from "react-redux";
import Table from "../../components/table/Table";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { editGenericCategoryDetails, getCuisinesFBSetup, getGenericCategoryDetails, getGenericCategoryRestaurtant, postGenericCategory } from "../../api";
import {
  getItemInLocalStorage,
  setItemInLocalStorage,
} from "../../utils/localStorage";
import { BiEdit } from "react-icons/bi";
import Navbar from "../../components/Navbar";
import SetupNavbar from "../../components/navbars/SetupNavbar";


const FBCuisinesSetup = () => {
  const siteID = getItemInLocalStorage("SITEID");
  const companyId = getItemInLocalStorage("COMPANYID");
  const [details, setDetails] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const themeColor = useSelector((state)=> state.theme.color);
  const [update, setUpdate] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  

  const openModal1 = (categoryId) => {
    setEditingCategoryId(categoryId);
    fetchCategoryDetails(categoryId);
    setIsModalOpen1(true);
  };
  const closeModal1 = () => setIsModalOpen1(false);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const siteDetailsResp = await getCuisinesFBSetup();
        
        setDetails(siteDetailsResp.data);
        setUpdate(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, [update]);
  const fetchCategoryDetails = async (categoryId) => {
    try {
      const categoryDetails = await getGenericCategoryDetails(categoryId);
      setFormData({
        name: categoryDetails.data.name,
        
      });
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };
  const [formData, setFormData] = useState({
    name: "",
    company_id: "",
    site_id: "",
    info_type: "",
    
  });
  console.log(formData)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
         <button onClick={() => openModal1(row.id)}><BiEdit size={15}/></button>
        </div>
      ),
    },
    {
      name: "Cuisine",
      selector: (row) => row.name,
      sortable: true,
    },
   
  ];

 

 
  const navigate = useNavigate()
  const handleCreateCategory = async () => {
    
   
    const sendData = new FormData();
    sendData.append("generic_info[company_id]", companyId);
    sendData.append("generic_info[name]", formData.name);
    sendData.append("generic_info[site_id]", siteID);
    sendData.append("generic_info[info_type]", "Cuisins");

    try {
      const resp = await postGenericCategory(sendData);
      console.log(resp);
      setIsModalOpen(false);
      toast.success("Cuisine added successfully");
      setFormData((prev) => ({
        ...prev,
        name: "",
      }));
      setupdate(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditCategory = async () => {
    try {
      const updatedData = {
        name: formData.name,
        company_id: formData.company_id,
        site_id: formData.site_id,
        info_type: formData.info_type,
      };
      await editGenericCategoryDetails(editingCategoryId, updatedData);
      setIsModalOpen1(false);
      toast.success("Cuisine updated successfully");
      setUpdate(true);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  return (
    <section className="flex">
        {/* <SetupNavbar/> */}
      <div className="w-full flex mx-3 flex-col overflow-hidden my-10">
        <div className="flex md:flex-row flex-col gap-5 justify-between  my-2">
          <div className="sm:flex grid grid-cols-2 items-center justify-center gap-4 border border-gray-300 rounded-md px-3 p-2 w-auto">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="all"
                name="status"
                checked={selectedStatus === "all"}
                onChange={() => handleStatusChange("all")}
              />
              <label htmlFor="all" className="text-sm">All</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="upcoming"
                name="status"
                checked={selectedStatus === "upcoming"}
                onChange={() => handleStatusChange("upcoming")}
              />
              <label htmlFor="upcoming" className="text-sm">Upcoming</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="completed"
                name="status"
                checked={selectedStatus === "completed"}
                onChange={() => handleStatusChange("completed")}
              />
              <label htmlFor="completed" className="text-sm">Completed</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="cancelled"
                name="status"
                checked={selectedStatus === "cancelled"}
                onChange={() => handleStatusChange("cancelled")}
              />
              <label htmlFor="cancelled" className="text-sm">Cancelled</label>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={openModal}
              className="border-2 font-semibold hover:bg-black hover:text-white transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
              
            >
              <PiPlusCircle size={20} />
              Add
            </button>
          </div>
        </div>
        <Table columns={columns} data={details} isPagination={true} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
          <div className="bg-white w-70 h-70 rounded-lg shadow-lg p-4 relative z-10">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-semibold mb-4">Add Cuisines</h2>
            <div className="flex flex-col gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-medium font-bold mb-2" htmlFor="category-name">
                Cuisine
                </label>
                <input
                  id="category-name"
                  name="name"
                  className="border p-1 px-4 w-full border-gray-500 rounded-md"
                  onChange={handleChange}
                  value={formData.name}
                  type="text"
                  placeholder="Enter Cuisine"
                />
              </div>
             
              <div className="flex items-center justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md "
                  type="button"
                  onClick={handleCreateCategory}
                >
                  Add
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}
       {isModalOpen1 && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
          <div className="bg-white w-70 h-70 rounded-lg shadow-lg p-4 relative z-10">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={closeModal1}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Cuisines</h2>
            <div className="flex flex-col gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-medium font-bold mb-2" htmlFor="category-name">
                Cuisine
                </label>
                <input
                  id="category-name"
                  name="name"
                  className="border p-1 px-4 w-full border-gray-500 rounded-md"
                  onChange={handleChange}
                  value={formData.name}
                  type="text"
                  placeholder="Enter Cuisine"
                />
              </div>
             
              <div className="flex items-center justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md "
                  type="button"
                  onClick={handleEditCategory}
                >
                  Update
                </button>
               
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FBCuisinesSetup;