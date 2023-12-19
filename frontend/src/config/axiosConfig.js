import axios from "axios";
import { BASE_URL } from "./clientConfiig";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.timeout = 6000;

export default axiosInstance;
