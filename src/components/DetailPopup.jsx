import React from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";

const DetailPopup = ({
  isOpen,
  onClose,
  title = "Details",
  subtitle = "",
  records = [],
  loading = false,
  columns = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {subtitle ? (
              <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition grid place-items-center text-gray-600"
          >
            <FaTimes className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-auto flex-1 p-5">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <FaSpinner className="animate-spin text-gray-400 text-3xl" />
            </div>
          ) : records.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              No records found.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="pb-3 pr-4 font-semibold text-gray-600 whitespace-nowrap"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((record, idx) => (
                  <tr
                    key={record.id ?? idx}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="py-3 pr-4 text-gray-700 whitespace-nowrap"
                      >
                        {col.accessor ? col.accessor(record) ?? "—" : record[col.key] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPopup;
