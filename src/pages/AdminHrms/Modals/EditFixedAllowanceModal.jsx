import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { 
  getHrmsFixedAllowanceDetailsId,
  editHrmsFixedAllowanceDetails
} from "../../../api";
import toast from "react-hot-toast";
import { getItemInLocalStorage } from "../../../utils/localStorage";

const EditFixedAllowanceModal = ({ EditId, closeModal, fetchFixedAllowance }) => {
  const [formData, setFormData] = useState({
    name: "",
    component_type: "fixed",
    percentage_of_ctc: "0.00",
    value: "0.00",
    organization: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchFixedAllowanceDetails = async () => {
      try {
        const res = await getHrmsFixedAllowanceDetailsId(EditId);
        console.log("Data fetched for editing:", res);
        
        setFormData({
          name: res.name || "",
          component_type: res.component_type || "fixed",
          percentage_of_ctc: res.percentage_of_ctc || "0.00",
          value: res.value || "0.00",
          organization: res.organization || getItemInLocalStorage("HRMSORGID")
        });
      } catch (error) {
        console.error("Error fetching allowance details:", error);
        toast.error("Failed to load allowance details");
      }
    };
    
    fetchFixedAllowanceDetails();
  }, [EditId]);

  const handleEditFixedAllowance = async () => {
    const { name, value } = formData;

    if (!name) {
      toast.error("Please enter a name.");
      return;
    }

    if (!value) {
      toast.error("Please enter a value.");
      return;
    }

    try {
      const postData = {
        name: formData.name,
        component_type: formData.component_type,
        percentage_of_ctc: formData.percentage_of_ctc,
        value: formData.value,
        organization: formData.organization
      };
    console.log("Sending update with:", {
      id: EditId,
      data: postData
    });

      await editHrmsFixedAllowanceDetails(postData ,EditId);
      closeModal();
      toast.success("Fixed Allowance updated successfully");
      fetchFixedAllowance();
    } catch (error) {
      console.error("Error updating allowance:", error);
      toast.error("Failed to update fixed allowance");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-black bg-opacity-50">
      <div className="max-h-[100%] bg-white p-8 w-2/3 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold border-b mb-2">Edit Fixed Allowance</h2>
        <div>
          <div className="grid md:grid-cols-2 gap-5 my-5 max-h-96 overflow-y-auto p-1">
            <div className="grid gap-2 items-center w-full">
              <label className="block mb-1 font-semibold">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300  rounded"
                value={formData.name}
                onChange={handleChange}
                name="name"
                placeholder="Allowance name"
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label className="block mb-1 font-semibold bg-gray-100 opacity-55 ">
                Component Type
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded bg-gray-100 opacity-55"
                value="Fixed"
                readOnly
                disabled
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label className="block mb-1 font-semibold text bg-gray-100 opacity-55">
                Percentage of CTC
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 bg-gray-100 opacity-55 rounded"
                value={formData.percentage_of_ctc}
                onChange={handleChange}
                name="percentage_of_ctc"
                placeholder="0.00"
                step="0.01"
                disabled
              />
              
            </div>

            <div className="grid gap-2 items-center w-full">
              <label className="block mb-1 font-semibold">
                Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.value}
                onChange={handleChange}
                name="value"
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>
          <div className="flex mt-2 justify-end gap-2 p-1 border-t">
            <button
              type="button"
              onClick={closeModal}
              className="border-2 font-semibold hover:bg-red-400 hover:text-red-500 hover:bg-opacity-30 flex items-center gap-2 duration-150 transition-all border-red-400 rounded-full p-1 px-3 text-red-400"
            >
              <MdClose /> Cancel
            </button>
            <button
              type="button"
              onClick={handleEditFixedAllowance}
              className="border-2 font-semibold hover:bg-green-400 hover:text-green-500 hover:bg-opacity-30 flex items-center gap-2 duration-150 transition-all border-green-400 rounded-full p-1 px-3 text-green-400"
            >
              <FaCheck /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFixedAllowanceModal;