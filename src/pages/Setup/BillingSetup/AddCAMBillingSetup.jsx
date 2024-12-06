import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../../../components/Navbar";

function AddCAMBillingSetup() {
  const themeColor = useSelector((state) => state.theme.color);
  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="md:p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
        <h2
          style={{ background: themeColor }}
          className="text-center text-xl font-bold p-2 rounded-full text-white"
        >
          Add CAM Billing
        </h2>
        <div className="md:mx-16 my-5 mb-10 sm:border border-gray-400 p-5 px-10 rounded-lg sm:shadow-xl">
          <div className="flex sm:flex-row flex-col justify-around items-center">
            <div className="grid md:grid-cols-3 item-start gap-x-4 gap-y-2 w-full">
              <div className="flex flex-col">
                <label className="block text-gray-700 mb-1 font-medium">
                  Bill Cycle Name
                </label>
                <input
                  type="text"
                  name=""
                  placeholder="Bill Cycle Name"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 mb-1 font-medium">
                  Start Date
                </label>
                <input
                  type="date"
                  name=""
                  placeholder="Start Date"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-gray-700 mb-1 font-medium">
                  End Date
                </label>
                <input
                  type="date"
                  name=""
                  placeholder="End Date"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col ">
                <label
                  htmlFor=""
                  className="block text-gray-700 mb-1 font-medium"
                >
                  Payment Due in (Days)
                </label>
                <div className="flex">
                  <h2 className="border p-1 px-4 border-gray-500 rounded-l-md w-fit">
                    Days
                  </h2>
                  <input
                    type="number"
                    placeholder=""
                    className="border p-1 px-4 border-gray-500 rounded-r-md w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor=""
                  className="block text-gray-700 mb-1 font-medium"
                >
                  Bill Cycle Frequency
                </label>
                <select
                  name=""
                  id=""
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option>Select</option>
                  <option value="one_time">One Time</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half_yearly">Half Yearly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor=""
                  className="block text-gray-700 mb-1 font-medium"
                >
                  Fine
                </label>
                <select
                  name=""
                  id=""
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option>Select</option>
                  <option value="flat">Flat</option>
                  <option value="percentage">Mo</option>
                </select>
              </div>
            </div>
          </div>
          <div className="sm:flex justify-center grid gap-2 my-5 ">
            <button className="bg-black text-white p-2 px-4 rounded-md font-medium">
              Save
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddCAMBillingSetup;
