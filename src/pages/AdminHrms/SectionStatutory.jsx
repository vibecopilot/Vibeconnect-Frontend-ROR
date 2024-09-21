import React, { useState, useRef } from "react";
import EmployeeSections from "./EmployeeSections";
import EditEmployeeDirectory from "./EditEmployeeDirectory";
import Collapsible from "react-collapsible";
import CustomTrigger from "../../containers/CustomTrigger";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SectionStatutory = () => {
  const {id} = useParams()
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const themeColor = useSelector((state) => state.theme.color);
  const [formData, setFormData] = useState({
    pf: false,
    esic: false,
    pt: false,
    lwf: false,
    IT: false,
    gratuity: false,
    nps: false,
    taxRegime: "",
    decimalPoint: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col ml-20">
      <EditEmployeeDirectory />
      <div className="flex">
        <div className="">
          <EmployeeSections empId={id} />
        </div>
        <div className=" w-full mt-10 p-5  rounded-md">
          <Collapsible
            readOnly
            trigger={
              <CustomTrigger isOpen={isOpen}>
                <h2 className="text-xl font-semibold ">Statutory</h2>
              </CustomTrigger>
            }
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            className="bg-gray-100 my-4 p-2 rounded-md font-bold "
          >
          <div className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="border-2 rounded-full p-1 transition-all duration-150 hover:bg-opacity-30 border-green-400  px-4 text-green-400 mb-2 hover:bg-green-300 font-semibold  "
                    // onClick={handleEditEmployeeBasicInfo}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="border-2 rounded-full p-1 border-red-400  px-4 text-red-400 mb-2 hover:bg-opacity-30 hover:bg-red-300 font-semibold  "
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="bg-black text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-6">
              Statutory Setting Information
            </h2>
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">
                    PF Applicable
                  </label>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="pf"
                      className="mr-2"
                      checked={formData.pf === true}
                      onChange={() => setFormData({ ...formData, pf: true })}
                      disabled={!isEditing}
                    />
                    <label className="mr-4">Yes</label>
                    <input
                      type="radio"
                      name="pf"
                      className="mr-2"
                      checked={formData.pf === false}
                      onChange={() => setFormData({ ...formData, pf: false })}
                      disabled={!isEditing}
                    />
                    <label>No</label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">
                    ESIC Applicable
                  </label>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="ESIC"
                      className="mr-2"
                      checked={formData.esic === true}
                      onChange={() => setFormData({ ...formData, esic: true })}
                      disabled={!isEditing}
                    />
                    <label className="mr-4">Yes</label>
                    <input
                      type="radio"
                      name="ESIC"
                      className="mr-2"
                      checked={formData.esic === false}
                      onChange={() => setFormData({ ...formData, esic: false })}
                      disabled={!isEditing}
                    />
                    <label>No</label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">
                    PT Applicable
                  </label>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="PT"
                      className="mr-2"
                      checked={formData.pt === true}
                      onChange={() => setFormData({ ...formData, pt: true })}
                      disabled={!isEditing}
                    />
                    <label className="mr-4">Yes</label>
                    <input
                      type="radio"
                      name="PT"
                      className="mr-2"
                      checked={formData.pt === false}
                      onChange={() => setFormData({ ...formData, pt: false })}
                      disabled={!isEditing}
                    />
                    <label>No</label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">
                    LWF Applicable
                  </label>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="LWF"
                      className="mr-2"
                      checked={formData.lwf === true}
                      onChange={() => setFormData({ ...formData, lwf: true })}
                      disabled={!isEditing}
                    />
                    <label className="mr-4">Yes</label>
                    <input
                      type="radio"
                      name="LWF"
                      className="mr-2"
                      checked={formData.lwf === false}
                      onChange={() => setFormData({ ...formData, lwf: false })}
                      disabled={!isEditing}
                    />
                    <label>No</label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">
                    IT Applicable
                  </label>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="IT"
                      className="mr-2"
                      checked={formData.IT === true}
                      onChange={() => setFormData({ ...formData, IT: true })}
                      disabled={!isEditing}
                    />
                    <label className="mr-4">Yes</label>
                    <input
                      type="radio"
                      name="IT"
                      className="mr-2"
                      checked={formData.IT === false}
                      onChange={() => setFormData({ ...formData, IT: false })}
                      disabled={!isEditing}
                    />
                    <label>No</label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Gratuity Applicable
                  </label>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="Gratuity"
                      className="mr-2"
                      checked={formData.gratuity === true}
                      onChange={() =>
                        setFormData({ ...formData, gratuity: true })
                      }
                      disabled={!isEditing}
                    />
                    <label className="mr-4">Yes</label>
                    <input
                      type="radio"
                      name="Gratuity"
                      className="mr-2"
                      checked={formData.gratuity === false}
                      onChange={() =>
                        setFormData({ ...formData, gratuity: false })
                      }
                      disabled={!isEditing}
                    />
                    <label>No</label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">
                    NPS Applicable
                  </label>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="NPS"
                      className="mr-2"
                      checked={formData.nps === true}
                      onChange={() => setFormData({ ...formData, nps: true })}
                      disabled={!isEditing}
                    />
                    <label className="mr-4">Yes</label>
                    <input
                      type="radio"
                      name="NPS"
                      className="mr-2"
                      checked={formData.nps === false}
                      onChange={() => setFormData({ ...formData, nps: false })}
                      disabled={!isEditing}
                    />
                    <label>No</label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Tax Regime
                  </label>
                  <div className="flex items-center">
                    <select
                      id="New Regime"
                      name="taxRegime"
                      className="mr-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={formData.taxRegime}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="">Select Tax Regime</option>
                      <option value="New Regime">New Regime</option>
                      <option value="Old Regime">Old Regime</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Tax Regime Updated at
                  </label>
                  <input
                    type="text"
                    className={`mt-1 p-2 w-full border rounded-md ${
                      !isEditing ? "bg-gray-200" : ""
                    }`}
                    readOnly={!isEditing}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Tax Regime Updated by
                  </label>
                  <input
                    type="text"
                    className={`mt-1 p-2 w-full border rounded-md ${
                      !isEditing ? "bg-gray-200" : ""
                    }`}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">
                  Decimal Rates Allowed
                </label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="Decimal Rates Allowed-yes"
                    name="Decimal Rates Allowed"
                    checked={formData.decimalPoint === true}
                    onChange={() =>
                      setFormData({ ...formData, decimalPoint: true })
                    }
                    className="mr-2"
                    disabled={!isEditing}
                  />
                  <label htmlFor="Decimal Rates Allowed-yes" className="mr-4">
                    Yes
                  </label>
                  <input
                    type="radio"
                    id="Decimal Rates Allowed-no"
                    name="Decimal Rates Allowed"
                    checked={formData.decimalPoint === false}
                    onChange={() =>
                      setFormData({ ...formData, decimalPoint: false })
                    }
                    className="mr-2"
                    disabled={!isEditing}
                  />
                  <label htmlFor="Decimal Rates Allowed-no">No</label>
                </div>
              </div>
            </div>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default SectionStatutory;
