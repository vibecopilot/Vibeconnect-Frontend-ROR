import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import FileInputBox from "../../../containers/Inputs/FileInputBox";
import { Switch } from "../../../Buttons";

function BillingSetup() {
  const [selectedOption, setSelectedOption] = useState("auto");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="border-b py-5 mx-5 border-black">
          <p className="text-md font-semibold">Logo Setup</p>
        </div>
        <div className="my-5 mx-5">
          <FileInputBox />
          <div className="flex justify-end">
            <button className="border border-gray-500 p-1 px-5 my-3 rounded-md">
              Submit
            </button>
          </div>
        </div>
        <div className="flex gap-5 mx-4">
          <h2>Online Payment Allowed </h2>
          <Switch />
        </div>
        <div className="border-b py-5 mx-5 border-black">
          <p className="text-md font-semibold">Invoice Number</p>
        </div>
        <div className="grid md:grid-cols-2">
          <div className="space-y-5 my-5 mx-5">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="auto"
                value="auto"
                checked={selectedOption === "auto"}
                onChange={handleChange}
              />
              <label htmlFor="auto" className="text-base text-gray-800">
                Continue auto-generating invoice numbers
              </label>
              <div className="flex gap-2">
                <div className="w-24">
                  <input defaultValue="INV" />
                </div>
                <div className="w-24">
                  <input defaultValue="4048" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="manual"
                value="manual"
                checked={selectedOption === "manual"}
                onChange={handleChange}
              />
              <label htmlFor="manual" className="text-base text-gray-800">
                I will add them manually each time
              </label>
            </div>
          </div>
        </div>
        <h2 className="text-md font-semibold my-3 mx-5">Receipt Number</h2>
        <div className="border-t py-5 mx-5 border-black">
          <p className="text-md font-semibold">Invoice Setup</p>
        </div>
        <div className="border-t py-5 mx-5 border-black">
          <p className="text-md font-semibold">Address</p>
        </div>
        <div className="border-t py-5 mx-5 border-black">
          <p className="text-md font-semibold">Breakup Files</p>
        </div>
      </div>
    </section>
  );
}

export default BillingSetup;
