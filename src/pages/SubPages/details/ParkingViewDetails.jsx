import React from "react";
import { AiFillCar } from "react-icons/ai";
import Navbar from "../../../components/Navbar";

const InfoItem = ({ label, value }) => (
  <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value}</p>
  </div>
);

const Slot = ({ name, active }) => (
  <div
    className={`shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl border shadow-sm
      flex flex-col items-center justify-center gap-1 transition
      ${
        active
          ? "bg-teal-500 border-teal-600 text-white"
          : "bg-gray-100 border-gray-200 text-gray-700"
      }`}
  >
    <AiFillCar className="text-xl md:text-2xl" />
    <p className="text-sm font-semibold">{name}</p>
  </div>
);

const SmallSlot = ({ name }) => (
  <div className="shrink-0 w-16 h-12 rounded-lg bg-teal-500 text-white text-sm font-semibold shadow-sm flex items-center justify-center">
    {name}
  </div>
);

const ParkingViewDetails = () => {
  const leftSlots = ["P11A", "P11B", "P12A", "P12B"];
  const rightSlots = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"];

  return (
    <section className="flex bg-gray-50 min-h-screen">
      <Navbar />

      <div className="w-full m-3">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-6">
          {/* Main Card */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 text-center">
                CLIENT PARKING DETAILS
              </h2>
            </div>

            {/* Body */}
            <div className="px-5 md:px-8 py-6 space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoItem label="Client Name" value="Shubh Jhaveri" />
                <InfoItem label="No. of 2 Wheeler" value="0" />
                <InfoItem label="No. of 4 Wheeler" value="0" />
                <InfoItem label="Start Period" value="01/10/2023" />
                <InfoItem label="End Period" value="01/10/2023" />
              </div>

              {/* Parking Meta */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <h3 className="text-sm md:text-base font-semibold text-gray-800 text-center">
                  Tower Name - Jyoti Tower , Floor Name - 2nd Floor, Parking Type - Two Wheeler
                </h3>
              </div>

              {/* Parking Slots */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
                {/* ✅ NO HORIZONTAL SCROLL: wrap instead of overflow-x-auto */}
                <div className="flex flex-wrap gap-5 pb-2">
                  {/* Left Slots */}
                  <div className="grid grid-cols-2 gap-2">
                    {leftSlots.map((slot) => (
                      <SmallSlot key={slot} name={slot} />
                    ))}
                  </div>

                  {/* Right Slots */}
                  <div className="flex flex-wrap gap-3">
                    {rightSlots.map((slot) => (
                      <Slot
                        key={slot}
                        name={slot}
                        active={slot === "P9" || slot === "P10"}
                      />
                    ))}
                  </div>
                </div>

                {/* optional helper text (keep/remove) */}
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Parking slots view
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParkingViewDetails;
