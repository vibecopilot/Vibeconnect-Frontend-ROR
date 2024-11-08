import React, { useState } from "react";
import TextFields from "../../containers/Inputs/TextFields";
import FileInput from "../../Buttons/FileInput";
import TimeHourPicker from "../../containers/TimeHourPicker";
import TimeMinPicker from "../../containers/TimeMinPicker";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { FaCheck, FaTrash } from "react-icons/fa";
import { BiPlusCircle } from "react-icons/bi";

const SetupFacility = () => {
  const [allowMultipleSlots, setAllowMultipleSlots] = useState("no");

  const handleSelectChange = (e) => {
    setAllowMultipleSlots(e.target.value);
  };
  const themeColor = useSelector((state) => state.theme.color);
  const [formData, setFormData] = useState({
    type: "bookable",
  });
  const [slots, setSlots] = useState([
    {
      id: 1,
      startTime: "",
      breakTimeStart: "",
      breakTimeEnd: "",
      endTime: "",
      concurrentSlots: "",
      slotBy: "",
      wrapTime: "",
    },
  ]);

  const handleAddSlot = () => {
    setSlots([
      ...slots,
      {
        id: slots.length + 1,
        startTime: "",
        breakTimeStart: "",
        breakTimeEnd: "",
        endTime: "",
        concurrentSlots: "",
        slotBy: "",
        wrapTime: "",
      },
    ]);
  };

  const handleRemoveSlot = (id) => {
    setSlots(slots.filter((slot) => slot.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setSlots(
      slots.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
    );
  };

  const [timeValues, setTimeValues] = useState({
    time1: "00:00",
    time2: "00:00",
    time3: "00:00",
  });

  const handleTimeChange = (e, timeKey) => {
    const { value } = e.target;
    setTimeValues((prev) => ({
      ...prev,
      [timeKey]: value,
    }));
  };
  return (
    <section className="flex">
      <Navbar />
      <div className="w-full p-4 mb-5">
        <h1
          style={{ background: themeColor }}
          className="bg-black text-white font-semibold rounded-md text-center p-2"
        >
          Setup New Facility
        </h1>

        <div className="flex  gap-4 my-4">
          <div className="flex gap-2 items-center">
            <input type="radio" name="type" id="bookable" />
            <label htmlFor="bookable" className="text-lg">
              Bookable
            </label>
          </div>
          <div className="flex gap-2 items-center">
            <input type="radio" name="type" id="request" />
            <label htmlFor="request" className="text-lg">
              Request
            </label>
          </div>
        </div>

        <div>
          <h2 className="border-b border-black text-lg  font-medium my-3">
            Facility Details
          </h2>
          <div className="grid md:grid-cols-4 gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="font-medium">
                Facility name
              </label>
              <input
                type="text"
                name=""
                id=""
                className="border border-gray-400 rounded-md p-2"
                placeholder="Facility name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="font-medium">
                Active
              </label>
              <select
                name=""
                id=""
                className="border rounded-md border-gray-400 p-2 "
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="font-medium">
                Shareable
              </label>
              <select
                name=""
                id=""
                className="border rounded-md border-gray-400 p-2"
              >
                <option value="">Select </option>
                <option value="">Yes</option>
                <option value="">No</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="font-medium">
                Link to billing
              </label>
              <select
                name=""
                id=""
                className="border rounded-md border-gray-400 p-2"
              >
                <option value="">Select </option>
                <option value="">Yes</option>
                <option value="">No</option>
              </select>
            </div>
          </div>
        </div>
        <div className="my-4">
          <h2 className="border-b border-black font-medium text-lg">
            Fee Setup
          </h2>
          <div className="grid grid-cols-4 my-2">
            <div className="flex gap-1 flex-col ">
              <label htmlFor="" className="font-medium">
                Fee <span className="text-sm text-gray-400">(per slot) </span>{" "}
              </label>
              <input
                type="text"
                name=""
                id=""
                className="border border-gray-400 rounded-md p-2"
                placeholder="0.0"
              />
            </div>
          </div>
          <div className="border rounded-lg bg-blue-50 p-1">
            <div className="grid grid-cols-4 gap-2 items-center">
              <label htmlFor="" className="font-medium text-gray-500">
                Booking allowed before
              </label>
              <input
                type="text"
                name=""
                id=""
                className="border border-gray-400 rounded-md p-2"
                placeholder="Day"
              />
              <input
                type="text"
                name=""
                id=""
                className="border border-gray-400 rounded-md p-2"
                placeholder="Hour"
              />
              <input
                type="text"
                name=""
                id=""
                className="border border-gray-400 rounded-md p-2"
                placeholder="Mins"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 items-center my-2">
              <label htmlFor="" className="font-medium text-gray-500">
                Advance Booking
              </label>
              <input
                type="text"
                name=""
                id=""
                className="border border-gray-400 rounded-md p-2"
                placeholder="Day"
              />
              <input
                type="text"
                name=""
                id=""
                className="border border-gray-400 rounded-md p-2"
                placeholder="Hour"
              />
              <input
                type="text"
                name=""
                id=""
                className="border border-gray-400 rounded-md p-2"
                placeholder="Mins"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <label htmlFor="" className="font-medium text-gray-500">
                Can Cancel Before Schedule
              </label>
              <input
                type="text"
                name=""
                id=""
                className="border border-gray-400 rounded-md p-2"
                placeholder="Day"
              />
              <input
                type="text"
                name=""
                id=""
                className="border border-gray-400 rounded-md p-2"
                placeholder="Hour"
              />
              <input
                type="text"
                name=""
                id=""
                className="border border-gray-400 rounded-md p-2"
                placeholder="Mins"
              />
            </div>
          </div>
          <div className="my-4">
            <h2 className="border-b border-black font-medium text-lg">
              Configure Payment
            </h2>
            <div className="flex my-4 gap-10">
              <div className="flex gap-2">
                <input
                  type="radio"
                  name="payment"
                  id="postpaid"
                  className="p-2"
                />
                <label htmlFor="postpaid" className="font-medium">
                  Postpaid
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="radio"
                  name="payment"
                  id="postpaid"
                  className="p-2"
                />
                <label htmlFor="prepaid" className="font-medium">
                  Prepaid
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="radio"
                  name="payment"
                  id="postpaid"
                  className="p-2"
                />
                <label htmlFor="payOnFacility" className="font-medium">
                  Pay on Facility
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="radio"
                  name="payment"
                  id="postpaid"
                  className="p-2"
                />
                <label htmlFor="complimentary" className="font-medium">
                  Complimentary
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-2 my-5">
              <label htmlFor="" className="font-medium">
                GST <span className="text-gray-400  text-sm">(%)</span>
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md max-w-40"
                placeholder="%"
              />
            </div>
          </div>
        </div>

        <div className=" grid grid-cols-3 gap-2 border-t border-gray-400 py-2">
          <div className="">
            <p className="font-semibold">Allow Multiple Slots :</p>
            <div className="flex gap-2">
              <select
                name="yesNoSelect"
                id="yesNoSelect"
                className=" border border-gray-400 p-1 w-full focus:outline-none rounded-md"
                value={allowMultipleSlots}
                onChange={handleSelectChange}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {allowMultipleSlots === "yes" && (
                <input
                  type="text"
                  placeholder="Maximum no. of Slots"
                  className="border border-gray-400 p-1 placeholder:text-sm rounded-md"
                />
              )}
            </div>
          </div>
          <div className=" flex flex-col">
            <label htmlFor="" className="font-medium ">
              No. of times a user can Book :
            </label>
            <input
              type="text"
              name=""
              id=""
              className="border border-gray-400 p-1 placeholder:text-sm rounded-md"
              placeholder="0"
            />
          </div>
        </div>
        <div className="my-4">
          <h2 className="border-b border-black text-lg mb-1 font-medium">
            Cover Images
          </h2>
          <FileInputBox fileType="image/*" />
        </div>
        <div className="my-4">
          <h2 className="border-b border-black text-lg mb-1 font-medium">
            Attachments
          </h2>
          <FileInputBox />
        </div>
        <div className="flex flex-col">
          <label htmlFor="" className="font-medium">
            Description
          </label>
          <textarea
            name=""
            id=""
            cols="80"
            rows="3"
            className="border border-gray-400 p-1 placeholder:text-sm rounded-md"
          />
        </div>
        <div className="my-4">
          <h2 className="border-b border-black text-lg mb-1 font-medium">
            Configure Slot
          </h2>

          {slots.map((slot) => (
            <div
              key={slot.id}
              className="grid grid-cols-8 gap-2 bg-white my-2 rounded-lg "
            >
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Start time
                </label>
                <input
                  type="time"
                  placeholder="Start Time"
                  value={slot.startTime}
                  onChange={(e) =>
                    handleInputChange(slot.id, "startTime", e.target.value)
                  }
                  className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Break Time{" "}
                  <span className="text-sm font-medium text-gray-400">
                    (start)
                  </span>
                </label>
                <input
                  type="time"
                  placeholder="Break Start"
                  value={slot.breakTimeStart}
                  onChange={(e) =>
                    handleInputChange(slot.id, "breakTimeStart", e.target.value)
                  }
                  className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                />
              </div>
              <div className="flex-col flex">
                <label htmlFor="" className="font-medium">
                  Break Time{" "}
                  <span className="text-sm font-medium text-gray-400">
                    (end)
                  </span>
                </label>
                <input
                  type="time"
                  placeholder="Break End"
                  value={slot.breakTimeEnd}
                  onChange={(e) =>
                    handleInputChange(slot.id, "breakTimeEnd", e.target.value)
                  }
                  className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  End Time{" "}
                </label>
                <input
                  type="time"
                  placeholder="End Time"
                  value={slot.endTime}
                  onChange={(e) =>
                    handleInputChange(slot.id, "endTime", e.target.value)
                  }
                  className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Concurrent Slots
                </label>
                <input
                  type="number"
                  placeholder="Concurrent Slots"
                  value={slot.concurrentSlots}
                  onChange={(e) =>
                    handleInputChange(
                      slot.id,
                      "concurrentSlots",
                      e.target.value
                    )
                  }
                  className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Slots by
                </label>
                <input
                  type="text"
                  placeholder="Slot by"
                  value={slot.slotBy}
                  onChange={(e) =>
                    handleInputChange(slot.id, "slotBy", e.target.value)
                  }
                  className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Wrap Time
                </label>
                <input
                  type="text"
                  placeholder="Wrap Time"
                  value={slot.wrapTime}
                  onChange={(e) =>
                    handleInputChange(slot.id, "wrapTime", e.target.value)
                  }
                  className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
                />
              </div>
              <div className="flex items-end justify-end">
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(slot.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>
          ))}

          <div className="flex ">
            <button
              type="button"
              onClick={handleAddSlot}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <BiPlusCircle className="h-5 w-5 mr-2" />
              Add Slot
            </button>
          </div>
        </div>
        <div></div>
        <div className="flex flex-col">
          <label htmlFor="" className="font-medium">
            Terms & Conditions
          </label>
          <textarea
            name=""
            id=""
            rows="3"
            className="border border-gray-400 rounded-md"
          />
        </div>
        <div className="flex flex-col my-4">
          <label htmlFor="" className="font-medium">
            Cancellation Policy
          </label>
          <textarea
            name=""
            id=""
            rows="3"
            className="border border-gray-400 rounded-md"
          />
        </div>
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left font-medium text-sm text-gray-500 py-2">
                  Rules Description
                </th>
                <th className="text-center font-medium text-sm text-gray-500 py-2">
                  Days
                </th>
                <th className="text-center font-medium text-sm text-gray-500 py-2">
                  Time
                </th>
                <th className="text-right font-medium text-sm text-gray-500 py-2">
                  Deduction (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr className="border-t">
                <td className="text-sm py-2">
                  If user cancels the booking selected hours/days prior to
                  schedule, the given percentage of amount will be deducted
                </td>
                <td className="text-center py-2">
                  <input
                    type="text"
                    placeholder="Day"
                    className=" border rounded-md p-2"
                  />
                </td>
                <td className="text-center py-2">
                  <input
                    type="time"
                    value={timeValues.time1}
                    onChange={(e) => handleTimeChange(e, "time1")}
                    className=" border rounded-md p-2"
                  />
                </td>
                <td className="flex items-center justify-end gap-2 py-2">
                  <input
                    type="number"
                    placeholder="0"
                    className="w-[60px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">%</span>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="border-t">
                <td className="text-sm py-2">
                  If user cancels the booking selected hours/days prior to
                  schedule, the given percentage of amount will be deducted
                </td>
                <td className="text-center py-2">
                  <input
                    type="text"
                    placeholder="Day"
                    className=" border rounded-md p-2"
                  />
                </td>
                <td className="text-center py-2">
                  <input
                    type="time"
                    value={timeValues.time2}
                    onChange={(e) => handleTimeChange(e, "time2")}
                    className=" border rounded-md p-2"
                  />
                </td>
                <td className="flex items-center justify-end gap-2 py-2">
                  <input
                    type="number"
                    placeholder="0"
                    className="w-[60px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">%</span>
                </td>
              </tr>

              <tr className="border-t">
                <td className="text-sm py-2">
                  If user cancels the booking selected hours/days prior to
                  schedule, the given percentage of amount will be deducted
                </td>
                <td className="text-center py-2">
                  <input
                    type="text"
                    placeholder="Day"
                    className=" border rounded-md p-2"
                  />
                </td>
                <td className="text-center py-2">
                  <input
                    type="time"
                    value={timeValues.time3}
                    onChange={(e) => handleTimeChange(e, "time3")}
                    className=" border rounded-md p-2"
                  />
                </td>
                <td className="flex items-center justify-end gap-2 py-2">
                  <input
                    type="number"
                    placeholder="0"
                    className="w-[60px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-center ">
          <button
            style={{ background: themeColor }}
            className=" text-white p-2 px-4 font-semibold rounded-md flex items-center gap-2"
          >
            <FaCheck /> Submit
          </button>
        </div>
      </div>
    </section>
  );
};

export default SetupFacility;
