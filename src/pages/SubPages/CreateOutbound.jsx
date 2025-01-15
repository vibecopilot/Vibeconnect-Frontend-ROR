import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";

const CreateOutbound = () => {
  const [modal, showModal] = useState(false);
  const [add, setAdd] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [ouboundRecord, setOutboundRecord] = useState("");
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await getVendors();
        setVendors(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch vendors");
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const onSelect = (value) => {
    console.log(`Selected vendor ID: ${value}`);
  };

  const [formData, setFormData] = useState({
    id: " ",
    vendor_id: "",
    receipant_name: "",
    sender: "",
    mobile_number: "",
    awb_number: "",
    company: "",
    company_address_1: "",
    company_address_2: "",
    state: "",
    city: "",
    pincode: "",
    mail_outbound_type: "",
    receiving_date: "",
    unit: "",
    department_name: "",
    collect_on: "",
    collect_by: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Input Change:", name, value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "state" ? { city: "" } : {}),
    }));
  };
  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await createInbound(formData); // Make POST request
      toast.success("Package created successfully");
      navigate("/mail-room/"); //
      //   if (response.status === 200 || response.status === 201) {
      //     console.log("Success condition met");
      //   }
    } catch (err) {
      toast.error("Error creating package:", err);
      if (err.response?.status === 400) {
        console.log("Bad request, possibly validation error");
      }
    }
  };

  const handleBack = async (event) => {
    navigate("/mail-room/");
  };

  return (
    <section>
      <div className="m-2">
        <h2 className="text-center text-xl font-bold p-2 bg-black rounded-full text-white">
          Create New Outbound Package
        </h2>
        <div className="flex justify-around my-10 mx-20 p-4 rounded-md border-2">
          <div className="flex gap-2 items-center ">
            <label htmlFor="vendorSelect" className="font-semibold text-lg">
              Select Vendor:
            </label>
            <select
              id="vendorSelect"
              onChange={(e) => onSelect(e.target.value)}
              value={vendors.id}
              className="border p-1 px-4 rounded-md border-gray-400"
            >
              <option value="">Select a Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
            <button className="border-2 px-2 p-1 rounded-md font-semibold flex items-center gap-2 border-black">
              <PiPlusCircle />
              Add vendor
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="" className="font-semibold text-lg">
              Sending Date:
            </label>
            <input
              type="date"
              name=""
              id=""
              className="border p-1 px-4 rounded-md border-gray-400"
            />
          </div>
        </div>
        <div className=" my-10">
          <h2 className="border-b text-center text-xl border-black m-5 font-bold">
            Package Details
          </h2>
          <div className="grid grid-cols-4 gap-5 mx-10">
            <div className="flex flex-col">
              <label htmlFor="vendorSelect" className="font-semibold text-lg">
                Select Sender:
              </label>
              <select
                id="vendorSelect"
                onChange={(e) => onSelect(e.target.value)}
                className="border p-1 px-4 rounded-md border-gray-400"
              >
                <option value="">Choose sender</option>
                {vendors.map((recipient) => (
                  <option key={recipient.id} value={recipient.id}>
                    {recipient.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold text-lg">
                Recipient Name:
              </label>
              <input
                id="receipant_name"
                name="receipant_name"
                value={formData.receipant_name}
                onChange={handleInputChange}
                className="border p-1 px-4 rounded-md border-gray-400"
              />
            </div>
            {/* <div className="flex flex-col ">
              <label htmlFor="" className="font-semibold text-lg">
                Mobile:
              </label>
              <input
                type="number"
                name="mobile_number"
                id="mobile_number"
                value={formData.mobile_number}
                className="border p-1 px-4 rounded-md border-gray-400"
              />
            </div> */}
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold text-lg">
                AWB Number:
              </label>
              <input
                type="text"
                name="awb_number"
                value={formData.awb_number}
                id="awb_number"
                className="border p-1 px-4 rounded-md border-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold text-lg">
                Recipient's Email ID:
              </label>
              <input
                type="text"
                name=""
                id=""
                className="border p-1 px-4 rounded-md border-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold text-lg">
                Recipient's Address Line 1 :{" "}
              </label>
              <input
                type="text"
                name=""
                id=""
                className="border p-1 px-4 rounded-md border-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold text-lg">
                Recipient's Address Line 2:
              </label>
              <input
                type="text"
                name=""
                id=""
                className="border p-1 px-4 rounded-md border-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold text-lg">
                State:
              </label>
              <input
                type="text"
                name=""
                id=""
                className="border p-1 px-4 rounded-md border-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold text-lg">
                City:
              </label>
              <input
                type="text"
                name=""
                id=""
                className="border p-1 px-4 rounded-md border-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold text-lg">
                Pin code:
              </label>
              <input
                type="text"
                name=""
                id=""
                className="border p-1 px-4 rounded-md border-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="vendorSelect" className="font-semibold text-lg">
                Type:
              </label>
              <select
                id="vendorSelect"
                onChange={(e) => onSelect(e.target.value)}
                className="border p-1 px-4 rounded-md border-gray-400"
              >
                <option value="">Select Type</option>
                {vendors.map((recipient) => (
                  <option key={recipient.id} value={recipient.id}>
                    {recipient.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-10 my-5">
          <button className="bg-black text-white p-2 rounded-md hover:bg-white hover:text-black hover:border-2 border-black font-semibold">
            Create Package
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateOutbound;
