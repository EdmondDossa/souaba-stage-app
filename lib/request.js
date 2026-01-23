import axios from "axios";

//Will be moved in .env file later
const baseURL = process.env.NEXT_PUBLIC_API_URL;

function getAxiosInstance() {
  //typeof window === "undefined" - we are on the server - ssr enabled
  const headers = (() => {
    if (typeof window === "undefined") {
      return { "User-Agent": "Next.js SSR" };
    }
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  })();
  return createAxiosInstance(headers);
}

function createAxiosInstance(headers) {
  return axios.create({
    baseURL,
    headers,
    withCredentials: true,
  });
}

export default getAxiosInstance;
