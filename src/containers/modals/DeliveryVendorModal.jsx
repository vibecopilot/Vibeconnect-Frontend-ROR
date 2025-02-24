import React, { useEffect, useState } from "react";
import { postVendors, EditVendors } from "../../api";
import ModalWrapper from "./ModalWrapper";
import { toast } from "react-hot-toast";

const DeliveryVendorModal = ({ onclose, title = "Edit", vendor = null }) => {
  const [formData, setFormData] = useState({
    vendor_supplier_id: "",
    vendor_name: "",
    website_url: "",
    address: "",
    email: "",
    mobile: "",
    spoc_person: "",
    aggrement_start_date: "",
    aggremen_start_date: "",
    attachments: null,
    status: "Active",
  });

  // Populate form with existing vendor data
  useEffect(() => {
    if (vendor) {
      setFormData({
        vendor_id: vendor.id || "",
        vendor_name: vendor.vendor_name || "",
        website_url: vendor.website_url || "",
        address: vendor.address || "",
        email: vendor.email || "",
        mobile: vendor.mobile || "",
        spoc_person: vendor.spoc_person || "",
        aggrement_start_date: vendor.aggrement_start_date || "",
        aggremenet_end_date: vendor.aggremenet_end_date || "",
        status: vendor.status || "Active",
        attachments: vendor.attachments || null,
      });
    }
  }, [vendor]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Log the change for debugging
    console.log(
      "Changed field:",
      name,
      "New value:",
      type === "file" ? files[0] : value
    );

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const formDataToSend = new FormData();
  //     formDataToSend.append("vendor_id", formData.vendor_id);
  //     formDataToSend.append("vendor_name", formData.vendor_name);
  //     formDataToSend.append("website_url", formData.website_url);
  //     formDataToSend.append("address", formData.address);
  //     formDataToSend.append("email", formData.email);
  //     formDataToSend.append("mobile", formData.mobile);
  //     formDataToSend.append("spoc_person", formData.spoc_person);
  //     formDataToSend.append("aggremenet_start_date", formData.aggremenet_start_date);
  //     formDataToSend.append("aggremenet_end_date", formData.aggremenet_end_date);
  //     formDataToSend.append("status", formData.status);

  //     // Handle attachments
  //     if (formData.attachments instanceof File) {
  //       formDataToSend.append("attachments", formData.attachments);
  //     }

  //     // API call based on the operation
  //     if (vendor && vendor.id) {
  //       const response = await EditVendors(vendor.id, formDataToSend);
  //       if (response.status === 200) {
  //         toast.success("Vendor updated successfully!");
  //         onclose();
  //       }
  //     } else {
  //       const response = await postVendors(formDataToSend);
  //       if (response.status === 200) {
  //         toast.success("Vendor created successfully!");
  //         onclose();
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     toast.error(error.response?.data?.message || "An error occurred.");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("start");

    try {
      const formDataToSend = new FormData();

      // Wrap all fields in 'vendor' object
      formDataToSend.append("vendor[vendor_id]", formData.vendor_id);
      formDataToSend.append("vendor[vendor_name]", formData.vendor_name);
      formDataToSend.append("vendor[website_url]", formData.website_url);
      formDataToSend.append("vendor[address]", formData.address);
      formDataToSend.append("vendor[email]", formData.email);
      formDataToSend.append("vendor[mobile]", formData.mobile);
      formDataToSend.append("vendor[spoc_person]", formData.spoc_person);
      formDataToSend.append(
        "vendor[aggrement_start_date]",
        formData.aggrement_start_date
      );
      formDataToSend.append(
        "vendor[aggremenet_end_date]",
        formData.aggremenet_end_date
      );
      formDataToSend.append("vendor[status]", formData.status);

      // Handle attachments
      if (formData.attachments instanceof File) {
        formDataToSend.append("vendor[attachments]", formData.attachments);
      }

      // API call based on the operation
      let response;
      if (vendor && vendor.id) {
        response = await EditVendors(vendor.id, formDataToSend);
      } else {
        response = await postVendors(formDataToSend);
      }
       console.log("Response:",response)
      if (response.status === 200) {
        toast.success(
          vendor
            ? "Vendor updated successfully!"
            : "Vendor created successfully!"
        );

        // Log to check if onclose is called
        console.log("Closing the modal..."); // Close modal after successful response
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      onclose();
      console.log("finally");
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
            <label htmlFor="vendor_id" className="text-sm font-bold">
              Vendor ID:
            </label>
            <input
              type="number"
              name="vendor_id"
              id="vendor_id"
              placeholder="Enter Vendor ID"
              value={formData.vendor_id}
              onChange={handleChange}
              className="border rounded-md border-gray-500 p-1 px-2"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="vendor_name" className="text-sm font-bold">
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
            <label htmlFor="website_url" className="text-sm font-bold">
              Website URL:
            </label>
            <input
              type="url"
              name="website_url"
              id="website_url"
              placeholder="Enter Website URL"
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
            <label htmlFor="mobile" className="text-sm font-bold">
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
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="aggremenet_start_date"
              className="text-sm font-bold"
            >
              Agreement Start Date:
            </label>
            <input
              type="date"
              name="aggrement_start_date"
              id="aggrement_start_date"
              value={formData.aggrement_start_date}
              onChange={handleChange}
              className="border rounded-md border-gray-500 p-1 px-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="aggremenet_end_date" className="text-sm font-bold">
              Agreement End Date:
            </label>
            <input
              type="date"
              name="aggremenet_end_date"
              id="aggremenet_end_date"
              value={formData.aggremenet_end_date}
              onChange={handleChange}
              className="border rounded-md border-gray-500 p-1 px-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="attachments" className="text-sm font-bold">
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
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded-md border-gray-500 p-1 px-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="col-span-2 mt-4 flex justify-center">
            <button
              type="submit"
              // onClick={() => showModal(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {vendor && vendor.id ? "Update Vendor" : "Create Vendor"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default DeliveryVendorModal;
