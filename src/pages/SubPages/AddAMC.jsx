import React, { useEffect, useState } from "react";
import { getSiteAsset, getSoftServices, getVendors, postAMC } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const AddAMC = () => {
  const navigate = useNavigate();
  const [amcFor, setAmcFor] = useState("asset");
  // const today = new Date();
  // const year = today.getFullYear();
  // const month = String(today.getMonth() + 1).padStart(2, "0");
  // const day = String(today.getDate()).padStart(2, "0");
  // const formattedDate = `${year}-${month}-${day}`;
  const [vendors, setVendors] = useState([]);
  const [assets, setAssets] = useState([]);
  const [services, setServices] = useState([]);
    const themeColor = useSelector((state)=> state.theme.color)

  const [formData, setFormData] = useState({
    asset: "",
    service: "",
    vendor_id: "",
    amc_cost: "",
    start_date: "",
    end_date: "",
    first_service: "",
    frequency: "",
    visits: "",
    remarks: "",
  });

  const [contactFiles, setContactFiles] = useState([]);
  const [invoiceFiles, setInvoiceFiles] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "contacts") setContactFiles(files);
    else if (type === "invoice") setInvoiceFiles(files);
  };

  const fetchVendors = async () => {
    try {
      const siteId = getItemInLocalStorage("SITEID");

      if (!siteId) {
        console.log("No Site ID Found");
        return;
      }

      const vendorResp = await getVendors(siteId);

      console.log("VENDOR RESPONSE:", vendorResp.data);

      const vendorData =
        vendorResp?.data?.vendors ||
        vendorResp?.data?.site_vendors ||
        vendorResp?.data?.data ||
        vendorResp?.data ||
        [];

      setVendors(Array.isArray(vendorData) ? vendorData : []);
    } catch (error) {
      console.log("Vendor Error:", error);
    }
  };

  const fetchAssets = async () => {
    try {
      const siteId = getItemInLocalStorage("SITEID");

      if (!siteId) return;

      const assetResp = await getSiteAsset(siteId);

      const assetData =
        assetResp?.data?.site_assets || assetResp?.data?.assets || [];

      setAssets(Array.isArray(assetData) ? assetData : []);
    } catch (error) {
      console.log("Asset Error:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const siteId = getItemInLocalStorage("SITEID");
      if (!siteId) return;

      const serviceResp = await getSoftServices(siteId);

      const serviceData =
        serviceResp?.data?.soft_services || serviceResp?.data?.services || [];

      setServices(Array.isArray(serviceData) ? serviceData : []);
    } catch (error) {
      console.log("Service Error:", error);
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchAssets();
    fetchServices();
  }, []);

  const handleSubmit = async () => {
    if (amcFor === "asset" && !formData.asset) {
toast.error("Please select asset");
      return;
    }

    if (amcFor === "service" && !formData.service) {
toast.error("Please select Service");
      return;
    }

    if (!formData.vendor_id) {
      toast.error("Please select supplier");
      return;
    }
    try {
      const siteId = getItemInLocalStorage("SITEID");

      // Build FormData so files (attachments) are included in multipart request
      const payload = new FormData();
      payload.append("asset_amc[site_id]", siteId);
      payload.append("asset_amc[asset_id]", amcFor === "asset" ? formData.asset : "");
      payload.append("asset_amc[service_id]", amcFor === "service" ? formData.service : "");
      payload.append("asset_amc[vendor_id]", formData.vendor_id);
      payload.append("asset_amc[start_date]", formData.start_date);
      payload.append("asset_amc[end_date]", formData.end_date);
      payload.append("asset_amc[first_service]", formData.first_service);
      payload.append("asset_amc[frequency]", formData.frequency);
      payload.append("asset_amc[visits]", formData.visits);
      payload.append("asset_amc[amc_cost]", formData.amc_cost);
      payload.append("asset_amc[remarks]", formData.remarks);

      // Attach contact files
      contactFiles.forEach((file) => {
        payload.append("asset_amc[attachments][]", file);
      });

      // Attach invoice files
      invoiceFiles.forEach((file) => {
        payload.append("asset_amc[attachments][]", file);
      });

      console.log("Submitting AMC with FormData");

      const response = await postAMC(payload);

      console.log("AMC Saved:", response.data);

      toast.success("AMC Saved Successfully");
      setTimeout(() => {
        navigate("/assets/amc");
      }, 1500);
    } catch (error) {
      console.log("AMC Save Error:", error);
      toast.error("Failed to Save AMC");
    }
  };

  return (
    <section>
       <ToastContainer position="top-right" autoClose={3000} />
      <div className="m-2">
        <h2
          style={{ background: themeColor }}
           className="text-center text-xl font-bold p-2 bg-black rounded-full text-white">
          Add AMC
        </h2>
        <div className="md:mx-20 my-5 mb-10 sm:border border-gray-400 p-5 rounded-lg sm:shadow-xl">
          <h2 className="border-b text-center text-xl border-black mb-6 font-bold">
            Details
          </h2>
          <div className="flex   items-center justify-center gap-4">
            <p className="font-semibold">AMC for :</p>
            <p
              className={`font-medium p-1 px-4 rounded-full cursor-pointer transition-all duration-500 ${
                amcFor === "asset" && "bg-black text-white"
              }`}
              onClick={() => setAmcFor("asset")}
            >
              Asset
            </p>
            <p
              className={`font-medium p-1 px-4 rounded-full cursor-pointer transition-all duration-500 ${
                amcFor === "service" && "bg-black text-white"
              }`}
              onClick={() => setAmcFor("service")}
            >
              Service
            </p>
          </div>
          <div className="flex gap-5 justify-around my-5 ">
            {amcFor === "asset" && (
              <div className="grid md:grid-cols-2 items-center">
                <label className="font-semibold">Select Asset :</label>

                <select
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  name="asset"
                  value={formData.asset}
                  onChange={handleChange}
                >
                  <option value="">Select Asset</option>

                  {assets.length > 0 ? (
                    assets.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No Assets Available</option>
                  )}
                </select>
              </div>
            )}

            {amcFor === "service" && (
              <div className="grid md:grid-cols-2 items-center">
                <label className="font-semibold">Select Service :</label>

                <select
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                >
                  <option value="">Select Service</option>

                  {services.length > 0 ? (
                    services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No Services Available</option>
                  )}
                </select>
              </div>
            )}

            <div className="grid  md:grid-cols-2 items-center">
              <label htmlFor="" className="font-semibold">
                Select Supplier :
              </label>
              <select
                className="border p-1 px-4 border-gray-500 rounded-md w-full"
                value={formData.vendor_id || ""}
                onChange={handleChange}
                name="vendor_id"
              >
                <option value="">Select Supplier</option>

                {vendors && vendors.length > 0 ? (
                  vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {(vendor.vendor_name || vendor.name) +
                        (vendor.company_name
                          ? ` - ${vendor.company_name}`
                          : "")}
                    </option>
                  ))
                ) : (
                  <option disabled>No Suppliers Available</option>
                )}
              </select>
            </div>
          </div>
          <h2 className="border-b text-center text-xl border-black mb-6 font-bold">
            AMC Details
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold">
                Cost :
              </label>
              <input
                type="text"
                name="amc_cost"
                value={formData.amc_cost}
                onChange={handleChange}
                placeholder="Cost"
                className="border p-1 px-4 border-gray-500 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold ">
                Start Date :
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date || ""}
                onChange={handleChange}
                className="border p-1 px-4 border-gray-500 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold ">
                End Date :
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date || ""}
                onChange={handleChange}
                className="border p-1 px-4 border-gray-500 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold ">
                First Service :
              </label>
              <input
                type="date"
                name="first_service"
                value={formData.first_service || ""}
                onChange={handleChange}
                className="border p-1 px-4 border-gray-500 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold ">
                Frequency :
              </label>
              <select
                className="border p-1 px-4 border-gray-500 rounded-md"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
              >
                <option value="">Select frequency</option>
                <option value="yearly">Yearly</option>
                <option value="half_yearly">Half Yearly</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
                <option value="full_payment">Full Payment</option>
                <option value="visit_payment">Visit Based Payment</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="font-semibold ">
                No. Of Visits :
              </label>
              <input
                type="text"
                name="visits"
                value={formData.visits}
                onChange={handleChange}
                className="border p-1 px-4 border-gray-500 rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col my-2">
            <label htmlFor="" className="font-semibold ">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter Remarks!"
              className="border border-black rounded-md px-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <p className="border-b border-black my-1 font-semibold">
                AMC Contacts
              </p>
              <input
                type="file"
                onChange={(event) => handleFileChange(event, "contacts")}
                multiple
              />
            </div>
            <div>
              <p className="border-b border-black my-1 font-semibold">
                AMC Invoice
              </p>
              <input
                type="file"
                onChange={(event) => handleFileChange(event, "invoice")}
                multiple
              />
            </div>
          </div>
          <div className="flex my-5 justify-end gap-3">
            <button
              className="bg-gray-300 text-black p-2 px-4 rounded-md font-medium"
              onClick={() => navigate("/assets/amc")}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-black text-white p-2 px-4 rounded-md font-medium"
            >
              Save & Show Details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddAMC;