import React, { useEffect, useState } from "react";
import { 
  editHrmsFixedDeduction,
  getHrmsFixedDeductionDetailsId
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";

const EditFixedDeductionModal = ({ EditId, fetchFixedDeduction, closeModal }) => {
  const [name, setName] = useState("");
  const [deductionType, setDeductionType] = useState("fixed");
  const [percentageOfSalary, setPercentageOfSalary] = useState("0.00");
  const [value, setValue] = useState("0.00");
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");

  useEffect(() => {
    const fetchDeductions = async () => {
      try {
        const res = await getHrmsFixedDeductionDetailsId(EditId);
        console.log("Response getting the details of specific id", res);
        setName(res.name);
        setDeductionType(res.deduction_type);
        setPercentageOfSalary(res.percentage_of_salary);
        setValue(res.value);
      } catch (error) {
        console.log(error);
        toast.error("Error fetching deduction details");
      }
    };
    fetchDeductions();
  }, [EditId]);

  const handleEditFixedDeduction = async () => {
    if (!name) {
      return toast.error("Please provide a name");
    }
    if (deductionType === "percentage" && !percentageOfSalary) {
      return toast.error("Please provide percentage of salary");
    }
    if (deductionType === "fixed" && !value) {
      return toast.error("Please provide fixed value");
    }
  
    const postData = {
      name: name,
      deduction_type: deductionType,
      percentage_of_salary: deductionType === "percentage" ? percentageOfSalary : "0.00",
      value: deductionType === "fixed" ? value : "0.00",
      organization: hrmsOrgId
    };
  
    try {
      const res = await editHrmsFixedDeduction(EditId, postData); // Note: EditId first, then data
      fetchFixedDeduction();
      closeModal();
      toast.success("Deduction updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error updating deduction");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
      <div className="max-h-screen h-30 bg-white p-2 w-[30rem] px-3 rounded-lg shadow-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Fixed Deduction</h2>
        <div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Deduction name"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Deduction Type <span className="text-red-400">*</span>
            </label>
            <select
              value={deductionType}
              onChange={(e) => setDeductionType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="fixed">Fixed Amount</option>
              <option value="percentage">Percentage of Salary</option>
            </select>
          </div>

          {deductionType === "fixed" ? (
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Value <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Fixed amount"
                step="0.01"
                min="0"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Percentage of Salary <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={percentageOfSalary}
                onChange={(e) => setPercentageOfSalary(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Percentage"
                step="0.01"
                min="0"
                max="100"
              />
            </div>
          )}

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
              onClick={handleEditFixedDeduction}
              className="border-2 font-semibold hover:bg-green-400 hover:text-green-500 hover:bg-opacity-30 flex items-center gap-2  duration-150 transition-all border-green-400 rounded-full p-1 px-3 text-green-400"
            >
              <FaCheck /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFixedDeductionModal;