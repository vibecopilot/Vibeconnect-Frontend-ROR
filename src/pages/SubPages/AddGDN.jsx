import React from "react";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";

const AddGdn = () => {
  const themeColor = useSelector((state) => state.theme.color);
  return (
    <section>
      <div className=" flex  ">
      <Navbar/>
      <div className='md:mx-20 my-2 mb-10 sm:border border-gray-400 p-5 px-10 rounded-lg w-full'>
        <h2 className="text-center text-xl font-bold p-2 bg-black rounded-full text-white mb-4" style={{ background: themeColor }}>
                       Add GDN
                    </h2>
      <div className="w-full flex  flex-col overflow-hidden">
        <div className="border-2 flex flex-col my-5 mx-5 p-4 gap-4 rounded-md border-gray-400">
          <h2 className=" border-b-2 border-gray-400 font-semibold ">
            Basic Details
          </h2>
          <div className="flex sm:flex-row flex-col justify-around items-center">
            <div className="grid md:grid-cols-3 item-start gap-x-4 gap-y-8 w-full">
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold my-1">
                  GDN Date
                </label>
                <input
                  type="date"
                  placeholder="Enter Date"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="" className="font-semibold my-1">
                  Description
                </label>
                <textarea
                  name=""
                  id=""
                  cols="1"
                  rows="1"
                  placeholder="GDN Description"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="border-2 flex flex-col my-5 mx-5 p-4 gap-4 rounded-md border-gray-400">
          <h2 className=" border-b-2 border-gray-400 font-semibold ">
            Inventory Details
          </h2>
          {/* <div className='border-2 border-gray-400 mx-2 py-5 px-5'> */}
          <div className="flex sm:flex-row flex-col justify-around items-center">
            <div className="grid md:grid-cols-2 item-start gap-x-4 gap-y-8 w-full">
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold my-1">
                  Inventory
                </label>
                <select
                  name=""
                  id=""
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value=""> Selcet Inventory</option>
                  <option value="">Pratibha Enterprises</option>
                </select>
              </div>
             
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold my-1">
                  Quantity
                </label>
                <input
                  type="text"
                  placeholder="Quantity"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold my-1">
                  Purpose
                </label>
                <select
                  
                  
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="">Select Purpose</option>
                  <option value="Consuming">Consuming</option>
                  <option value="Disposing">Disposing</option>
                  <option value="Breakage">Breakage</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold my-1">
                  Select Consuming in
                </label>
                <select
                  
                  
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="">Select Consuming in</option>
                  <option value="Asset">Asset</option>
                  <option value="Service">Service</option>
                  
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold my-1">
                  Select Asset
                </label>
                <select
                  
                  
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="">Select Asset</option>
                  <option value="Asset">Asset</option>
                  <option value="Service">Service</option>
                  
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold my-1">
                  Select Service
                </label>
                <select
                  
                  
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="">Select Service</option>
                  <option value="Asset">Asset</option>
                  <option value="Service">Service</option>
                  
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold my-1">
                  Handed Over to
                </label>
                <select
                  
                  
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="">Handed Over to</option>
                  <option value="">Mittu Panda</option>
                  <option value="">Test1</option>
                </select>
              </div>
              <div className="flex flex-col  ">
                <label htmlFor="" className="font-semibold my-1">
                  Comments
                </label>
                <textarea
                  name=""
                  id=""
                  cols="5"
                  rows="1"
                  placeholder="Comments"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              
            </div>
          </div>
          {/* </div> */}
        </div>
        <div className="my-10 mx-5 text-center">
          <button className="bg-black text-white px-8  py-2 text-small rounded-md ">
            Submit
          </button>
        </div>
      </div>
      </div>
      </div>
    </section>
  );
};

export default AddGdn;
