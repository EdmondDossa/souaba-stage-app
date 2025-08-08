import axios from "axios";

//Will be moved in .env file later
const baseURL = "http://localhost:8000";

function getAxiosInstance() {
  //we are on the server - ssr enabled
  if (typeof window === "undefined") {
    const headers = {
      "User-Agent": "Next.js SSR",
    };
    return createAxiosInstance(headers);
  }
  //we are on the browser - csr enabled
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("access_token") ?? ""}`,
  };
  return createAxiosInstance(headers);
}

function createAxiosInstance(headers) {
  return axios.create({
    baseURL,
    headers,
  });
}

export default getAxiosInstance;
