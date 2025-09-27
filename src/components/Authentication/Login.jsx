import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import wave from "/wave.png";
import {
  getEmployeeAssociatedSites,
  getHRMSEmployeeID,
  login,
  getAdminAccess,
  vibeBGImages, // newly imported API call
} from "../../api";
import { setItemInLocalStorage, getItemInLocalStorage } from "../../utils/localStorage";

const Login = () => {
  const navigate = useNavigate();

  // Form and password states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [password, showPassword] = useState(false);
  const [page, setPage] = useState("login");

  // New states for role access
  const [roleAccess, setRoleAccess] = useState({});
  const [clientDashboardVisible, setClientDashboardVisible] = useState(false);

  // State for background image
  const [bgImage, setBgImage] = useState(wave);

  // Handle input change
  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // If token exists, check role access and redirect accordingly.
  useEffect(() => {
    const token = localStorage.getItem("TOKEN");
    const approverId = localStorage.getItem("APPROVERID");
    const hrmsOrgId = localStorage.getItem("HRMSORGID");
    if (token && approverId && hrmsOrgId) {
      const fetchRoleAccess = async () => {
        try {
          const res = await getAdminAccess(hrmsOrgId, approverId);
          if (res && res.length > 0) {
            const clientDashboardAccess =
              res[0].client_dashboard === true || res[0].client_dashboard === "true";
            if (clientDashboardAccess) {
              navigate("/admin/hrms/client-dashboard");
            } else {
              navigate("/dashboard");
            }
          } else {
            navigate("/dashboard");
          }
          toast.success("You are already logged in!");
        } catch (error) {
          console.error("Error fetching admin access:", error);
          navigate("/dashboard");
        }
      };
      fetchRoleAccess();
    }
  }, [navigate]);

  // Handle login form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const response = await login({
        user: {
          email: formData.email,
          password: formData.password,
        },
      });

      // Store various data in local storage
      console.log("response data:",response.data)
      const selectedSiteId = response.data.user.selected_site_id;
      const userNameFromResponse = response.data.user.firstname;
      const userEmail = response.data?.user?.email;
      const siteName = response.data?.site?.name;
      const mobileNumber = response.data?.user?.mobile;
      setItemInLocalStorage("SITENAME", siteName);
      setItemInLocalStorage("USEREMAIL", userEmail);
      setItemInLocalStorage("SITEID", selectedSiteId);
      setItemInLocalStorage("Name", userNameFromResponse);
      setItemInLocalStorage("Mobile", mobileNumber);
      const features = response.data.features;
      setItemInLocalStorage("FEATURES", features);

      const featNames = features.map((feature) => feature.feature_name);

      // (Optional) Vibe Login logic commented out
      // if (selectedSiteId === 10) {
      //   if (featNames.includes("project_task")) {
      //     const vibeResponse = await vibeLogin({
      //       email: formData.email,
      //       password: formData.password,
      //     });
      //     const vibeToken = vibeResponse.data.token.access.token;
      //     setItemInLocalStorage("VIBETOKEN", vibeToken);
      //     const vibeUserId = vibeResponse.data.data.user_id;
      //     setItemInLocalStorage("VIBEUSERID", vibeUserId);
      //     const vibeOrganizationId = vibeResponse.data.data.organization_id;
      //     setItemInLocalStorage("VIBEORGID", vibeOrganizationId);
      //   }
      // }

      // If HRMS feature is available, get employee and associated site info.
      if (featNames.includes("hrms") && response.data.user.organization_id) {
        try {
          const hrmsRes = await getHRMSEmployeeID(response.data.user.id);
          const siteRes = await getEmployeeAssociatedSites(hrmsRes.id);
          const associatedSiteID = siteRes[0].associated_organization;
          setItemInLocalStorage("HRMS_SITE_ID", associatedSiteID);
          setItemInLocalStorage("HRMS_EMPLOYEE_ID", hrmsRes.id);
          setItemInLocalStorage("APPROVERID", hrmsRes.id);
          setItemInLocalStorage("HRMSORGID",hrmsRes.organization)
        } catch (error) {
          console.error("Error getting employee ID:", error);
        }
      }

      // Store additional user details
      const loginD = response.data.user;
      setItemInLocalStorage("user", loginD);
      setItemInLocalStorage("UserId", response.data.user.id);
      setItemInLocalStorage("UNITID", response.data.user.unit_id);
      setItemInLocalStorage("Building", response.data.buildings);
      setItemInLocalStorage("categories", response.data.categories);
      const token = response.data.user.api_key;
      setItemInLocalStorage("TOKEN", token);
      setItemInLocalStorage("LASTNAME", response.data.user.lastname);
      const userType = response.data.user.user_type;
      setItemInLocalStorage("USERTYPE", userType);
      setItemInLocalStorage("COMPANYID", response.data.user.company_id);
      // setItemInLocalStorage("HRMSORGID", response.data.user.organization_id);
      setItemInLocalStorage("STATUS", response.data.statuses);
      setItemInLocalStorage("complaint", response.data.complanits);

      toast.loading("Processing your data please wait...");

      // -------------------------------
      // ROLE ACCESS CHECK FOR CLIENT DASHBOARD
      // -------------------------------
      const approverId = getItemInLocalStorage("APPROVERID");
      const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
      if (hrmsOrgId && approverId) {
        try {
          const accessRes = await getAdminAccess(hrmsOrgId, approverId);
          if (accessRes && accessRes.length > 0) {
            const clientDashboardAccess =
              accessRes[0].client_dashboard === true || accessRes[0].client_dashboard === "true";
            // Save full role access details in state if needed
            setRoleAccess(accessRes[0]);
            setClientDashboardVisible(clientDashboardAccess);
            
            // Store clientDashboardVisible in localStorage so App.jsx can check it
            localStorage.setItem('CLIENT_DASHBOARD_VISIBLE', clientDashboardAccess);
            
            console.log("Client Dashboard Visibility:", clientDashboardAccess);
            if (clientDashboardAccess) {
              toast.dismiss();
              navigate("/admin/hrms/client-dashboard");
              window.location.reload();
              return; // Stop further navigation
            }
          }
        } catch (error) {
          console.error("Error fetching admin access:", error);
        }
      }
      // -------------------------------
      // END ROLE ACCESS CHECK
      // -------------------------------

      // Continue with the normal navigation logic if client dashboard is not to be shown
      if (userType === "pms_admin") {
        navigate("/dashboard");
      } else if (userType === "auditor") {
        navigate("/dashboard");
      } else if (userType === "vendor") {
        navigate("/compliance/vendor/dashboard");
      } else {
        navigate(
          selectedSiteId === 10
            ? "/employee/dashboard"
            : response.data.user.organization_id
            ? "/employee-portal/attendance"
            : "/mytickets"
        );
      }
      toast.dismiss();
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  // Toggle password visibility
  const togglePassword = () => {
    showPassword(!password);
  };

  // Fetch background image from API and set it with 6-hour interval caching
  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        // Check if we have a cached image and timestamp
        const cachedImage = localStorage.getItem('VibeBg');
        const cachedTimestamp = localStorage.getItem('VibeBgTimestamp');
        const currentTime = new Date().getTime();
        const sixHours = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

        // If we have cached image and it's less than 6 hours old, use it
        if (cachedImage && cachedTimestamp && (currentTime - parseInt(cachedTimestamp)) < sixHours) {
          setBgImage(cachedImage);
          return;
        }

        // Fetch new image from API
        const aks = await vibeBGImages();
        const resp = aks.data;
        console.log("API response:", resp);

        if (resp && resp.data && resp.data.length > 0) {
          // Filter only images with key "VibeBg"
          const vibeBgImages = resp.data.filter(item => item.key === "VibeBg");
          console.log("Filtered VibeBg images:", vibeBgImages);
          
          if (vibeBgImages.length > 0) {
            // Calculate which image to show based on 6-hour intervals
            const dayStartTime = new Date();
            dayStartTime.setHours(0, 0, 0, 0); // Start of the day
            const timeSinceDayStart = currentTime - dayStartTime.getTime();
            const sixHourInterval = Math.floor(timeSinceDayStart / sixHours);
            const imageIndex = sixHourInterval % vibeBgImages.length; // Cycle through available images
            
            const selectedImage = vibeBgImages[imageIndex];
            const newImageUrl = selectedImage.image;
            
            console.log(`Using image ${imageIndex + 1} of ${vibeBgImages.length} for 6-hour interval ${sixHourInterval}`);
            console.log("Selected image URL:", newImageUrl);
            
            setBgImage(newImageUrl);
            
            // Cache the new image and timestamp
            localStorage.setItem('VibeBg', newImageUrl);
            localStorage.setItem('VibeBgTimestamp', currentTime.toString());
          } else {
            console.log("No VibeBg images found, using cached or default");
            if (cachedImage) {
              setBgImage(cachedImage);
            } else {
              setBgImage(wave);
            }
          }
        } else if (cachedImage) {
          // If API fails but we have a cached image, use it
          setBgImage(cachedImage);
        } else {
          // Fallback to default wave image
          setBgImage(wave);
        }
      } catch (error) {
        console.error("Error fetching background image:", error);
        
        // Try to use cached image as fallback
        const cachedImage = localStorage.getItem('VibeBg');
        if (cachedImage) {
          setBgImage(cachedImage);
        } else {
          // Final fallback to default wave image
          setBgImage(wave);
        }
      }
    };
    
    fetchBackgroundImage();
  }, []);

  return (
    <div
      className="h-screen relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        background: "blur",
        opacity: 0.9,
      }}
    >
      <div className="rounded-md">
        <h1 className="text-3xl text-white p-2 px-10 font-semibold jersey-15-regular">
          VIBE CONNECT
        </h1>
      </div>
      <div className="flex justify-center h-[90vh] items-center">
        <div className="bg-white border-2 border-white w-[30rem] rounded-xl max-h-full p-5 shadow-2xl">
          <h1 className="text-2xl font-semibold text-center">Login</h1>
          <form onSubmit={onSubmit} className="m-2 flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2 mx-5">
              <label htmlFor="email" className="font-medium">
                Email:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="rounded-sm p-1 px-2 border border-black"
                placeholder="example@company.com"
                onChange={onChange}
                value={formData.email}
              />
            </div>
            {page === "login" && (
              <div className="flex flex-col gap-2 relative mx-5">
                <label htmlFor="password" className="font-medium">
                  Password:
                </label>
                <input
                  name="password"
                  id="password"
                  className="rounded-sm p-1 px-2 border border-black"
                  placeholder="**********"
                  type={password ? "text" : "password"}
                  onChange={onChange}
                  value={formData.password}
                />
                <div className="p-1 rounded-full absolute top-12 right-2 transform -translate-y-1/2 cursor-pointer">
                  {password ? (
                    <AiFillEye onClick={togglePassword} />
                  ) : (
                    <AiFillEyeInvisible onClick={togglePassword} />
                  )}
                </div>
              </div>
            )}
            <div className="mx-5 flex gap-2">
              <input type="checkbox" name="" id="" />
              <label className="" htmlFor="">
                Remember Me
              </label>
            </div>
            <div className="flex justify-center gap-4 w-full">
              {page === "login" && (
                <button
                  type="submit"
                  className="w-20 my-2 bg-black text-white p-1 rounded-md text-xl font-bold hover:bg-gray-300"
                >
                  Login
                </button>
              )}
              <p
                onClick={() => setPage("sso")}
                className="w-20 my-2 border-black border-2 p-1 cursor-pointer text-center rounded-md text-xl font-medium hover:bg-gray-300"
              >
                {page === "sso" ? "Submit" : "SSO"}
              </p>
            </div>
            {page === "sso" && (
              <p
                className="text-center cursor-pointer hover:text-blue-400"
                onClick={() => setPage("login")}
              >
                Login
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
