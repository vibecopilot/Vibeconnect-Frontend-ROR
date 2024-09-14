import React, { useEffect, useState } from "react";
import OrganisationSetting from "./OrganisationSetting";
import {
  getAllOrganizationGeoSettings,
  getCountriesList,
  getCountryData,
} from "../../api";
import Select from "react-select";
const GeographicalSetting = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [dateFormat, setDateFormat] = useState("");
  const [currency, setCurrency] = useState("");

  const fetchAllGeoSettings = async () => {
    try {
      const res = await getAllOrganizationGeoSettings();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCountries = async () => {
    try {
      const countries = await getCountriesList();
      const options = countries.map((country) => ({
        value: country.id,
        label: country.country,
      }));

      setCountryOptions(options);
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };
  useEffect(() => {
    fetchAllGeoSettings();
    fetchCountries();
  }, []);
  const handleSelectChange = async (selectedOption) => {
    setSelectedCountry(selectedOption);

    try {
      const countryInfo = await fetchCountryInfo(selectedOption.value);
    } catch (error) {
      console.error("Error fetching country information:", error);
    }
  };

  const fetchCountryInfo = async (countryId) => {
    try {
      const response =  await getCountryData(countryId);
      console.log(response);
      setTimezone(response.time_zone)
      setDateFormat(response.date_format)
      setCurrency(response.default_currency)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-10 ml-20">
      <OrganisationSetting />
      <div className="w-2/3 mt-2  py-6 bg-white rounded-lg ">
        {/* <h2 className="text-xl font-bold mb-4">Geographical Settings</h2> */}
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-6">Geographical Settings</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
        <div className="mb-4">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country of Origin
          </label>
          <Select
            id="country"
            value={selectedCountry}
            onChange={handleSelectChange}
            options={countryOptions}
            placeholder="Select a country"
            noOptionsMessage={() => "No countries available"}
            isDisabled={!isEditing}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="timezone"
            className="block text-sm font-medium text-gray-700"
          >
            Timezone
          </label>
          <input
            id="timezone"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200
              `}
            value={timezone}
            // onChange={(e) => setTimezone(e.target.value)}
            disabled
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="dateFormat"
            className="block text-sm font-medium text-gray-700"
          >
            Date Format
          </label>
          <input
            id="dateFormat"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200
              `}
            disabled
            value={dateFormat}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700"
          >
            Default Currency
          </label>
          <input
            id="currency"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200
            `}
            value={currency}
            // onChange={(e) => setCurrency(e.target.value)}
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default GeographicalSetting;
