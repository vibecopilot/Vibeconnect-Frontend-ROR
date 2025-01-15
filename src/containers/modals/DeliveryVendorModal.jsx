import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { postVendors, EditVendors, getVendors } from "../../api";
import ModalWrapper from "./ModalWrapper";

const DeliveryVendorModal = ({ onclose, title = "Edit", vendor = null }) => {
  const [formData, setFormData] = useState({
    vendor_name: "",
    website_url: "",
    address: "",
    email: "",
    mobile: "",
    spoc_person: "",
    aggrement_start_date: "",
    aggremenet_end_date: "",
    attachment: null,
    status: " ",
    attachments: " ",
  });

  // Populate form with existing vendor data when editing
  useEffect(() => {
    if (vendor) {
      setFormData({
        vendor_name: vendor.vendor_name || "",
        website_url: vendor.website_url || "",
        address: vendor.address || "",
        email: vendor.email || "",
        mobile: vendor.mobile || "",
        spoc_person: vendor.spoc_person || "",
        aggrement_start_date: vendor.aggrement_start_date || "",
        aggremenet_end_date: vendor.aggremenet_end_date || "",
        active: vendor.active || "",
        attachments: vendor.attachments || "",
      });
    }
  }, [vendor]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (vendor && vendor.id) {
        // Update existing vendor
        await EditVendors(id, vendorData);
      } else {
        // Create new vendor
        await postVendors(formData);
      }
      // Close modal and refresh the vendor list
      onclose();
    } catch (error) {
      console.error("Error submitting vendor:", error);
      alert("Failed to submit vendor. Please check your inputs.");
    }
  };

  return (
    <ModalWrapper onclose={onclose}>
      <div className="flex flex-col gap-4 z-10">
        <h1 className="font-semibold text-center text-xl">{title} Vendor</h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 px-5 gap-x-5 gap-y-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-bold">
              Vendor Name:
            </label>
            <input
              type="text"
              name="vendor_name"
              id="vendor_name"
              placeholder="Enter Vendor Name"
              value={formData.vendor_name}
              onChange={handleChange}
              className="border rounded-md border-gray-500 p-1 px-2"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="website_link" className="text-sm font-bold">
              Website Url:
            </label>
            <input
              type="url"
              name="website_url"
              id="website_url"
              placeholder="Enter Website Link"
              value={formData.website_url}
              onChange={handleChange}
              className="border rounded-md border-gray-500 p-1 px-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="address" className="text-sm font-bold">
              Address:
            </label>
            <textarea
              name="address"
              id="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
              className="border rounded-md border-gray-500 p-1 px-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-bold">
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-md border-gray-500 p-1 px-2"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-bold">
              Phone:
            </label>
            <input
              type="tel"
              name="mobile"
              id="mobile"
              placeholder="Enter Phone Number"
              value={formData.mobile}
              onChange={handleChange}
              className="border rounded-md border-gray-500 p-1 px-2"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="spoc_person" className="text-sm font-bold">
              SPOC Person:
            </label>
            <input
              type="text"
              name="spoc_person"
              id="spoc_person"
              placeholder="Enter SPOC Person"
              value={formData.spoc_person}
              onChange={handleChange}
              className="border rounded-md border-gray-500 p-1 px-2"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="agreement_start_date" className="text-sm font-bold">
              Agreement Start Date:
            </label>
            <input
              type="date"
              name="aggrement_start_date"
              id="aggrement_start_date"
              value={formData.aggrement_start_date}
              onChange={handleChange}
              className="border rounded-md border-gray-500 p-1 px-2"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="agreement_end_date" className="text-sm font-bold">
              Agreement End Date:
            </label>
            <input
              type="date"
              name="aggremenet_end_date"
              id="aggremenet_end_date"
              value={formData.aggremenet_end_date}
              onChange={handleChange}
              className="border rounded-md border-gray-500 p-1 px-2"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="agreement_attachment" className="text-sm font-bold">
              Agreement Attachment:
            </label>
            <input
              type="file"
              accept="image/*"
              name="attachments"
              id="attachments"
              onChange={handleChange}
              className="border rounded-md border-gray-500 p-1 px-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="text-sm font-bold">
              Status:
            </label>
            <input
              name="active"
              id="active"
              value={formData.active}
              onChange={handleChange}
              className="border rounded-md border-gray-500 p-1 px-2"
            ></input>
          </div>
          <button
            type="submit"
            // onClick
            className="col-span-2 bg-black p-2 px-4 text-white rounded-md my-5"
          >
            Submit
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default DeliveryVendorModal;
