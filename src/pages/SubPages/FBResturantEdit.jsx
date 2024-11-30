import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { editFB, getFBDetails } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { restaurantSchedule } from "../../utils/initialFormData";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";

const FBRestaurtantEdit = () => {
  const [rows, setRows] = useState([]);
  const addRow = () => {
    setRows([...rows, { order: false, booking: false, date: "" }]);
  };

  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };
  const themeColor = useSelector((state) => state.theme.color);
  const { id } = useParams();
  useEffect(() => {
    const fetchFBDetails = async () => {
      try {
        const details = await getFBDetails(id);
        console.log(details);
      } catch (error) {
        console.error("Error fetching site FB details:", error);
      }
    };
    fetchFBDetails();
  }, []);

  const [formData, setFormData] = useState({
    restaurantName: "",
    costForTwo: "",
    mobileNumber: "",
    anotherMobileNumber: "",
    landlineNumber: "",
    deliveryTime: "",
    cuisines: "",
    servesAlcohol: "",
    wheelchairAccessible: "",
    cashOnDelivery: "",
    pureVeg: "",
    address: "",
    termsAndConditions: "",
    disclaimer: "",
    closingMessage: "",
    minimumPerson: "",
    maximumPerson: "",
    canCancelBefore: "",
    bookingNotAllowedText: "",
    gst: "",
    deliveryCharge: "",
    minimumOrder: "",
    orderNotAllowedText: "",
    service_charge: "",
    cover_image: [],
    menu: [],
    gallery: [],
    restaurantBook: restaurantSchedule,
  });

  console.log("Form Data", formData);
  useEffect(() => {
    const fetchFBDetails = async () => {
      try {
        // Fetch the restaurant details
        const details = await getFBDetails(id);
        console.log(details);
  
        const data = details.data || {};
      setFormData({
        restaurantName: data.restaurant_name || "",
        costForTwo: data.cost_for_two || "",
        mobileNumber: data.mobile_number || "",
        anotherMobileNumber: data.alternate_mobile_number || "",
        landlineNumber: data.landline_number || "",
        deliveryTime: data.delivery_time || "",
        cuisines: data.cuisines || "",
        servesAlcohol: data.serves_alcohols || "",
        wheelchairAccessible: data.wheelchair_accessible || "",
        cashOnDelivery: data.cash_on_delivery || "",
        pureVeg: data.pure_veg || "",
        address: data.address || "",
        termsAndConditions: data.terms_and_conditions || "",
        disclaimer: data.disclaimer || "",
        closingMessage: data.closing_message || "",
        minimumPerson: data.minimum_person || "",
        maximumPerson: data.maximum_person || "",
        canCancelBefore: data.cancel_before || "",
        bookingNotAllowedText: data.bookingNotAllowedText || "",
        gst: data.gst || "",
        deliveryCharge: data.delivery_charges || "",
        minimumOrder: data.minimum_order || "",
        orderNotAllowedText: data.orderNotAllowedText || "",
        service_charge: data.serviceCharges || "",
        cover_image: data.cover_image || [],
        menu: data.menu || [],
        gallery: data.gallery || [],
        restaurantBook: data.restaurant_schedule || restaurantSchedule,
      });
        console.log("Transformed Schedule Data:", transformedData);
      } catch (error) {
        console.error("Error fetching site FB details:", error);
      }
    };
  
    fetchFBDetails();
  }, [id]); // Add 'id' as a dependency to refetch when it changes
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (day) => {
    setFormData((prevState) => ({
      ...prevState,
      restaurantBook: {
        ...prevState.restaurantBook,
        [day]: {
          ...prevState.restaurantBook[day],
          selected: !prevState.restaurantBook[day].selected,
        },
      },
    }));
  };

  const handleTimeChange = (day, type, value) => {
    setFormData((prevState) => ({
      ...prevState,
      restaurantBook: {
        ...prevState.restaurantBook,
        [day]: {
          ...prevState.restaurantBook[day],
          [type]: value,
        },
      },
    }));
  };

  const handleFileChange = (files, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: files,
    });
    console.log(fieldName);
  };

  const userId = getItemInLocalStorage("UserId");
  const navigate = useNavigate();
  const handleEdit = async () => {
    if (!formData.restaurantName) {
      return toast.error("Restaurant Name is required");
    }
    if (!formData.costForTwo) {
      return toast.error(" Cost For Two Name is required");
    }
    if (!formData.mobileNumber) {
      return toast.error("Mobile Number is required");
    }
    if (formData.mobileNumber.length !== 10) {
      return toast.error("Mobile Number must be exactly 10 characters long");
    }

    if (!/^\d+$/.test(formData.mobileNumber)) {
      return toast.error("Mobile Number must contain only digits");
    }
    // Another Mobile Number
    if (!formData.anotherMobileNumber) {
      return toast.error("Another Mobile Number is required");
    }
    if (formData.anotherMobileNumber.length !== 10) {
      return toast.error(
        "Another Mobile Number must be exactly 10 characters long"
      );
    }

    if (!/^\d+$/.test(formData.anotherMobileNumber)) {
      return toast.error("Another Mobile Number must contain only digits");
    }
    // Landline Number
    if (!formData.landlineNumber) {
      return toast.error("Landline Number is required");
    }
    if (formData.landlineNumber.length !== 10) {
      return toast.error("Landline Number must be exactly 10 characters long");
    }

    if (!/^\d+$/.test(formData.landlineNumber)) {
      return toast.error("Landline Number must contain only digits");
    }

    if (!formData.servesAlcohol) {
      return toast.error("Please select Serves Alcohol Yes or No");
    }
    if (!formData.wheelchairAccessible) {
      return toast.error("Please select Wheelchair Accessible Yes or No ");
    }
    if (!formData.costForTwo) {
      return toast.error("Please select Cost For Two Yes or No ");
    }
    if (!formData.pureVeg) {
      return toast.error("Please select Pure Veg Yes or No ");
    }

    const editData = new FormData();
    editData.append(
      "food_and_beverage[restaurant_name]",
      formData.restaurantName
    );
    editData.append("food_and_beverage[created_by_id]", userId);
    editData.append("food_and_beverage[cost_for_two]", formData.costForTwo);
    editData.append("food_and_beverage[mobile_number]", formData.mobileNumber);
    editData.append(
      "food_and_beverage[alternate_mobile_number]",
      formData.anotherMobileNumber
    );
    editData.append(
      "food_and_beverage[landline_number]",
      formData.landlineNumber
    );
    editData.append("food_and_beverage[delivery_time]", formData.deliveryTime);
    editData.append("food_and_beverage[cuisines]", formData.cuisines);
    editData.append(
      "food_and_beverage[serves_alcohols]",
      formData.servesAlcohol
    );
    editData.append(
      "food_and_beverage[wheelchair_accessible]",
      formData.wheelchairAccessible
    );
    editData.append(
      "food_and_beverage[cash_on_delivery]",
      formData.cashOnDelivery
    );
    editData.append("food_and_beverage[pure_veg]", formData.pureVeg);
    editData.append("food_and_beverage[address]", formData.address);
    editData.append(
      "food_and_beverage[terms_and_conditions]",
      formData.termsAndConditions
    );
    editData.append("food_and_beverage[disclaimer]", formData.disclaimer);
    editData.append(
      "food_and_beverage[closing_message]",
      formData.closingMessage
    );
    editData.append(
      "food_and_beverage[minimum_person]",
      formData.minimumPerson
    );
    editData.append(
      "food_and_beverage[maximum_person]",
      formData.maximumPerson
    );
    editData.append(
      "food_and_beverage[cancel_before]",
      formData.canCancelBefore
    );
    // editData.append("food_and_beverage[closing_message]", formData.bookingNotAllowedText);
    editData.append("food_and_beverage[gst]", formData.gst);
    editData.append(
      "food_and_beverage[delivery_charges]",
      formData.deliveryCharge
    );
    editData.append("food_and_beverage[minimum_order]", formData.minimumOrder);
    // editData.append("food_and_beverage[closing_message]", formData.orderNotAllowedText);
    editData.append(
      "food_and_beverage[serviceCharges]",
      formData.service_charge
    );

    Object.keys(formData.restaurantBook).forEach((day) => {
      editData.append(
        `food_and_beverage[restaurant_schedule][${day}][selected]`,
        formData.restaurantBook[day].selected ? "1" : "0"
      );
      editData.append(
        `food_and_beverage[restaurant_schedule][${day}][start_time]`,
        formData.restaurantBook[day].start_time
      );
      editData.append(
        `food_and_beverage[restaurant_schedule][${day}][end_time]`,
        formData.restaurantBook[day].end_time
      );
      editData.append(
        `food_and_beverage[restaurant_schedule][${day}][booking_allowed]`,
        //  "1"
        formData.restaurantBook[day].booking_allowed ? "1" : "0"
      );
      editData.append(
        `food_and_beverage[restaurant_schedule][${day}][order_allowed]`,
        // "1"
        formData.restaurantBook[day].order_allowed ? "1" : "0"
      );
    });

    formData.cover_image?.forEach((file, index) => {
      editData.append(`attachfiles[]`, file);
    });
    formData.menu?.forEach((file, index) => {
      editData.append(`attachfiles[]`, file);
    });
    formData.gallery?.forEach((file, index) => {
      editData.append(`attachfiles[]`, file);
    });
    try {
      const postRes = await editFB(id,editData);
      console.log(postRes);
      toast.success("F&B Updated successfully");
      navigate(`/admin/fb-details/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col overflow-hidden w-full">
      <div className="md:mx-20 mb-10 sm:border border-gray-400 p-5 px-10 rounded-lg sm:shadow-xl">
        <h2
          style={{ background: themeColor }}
          className="text-center text-xl font-bold p-2 rounded-md text-white"
        >
          Edit F&B
        </h2>
        <div className="w-full mx-3 my-5 p-5 shadow-lg rounded-lg border border-gray-300">
          <h3 className="border-b text-center text-xl  mb-6 font-bold">
            BASIC DETAILS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="restaurant-name"
              >
                Restaurant Name <span className="text-red-500">*</span>
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="restaurant-name"
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                placeholder="Restaurant Name"
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="cost-for-two"
              >
                Cost For Two <span className="text-red-500">*</span>
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="cost-for-two"
                type="text"
                name="costForTwo"
                value={formData.costForTwo}
                onChange={handleChange}
                placeholder="Cost For Two"
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="mobile-number"
              >
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="mobile-number"
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Enter Number"
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="another-mobile-number"
              >
                Another Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="another-mobile-number"
                type="tel"
                name="anotherMobileNumber"
                value={formData.anotherMobileNumber}
                onChange={handleChange}
                placeholder="Enter Number"
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="landline-number"
              >
                Landline Number <span className="text-red-500">*</span>
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="landline-number"
                type="tel"
                name="landlineNumber"
                value={formData.landlineNumber}
                onChange={handleChange}
                placeholder="Enter Number"
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="delivery-time"
              >
                Delivery Time
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="delivery-time"
                type="text"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                placeholder="Mins"
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="cuisines"
              >
                Cuisines
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="delivery-time"
                type="text"
                name="cuisines"
                value={formData.cuisines}
                onChange={handleChange}
                placeholder="Cuisines"
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="serves-alcohol"
              >
                Serves Alcohol <span className="text-red-500">*</span>
              </label>
              <select
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="serves-alcohol"
                name="servesAlcohol"
                value={formData.servesAlcohol}
                onChange={handleChange}
              >
                {/* Options for serving alcohol */}
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="wheelchair-accessible"
              >
                Wheelchair Accessible <span className="text-red-500">*</span>
              </label>
              <select
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="wheelchair-accessible"
                value={formData.wheelchairAccessible}
                name="wheelchairAccessible"
                onChange={handleChange}
              >
                {/* Options for wheelchair accessibility */}
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="cash-on-delivery"
              >
                Cash on Delivery <span className="text-red-500">*</span>
              </label>
              <select
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="cash-on-delivery"
                name="cashOnDelivery"
                value={formData.cashOnDelivery}
                onChange={handleChange}
              >
                {/* Options for cash on delivery */}
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="pure-veg"
              >
                Pure Veg <span className="text-red-500">*</span>
              </label>
              <select
                className="border border-gray-400  p-2 rounded-md placeholder:text-sm w-full"
                id="pure-veg"
                name="pureVeg"
                value={formData.pureVeg}
                onChange={handleChange}
              >
                {/* Options for pure vegetarian */}
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="col-span-3">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="address"
              >
                Address
              </label>
              <textarea
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
              />
            </div>
            <div className="col-span-3">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="terms-conditions"
              >
                Terms & Conditions
              </label>
              <textarea
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="terms-conditions"
                type="text"
                name="termsAndConditions"
                value={formData.termsAndConditions}
                onChange={handleChange}
                placeholder="Terms & Conditions"
              />
            </div>
            <div className="col-span-3">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="disclaimer"
              >
                Disclaimer
              </label>
              <textarea
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="disclaimer"
                type="text"
                value={formData.disclaimer}
                name="disclaimer"
                onChange={handleChange}
                placeholder="Disclaimer"
              />
            </div>
            <div className="col-span-3">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="closing-message"
              >
                Closing Message
              </label>
              <textarea
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="closing-message"
                type="text"
                name="closingMessage"
                value={formData.closingMessage}
                onChange={handleChange}
                placeholder="Closing Message"
              />
            </div>
          </div>
        </div>
        <div className="w-full mx-3 my-5 p-5 shadow-lg rounded-lg border border-gray-300">
          <h3 className="border-b text-center text-xl border-black mb-6 font-bold">
            RESTAURTANT DETAILS
          </h3>

          <div class="overflow-x-auto">
            <table class="table-auto">
              <thead>
                <tr>
                  <th class="px-4 py-2"></th>
                  <th class="px-4 py-2">Operational Days</th>
                  <th class="px-4 py-2">Start Time</th>
                  <th class="px-4 py-2">End Time</th>
                  <th class="px-4 py-2">Break Start Time</th>
                  <th class="px-4 py-2">Break End Time</th>
                  <th class="px-4 py-2">Booking Allowed</th>
                  <th class="px-4 py-2">Order Allowed</th>
                  <th class="px-4 py-2">Last Booking & Order Time</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(formData.restaurantBook).map((day) => (
                  <tr key={day}>
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={formData.restaurantBook[day].selected}
                        onChange={() => handleCheckboxChange(day)}
                      />
                    </td>
                    <td className="border px-4 py-2 text-center">{day}</td>
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="time"
                        className="border border-gray-400 p-2 rounded-md"
                        value={formData.restaurantBook[day].start_time}
                        onChange={(e) =>
                          handleTimeChange(day, "start_time", e.target.value)
                        }
                        disabled={!formData.restaurantBook[day].selected}
                      />
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="time"
                        className="border border-gray-400 p-2 rounded-md"
                        value={formData.restaurantBook[day].end_time}
                        onChange={(e) =>
                          handleTimeChange(day, "end_time", e.target.value)
                        }
                        disabled={!formData.restaurantBook[day].selected}
                      />
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="time"
                        className="border border-gray-400 p-2 rounded-md"
                        value={formData.restaurantBook[day].break_start_time}
                        onChange={(e) =>
                          handleTimeChange(
                            day,
                            "break_start_time",
                            e.target.value
                          )
                        }
                        disabled={!formData.restaurantBook[day].selected}
                      />
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="time"
                        className="border border-gray-400 p-2 rounded-md"
                        value={formData.restaurantBook[day].break_end_time}
                        onChange={(e) =>
                          handleTimeChange(
                            day,
                            "break_end_time",
                            e.target.value
                          )
                        }
                        disabled={!formData.restaurantBook[day].selected}
                      />
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={
                          formData.restaurantBook[day].booking_allowed === true
                        }
                        onChange={(e) =>
                          handleTimeChange(
                            day,
                            "booking_allowed",
                            e.target.checked ? true : false
                          )
                        }
                        disabled={!formData.restaurantBook[day].selected}
                      />
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={
                          formData.restaurantBook[day].order_allowed === true
                        }
                        onChange={(e) =>
                          handleTimeChange(
                            day,
                            "order_allowed",
                            e.target.checked ? true : false
                          )
                        }
                        disabled={!formData.restaurantBook[day].selected}
                      />
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="time"
                        className="border border-gray-400 p-2 rounded-md"
                        value={
                          formData.restaurantBook[day].last_booking_order_time
                        }
                        onChange={(e) =>
                          handleTimeChange(
                            day,
                            "last_booking_order_time",
                            e.target.value
                          )
                        }
                        disabled={!formData.restaurantBook[day].selected}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full mx-3 my-5 p-5 shadow-lg rounded-lg border border-gray-300">
          <h3 className="border-b text-center text-xl border-black mb-6 font-bold">
            BLOCKED DAYS
          </h3>

          <div>
            <button
              onClick={addRow}
              className="px-4 py-2 border border-blue-500 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Add
            </button>

            {rows.map((row, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  checked={row.order}
                  onChange={(e) => {
                    const newRows = [...rows];
                    newRows[index].order = e.target.checked;
                    setRows(newRows);
                  }}
                />
                &nbsp;&nbsp;
                <label>Order</label>
                &nbsp;&nbsp;
                <input
                  type="checkbox"
                  checked={row.booking}
                  onChange={(e) => {
                    const newRows = [...rows];
                    newRows[index].booking = e.target.checked;
                    setRows(newRows);
                  }}
                />
                &nbsp;&nbsp;
                <label>Booking</label>
                &nbsp;&nbsp;
                <input
                  type="date"
                  className="border border-gray-400 p-2 rounded-md"
                  value={row.date}
                  onChange={(e) => {
                    const newRows = [...rows];
                    newRows[index].date = e.target.value;
                    setRows(newRows);
                  }}
                />
                &nbsp;
                <button
                  onClick={() => deleteRow(index)}
                  className="px-4 py-2 border border-red-500 rounded bg-red-500 text-white hover:bg-blue-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full mx-3 my-5 p-5 shadow-lg rounded-lg border border-gray-300">
          <h3 className="border-b text-center text-xl border-black mb-6 font-bold">
            TABLE BOOKING
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="minimum-person"
              >
                Minimum Person
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="minimum-person"
                type="text"
                name="minimumPerson"
                value={formData.minimumPerson}
                onChange={handleChange}
                placeholder="Minimum Person"
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="maximum-person"
              >
                Maximum Person
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="maximum-person"
                type="text"
                name="maximumPerson"
                value={formData.maximumPerson}
                onChange={handleChange}
                placeholder="Maximum Person"
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="can-cancel-before"
              >
                Can Cancel Before
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="can-cancel-before"
                type="text"
                name="canCancelBefore"
                value={formData.canCancelBefore}
                onChange={handleChange}
                placeholder="In Mins"
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="booking-not-allowed-text"
              >
                Booking Not Allowed Text
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="booking-not-allowed-text"
                type="text"
                name="bookingNotAllowedText"
                value={formData.bookingNotAllowedText}
                onChange={handleChange}
                placeholder="Booking Not Allowed Text"
              />
            </div>
          </div>
        </div>
        <div className="w-full mx-3 my-5 p-5 shadow-lg rounded-lg border border-gray-300">
          <h3 className="border-b text-center text-xl border-black mb-6 font-bold">
            ORDER CONFIGURE
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="GST"
              >
                GST(%)
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="GST"
                type="text"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                placeholder="GST(%)"
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="delivery-charge"
              >
                Delivery Charge
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="delivery-charge"
                type="text"
                name="deliveryCharge"
                value={formData.deliveryCharge}
                onChange={handleChange}
                placeholder=" Delivery Charge"
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="delivery-charge"
              >
                Service Charge(%)
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="delivery-charge"
                type="text"
                name="service_charge"
                placeholder="Service Charge(%)"
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="minimum-order"
              >
                Minimum Order
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="minimum-order"
                type="text"
                name="minimumOrder"
                value={formData.minimumOrder}
                onChange={handleChange}
                placeholder="Minimum Order"
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="order-not-allowed-text"
              >
                Order Not Allowed Text
              </label>
              <input
                className="border border-gray-400 p-2 rounded-md placeholder:text-sm w-full"
                id="order-not-allowed-text"
                type="text"
                name="orderNotAllowedText"
                value={formData.orderNotAllowedText}
                onChange={handleChange}
                placeholder="Order Not Allowed Text"
              />
            </div>
          </div>
        </div>
        <div className="w-full mx-3 my-5 p-5 shadow-lg rounded-lg border border-gray-300">
          <h3 className="border-b text-center text-xl border-black mb-6 font-bold">
            ATTACHMENTS
          </h3>
          <label htmlFor="" className="font-medium my-1">
            Cover Image
          </label>

          <FileInputBox
            handleChange={(files) => handleFileChange(files, "cover_image")}
            fieldName={"cover_image"}
            // isMulti={true}
          />
          <label htmlFor="" className="font-medium">
            Menu
          </label>
          <FileInputBox
            handleChange={(files) => handleFileChange(files, "menu")}
            fieldName={"Menu"}
            isMulti={true}
          />
          <label htmlFor="" className="font-medium my-1">
            Gallery
          </label>
          <FileInputBox
            handleChange={(files) => handleFileChange(files, "gallery")}
            fieldName={"gallery"}
            isMulti={true}
          />
        </div>

        <div className="sm:flex justify-center grid gap-2 my-5 ">
          <button
            className="bg-black text-white p-2 px-4 rounded-md font-medium"
            onClick={handleEdit}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default FBRestaurtantEdit;
