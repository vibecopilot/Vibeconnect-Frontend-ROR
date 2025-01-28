import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";

import { MdDelete } from "react-icons/md";

const Auditmodel = ({ onclose }) => {
  const [formItems, setFormItems] = useState([
    { id: Date.now(), order: "", levelName: "", user: "", sendEmail: false },
  ]);

  const handleAdd = () => {
    setFormItems([
      ...formItems,
      { id: Date.now(), order: "", levelName: "", user: "", sendEmail: false },
    ]);
  };

  const handleDelete = (id) => {
    setFormItems(formItems.filter((item) => item.id !== id));
  };

  return (
    <ModalWrapper onclose={onclose}>
      <div className="w-full max-w-4xl mx-auto overflow-auto flex flex-col space-y-8">
        <div className="border-b border-gray-300 pb-3">
          <h2 className="text-xl font-bold text-gray-700">Filter By</h2>
        </div>

        <div className="space-y-4">
          {formItems.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 px-5 w-full"
            >
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-sm">
                  Order
                </label>
                <input
                  type="text"
                  value={item.order}
                  onChange={(e) =>
                    setFormItems(
                      formItems.map((el) =>
                        el.id === item.id
                          ? { ...el, order: e.target.value }
                          : el
                      )
                    )
                  }
                  className="border border-gray-400 p-2 rounded-md text-sm"
                  placeholder="Enter order"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-sm">
                  Name of Level
                </label>
                <input
                  type="text"
                  value={item.levelName}
                  onChange={(e) =>
                    setFormItems(
                      formItems.map((el) =>
                        el.id === item.id
                          ? { ...el, levelName: e.target.value }
                          : el
                      )
                    )
                  }
                  className="border border-gray-400 p-2 rounded-md text-sm"
                  placeholder="Enter Name of Level"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-600 text-sm">
                  Users
                </label>
                <select
                  value={item.user}
                  onChange={(e) =>
                    setFormItems(
                      formItems.map((el) =>
                        el.id === item.id ? { ...el, user: e.target.value } : el
                      )
                    )
                  }
                  className="border p-2 w-full border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 text-sm"
                >
                  <option value="">Select up to 15 Options</option>
                  <option value="User1">User1</option>
                  <option value="User2">User2</option>
                  <option value="User3">User3</option>
                </select>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <label className="font-semibold text-gray-600 text-sm">
                    Send Emails
                  </label>
                  <input
                    type="checkbox"
                    checked={item.sendEmail}
                    onChange={(e) =>
                      setFormItems(
                        formItems.map((el) =>
                          el.id === item.id
                            ? { ...el, sendEmail: e.target.checked }
                            : el
                        )
                      )
                    }
                    className="form-checkbox"
                  />
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm text-red-500 hover:underline mt-2 flex items-center"
                >
                  <MdDelete size={20} className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5">
          <button
            onClick={handleAdd}
            className="bg-gray-600 text-white rounded-md px-6 py-2 hover:bg-gray-700"
          >
            +
          </button>
        </div>

        <div className="flex gap-4 pt-5 border-t border-gray-300 mt-5 justify-end px-5">
          <button className="border border-gray-400 rounded-md px-6 py-2 hover:bg-gray-100 ">
            Apply
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default Auditmodel;
