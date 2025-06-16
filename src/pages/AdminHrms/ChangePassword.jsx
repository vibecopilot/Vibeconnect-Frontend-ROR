import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { changeEmployeePassword, getEmployeeDetails } from "../../api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import EmployeeSections from "./EmployeeSections";
import EditEmployeeDirectory from "./EditEmployeeDirectory";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { getItemInLocalStorage } from "../../utils/localStorage";
import ThemeChanger from "../../components/ThemeChanger";
const ChangePassword = () => {
  const Id= getItemInLocalStorage("APPROVERID")
  const { id } = useParams();
  const themeColor = useSelector((state) => state.theme.color);
  const [formData, setFormData] = useState({
    email_id: "",
    new_password: "",
    employee_id: id,
    reset_by_employee:Id
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [employeeData, setEmployeeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch employee data on component mount
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const data = await getEmployeeDetails(id);
        console.log("Get Data of employee", data);
        setEmployeeData(data);
        setFormData((prev) => ({
          ...prev,
          email_id: data.email_id || "",
          employee_id: Number(data.id),
         
        }));
      } catch (error) {
        toast.error("Failed to load employee data");
      }
    };

    fetchEmployeeData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.new_password || !confirmPassword) {
      toast.error("Please fill in all password fields");
      setIsLoading(false);
      return;
    }

    if (formData.new_password !== confirmPassword) {
      toast.error("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    if (formData.new_password.length < 8) {
      toast.error("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending payload:", formData);
      await changeEmployeePassword(formData);
      toast.success("Password changed successfully!");
      // Reset form after successful submission
      setFormData((prev) => ({ ...prev, new_password: "" }));
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change error:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col ml-20 min-h-screen w-full bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
      <EditEmployeeDirectory />
      
      <div className="flex ">
        <EmployeeSections empId={id} />

        <div className="w-full mt-5 p-5 rounded-md">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Change Password</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                    minLength="8"
                    className="w-full p-2 border rounded pr-10"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded pr-10"
                    placeholder="Re-enter your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{ background: themeColor }}
                className={`mt-4 px-6 py-2 text-white font-medium rounded-md hover:opacity-90 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;