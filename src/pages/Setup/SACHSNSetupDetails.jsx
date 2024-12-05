import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar'
import { useSelector } from "react-redux";
import { getHSNSetupDetails } from '../../api';
import { useParams } from "react-router-dom";

function SACHSNSetupDetails() {
    const themeColor = useSelector((state) => state.theme.color);
    const {id} = useParams();
    const [hsndetails, sethsnDetails] = useState("");
    useEffect(() => {
      const fetchCategory = async () => {
        try {
          const siteDetailsResp = await getHSNSetupDetails(id);
          
          sethsnDetails(siteDetailsResp.data);
         
        } catch (error) {
          console.log(error);
        }
      };
      fetchCategory();
    }, []);
  return (
    <section className='flex'>
        <div className='hidden md:block'>
            <Navbar/>
        </div>
        <div className="w-full flex  flex-col overflow-hidden">
            <h2 className="text-center text-xl font-bold my-5 p-2 bg-black rounded-full text-white mx-10" style={{ background: themeColor }}>
                SAC/HSN Setup Details
            </h2>
            <div className='flex justify-center'>
            <div className="md:my-5  p-5 text-sm items-center font-medium grid  md:grid-cols-2 border-2 border-black w-4/5 rounded-md" >
                <div className="grid grid-cols-2 items-center ">
                    <p>Type:</p>
                    <p className="text-sm font-normal ">{hsndetails.hsn_type}</p>
                </div>
                <div className="grid grid-cols-2 items-center">
                    <p>Category:</p>
                    <p className="text-sm font-normal ">{hsndetails.category}</p>
                </div>
                <div className="grid grid-cols-2 items-center">
                    <p>SAC/HSN Code: </p>
                    <p className="text-sm font-normal ">{hsndetails.code}</p>
                </div>
                <div className="grid grid-cols-2 items-center">
                    <p>CGST Rate:</p>
                    <p className="text-sm font-normal ">{hsndetails.cgst_rate}</p>
                </div>
                <div className="grid grid-cols-2 items-center">
                    <p>SGST Rate:</p>
                    <p className="text-sm font-normal ">{hsndetails.sgst_rate}</p>
                </div>
                <div className="grid grid-cols-2 items-center">
                    <p>IGST Rate:</p>
                    <p className="text-sm font-normal ">{hsndetails.igst_rate}</p>
                </div>
                <div className="grid grid-cols-2 items-center">
  <p>Created On:</p>
  <p className="text-sm font-normal">
    {new Date(hsndetails.created_at).toLocaleString()}
  </p>
</div>
<div className="grid grid-cols-2 items-center">
  <p>Updated On:</p>
  <p className="text-sm font-normal">
    {new Date(hsndetails.updated_at).toLocaleString()}
  </p>
</div>

                <div className="grid grid-cols-2 items-center">
                    <p>Created By:</p>
                    <p className="text-sm font-normal ">
    {hsndetails.created_by_name?.firstname || ""} {hsndetails.created_by_name?.lastname || ""}
  </p>                </div>
            </div>
            </div>
        </div>
    </section>
  )
}

export default SACHSNSetupDetails