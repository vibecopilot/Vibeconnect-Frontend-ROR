// Re-exports the shared axiosInstance so the dashboard uses the same
// base URL and auth interceptor as the rest of the app.
import axiosInstance from "../../api/axiosInstance";

export default axiosInstance;
