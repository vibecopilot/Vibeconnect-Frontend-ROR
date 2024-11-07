import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import FileInputBox from "../../containers/Inputs/FileInputBox";

function CreateForum() {
  const themeColor = useSelector((state) => state.theme.color);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: "",
    description: "",
    attachments: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="w-full flex mx-3 flex-col overflow-hidden mb-5">
        <div className="flex justify-center">
          <div className="border border-gray-400 rounded-md my-5 w-4/5">
            <h2
              style={{ background: themeColor }}
              className="text-center text-xl font-bold my-2 p-2  rounded-md text-white mx-2"
            >
              Create Forum
            </h2>
            <div className="md:grid grid-cols-3 mx-5 gap-5 mt-5 mb-2">
              <div className="flex flex-col ">
                <label htmlFor="" className="font-semibold my-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter Title "
                  className="border p-2 px-4 border-gray-400 rounded-md"
                  onChange={handleChange}
                  value={formData.title}
                  name="title"
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="" className="font-semibold my-2">
                  Category
                </label>
                <select className="border p-2 px-4 border-gray-400 rounded-md" name="">
                  <option value="">Select Category </option>
                  <option value="General">General</option>
                  <option value="Discussion">Discussion</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Support">Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex flex-col ">
                <label htmlFor="" className="font-semibold my-2">
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="#tags"
                  className="border p-2 px-4 border-gray-400 rounded-md"
                />
              </div>
            </div>
            <div className="grid grid-cols mx-5 gap-5 my-2">
              <div className="flex flex-col ">
                <label htmlFor="" className="font-semibold my-2">
                  Thread Description
                </label>
                <textarea
                  name=""
                  id=""
                  cols="5"
                  rows="3"
                  placeholder="Description"
                  className="border p-2 px-4 border-gray-400 rounded-md"
                />
              </div>
            </div>
            <div className="mx-5 flex flex-col gap-2">
              <label htmlFor="" className="font-medium">
                Forum profile picture
              </label>
              <input
                type="file"
                name=""
                id=""
                className="border p-2 rounded-md"
              />
            </div>
            <div className="flex justify-center my-4 gap-2">
              <button
                style={{ background: themeColor }}
                className="bg-black text-white p-2 px-4 rounded-md font-medium"
              >
                Create Forum
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateForum;
