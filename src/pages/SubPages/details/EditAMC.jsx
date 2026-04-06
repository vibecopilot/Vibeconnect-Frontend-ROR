import React, { useEffect, useState } from "react";
import {
  getSiteAsset,
  getSoftServices,
  getVendors,
  getEditAMCDetails,
  EditAMCDetails,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const EditAssetAMC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [amcFor, setAmcFor] = useState("asset");

  const [vendors, setVendors] = useState([]);
  const [assets, setAssets] = useState([]);
  const [services, setServices] = useState([]);
  const themeColor = useSelector((state) => state.theme.color)


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

  const fetchVendors = async () => {
    try {
      const siteId = getItemInLocalStorage("SITEID");

      const vendorResp = await getVendors(siteId);

      const vendorData =
        vendorResp?.data?.vendors ||
        vendorResp?.data?.site_vendors ||
        vendorResp?.data ||
        [];

      setVendors(Array.isArray(vendorData) ? vendorData : []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAssets = async () => {
    try {
      const siteId = getItemInLocalStorage("SITEID");

      const assetResp = await getSiteAsset(siteId);

      const assetData =
        assetResp?.data?.site_assets || assetResp?.data?.assets || [];

      setAssets(Array.isArray(assetData) ? assetData : []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServices = async () => {
    try {
      const siteId = getItemInLocalStorage("SITEID");

      const serviceResp = await getSoftServices(siteId);

      const serviceData =
        serviceResp?.data?.soft_services || serviceResp?.data?.services || [];

      setServices(Array.isArray(serviceData) ? serviceData : []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAMCDetails = async () => {
    try {
      const response = await getEditAMCDetails(id);

      const data = response?.data;

      if (!data) return;

      if (data.asset_id) {
        setAmcFor("asset");
      } else {
        setAmcFor("service");
      }

      setFormData({
        asset: data.asset_id || "",
        service: data.service_id || "",
        vendor_id: data.vendor_id || "",
        amc_cost: data.amc_cost || "",
        start_date: data.start_date || "",
        end_date: data.end_date || "",
        first_service: data.first_service || "",
        frequency: data.frequency
          ? data.frequency.toLowerCase().replace(" ", "_")
          : "",
        visits: data.visits || "",
        remarks: data.remarks || "",
      });
    } catch (error) {
      console.log("AMC Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchAssets();
    fetchServices();
    fetchAMCDetails();
  }, [id]);

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

  const handleSubmit = async () => {
    if (amcFor === "asset" && !formData.asset) {
      toast.error("Please select asset");
      return;
    }

    if (amcFor === "service" && !formData.service) {
      toast.error("Please select service");
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
        payload.append("asset_amc[amc_contacts][]", file);
      });

      // Attach invoice files
      invoiceFiles.forEach((file) => {
        payload.append("asset_amc[amc_invoices][]", file);
      });

      // Fixed: was EditAMCDetails(id, payload) — args were swapped
      await EditAMCDetails(payload, id);
      toast.success("AMC Updated Successfully");

      setTimeout(() => {
        navigate("/assets/amc");
      }, 1500);
    } catch (error) {
      console.log("Update Error:", error);
      toast.error("Failed to Update AMC");
    }
  };

  return (
    <section>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="m-2">
        <h2 className="text-center text-xl font-bold p-2 bg-black rounded-full text-white"
          style={{ background: themeColor }}>
          Edit AMC
        </h2>

        <div className="md:mx-20 my-5 mb-10 sm:border border-gray-400 p-5 rounded-lg sm:shadow-xl">

          <h2 className="border-b text-center text-xl border-black mb-6 font-bold">
            Details
          </h2>

          <div className="flex items-center justify-center gap-4">
            <p className="font-semibold">AMC for :</p>

            <p
              className={`font-medium p-1 px-4 rounded-full cursor-pointer ${amcFor === "asset" && "bg-black text-white"
                }`}
              onClick={() => setAmcFor("asset")}
            >
              Asset
            </p>

            <p
              className={`font-medium p-1 px-4 rounded-full cursor-pointer ${amcFor === "service" && "bg-black text-white"
                }`}
              onClick={() => setAmcFor("service")}
            >
              Service
            </p>
          </div>

          <div className="flex gap-5 justify-around my-5">

            {amcFor === "asset" && (
              <div className="grid md:grid-cols-2 items-center">
                <label className="font-semibold">Select Asset :</label>

                <select
                  name="asset"
                  value={formData.asset}
                  onChange={handleChange}
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="">Select Asset</option>

                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {amcFor === "service" && (
              <div className="grid md:grid-cols-2 items-center">
                <label className="font-semibold">Select Service :</label>

                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="">Select Service</option>

                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid md:grid-cols-2 items-center">
              <label className="font-semibold">Select Supplier :</label>

              <select
                name="vendor_id"
                value={formData.vendor_id}
                onChange={handleChange}
                className="border p-1 px-4 border-gray-500 rounded-md"
              >
                <option value="">Select Supplier</option>

                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.vendor_name || vendor.name}
                  </option>
                ))}
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
              Update AMC
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default EditAssetAMC;