import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

const BookOutstation = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [formData, setFormData] = useState({
    behalf: "self",
    pickup_location: "",
    dropoff_location: "",
    date: "",
    time: "",
    no_of_passengers: "",
    additional_note: "",
    transportation_type: "",
    userId: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  return (
    <section className="flex ">
      <Navbar />
      <div className="flex justify-center  my-2 w-full p-2">
        <div
          className="border  border-gray-300 rounded-lg p-2 w-full mx-4"
          // onSubmit={handleSubmit}
        >
          <h2
            className="text-center text-xl font-bold p-2 bg-black rounded-md text-white"
            style={{ background: themeColor }}
          >
            Book New Outstation Ride
          </h2>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium">
                Departure from:
              </label>
              <textarea
                name="pickup_location"
                placeholder="Departure From"
                cols="15"
                rows="1"
                value={formData.pickup_location}
                onChange={handleChange}
                className="border p-2 rounded-md border-gray-400"
              ></textarea>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium">
                Destination:
              </label>
              <textarea
                name="dropoff_location"
                placeholder="Enter Destination"
                cols="15"
                rows="1"
                value={formData.dropoff_location}
                onChange={handleChange}
                className="border p-2 rounded-md border-gray-400"
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium">
                Departure Date :
              </label>
              <input
                type="date"
                id=""
                name="date"
                value={formData.date}
                onChange={handleChange}
                className=" border p-2 border-gray-400 px-4 rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium">
                Return Date :
              </label>
              <input
                type="date"
                name=""
                id=""
                className=" border p-2 border-gray-400 px-4 rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium">
                No. Of Passengers :
              </label>
              <input
                type="number"
                placeholder="No. of Passengers"
                name="no_of_passengers"
                value={formData.no_of_passengers}
                onChange={handleChange}
                id=""
                className=" border border-gray-400 p-2 placeholder:text-sm rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col my-2 justify-around w-full gap-4">
            <div className="flex flex-col gap-1 ">
              <label htmlFor="" className="font-medium">
                Purpose :
              </label>
              <textarea
                name="additional_note"
                placeholder=" Purpose of Travel!"
                id=""
                cols="80"
                rows="3"
                className="border p-2 border-gray-400 rounded-md"
                value={formData.additional_note}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex gap-5 justify-center items-center my-4">
            <button
              onClick={() => navigate("/employees/transportation")}
              className={`text-white bg-red-400 rounded-full font-semibold py-2 px-4 transition-all duration-300 flex items-center gap-2`}
            >
              <MdClose /> Cancel
            </button>
            <button
              // onClick={handleSubmit}
              className={`text-white bg-green-400 font-semibold py-2 px-4 rounded-full transition-all duration-300 flex items-center gap-2`}
            >
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookOutstation;
