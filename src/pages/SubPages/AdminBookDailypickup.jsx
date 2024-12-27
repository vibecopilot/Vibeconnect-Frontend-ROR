import React, { useEffect, useState } from "react";
import { getSetupUsers, postDailyPickUpTransportation } from "../../api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { getItemInLocalStorage } from "../../utils/localStorage";

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
    transportation_type: "",
    userId: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const createdByUserId = getItemInLocalStorage("UserId");
  const handleSubmit = async () => {
   
   
    if (!formData.pickup_location) {
      toast.error("Pickup location is required.");
      return;
    }
    if (!formData.dropoff_location) {
      toast.error("Dropoff location is required.");
      return;
    }
    if (!formData.date) {
      toast.error("Date is required.");
      return;
    }
    if (!formData.time) {
      toast.error("Time is required.");
      return;
    }
    if (!formData.no_of_passengers || formData.no_of_passengers <= 0) {
      toast.error("Please enter a valid number of passengers.");
      return;
    }
  
  
    const sendData = new FormData();
    sendData.append("transportation[on_behalf_of]", formData.behalf);
    sendData.append("transportation[user_id]", formData.userId);
    sendData.append("transportation[created_by_id]", createdByUserId);
    sendData.append(
      "transportation[pickup_location]",
      formData.pickup_location
    );
    sendData.append(
      "transportation[dropoff_location]",
      formData.dropoff_location
    );
    sendData.append("transportation[date]", formData.date);
    sendData.append("transportation[time]", formData.time);
    sendData.append(
      "transportation[no_of_passengers]",
      formData.no_of_passengers
    );
    sendData.append(
      "transportation[additional_note]",
      formData.additional_note || ""
    );
    sendData.append("transportation[transportation_type]", "Daily_Pickup");
  
    try {
      const resp = await postDailyPickUpTransportation(sendData);
      toast.success("Daily Pickup & Drop added successfully");
      navigate("/admin/transportation");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add Daily Pickup & Drop. Please try again.");
    }
  };
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const setupUsers = await getSetupUsers(); // API call to fetch users
        const formattedOptions = setupUsers.data.map((user) => ({
          value: user.id,
          label: user.firstname + " " + user.lastname,
        }));

        setUsers(setupUsers.data);
        console.log("show user data", setupUsers.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <section className="flex">
      <Navbar />
      <div className="flex justify-center my-2 w-full md:p-2 ">
        <div
          className="md:border  border-gray-300 rounded-lg md:p-2 w-full mx-4"
          // onSubmit={handleSubmit}
        >
          <h2
            className="text-center md:text-xl font-bold p-2 bg-black rounded-md text-white"
            style={{ background: themeColor }}
          >
            Book New Pickup and Drop-Off Ride
          </h2>

          <div className="flex flex-col my-5 justify-around w-full gap-4">
            <div className="flex items-center gap-5">
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
                    onChange={() =>
                      setFormData({ ...formData, behalf: "self" })
                    }
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
                    onChange={() =>
                      setFormData({ ...formData, behalf: "other" })
                    }
                  />
                  <label htmlFor="other">Other User</label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 gap-y-4">
              {formData.behalf === "other" && (
                <div className="grid md:grid-cols-1">
                  <label htmlFor="" className="font-medium">
                    Select User :
                  </label>
                  <select
                    onChange={handleChange}
                    value={formData.userId}
                    name="userId"
                    className="border p-2 px-4 w-full border-gray-400 rounded-md"
                  >
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
                <label htmlFor="" className="font-medium">
                  Pickup Location:
                </label>
                <textarea
                  name="pickup_location"
                  placeholder="Enter Pickup Location"
                  onChange={handleChange}
                  value={formData.pickup_location}
                  cols="15"
                  rows="1"
                  className="border p-2 rounded-md border-gray-400"
                ></textarea>
              </div>
              <div className="flex flex-col justify-around">
                <label htmlFor="" className="font-medium">
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
                  className="border p-2 rounded-md border-gray-400"
                ></textarea>
              </div>
              {/* <div className="grid md:grid-cols-2 gap-5"> */}
              <div className="flex flex-col ">
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
                  className=" border border-gray-400 p-2 px-4 rounded-md"
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="" className="font-medium">
                  Time :
                </label>
                <input
                  type="time"
                  onChange={handleChange}
                  value={formData.time}
                  name="time"
                  id=""
                  className=" border border-gray-400 p-2 px-4 rounded-md"
                />
              </div>
              <div className="flex flex-col ">
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
                  className=" border border-gray-400 p-2 placeholder:text-sm rounded-md"
                />
              </div>
              {/* </div> */}
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
              className="border p-2 rounded-md border-gray-400"
            ></textarea>
          </div>
          <div className="flex gap-5 justify-center items-center my-4">
            <button
              onClick={() => navigate("/admin/transportation")}
              className={`text-white bg-red-400  rounded-full font-semibold py-2 px-4 transition-all duration-300 flex items-center gap-2`}
            >
              <MdClose /> Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`text-white bg-green-400  rounded-full font-semibold py-2 px-4 transition-all duration-300 flex items-center gap-2`}
            >
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminBookDailypickup;
