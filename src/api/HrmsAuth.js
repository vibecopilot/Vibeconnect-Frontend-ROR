import axios from "axios";
import { getItemInLocalStorage } from "../utils/localStorage";

const HrmsAuth= axios.create({
  baseURL: "http://13.126.205.205/",
});

HrmsAuth.interceptors.request.use(
    (config) => {
      const token = getItemInLocalStorage("VIBETOKEN");
      
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default HrmsAuth;
