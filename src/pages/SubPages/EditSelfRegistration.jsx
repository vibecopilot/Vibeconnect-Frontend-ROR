import React, { useState, useRef, useCallback, useEffect } from "react";
import image from "/profile.png";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { getVisitorById, updateVisitor } from "../../api";

const EditSelfRegistration = () => {

  const themeColor = useSelector((state) => state.theme.color);

  const { id } = useParams();
  const location = useLocation();
 const searchParams = new URLSearchParams(location.search);
const token = searchParams.get("token") || "";

  const webcamRef = useRef(null);

  const [showWebcam, setShowWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [hosts, setHosts] = useState([]);

  const [formData, setFormData] = useState({
    visitor_type: "Guest",
    visiting_frequency: "Once",
    name: "",
    contact_no: "",
    host_id: "",
    pass_number: "",
    coming_from: "",
    vehicle_no: "",
    expected_date: "",
    expected_time: "",
    purpose: "",
    skip_host_approval: false,
    goods_inwards: false,
    additional_visitors: []
  });

useEffect(() => {

  if (!id) return;

  const fetchVisitor = async () => {
    try {

      const res = await getVisitorById(id);

      const data = res.data?.visitor || res.data;

      setFormData(prev => ({
        ...prev,
        visitor_type: data.visit_type || data.visitor_type || "Guest",
        visiting_frequency: data.visiting_frequency || "Once",
        name: data.name || "",
        contact_no: data.contact_no || "",
        host_id: data.host_id || "",
        pass_number: data.pass_number || "",
        coming_from: data.coming_from || "",
        vehicle_no: data.vehicle_no || "",
        expected_date: data.expected_date || "",
        expected_time: data.expected_time || "",
        purpose: data.purpose || "",
        skip_host_approval: data.skip_host_approval || false,
        goods_inwards: data.goods_inward ?? data.goods_inwards ?? false,
        additional_visitors: data.additional_visitors || []
      }));

      if (data.profile_picture) {
        setCapturedImage(
          "https://admin.vibecopilot.ai" + data.profile_picture
        );
      }

    } catch (err) {
      console.log(err);
    }
  };

  fetchVisitor();

}, [id]);

  const capture = useCallback(() => {

    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowWebcam(false);

  }, [webcamRef]);

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });

  };

  const addVisitor = () => {

    setFormData({
      ...formData,
      additional_visitors: [
        ...formData.additional_visitors,
        { name: "", mobile: "" }
      ]
    });

  };

  const removeVisitor = (index) => {

    const updated = [...formData.additional_visitors];
    updated.splice(index, 1);

    setFormData({
      ...formData,
      additional_visitors: updated
    });

  };

  const handleAdditionalChange = (index, field, value) => {

    const updated = [...formData.additional_visitors];
    updated[index][field] = value;

    setFormData({
      ...formData,
      additional_visitors: updated
    });

  };

 const handleSave = async () => {
  try {

    const form = new FormData();

    form.append("visitor[name]", formData.name);
    form.append("visitor[contact_no]", formData.contact_no);
    form.append("visitor[visitor_type]", formData.visitor_type);
    form.append("visitor[visiting_frequency]", formData.visiting_frequency);
    form.append("visitor[coming_from]", formData.coming_from);
    form.append("visitor[vehicle_no]", formData.vehicle_no);
    form.append("visitor[expected_date]", formData.expected_date);
    form.append("visitor[expected_time]", formData.expected_time);
    form.append("visitor[purpose]", formData.purpose);
    form.append("visitor[host_id]", formData.host_id);

    await updateVisitor(id, form, token);

    alert("Visitor updated successfully");

  } catch (error) {
    console.log(error);
  }
};
  return (

    <div className="w-full p-3">

      <div className="border border-gray-300 rounded-lg p-6 w-full">

        <h2
          style={{ background: themeColor }}
          className="text-center text-lg md:text-xl font-bold p-2 rounded-full text-white"
        >
          Edit Visitor
        </h2>

        {/* Profile */}

        <div className="flex justify-center mt-4">

          {!showWebcam ? (

            <button onClick={() => setShowWebcam(true)}>

              <img
                src={capturedImage || image}
                alt="visitor"
                className="border-4 border-gray-300 rounded-full w-32 h-32 md:w-40 md:h-40 object-cover"
              />

            </button>

          ) : (

            <div className="text-center">

              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded-full w-60 h-60"
              />

              <div className="flex justify-center gap-3 mt-2">

                <button
                  onClick={capture}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Capture
                </button>

                <button
                  onClick={() => setShowWebcam(false)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Close
                </button>

              </div>

            </div>

          )}

        </div>

        {/* Visitor Type */}

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 mt-4">

          <div>

            <p className="font-semibold">Visitor Type</p>

            <label className="mr-4">
              <input type="radio" name="visitor_type" value="Guest"
                checked={formData.visitor_type === "Guest"}
                onChange={handleChange}
              /> Guest
            </label>

            <label>
              <input type="radio" name="visitor_type" value="Support Staff"
                checked={formData.visitor_type === "Support Staff"}
                onChange={handleChange}
              /> Support Staff
            </label>

          </div>

          <div>

            <p className="font-semibold">Visiting Frequency</p>

            <label className="mr-4">
              <input type="radio" name="visiting_frequency" value="Once"
                checked={formData.visiting_frequency === "Once"}
                onChange={handleChange}
              /> Once
            </label>

            <label>
              <input type="radio" name="visiting_frequency" value="Frequently"
                checked={formData.visiting_frequency === "Frequently"}
                onChange={handleChange}
              /> Frequently
            </label>

          </div>

        </div>

        {/* Fields */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">

  <div>
    <label className="text-sm font-medium">Visitor Name :</label>
    <input
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="border p-2 rounded w-full"
    />
  </div>

  <div>
    <label className="text-sm font-medium">Mobile Number :</label>
    <input
      name="contact_no"
      value={formData.contact_no}
      onChange={handleChange}
      className="border p-2 rounded w-full"
    />
  </div>

  <div>
    <label className="text-sm font-medium">Host :</label>
    <select
      name="host_id"
      value={formData.host_id}
      onChange={handleChange}
      className="border p-2 rounded w-full"
    >
      <option>Select Person to meet</option>
      {hosts.map((h) => (
        <option key={h.id} value={h.id}>
          {h.full_name}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="text-sm font-medium">Pass Number :</label>
    <input
      name="pass_number"
      value={formData.pass_number}
      onChange={handleChange}
      className="border p-2 rounded w-full"
      placeholder="Enter Pass number"
    />
  </div>

  <div>
    <label className="text-sm font-medium">Coming from :</label>
    <input
      name="coming_from"
      value={formData.coming_from}
      onChange={handleChange}
      className="border p-2 rounded w-full"
    />
  </div>

  <div>
    <label className="text-sm font-medium">Vehicle Number :</label>
    <input
      name="vehicle_no"
      value={formData.vehicle_no}
      onChange={handleChange}
      className="border p-2 rounded w-full"
      placeholder="Enter Vehicle Number"
    />
  </div>

  <div>
    <label className="text-sm font-medium">Expected Date :</label>
    <input
      type="date"
      name="expected_date"
      value={formData.expected_date}
      onChange={handleChange}
      className="border p-2 rounded w-full"
    />
  </div>

  <div>
    <label className="text-sm font-medium">Expected Time :</label>
    <input
      type="time"
      name="expected_time"
      value={formData.expected_time}
      onChange={handleChange}
      className="border p-2 rounded w-full"
    />
  </div>

  <div>
    <label className="text-sm font-medium">Visit Purpose :</label>
    <select
      name="purpose"
      value={formData.purpose}
      onChange={handleChange}
      className="border p-2 rounded w-full"
    >
      <option value="">Select Purpose</option>
      <option>Meeting</option>
      <option>Delivery</option>
      <option>Personal</option>
      <option>Fitout Staff</option>
      <option>Other</option>
    </select>
  </div>

</div>

        {/* Checkboxes */}

        <div className="flex flex-col sm:flex-row gap-4 mt-4">

          <label>
            <input type="checkbox" name="skip_host_approval"
              checked={formData.skip_host_approval}
              onChange={handleChange}
            /> Skip Host Approval
          </label>

          <label>
            <input type="checkbox" name="goods_inwards"
              checked={formData.goods_inwards}
              onChange={handleChange}
            /> Goods Inwards
          </label>

        </div>

     {/* Additional Visitors */}

<div className="mt-5">

  <p className="font-semibold mb-1">
    Additional Visitor
  </p>

  <div className="border-t border-gray-300 mb-3"></div>

  <button
    onClick={addVisitor}
    className="bg-black text-white px-4 py-1 rounded"
  >
    Add Additional Visitor
  </button>

  {formData.additional_visitors.map((visitor, index) => (

    <div
      key={index}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3 items-center"
    >

      <input
        placeholder="Visitor Name"
        value={visitor.name}
        onChange={(e) =>
          handleAdditionalChange(index, "name", e.target.value)
        }
        className="border p-2 rounded"
      />

      <input
        placeholder="Mobile Number"
        value={visitor.mobile}
        onChange={(e) =>
          handleAdditionalChange(index, "mobile", e.target.value)
        }
        className="border p-2 rounded"
      />

      <button
        onClick={() => removeVisitor(index)}
        className="text-red-500 text-lg"
      >
        <FaTrash />
      </button>

    </div>

  ))}

</div>

        <div className="flex justify-center mt-5">

          <button
            onClick={handleSave}
            className="bg-black text-white px-8 py-2 rounded"
          >
            Save
          </button>

        </div>

      </div>

    </div>

  );

};

export default EditSelfRegistration;