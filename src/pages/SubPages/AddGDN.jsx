import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { getGDNConsumingSetup, getGDNPurposeSetup, getMasters, getSetupUsers, getSiteAsset, getSoftServices, postGDN } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";

const AddGdn = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [gdnDate, setGdnDate] = useState("");
  const userid = getItemInLocalStorage("UserId");
  const [description, setDescription] = useState("");
  const [invent, setInvent] = useState([]);
  const[asset,setasset]=useState([]);
  const[services,setservices]=useState([]);
  const[purpose,setpurpose]=useState([]);
  const[consuming,setconsuming]=useState([]);

  const [assignedUser, setAssignedUser] = useState([]);
  const [inventoryDetails, setInventoryDetails] = useState([
    {
      inventoryId: "",
      quantity: "",
      purpose: "",
      consumingIn: "",
      asset: "",
      service: "",
      handedOverTo: "",
      comments: "",
    },
  ]);
  useEffect(() => {
    const fetchAssignedTo = async () => {
      try {
        const response = await getSetupUsers();
  
        // Assuming response.data is an array of user objects
        const formattedUsers = response.data.map(user => ({
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
        }));
  
        setAssignedUser(formattedUsers);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };
  
    fetchAssignedTo();
  }, []);
  useEffect(() => {
    const fetchAssignedTo = async () => {
      try {
        const response = await getSoftServices();
  
        // Assuming response.data is an array of user objects
        const formattedUsers = response.data.map(user => ({
          id: user.id,
          name: user.name,
          
        }));
  
        setservices(formattedUsers);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };
  
    fetchAssignedTo();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("gdn_detail[gdn_date]", gdnDate);
    formData.append("gdn_detail[description]", description);
    formData.append("gdn_detail[status]", "active"); 
    formData.append("gdn_detail[created_by_id]", userid); 

    // Append inventory details
    inventoryDetails.forEach((item, index) => {
      formData.append(`gdn_inventory_details[][inventory]`, item.inventoryId);
      formData.append(`gdn_inventory_details[][quantity]`, item.quantity);
      formData.append(`gdn_inventory_details[][purpose_id]`, item.purpose);
      formData.append(`gdn_inventory_details[][consuming_in_id]`, item.consumingIn);
      formData.append(`gdn_inventory_details[][asset_id]`, item.asset);
      formData.append(`gdn_inventory_details[][service_id]`, item.service);
      formData.append(`gdn_inventory_details[][handover_to_id]`, item.handedOverTo);
      formData.append(`gdn_inventory_details[][comments]`, item.comments);
    });

    try {
      const response = await postGDN(formData);
      if (response.status === 200) {
        alert("GDN added successfully!");
      } else {
        console.error("Failed to submit GDN");
      }
    } catch (error) {
      console.error("Error submitting GDN:", error);
    }
  };
  useEffect(() => {
    const fetchAssignedTo = async () => {
      try {
        const response = await getGDNConsumingSetup();
  
        // Assuming response.data is an array of user objects
        const formattedUsers = response.data.map(user => ({
          id: user.id,
          name: user.name,
          
        }));
  
        setconsuming(formattedUsers);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };
  
    fetchAssignedTo();
  }, []);
  useEffect(() => {
    const fetchAssignedTo = async () => {
      try {
        const response = await getGDNPurposeSetup();
  
        // Assuming response.data is an array of user objects
        const formattedUsers = response.data.map(user => ({
          id: user.id,
          name: user.name,
          
        }));
  
        setpurpose(formattedUsers);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };
  
    fetchAssignedTo();
  }, []);
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const response = await getSiteAsset();
  
        // Assuming response.data is an array of user objects
        const formattedUsers = response.data.site_assets.map(user => ({
          id: user.id,
          name: user.name,
          
        }));
  console.log("asset show",response);
        setasset(formattedUsers);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };
  
    fetchAsset();
  }, []);
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const invResp = await getMasters();

        // Ensure invResp.data is an array and map the required fields
        const sortedInvData = Array.isArray(invResp.data)
          ? invResp.data.map((host) => ({
              id: host.id,
              name: host.name,
              type: host.inventory_type,
            }))
          : [];

        setInvent(sortedInvData);

        console.log("Fetched Inventory:", sortedInvData);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, []);

  // Handler to add a new inventory row
  const handleAddInventory = () => {
    setInventoryDetails([
      ...inventoryDetails,
      {
        inventoryId: "",
        quantity: "",
        purpose: "",
        consumingIn: "",
        asset: "",
        service: "",
        handedOverTo: "",
        comments: "",
      },
    ]);
  };

  // Handler to remove an inventory row
  const handleRemoveInventory = (index) => {
    const updatedDetails = [...inventoryDetails];
    updatedDetails.splice(index, 1);
    setInventoryDetails(updatedDetails);
  };

  // Handler to update inventory details
  const handleChange = (index, field, value) => {
    const updatedDetails = [...inventoryDetails];
    updatedDetails[index][field] = value;
    setInventoryDetails(updatedDetails);
  };

  return (
    <section>
      <div className="flex">
        <Navbar />
        <div className="md:mx-20 my-2 mb-10 sm:border border-gray-400 p-5 px-10 rounded-lg w-full">
          <h2
            className="text-center text-xl font-bold p-2 bg-black rounded-full text-white mb-4"
            style={{ background: themeColor }}
          >
            Add GDN
          </h2>
          <div className="w-full flex flex-col overflow-hidden">
            {/* Basic Details Section */}
            <div className="border-2 flex flex-col my-5 mx-5 p-4 gap-4 rounded-md border-gray-400">
              <h2 className="border-b-2 border-gray-400 font-semibold">
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
                      value={gdnDate} 
                      onChange={(e) => setGdnDate(e.target.value)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="" className="font-semibold my-1">
                      Description
                    </label>
                    <textarea
                      placeholder="GDN Description"
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      rows="1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Details Section */}
            <div className="border-2 flex flex-col my-5 mx-5 p-4 gap-4 rounded-md border-gray-400">
              <h2 className="border-b-2 border-gray-400 font-semibold">
                Inventory Details
              </h2>
              {inventoryDetails.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-around  gap-4 mb-4"
                >
                  <div className="grid grid-cols-3 gap-4 w-full">
                  <div className="flex flex-col w-full">
                    <label className="font-semibold my-1">Inventory</label>
                    <select
                      value={item.inventoryId}
                      onChange={(e) =>
                        handleChange(index, "inventoryId", e.target.value)
                      }
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    >
                      <option value="">Select Inventory</option>
                      {invent.map((supplier) => (
                        <option value={supplier.id} key={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="font-semibold my-1">Quantity</label>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) =>
                        handleChange(index, "quantity", e.target.value)
                      }
                      placeholder="Quantity"
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>
                  <div className="flex flex-col">
                <label htmlFor="" className="font-semibold my-1">
                  Purpose
                </label>
                <select
                  value={item.purpose}
                  onChange={(e) =>
                    handleChange(index, "purpose", e.target.value)
                  }
                  
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="">Select Purpose</option>
                  {purpose.map((supplier) => (
                        <option value={supplier.id} key={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                </select>
              </div>
              {item.purpose === "42" && (
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold my-1">
                  Select Consuming in
                </label>
                <select
                   value={item.consumingIn}
                   onChange={(e) =>
                     handleChange(index, "consumingIn", e.target.value)
                   }
                  
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="">Select Consuming in</option>
                  {consuming.map((supplier) => (
                        <option value={supplier.id} key={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                  
                </select>
              </div>
              )}
{(item.purpose === "42" && item.consumingIn == "47") && (
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold my-1">
                  Select Asset
                </label>
                <select
                   value={item.asset}
                   onChange={(e) =>
                     handleChange(index, "asset", e.target.value)
                   }
                  
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="">Select Asset</option>
                  {asset.map((supplier) => (
                        <option value={supplier.id} key={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                  
                </select>
              </div>
)}
{(item.purpose === "42" && item.consumingIn == "48") && (
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold my-1">
                  Select Service
                </label>
                <select
                   value={item.service}
                   onChange={(e) =>
                     handleChange(index, "service", e.target.value)
                   }
                  
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="">Select Service</option>
                  {services.map((supplier) => (
                        <option value={supplier.id} key={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                  
                </select>
              </div>
)}
{(item.purpose === "42" || item.purpose === "43") && (
                  <div className="flex flex-col w-full">
                    <label className="font-semibold my-1">Handed Over to</label>
                    <select
                      value={item.handedOverTo}
                      onChange={(e) =>
                        handleChange(index, "handedOverTo", e.target.value)
                      }
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    >
                      <option value="">Handed Over to</option>
                      {assignedUser?.map((assign) => (
                  <option key={assign.id} value={assign.id}>
                    {assign.firstname} {assign.lastname}
                  </option>
                ))}
                    </select>
                  </div>
)}
                  <div className="flex flex-col  ">
                <label htmlFor="" className="font-semibold my-1">
                  Comments
                </label>
                <textarea
                  name=""
                  value={item.comments}
                      onChange={(e) =>
                        handleChange(index, "comments", e.target.value)
                      }
                  id=""
                  cols="5"
                  rows="1"
                  placeholder="Comments"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              </div>
                  <button
                    className="w-8 text-white p-2 rounded-md"
                    onClick={() => handleRemoveInventory(index)} style={{ background: themeColor }}
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddInventory}
                className="w-48 text-white px-4 py-2 rounded-md flex items-center gap-2" style={{ background: themeColor }}
              >
                <IoMdAdd /> Add Inventory
              </button>
            </div>

            {/* Submit Button */}
            <div className="my-10 mx-5 text-center">
              <button onClick={handleSubmit}  className="bg-black text-white px-8 py-2 rounded-md" style={{ background: themeColor }}>
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
