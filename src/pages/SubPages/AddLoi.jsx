// ✅ AddLoi.jsx (FULL UPDATED) — Inventory dropdown fix + safe data parsing + numeric amount calc + attachments safe
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import {
  getAllAddress,
  getInventory,
  getStandardUnits,
  postLOI,
} from "../../api";
import toast from "react-hot-toast";
import { getItemInLocalStorage } from "../../utils/localStorage";
import LOIChanges from "./LOIChanges";
import LOIPOProceed from "./LOIPOProceed";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const AddLoi = () => {
  const [scheduleFor, setScheduleFor] = useState("PO");
  const themeColor = useSelector((state) => state.theme.color);

  const [addresses, setAddresses] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [units, setUnits] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activities, setActivities] = useState([
    {
      inventory: "",
      quantity: "",
      unit: "",
      rate: "",
      Amount: "",
    },
  ]);

  const [formData, setFormData] = useState({
    date: "",
    type: "PO",
    relatedTo: "",
    billingAddress: "",
    deliveryAddress: "",
    attachments: [],
  });

  const siteId = getItemInLocalStorage("SITEID");
  const userId = getItemInLocalStorage("UserId");
  const navigate = useNavigate();

  // ✅ helper: safely read arrays from various response shapes
  const asArray = (resp) => {
    const d = resp?.data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.results)) return d.results;
    return [];
  };

  // ✅ robust label for inventory items
  const getInventoryLabel = (stock) =>
    stock?.name ||
    stock?.item_name ||
    stock?.inventory_name ||
    stock?.material_name ||
    stock?.title ||
    stock?.product_name ||
    (stock?.id ? `Item #${stock.id}` : "Item");

  useEffect(() => {
    const fetchStandardUnits = async () => {
      try {
        const unitResp = await getStandardUnits();
        setUnits(asArray(unitResp));
      } catch (e) {
        console.log(e);
      }
    };
    fetchStandardUnits();
  }, []);

  useEffect(() => {
    const fetchAllAddress = async () => {
      try {
        const addressResp = await getAllAddress();
        setAddresses(asArray(addressResp));
      } catch (error) {
        console.log(error);
      }
    };

    const fetchInventory = async () => {
      try {
        const inventoryResp = await getInventory();
        const list = asArray(inventoryResp);
        // ✅ debug sample once (remove later)
        console.log("Inventory sample:", list?.[0]);
        setStocks(list);
      } catch (error) {
        console.log(error);
        setStocks([]);
      }
    };

    fetchAllAddress();
    fetchInventory();
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    setActivities((prev) => {
      const next = [...prev];
      const row = { ...next[index], [name]: value };

      // ✅ numeric calc (avoid "2" * "" issues)
      const qty = Number(name === "quantity" ? value : row.quantity) || 0;
      const rate = Number(name === "rate" ? value : row.rate) || 0;

      // only recalc if qty/rate fields touched or already present
      if (name === "quantity" || name === "rate") {
        row.Amount = qty && rate ? qty * rate : "";
      }

      next[index] = row;
      return next;
    });
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleAddActivity = () => {
    setActivities((prev) => [
      ...prev,
      {
        inventory: "",
        quantity: "",
        unit: "",
        rate: "",
        Amount: "",
      },
    ]);
  };

  const handleDeleteActivity = (index) => {
    setActivities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (files, fieldName) => {
    const safeFiles = files ? Array.from(files) : [];
    setFormData((p) => ({ ...p, [fieldName]: safeFiles }));
  };

  const handleLoiSubmit = async () => {
    if (!formData.date || !formData.billingAddress || (scheduleFor === "PO" && !formData.deliveryAddress)) {
      return toast.error("Please provide the required details");
    }

    const invalidInventory = activities.some((a) => !a.inventory);
    if (invalidInventory) return toast.error("Inventory is required");

    const sendData = new FormData();
    sendData.append("loi_detail[site_id]", siteId);
    sendData.append("loi_detail[created_by_id]", userId);
    sendData.append("loi_detail[loi_type]", formData.type);
    sendData.append("loi_detail[loi_date]", formData.date);
    sendData.append("loi_detail[related_to]", formData.relatedTo);
    sendData.append("loi_detail[billing_address_id]", formData.billingAddress);

    if (scheduleFor === "PO") {
      sendData.append("loi_detail[delivery_address_id]", formData.deliveryAddress);
    }

    // ✅ attachments
    (Array.isArray(formData.attachments) ? formData.attachments : []).forEach((file) => {
      sendData.append("attachfiles[]", file);
    });

    // ✅ items
    activities.forEach((item) => {
      sendData.append("loi_detail[loi_items][][item_id]", item.inventory);
      sendData.append("loi_detail[loi_items][][quantity]", item.quantity || 0);
      sendData.append("loi_detail[loi_items][][standard_unit_id]", item.unit || "");
      sendData.append("loi_detail[loi_items][][rate]", item.rate || 0);
      sendData.append("loi_detail[loi_items][][amount]", item.Amount || 0);
    });

    const tid = toast.loading("Submitting...");
    try {
      await postLOI(sendData);
      toast.success("LOI Created Successfully", { id: tid });
      navigate("/admin/purchase/loi");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create LOI", { id: tid });
    }
  };

  return (
    <section className="flex">
      <div className="md:block hidden">
        <Navbar />
      </div>

      <div className="w-full flex md:mx-2 overflow-hidden flex-col">
        <div className="m-2">
          <h2
            style={{ background: themeColor }}
            className="text-center text-xl font-bold p-2 rounded-full text-white"
          >
            New LOI
          </h2>

          <div className="md:mx-20 my-5 mb-10 md:border border-gray-400 md:p-5 md:px-10 rounded-lg md:shadow-xl">
            {/* Header inputs */}
            <div className="w-full mx-3 my-5 p-5 md:shadow-lg rounded-lg md:border border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="col-span-1">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="date">
                    Select LOI Date
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="related">
                    Related To
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="related"
                    type="text"
                    name="relatedTo"
                    value={formData.relatedTo}
                    onChange={handleChange}
                    placeholder="Related To"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-gray-700 font-bold mb-2">
                    Select Billing Address
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleChange}
                  >
                    <option value="">Select billing address</option>
                    {Array.isArray(addresses) &&
                      addresses.map((address) => (
                        <option value={address.id} key={address.id}>
                          {address.address_title || address.name || `Address #${address.id}`}
                        </option>
                      ))}
                  </select>
                </div>

                {scheduleFor === "PO" && (
                  <div className="col-span-1">
                    <label className="block text-gray-700 font-bold my-2">
                      Select Delivery Address
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                    >
                      <option value="">Select delivery address</option>
                      {Array.isArray(addresses) &&
                        addresses.map((address) => (
                          <option value={address.id} key={address.id}>
                            {address.address_title || address.name || `Address #${address.id}`}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* PO Activities */}
            {scheduleFor === "PO" && (
              <div className="w-full mx-3 my-5 p-5 shadow-lg rounded-lg border border-gray-300">
                {activities.map((activity, index) => (
                  <div key={index} className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="col-span-1">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor={`activity-${index}`}>
                          Item Details
                        </label>
                        <select
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id={`activity-${index}`}
                          name="inventory"
                          value={activity.inventory}
                          onChange={(e) => handleInputChange(e, index)}
                        >
                          <option value="">Select Inventory</option>
                          {Array.isArray(stocks) &&
                            stocks.map((stock) => (
                              <option value={stock?.id} key={stock?.id}>
                                {getInventoryLabel(stock)}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="col-span-1">
                        <label className="block text-gray-700 font-bold mb-2">
                          Quantity
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="number"
                          value={activity.quantity}
                          placeholder="Quantity"
                          name="quantity"
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      </div>

                      <div className="col-span-1">
                        <label className="block text-gray-700 font-bold mb-2">
                          Select Unit
                        </label>
                        <select
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={activity.unit}
                          name="unit"
                          onChange={(e) => handleInputChange(e, index)}
                        >
                          <option value="">Select Unit</option>
                          {Array.isArray(units) &&
                            units.map((unit) => (
                              <option value={unit.id} key={unit.id}>
                                {unit.unit_name || unit.name || `Unit #${unit.id}`}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="col-span-1">
                        <label className="block text-gray-700 font-bold mb-2">
                          Rate
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="number"
                          placeholder="Rate"
                          value={activity.rate}
                          name="rate"
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      </div>

                      <div className="col-span-1">
                        <label className="block text-gray-700 font-bold mb-2">
                          Amount
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                          type="text"
                          placeholder="Amount"
                          value={activity.Amount}
                          name="Amount"
                          readOnly
                        />
                      </div>
                    </div>

                    {activities.length > 1 && (
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={() => handleDeleteActivity(index)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleAddActivity}
                  >
                    Add Inventory
                  </button>
                </div>

                <h3 className="border-b text-center text-xl border-black mb-6 font-bold mt-8">
                  ATTACHMENTS
                </h3>

                <FileInputBox
                  handleChange={(files) => handleFileChange(files, "attachments")}
                  fieldName={"attachments"}
                  isMulti={true}
                />

                <div className="sm:flex justify-center grid gap-2 my-5">
                  {isModalOpen && (
                    <div
                      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <div
                        className="bg-white p-5 max-h-[90%] overflow-y-auto hide-scrollbar rounded-md shadow-md w-2/3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LOIPOProceed />
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => setIsModalOpen(false)}
                            className="bg-red-400 text-white font-medium p-2 px-4 rounded-md mx-2"
                            type="button"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    className="bg-black text-white p-2 px-4 rounded-md font-medium"
                    onClick={handleLoiSubmit}
                    style={{ background: themeColor }}
                    type="button"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}

            {scheduleFor === "WO" && <LOIChanges />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddLoi;
