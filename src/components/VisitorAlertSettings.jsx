import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// LocalStorage key constant
const STORAGE_KEY = "VISITOR_ALERT_CONFIG";

const defaultConfig = {
  enabled: false,
  value: 4, // default threshold
  unit: "hours", // hours | days
};

const VisitorAlertSettings = () => {
  const [enabled, setEnabled] = useState(defaultConfig.enabled);
  const [value, setValue] = useState(defaultConfig.value);
  const [unit, setUnit] = useState(defaultConfig.unit);
  const [loaded, setLoaded] = useState(false);

  // Load persisted config
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setEnabled(!!parsed.enabled);
          setValue(parsed.value || defaultConfig.value);
          setUnit(parsed.unit || defaultConfig.unit);
        }
      }
    } catch (e) {
      console.error("Failed to parse visitor alert config", e);
    } finally {
      setLoaded(true);
    }
  }, []);

  const handleSave = () => {
    if (!value || value <= 0) {
      toast.error("Please enter a valid threshold value");
      return;
    }
    const config = { enabled, value, unit };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    toast.success("Visitor alert settings saved");
  };

  return (
    <div className="p-4 border rounded-md bg-white shadow-sm w-full max-w-xl mt-4">
      <h2 className="text-lg font-semibold mb-3">Visitor Overstay Alerts</h2>
      <p className="text-sm text-gray-600 mb-4">
        Enable automatic notifications if a checked-in visitor remains IN beyond the configured time threshold. Notifications are shown to the host & security until checkout.
      </p>
      <div className="flex items-center mb-4 gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm font-medium">Enable Alerts</span>
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-700">Threshold Value</label>
          <input
            type="number"
            min={1}
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value, 10) || 0)}
            className="mt-1 w-full border rounded-md p-2 text-sm"
            disabled={!enabled}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700">Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="mt-1 w-full border rounded-md p-2 text-sm"
            disabled={!enabled}
          >
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!loaded}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md disabled:opacity-50"
        >
          Save Settings
        </button>
        <button
          onClick={() => {
            setEnabled(defaultConfig.enabled);
            setValue(defaultConfig.value);
            setUnit(defaultConfig.unit);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
            toast.success("Settings reset");
          }}
          className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-sm rounded-md"
        >
          Reset
        </button>
      </div>
      {enabled && (
        <p className="mt-4 text-xs text-gray-500">
          Active: Visitors IN longer than {value} {unit === "hours" ? "hour(s)" : "day(s)"} trigger alerts every few minutes.
        </p>
      )}
    </div>
  );
};

export default VisitorAlertSettings;
