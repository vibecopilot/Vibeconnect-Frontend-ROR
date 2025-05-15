import React, { useEffect, useState } from "react";
import axios from "axios";
import{  getAvailableSites,
  getEmployeeAssociations,
  updateEmployeeAssociations} from '../../../api/index'
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import Select from "react-select";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getItemInLocalStorage } from "../../../utils/localStorage";

const AddAssociateEmployeeModal = ({ closeModal, fetchEmployeeData }) => {
  const [availableSites, setAvailableSites] = useState([]);
  const [selectedSiteIds, setSelectedSiteIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // Initial loading state
  const [associatedId, setAssociatedId] = useState(null);
  const { id } = useParams();
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");

  // Fetch all available sites for the organization
  const fetchAvailableSitesData = async () => {
    try {
      const sitesData = await getAvailableSites(hrmsOrgId);
      console.log("fetch all available sites", sitesData);
      if (sitesData) {
        const formattedSites = sitesData.map(site => ({
          value: site.id,
          label: `${site.site_name}`
        }));
        setAvailableSites(formattedSites);
      }
    } catch (error) {
      console.error("Error fetching available sites:", error);
      toast.error("Failed to load available sites");
    }
  };

  // Fetch employee's current associations
  const fetchEmployeeAssociationsData = async () => {
    try {
      const associationsData = await getEmployeeAssociations(id);
      console.log("fetch employee current associations", associationsData);
      if (associationsData && associationsData.length > 0) {
        const employeeData = associationsData[0];
        setSelectedSiteIds(employeeData.multiple_associated || []);
        setAssociatedId(employeeData.id);
      }
    } catch (error) {
      console.error("Error fetching associations:", error);
      toast.error("Failed to load current associations");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchAvailableSitesData();
      await fetchEmployeeAssociationsData();
    };
    fetchData();
  }, []);

  const handleSiteChange = (selectedOptions) => {
    const newSelectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedSiteIds(newSelectedIds);
  };

  const handleSubmit = async () => {
    if (selectedSiteIds.length === 0) {
      toast.error("Please select at least one site");
      return;
    }

    if (!associatedId) {
      toast.error("No association record found for this employee");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const postData = {
        employee: id,
        organization: hrmsOrgId,
        multiple_associated: selectedSiteIds
      };

      await updateEmployeeAssociations(associatedId , postData)
     
      
      toast.success("Employee associations updated successfully");
      fetchEmployeeData();
      closeModal();
    } catch (error) {
      console.error("Error updating associations:", error);
      toast.error(error.response?.data?.message || "Failed to update associations");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedOptions = () => {
    if (!availableSites.length || !selectedSiteIds.length) return [];
    return availableSites.filter(site => selectedSiteIds.includes(site.value));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="max-h-screen bg-white p-6 w-[32rem] rounded-lg shadow-lg overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Manage Employee Site Associations</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Associated Sites <span className="text-red-500">*</span>
          </label>
          <Select
            options={availableSites}
            value={getSelectedOptions()}
            onChange={handleSiteChange}
            isMulti
            isLoading={isFetching}
            isDisabled={isSubmitting} // Only disable during submission
            noOptionsMessage={() => "No sites available"}
            placeholder={isFetching ? "Loading sites..." : "Select sites..."}
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <p className="mt-1 text-sm text-gray-500">
            Current associations: {selectedSiteIds.length} sites
          </p>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={closeModal}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <MdClose /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !associatedId}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <FaCheck /> Save Associations
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssociateEmployeeModal;