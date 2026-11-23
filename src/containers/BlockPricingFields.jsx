import React from "react";
import { BLOCK_PRICING_TYPE } from "../utils/blockPricing";

const hoursValue = (minutes) =>
  minutes === "" || minutes === null || minutes === undefined ? "" : Number(minutes) / 60;

const toMinutes = (hours) => (hours === "" ? "" : Math.round(Number(hours) * 60));

const BlockPricingFields = ({ value, onChange }) => {
  const update = (field, fieldValue) => onChange({ ...value, [field]: fieldValue });
  const isBlock = value.pricing_type === BLOCK_PRICING_TYPE;

  return (
    <div className="border rounded-md p-3 my-3 bg-white">
      <div className="flex flex-col gap-2 md:w-1/3">
        <label className="font-medium">Pricing type</label>
        <select
          className="border rounded-md p-2"
          value={isBlock ? BLOCK_PRICING_TYPE : ""}
          onChange={(e) => update("pricing_type", e.target.value)}
        >
          <option value="">Standard</option>
          <option value={BLOCK_PRICING_TYPE}>Base + extra time</option>
        </select>
      </div>
      {isBlock && (
        <>
          <div className="grid md:grid-cols-4 gap-3 mt-3">
            <div className="flex flex-col gap-1">
              <label className="font-medium">Base amount (₹)</label>
              <input
                type="number"
                min={0}
                className="border rounded-md p-2"
                value={value.base_amount}
                onChange={(e) => update("base_amount", e.target.value)}
                placeholder="e.g. 10000"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Base duration (hours)</label>
              <input
                type="number"
                min={0.25}
                step={0.25}
                className="border rounded-md p-2"
                value={hoursValue(value.base_duration_minutes)}
                onChange={(e) => update("base_duration_minutes", toMinutes(e.target.value))}
                placeholder="e.g. 3"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Extra time amount (₹)</label>
              <input
                type="number"
                min={0}
                className="border rounded-md p-2"
                value={value.extra_amount}
                onChange={(e) => update("extra_amount", e.target.value)}
                placeholder="e.g. 3000"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Extra time per (hours)</label>
              <input
                type="number"
                min={0.25}
                step={0.25}
                className="border rounded-md p-2"
                value={hoursValue(value.extra_duration_minutes)}
                onChange={(e) => update("extra_duration_minutes", toMinutes(e.target.value))}
                placeholder="e.g. 1"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Bookings up to the base duration pay the base amount. Each extra block, or part of it,
            is charged at the extra time amount. GST is added on top. The number of people does not
            change the price. Turn on consecutive slots and set max slots so longer bookings and
            extensions are possible.
          </p>
        </>
      )}
    </div>
  );
};

export default BlockPricingFields;
