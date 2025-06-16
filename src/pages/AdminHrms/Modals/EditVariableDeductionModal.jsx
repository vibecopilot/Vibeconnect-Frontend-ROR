import React, { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import { getItemInLocalStorage } from '../../../utils/localStorage'
import { getHrmsFixedDeductionDetailsId ,
    editHrmsFixedDeduction
} from '../../../api'
import toast from 'react-hot-toast'

 
const EditVariableDeductionModal = ({EditId , closeModal , fetchVariableDeductions}) => {
    const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
    const [formdata, setFormData] = useState({
        name:"",
        deduction_type:"variable",
        percentage_of_salary: "0.00",
        value:"0.00",
        organization:hrmsOrgId
    })
    const [loading , setLoading] = useState(false);
    
    useEffect(()=>{
        const fetchAllowanceData = async () =>{
            if (!EditId) {
                toast.error("No allowance ID provided");
                closeModal();
                return;
              }
              setLoading(true);
              try {
                const data = await getHrmsFixedDeductionDetailsId(EditId);
                console.log("specific data",data)
                setFormData({
                    name:data.name || "",
                    deduction_type: data.deduction_type || "variable",
                    percentage_of_salary: data.percentage_of_salary || "0.00",
          value: data.value || "0.00",
          organization: data.organization || hrmsOrgId
                })
              } catch (error) {
                console.error("Error fetching allowance data:", error);
        toast.error("Failed to load deduction data");
        closeModal();
              } finally{
                setLoading(false)
              }
        }
        fetchAllowanceData()
    },[EditId, closeModal, hrmsOrgId])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };

      const handleSubmit = async (e) =>{
        e.preventDefault();

        if(!EditId){
            toast.error("No allowance Id Provided")
            return
        }

        if (!formdata.name) {
             toast.error("Please enter a name");
             return;
           }
       
           if (!formdata.value) {
             toast.error("Please enter a value");
             return;
           }
           setLoading(true)
           try {
            await editHrmsFixedDeduction(EditId , formdata)
            fetchVariableDeductions();
            closeModal();
           } catch (error) {
            console.error("Error updating allowance:", error);
                  toast.error(error.response?.data?.message || "Failed to update allowance");
           }
           finally{
            setLoading(false)
           }
      };

      if (loading) {
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p>Loading...</p>
            </div>
          </div>
        );
      }
  return (
    <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-black bg-opacity-50">
          <div className="max-h-[100%] bg-white p-8 w-2/3 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold border-b mb-2">Edit Variable Allowance</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-5 my-5 max-h-96 overflow-y-auto p-1">
                <div className="grid gap-2 items-center w-full">
                  <label className="block mb-1 font-semibold">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formdata.name}
                    onChange={handleChange}
                    name="name"
                    placeholder="Allowance name"
                    required
                  />
                </div>
    
                <div className="grid gap-2 items-center w-full">
                  <label className="block mb-1 font-semibold bg-gray-100 opacity-55">
                    Component Type
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100 opacity-55"
                    value="Variable"
                    readOnly
                    disabled
                  />
                </div>
    
                <div className="grid gap-2 items-center w-full">
                  <label className="block mb-1 font-semibold text ">
                    Percentage of CTC
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300  rounded"
                    value={formdata.percentage_of_salary}
                    onChange={handleChange}
                    name="percentage_of_salary"
                    placeholder="0.00"
                    step="0.01"
                    
                  />
                </div>
    
                {/* <div className="grid gap-2 items-center w-full">
                  <label className="block mb-1 font-semibold bg-gray-100 opacity-55">
                    Value 
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 bg-gray-100 opacity-55 rounded"
                    value={formData.value}
                    onChange={handleChange}
                    name="value"
                    placeholder="0.00"
                    step="0.01"
                    disabled
                  />
                </div> */}
              </div>
              <div className="flex mt-2 justify-end gap-2 p-1 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="border-2 font-semibold hover:bg-red-400 hover:text-red-500 hover:bg-opacity-30 flex items-center gap-2 duration-150 transition-all border-red-400 rounded-full p-1 px-3 text-red-400"
                  disabled={loading}
                >
                  <MdClose /> Cancel
                </button>
                <button
                  type="submit"
                  className="border-2 font-semibold hover:bg-green-400 hover:text-green-500 hover:bg-opacity-30 flex items-center gap-2 duration-150 transition-all border-green-400 rounded-full p-1 px-3 text-green-400"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (<><FaCheck /> Save</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
  )
}

export default EditVariableDeductionModal
