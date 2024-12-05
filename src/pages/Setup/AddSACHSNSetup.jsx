import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { postHSNSetup } from '../../api';
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
    getItemInLocalStorage,
    setItemInLocalStorage,
  } from "../../utils/localStorage";

function AddSACHSNSetup() {
    const companyID = getItemInLocalStorage("COMPANYID");
    const userID = getItemInLocalStorage("UserId");
    const themeColor = useSelector((state) => state.theme.color);
    const [formData, setFormData] = useState({
        type: "",
        category: "",
        code: "",
        sgst_rate: "",
        cgst_rate: "",
        igst_rate: "",
        active: true,
        created_by: "", 
        company_id: "",
        hsn_type: ""
      });
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
      const navigate = useNavigate()
      const handleSubmit = async () => {
    
   
        const sendData = new FormData();
        sendData.append("hsn[hsn_type]", formData.hsn_type);
        sendData.append("hsn[category]", formData.category);
        sendData.append("hsn[code]", formData.code);
        sendData.append("hsn[sgst_rate]", formData.sgst_rate);
        sendData.append("hsn[cgst_rate]", formData.cgst_rate);
        sendData.append("hsn[igst_rate]", formData.igst_rate);
        sendData.append("hsn[created_by]", userID);
        sendData.append("hsn[company_id]", companyID);
    
       
        try {
          const resp = await postHSNSetup(sendData);
          console.log(resp);
          
          toast.success("SAC/HSN Setup added successfully");
          navigate("/admin/sac-hsn-setup");
        } catch (error) {
          console.log(error);
        }
      };
  return (
    <section className='flex'>
        
            <Navbar/>
       
        <div className="w-full flex  flex-col overflow-hidden">
            <h2 className="text-center text-xl font-bold my-5 p-2 bg-black rounded-full text-white mx-10" style={{ background: themeColor }}>
                Add SAC/HSN Setup
            </h2>
            <div className='flex justify-center'>
                <div className='border border-gray-400 p-5 px-10 rounded-lg w-4/5'>
                    <div className='md:grid grid-cols-3 gap-5 my-3'>
                        <div className="flex flex-col ">
                            <label htmlFor="" className="font-semibold my-2">
                                Type 
                            </label>
                            <select
                            name='hsn_type'
                             onChange={handleChange}
                             value={formData.hsn_type}
                            className="border p-1 px-4 border-gray-500 rounded-md"
                            >
                                <option value="">Select Type </option>
                                <option value="Product">Product</option>
                                <option value="Services">Services</option>
                            </select>
                        </div>
                        <div className="flex flex-col ">
                            <label htmlFor="" 
                            className="font-semibold my-2">
                                Category 
                            </label>
                            <input
                              type="text"
                              name='category'
                             onChange={handleChange}
                             value={formData.category}
                              placeholder="Enter Category "
                              className="border p-1 px-4 border-gray-500 rounded-md"
                            />
                        </div>
                        <div className="flex flex-col ">
                            <label htmlFor="" className="font-semibold my-2">
                                SAC/HSN code 
                            </label>
                            <input
                              type="text"
                              name='code'
                             onChange={handleChange}
                             value={formData.code}
                              placeholder="Enter SAC/HSN code "
                              className="border p-1 px-4 border-gray-500 rounded-md"
                            />
                        </div>
                        <div className="flex flex-col ">
                            <label htmlFor="" className="font-semibold my-2">
                                CGST Rate
                            </label>
                            <input
                              type="text"
                              name='cgst_rate'
                             onChange={handleChange}
                             value={formData.cgst_rate}
                              placeholder="Enter CGST Rate"
                              className="border p-1 px-4 border-gray-500 rounded-md"
                            />
                        </div>
                        <div className="flex flex-col ">
                            <label htmlFor="" className="font-semibold my-2">
                                SGST Rate
                            </label>
                            <input
                              type="text"
                              name='sgst_rate'
                             onChange={handleChange}
                             value={formData.sgst_rate}
                              placeholder="Enter SGST Rate"
                              className="border p-1 px-4 border-gray-500 rounded-md"
                           />
                        </div>
                        <div className="flex flex-col ">
                            <label htmlFor="" className="font-semibold my-2">
                                IGST Rate
                            </label>
                            <input
                              type="text"
                              name='igst_rate'
                             onChange={handleChange}
                             value={formData.igst_rate}
                              placeholder="Enter IGST Rate"
                              className="border p-1 px-4 border-gray-500 rounded-md"
                            />
                        </div>
                    </div>
                    <div className="sm:flex justify-center grid gap-2 my-5 ">
                        <button 
                        onClick={handleSubmit}
                        className="bg-black text-white p-2 px-4 rounded-md font-medium" style={{ background: themeColor }}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default AddSACHSNSetup