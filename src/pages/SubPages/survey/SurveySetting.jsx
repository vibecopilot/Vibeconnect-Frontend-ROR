import React from "react";
import { BsThreeDots } from "react-icons/bs";

function SurveySetting() {
  return (
    <div className="flex flex-col overflow-auto w-full">
      <div className="flex justify-between px-5 border-b py-3">
        <h2 className="text-sm">Dewdrop (Modified)</h2>
        <span>
          <BsThreeDots />
        </span>
      </div>
      <div className="grid grid-cols-2">
        <div className="flex flex-col border p-5">
          <h2>Roster Date</h2>
          <button>Edit</button>
        </div>
        <div className="flex flex-col py-3 border"></div>
        <div className="flex flex-col py-3 border"></div>
        <div className="flex flex-col py-3 border"></div>
      </div>
    </div>
  );
}

export default SurveySetting;
