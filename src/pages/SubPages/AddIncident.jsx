import React, { useRef, useState } from "react";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getItemInLocalStorage } from "../../utils/localStorage";
const AddIncident = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [formData, setFormData] = useState({
    date_time: "",
  });
  const datePickerRef = useRef(null);
  const currentDate = new Date();

  const handleIncidentDateChange = (date) => {
    setFormData({ ...formData, date_time: date });
  };
  const buildings = getItemInLocalStorage("Building");
  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="border flex flex-col my-2 md:mx-10 p-4 gap-4 rounded-md border-gray-300">
          <h2
            style={{ background: themeColor }}
            className="text-center text-lg  font-semibold p-2 bg-black rounded-md text-white"
          >
            Add Incidents
          </h2>
          <h2 className=" text-lg border-black border-b font-semibold ">
            DETAILS
          </h2>
          <div className="flex  flex-col justify-around ">
            <div className="grid md:grid-cols-3 item-start gap-x-4 gap-y-5 w-full">
              <div className="flex flex-col ">
                <label htmlFor="" className="font-semibold">
                  Time & Date
                </label>
                <DatePicker
                  selected={formData.date_time}
                  onChange={handleIncidentDateChange}
                  showTimeSelect
                  dateFormat="dd/MM/yyyy h:mm aa"
                  placeholderText="Select end date & time"
                  ref={datePickerRef}
                  minDate={currentDate}
                  className="border border-gray-400 rounded-md p-2 w-full "
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Building
                </label>
                <select
                  name=""
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select Building</option>
                  {buildings?.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Select The Incident Primary Category
                </label>
                <select
                  name=""
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select </option>
                  <option value="">Health and Safety</option>
                  <option value="">Fire</option>
                  <option value="">Near Miss/Good Catch</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Select The Category For The Incident
                </label>
                <select
                  name=""
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select </option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Select The Category For The Incident
                </label>
                <select
                  name=""
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select </option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Select The Category For The Incident
                </label>
                <select
                  name=""
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select </option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Select The Secondary Category
                </label>
                <select
                  name=""
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select </option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Select The Secondary Category
                </label>
                <select
                  name=""
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select </option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Select The Secondary Category
                </label>
                <select
                  name=""
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select </option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Severity
                </label>
                <select
                  name=""
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select Severity </option>
                  <option value="">Insignificant </option>
                  <option value="">Minor </option>
                  <option value="">moderate </option>
                  <option value="">major </option>
                  <option value="">catasTrophic </option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Incident level
                </label>
                <select
                  name=""
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select Level </option>
                  <option value="">Level-1 </option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">
                  Probability
                </label>
                <select
                  name=""
                  id=""
                  className="border p-2 border-gray-500 rounded-md"
                >
                  <option value="">Select Probability</option>
                  <option value="">Rare </option>
                  <option value="">Possible </option>
                  <option value="">Likely </option>
                  <option value="">Often </option>
                  <option value="">Frequent Almost/Certain </option>
                </select>
              </div>
            </div>
            <div className="flex flex-col mt-2">
              <label htmlFor="" className="font-semibold">
                Description
              </label>
              <textarea
                name=""
                id=""
                cols="5"
                rows="3"
                placeholder="Accident near Main Gate"
                className="border p-2 border-gray-500 rounded-md"
              />
            </div>
          </div>

          <div className=" flex flex-col gap-2 rounded-md ">
            <div className=" mt-3 mb-10 ">
              <div className="flex items-center gap-6">
                {/* <label htmlFor="meterApplicable">Support</label> */}
                <input type="checkbox" name="is_meter" id="meterApplicable" />
                <label htmlFor="meterApplicable">Support required</label>
              </div>
              <div className="flex md:flex-row flex-col gap-2">
                {/* <label htmlFor="meterApplicable">Disclaimer </label>
                 */}
                <div className="flex items-center gap-6">
                  <input type="checkbox" name="is_meter" id="meterApplicable" />
                  <label htmlFor="meterApplicable">
                    I have correctly stated all the facts related to the
                    incident
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className=" flex flex-col gap-4 rounded-md ">
            <h2 className=" text-lg border-black border-b font-semibold ">
              ATTACHMENTS
            </h2>
            <FileInputBox />
          </div>
          <div className="flex justify-center gap-2 mb-20 my-3">
            <button className="font-semibold bg-red-500 text-white  p-2 flex rounded-md items-center gap-2">
              <MdClose /> Cancel
            </button>
            <button className="font-semibold bg-green-500 text-white p-2 flex rounded-md items-center gap-2">
              <FaCheck /> Create Incident
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddIncident;
