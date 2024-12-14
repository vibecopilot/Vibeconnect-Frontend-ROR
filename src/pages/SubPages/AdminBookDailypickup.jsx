import React, { useEffect, useState } from "react";
import {  getSetupUsers, postDailyPickUpTransportation } from "../../api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminBookDailypickup = () => {
  const [users, setUsers] = useState([]);
  const themeColor = useSelector((state) => state.theme.color);
  const [formData, setFormData] = useState({
    behalf: "self",
    pickup_location: "",
    dropoff_location: "",
    date: "",
    time: "",
    no_of_passengers: "",
    additional_note: "",
    transportation_type: ""
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate()
  
  const handleSubmit = async () => {
    
   
    const sendData = new FormData();
    sendData.append("transportation[on_behalf_of]", formData.behalf);
    sendData.append("transportation[pickup_location]", formData.pickup_location);
    sendData.append("transportation[dropoff_location]", formData.dropoff_location);
    sendData.append("transportation[date]", formData.date);
    sendData.append("transportation[time]", formData.time);
    sendData.append("transportation[no_of_passengers]", formData.no_of_passengers);
    sendData.append("transportation[additional_note]", formData.additional_note);
    sendData.append("transportation[transportation_type]","Daily_Pickup" );

    try {
      const resp = await postDailyPickUpTransportation(sendData);
      console.log(resp);
      
      toast.success("Daily Pickup & Drop added successfully");
      navigate("/admin/transportation");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const setupUsers = await getSetupUsers(); // API call to fetch users
        const formattedOptions = setupUsers.data.map((user) => ({
          value: user.id,
          label: user.firstname+" "+user.lastname,
        }));

        setUsers(setupUsers.data);
        console.log("show user data",setupUsers.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
}, []);

  return (
    <div className="flex justify-center items-center my-5 w-full md:p-4 ">
      <div
        className="md:border  border-gray-300 rounded-lg md:p-4 w-full mx-4"
        // onSubmit={handleSubmit}
      >
        <h2 className="text-center md:text-xl font-bold p-2 bg-black rounded-full text-white" style={{ background: themeColor }}>
          Book New Pickup and Drop-Off Ride
        </h2>

        <div className="flex flex-col my-5 justify-around w-full gap-4">
          <div className="grid md:grid-cols-3">
          {/* <div className="flex flex-col md:flex-row justify-around items-center"> */}
            <label htmlFor="" className="font-semibold">
              On Behalf of :
            </label>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="behalf"
                  checked={formData.behalf === "self"}
                  onChange={() => setFormData({ ...formData, behalf: "self" })}
                  id="self"
                />
                <label htmlFor="self">Self</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="behalf"
                  id="other"
                  checked={formData.behalf === "other"}
                  onChange={() => setFormData({ ...formData, behalf: "other" })}
                />
                <label htmlFor="other">Other User</label>
              </div>
            </div>
          
          </div>
          {formData.behalf === "other" && (
            <div className="grid md:grid-cols-1">
              <label htmlFor="" className="font-medium">Select User :</label>
              <select  
              onChange={handleChange}
                  value={formData.name}
                  className="border p-2 px-4 w-full border-gray-500 rounded-md">
                <option value="" className="text-gray-300">
                  Select User{" "}
                </option>
                {users?.map((assign) => (
                      <option key={assign.id} value={assign.id}>
                        {assign.firstname} {assign.lastname} 
                      </option>
                    ))}
              </select>
            </div>
          )}
          <div className="flex flex-col justify-around">
            <label htmlFor="" className="">
              Pickup Location:
            </label>
            <textarea
              name="pickup_location"
              placeholder="Enter Pickup Location"
              onChange={handleChange}
              value={formData.pickup_location}
              cols="15"
              rows="1"
              //   value={formData.heading}
              //   onChange={handleChange}
              className="border p-2 rounded-md border-black"
            ></textarea>
          </div>
          <div className="flex flex-col justify-around">
            <label htmlFor="" className="">
              Drop-off Location:
            </label>
            <textarea
              name="dropoff_location"
              placeholder="Enter Drop-off Location"
              onChange={handleChange}
              value={formData.dropoff_location}
              cols="15"
              rows="1"
              //   value={formData.heading}
              //   onChange={handleChange}
              className="border p-2 rounded-md border-black"
            ></textarea>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="grid grid-cols-2 items-center">
              <label htmlFor="" className="font-medium">
                {" "}
                Date :
              </label>
              <input
                type="date"
                onChange={handleChange}
                value={formData.date}
                name="date"
                id=""
                className=" border border-gray-500 p-2 px-4 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 items-center">
              <label htmlFor="" className="font-medium md:text-center">
                Time :
              </label>
              <input
                type="time"
                onChange={handleChange}
                value={formData.time}
                name="time"
                id=""
                className=" border border-gray-500 p-2 px-4 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 items-center">
              <label htmlFor="" className="font-medium">
                No. Of Passengers :
              </label>
              <input
                type="number"
                placeholder="No. of Passengers"
                onChange={handleChange}
                value={formData.no_of_passengers}
                name="no_of_passengers"
                id=""
                className=" border border-gray-500 p-2 placeholder:text-sm rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-around">
            <label htmlFor="" className="font-semibold">
              Additional note :
            </label>
            <textarea
              
              placeholder="Additional note"
              onChange={handleChange}
              name="additional_note"
              value={formData.additional_note}
              cols="15"
              rows="3"
              //   value={formData.heading}
              //   onChange={handleChange}
              className="border p-2 rounded-md border-black"
            ></textarea>
          </div>
        <div className="flex gap-5 justify-center items-center my-4">
          <button
           onClick={handleSubmit}
            style={{ background: themeColor }}
            className={`text-white bg-black hover:bg-white hover:text-black border-2 border-black font-semibold py-2 px-4 rounded-md transition-all duration-300 `}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBookDailypickup;
