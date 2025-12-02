import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getVisitorAlertConfig, updateVisitorAlertConfig } from "../api";

const VisitorAlertSettings = () => {
  const [enabled, setEnabled] = useState(false);
  const [value, setValue] = useState(4);
  const [unit, setUnit] = useState("hours");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load config from backend
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await getVisitorAlertConfig();
      if (response.data) {
        setEnabled(!!response.data.enabled);
        setValue(response.data.value || 4);
        setUnit(response.data.unit || "hours");
      }
    } catch (error) {
      console.error("Failed to load visitor alert config", error);
      toast.error("Failed to load settings");
    } finally {
      setLoaded(true);
    }
  };

  const handleSave = async () => {
    if (!value || value <= 0) {
      toast.error("Please enter a valid threshold value");
      return;
    }

    setSaving(true);
    try {
      const config = { enabled, value: parseInt(value, 10), unit };
      await updateVisitorAlertConfig(config);
      toast.success("Visitor alert settings saved successfully");
    } catch (error) {
      console.error("Failed to save visitor alert config", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const defaultConfig = { enabled: false, value: 4, unit: "hours" };
    setEnabled(defaultConfig.enabled);
    setValue(defaultConfig.value);
    setUnit(defaultConfig.unit);

    setSaving(true);
    try {
      await updateVisitorAlertConfig(defaultConfig);
      toast.success("Settings reset to default");
    } catch (error) {
      console.error("Failed to reset settings", error);
      toast.error("Failed to reset settings");
    } finally {
      setSaving(false);
    }
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
          disabled={!loaded || saving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
        <button
          onClick={handleReset}
          disabled={saving}
          className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-sm rounded-md disabled:opacity-50"
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
