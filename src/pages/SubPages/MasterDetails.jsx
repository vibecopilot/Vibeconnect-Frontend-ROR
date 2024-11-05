import React, { useEffect, useState } from "react";
import image from "/profile.png";
import Navbar from "../../components/Navbar";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { getMastersDetails } from "../../api";

const MasterDetails = () => {
  const {id}= useParams()
  const [masterDetails, setMasterDetails] = useState([]);

    const themeColor = useSelector((state) => state.theme.color);
    useEffect(() => {
      const fetchMastersDetails = async () => {
        try{
        const MastersDetailsResponse = await getMastersDetails(id);
        const data = MastersDetailsResponse.data;
        console.log(data);
        setMasterDetails(MastersDetailsResponse.data);
      }catch (error) {
        console.log(error);
      }
      };
      fetchMastersDetails();
    }, []);
    const dateFormat = (dateString) => {
      const date = new Date(dateString);
      return date.toDateString();
    };
    const dateTimeFormat = (dateString) => {
      if (!dateString) {
        return " ";
      }
  
      const date = new Date(dateString);
  
      if (isNaN(date)) {
        return " ";
      }
  
      return date.toLocaleString();
    };
  return (
    <section className="flex">
    <Navbar />
    <div className=" w-full p-2 flex mx-3 flex-col overflow-hidden">
    <h2
          style={{
            background: themeColor,
          }}
          className="text-center rounded-full w-full text-white font-semibold text-lg p-2 px-4 mb-2 "
        >
          Master Details
        </h2>
        
      <div className="flex flex-col gap-2">
        
        
      <h2 className="border-b-2 border-black text font-medium ">
                      Inventory Details
                    </h2>
        
       
        <div className="md:grid  px-4 flex flex-col grid-cols-3 gap-5 gap-x-4 my-4">
          
       
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Name : </p>
            <p className="">{masterDetails.name}</p>
          </div>
          
            <div className="grid grid-cols-2 ">
              <p className="font-semibold text-sm">Type : </p>
              <p className="">{masterDetails.inventory_type === 1 ? "Spares" : "Consumable"}</p>
              </div>
         
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">{masterDetails.criticality==1?"Critical":"Non Critical"} </p>
            <p className="">Critical</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Code : </p>
            <p className="">{masterDetails.code}</p>
          </div>
          
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Serial Number: : </p>
            <p className="">{masterDetails.serial_number}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Quantity : </p>
            <p className="">{masterDetails.quantity}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Unit : </p>
            <p className="">{masterDetails.unit}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Category : </p>
            <p className="">Technical</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Min.Stock Level: : </p>
            <p className="">{masterDetails.min_stock_level}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Min.Order Level: : </p>
            <p className="">{masterDetails.min_order_level}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">SAC/HSN Code : </p>
            <p className="">{masterDetails.hsn_id}</p>
          </div>
          

          
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Cost : </p>
            <p className="">{masterDetails.cost}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">CGST Rate : </p>
            <p className="">{masterDetails.cgst_rate}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">SGST Rate : </p>
            <p className="">{masterDetails.sgst_rate}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">IGST Rate : </p>
            <p className="">{masterDetails.igst_rate}</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Site : </p>
            <p className="">NA</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Expiry Date : </p>
            <p className="">{dateFormat(masterDetails.expiry_date)}</p>
          </div>
          

          
         
         
        </div>

        <h2 className="border-b-2 border-black text font-medium ">
                      Asset Information
                    </h2>
                    <div className="md:grid  px-4 flex flex-col grid-cols-3 gap-5 gap-x-4 my-4">
                    <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Name : </p>
            <p className="">Motor</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Group : </p>
            <p className="">Electrical</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">SubGroup : </p>
            <p className="">
            Back Up Source</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Site : </p>
            <p className="">
            NA</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Building : </p>
            <p className="">
            NA</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Floor : </p>
            <p className="">
            NA</p>
          </div>
          <div className="grid grid-cols-2 ">
            <p className="font-semibold text-sm">Area : </p>
            <p className="">
            NA</p>
          </div>
                        </div>
      </div>
    </div>
   
  </section>
  )
}

export default MasterDetails