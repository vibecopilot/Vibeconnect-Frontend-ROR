import React, { useEffect, useState } from "react";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { getMasters, getVendors, postGRN } from "../../api";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddGrn = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const [vendors, setVendors] = useState([]);
  const [invent, setinvent] = useState([]);

  const [inventories, setInventories] = useState([
    {
      item_id: "", // ✅ THIS WILL HOLD MASTER ID
      expected_quantity: "",
      received_quantity: "",
      approved_quantity: "",
      rejected_quantity: "",
      rate: "",
      csgt_rate: "",
      csgt_amt: "",
      sgst_rate: "",
      sgst_amt: "",
      igst_rate: "",
      igst_amt: "",
      tcs_rate: "",
      tcs_amt: "",
      tax_amt: "",
      inventory_amount: "",
      total_amount: "",
      grn_id: "",
      inventory_type: "", // optional (if backend needs)
      criticality: "",
      batches: [{ value: "" }],
    },
  ]);

  const [formData, setFormData] = useState({
    loi_detail_id: "",
    vendor_id: "",
    payment_mode: "",
    invoice_number: "",
    related_to: "",
    invoice_amount: "",
    invoice_date: "",
    posting_date: "",
    other_expenses: "",
    loading_expenses: "",
    adjustment_amount: "",
    notes: "",
    inventory_details: [],
  });

  const navigate = useNavigate();

  const handleAddInventory = () => {
    setInventories((prev) => [
      ...prev,
      {
        item_id: "",
        expected_quantity: "",
        received_quantity: "",
        approved_quantity: "",
        rejected_quantity: "",
        rate: "",
        csgt_rate: "",
        csgt_amt: "",
        sgst_rate: "",
        sgst_amt: "",
        igst_rate: "",
        igst_amt: "",
        tcs_rate: "",
        tcs_amt: "",
        tax_amt: "",
        inventory_amount: "",
        total_amount: "",
        grn_id: "",
        inventory_type: "",
        criticality: "",
        batches: [{ value: "" }],
      },
    ]);
  };

  /** ---------------- vendors ---------------- */
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const vendorResp = await getVendors();
        setVendors(Array.isArray(vendorResp?.data) ? vendorResp.data : []);
      } catch (e) {
        console.log("getVendors error:", e);
        setVendors([]);
      }
    };
    fetchVendors();
  }, []);

  /** ---------------- masters (inventory dropdown) ---------------- */
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const invResp = await getMasters();

        // ✅ your previous mapping (kept)
        const sortedInvData = Array.isArray(invResp?.data)
          ? invResp.data.map((host) => ({
              id: host.id,
              name: host.name,
              type: host.inventory_type,
              criticality: host.criticality,
            }))
          : [];

        setinvent(sortedInvData);
        console.log("Fetched Inventory Masters:", sortedInvData);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setinvent([]);
      }
    };

    fetchInventory();
  }, []);

  /** ---------------- form handlers ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInventoryChange = (index, e) => {
    const { name, value } = e.target;
    setInventories((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  // ✅ Batch handlers
  const handleBatchChange = (invIndex, batchIndex, value) => {
    setInventories((prev) => {
      const updated = [...prev];
      const inv = { ...updated[invIndex] };
      const batches = [...(inv.batches || [])];
      batches[batchIndex] = { ...batches[batchIndex], value };
      inv.batches = batches;
      updated[invIndex] = inv;
      return updated;
    });
  };

  const handleAddBatchField = (invIndex) => {
    setInventories((prev) => {
      const updated = [...prev];
      const inv = { ...updated[invIndex] };
      inv.batches = [...(inv.batches || []), { value: "" }];
      updated[invIndex] = inv;
      return updated;
    });
  };

  const handleDeleteBatch = (invIndex, batchIndex) => {
    setInventories((prev) => {
      const updated = [...prev];
      const inv = { ...updated[invIndex] };
      const batches = [...(inv.batches || [])];
      batches.splice(batchIndex, 1);
      inv.batches = batches.length ? batches : [{ value: "" }];
      updated[invIndex] = inv;
      return updated;
    });
  };

  const handleDeleteInventory = (invIndex) => {
    setInventories((prev) => prev.filter((_, index) => index !== invIndex));
  };

  const calculateTotalAmount = () => {
    return inventories
      .reduce((acc, curr) => acc + (parseFloat(curr.total_amount) || 0), 0)
      .toFixed(2);
  };

  /** ---------------- ✅ SUBMIT FIX ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vendor_id) return toast.error("Please select Supplier");

    // ✅ validate item_id exists
    for (let i = 0; i < inventories.length; i++) {
      if (!inventories[i].item_id) {
        return toast.error(`Please select Inventory in row ${i + 1}`);
      }
    }

    const formDataSend = new FormData();

    formDataSend.append("grn_detail[vendor_id]", formData.vendor_id);
    formDataSend.append("grn_detail[payment_mode]", formData.payment_mode);
    formDataSend.append("grn_detail[invoice_number]", formData.invoice_number);
    formDataSend.append("grn_detail[related_to]", formData.related_to);
    formDataSend.append("grn_detail[invoice_amount]", formData.invoice_amount);
    formDataSend.append("grn_detail[invoice_date]", formData.invoice_date);
    formDataSend.append("grn_detail[posting_date]", formData.posting_date);
    formDataSend.append("grn_detail[other_expenses]", formData.other_expenses);
    formDataSend.append("grn_detail[loading_expenses]", formData.loading_expenses);
    formDataSend.append("grn_detail[adjustment_amount]", formData.adjustment_amount);
    formDataSend.append("grn_detail[notes]", formData.notes);

    // ✅ IMPORTANT: index-based keys so backend receives proper inventory_details array
    inventories.forEach((inventory, i) => {
      // fields (except batches)
      Object.entries(inventory).forEach(([key, value]) => {
        if (key === "batches") return;
        formDataSend.append(`inventory_details[${i}][${key}]`, value ?? "");
      });

      // batches
      (inventory.batches || []).forEach((batch) => {
        formDataSend.append(`inventory_details[${i}][batches][]`, batch?.value ?? "");
      });
    });

    try {
      const response = await postGRN(formDataSend);
      console.log("GRN submitted successfully:", response?.data);

      toast.success("GRN submitted successfully");
      navigate(`/assets/stock-items`);

      // reset
      setFormData({
        loi_detail_id: "",
        vendor_id: "",
        payment_mode: "",
        invoice_number: "",
        related_to: "",
        invoice_amount: "",
        invoice_date: "",
        posting_date: "",
        other_expenses: "",
        loading_expenses: "",
        adjustment_amount: "",
        notes: "",
        inventory_details: [],
      });

      setInventories([
        {
          item_id: "",
          expected_quantity: "",
          received_quantity: "",
          approved_quantity: "",
          rejected_quantity: "",
          rate: "",
          csgt_rate: "",
          csgt_amt: "",
          sgst_rate: "",
          sgst_amt: "",
          igst_rate: "",
          igst_amt: "",
          tcs_rate: "",
          tcs_amt: "",
          tax_amt: "",
          inventory_amount: "",
          total_amount: "",
          grn_id: "",
          inventory_type: "",
          criticality: "",
          batches: [{ value: "" }],
        },
      ]);
    } catch (error) {
      console.error("Error submitting GRN:", error);
      toast.error(error?.response?.data?.error || "Failed to submit GRN");
    }
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
            NEW GRN
          </h2>

          {/* GRN DETAILS */}
          <div className="border-2 flex flex-col my-5 mx-3 p-4 gap-4 rounded-md border-gray-400">
            <h2 className="text-lg border-black font-semibold text-center">
              GRN DETAILS
            </h2>

            <div className="flex sm:flex-row flex-col justify-around items-center">
              <div className="grid md:grid-cols-3 item-start gap-x-4 gap-y-8 w-full">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="vendor_id" className="font-semibold">
                    Supplier:
                  </label>

                  <select
                    className="border p-1 px-4 border-gray-500 rounded-md"
                    value={formData.vendor_id}
                    onChange={handleChange}
                    name="vendor_id"
                    id="vendor_id"
                  >
                    <option value="">Select Supplier</option>
                    {vendors.map((vendor) => (
                      <option value={vendor.id} key={vendor.id}>
                        {vendor.vendor_name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => navigate("/suppliers/add-supplier")}
                    className="self-start mt-1 text-sm text-blue-600 hover:underline"
                  >
                    + Add New Supplier
                  </button>
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold">Payment Mode</label>
                  <select
                    name="payment_mode"
                    value={formData.payment_mode}
                    onChange={handleChange}
                    className="border p-1 px-4 border-gray-500 rounded-md"
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="Cheque">Cheque</option>
                    <option value="RTGS">RTGS</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold">Invoice Number</label>
                  <input
                    type="text"
                    name="invoice_number"
                    placeholder="Enter Number"
                    value={formData.invoice_number}
                    onChange={handleChange}
                    className="border p-1 px-4 border-gray-500 rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold">Related To</label>
                  <input
                    type="text"
                    name="related_to"
                    placeholder="Enter Text"
                    value={formData.related_to}
                    onChange={handleChange}
                    className="border p-1 px-4 border-gray-500 rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold">Invoice Amount</label>
                  <input
                    type="text"
                    name="invoice_amount"
                    placeholder="Enter Number"
                    value={formData.invoice_amount}
                    onChange={handleChange}
                    className="border p-1 px-4 border-gray-500 rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold">Invoice Date</label>
                  <input
                    type="date"
                    name="invoice_date"
                    value={formData.invoice_date}
                    onChange={handleChange}
                    className="border p-1 px-4 border-gray-500 rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold">Posting Date</label>
                  <input
                    type="date"
                    name="posting_date"
                    value={formData.posting_date}
                    onChange={handleChange}
                    className="border p-1 px-4 border-gray-500 rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold">Other Expense</label>
                  <input
                    type="text"
                    name="other_expenses"
                    placeholder="Other Expense"
                    value={formData.other_expenses}
                    onChange={handleChange}
                    className="border p-1 px-4 border-gray-500 rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold">Loading Expense</label>
                  <input
                    type="text"
                    name="loading_expenses"
                    placeholder="Enter Number"
                    value={formData.loading_expenses}
                    onChange={handleChange}
                    className="border p-1 px-4 border-gray-500 rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold">Adjustment Amount</label>
                  <input
                    type="text"
                    name="adjustment_amount"
                    placeholder="Enter Number"
                    value={formData.adjustment_amount}
                    onChange={handleChange}
                    className="border p-1 px-4 border-gray-500 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Notes</label>
              <textarea
                name="notes"
                cols="5"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes"
                className="border p-1 px-4 border-gray-500 rounded-md"
              />
            </div>
          </div>

          {/* INVENTORY DETAILS */}
          <div className="border-2 flex flex-col my-5 mx-3 p-4 gap-4 rounded-md border-gray-400">
            <h2 className="text-lg border-black font-semibold text-center">
              INVENTORY DETAILS
            </h2>

            {inventories.map((inventory, invIndex) => (
              <div key={invIndex} className="mb-8">
                <div className="grid md:grid-cols-3 item-start gap-x-4 gap-y-8 w-full">
                  <div className="flex flex-col">
                    <label className="font-semibold">Inventory</label>

                    {/* ✅ FIX: name=item_id, value=item_id */}
                    <select
                      name="item_id"
                      value={inventory.item_id || ""}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                    >
                      <option value="">Select Inventory</option>
                      {invent.map((m) => (
                        <option value={m.id} key={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">Expected Quantity</label>
                    <input
                      type="text"
                      name="expected_quantity"
                      value={inventory.expected_quantity}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">Received Quantity</label>
                    <input
                      type="text"
                      name="received_quantity"
                      value={inventory.received_quantity}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">Approved Quantity</label>
                    <input
                      type="text"
                      name="approved_quantity"
                      value={inventory.approved_quantity}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">Rejected Quantity</label>
                    <input
                      type="text"
                      name="rejected_quantity"
                      value={inventory.rejected_quantity}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">Rate</label>
                    <input
                      type="text"
                      name="rate"
                      value={inventory.rate}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">CGST Rate</label>
                    <input
                      type="text"
                      name="csgt_rate"
                      value={inventory.csgt_rate}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">CGST Amount</label>
                    <input
                      type="text"
                      name="csgt_amt"
                      value={inventory.csgt_amt}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">SGST Rate</label>
                    <input
                      type="text"
                      name="sgst_rate"
                      value={inventory.sgst_rate}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">SGST Amount</label>
                    <input
                      type="text"
                      name="sgst_amt"
                      value={inventory.sgst_amt}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">IGST Rate</label>
                    <input
                      type="text"
                      name="igst_rate"
                      value={inventory.igst_rate}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">IGST Amount</label>
                    <input
                      type="text"
                      name="igst_amt"
                      value={inventory.igst_amt}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">TCS Rate</label>
                    <input
                      type="text"
                      name="tcs_rate"
                      value={inventory.tcs_rate}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">TCS Amount</label>
                    <input
                      type="text"
                      name="tcs_amt"
                      value={inventory.tcs_amt}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">Total Taxes</label>
                    <input
                      type="text"
                      name="tax_amt"
                      value={inventory.tax_amt}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">Amount</label>
                    <input
                      type="text"
                      name="inventory_amount"
                      value={inventory.inventory_amount}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">Total Amount</label>
                    <input
                      type="text"
                      name="total_amount"
                      value={inventory.total_amount}
                      onChange={(e) => handleInventoryChange(invIndex, e)}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                    />
                  </div>
                </div>

                {(inventory.batches || []).map((batch, batchIndex) => (
                  <div key={batchIndex} className="my-2">
                    <input
                      type="text"
                      placeholder="Enter Batch No."
                      value={batch.value}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      onChange={(e) =>
                        handleBatchChange(invIndex, batchIndex, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteBatch(invIndex, batchIndex)}
                      className="ml-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="text-white p-1 text-lg w-32 rounded-md"
                  style={{ background: themeColor }}
                  onClick={() => handleAddBatchField(invIndex)}
                >
                  Add Batch
                </button>

                <button
                  type="button"
                  className="text-white p-1 text-lg w-64 ml-2 rounded-md"
                  style={{ background: themeColor }}
                  onClick={() => handleDeleteInventory(invIndex)}
                >
                  Delete Inventory
                </button>
              </div>
            ))}

            <button
              type="button"
              className="text-white p-1 text-lg w-32 rounded-md"
              style={{ background: themeColor }}
              onClick={handleAddInventory}
            >
              Add Inventory
            </button>
          </div>

          {/* Attachments */}
          <div className="my-3 mx-5">
            <h2 className="text-lg border-black font-semibold text-start my-5">
              ATTACHMENTS*
            </h2>
            <FileInputBox />
          </div>

          <div className="my-3 mx-5 text-end">
            <button
              type="button"
              className="bg-black text-white p-2 text-small rounded-md"
              style={{ background: themeColor }}
            >
              Total Amount: ₹ {calculateTotalAmount()}
            </button>
          </div>

          <div className="my-10 mx-5 text-center">
            <button
              onClick={handleSubmit}
              className="bg-black text-white px-8 py-2 text-small rounded-md"
              style={{ background: themeColor }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddGrn;
