import axios from "axios";

//Will be moved in .env file later
const baseURL = process.env.NEXT_PUBLIC_API_URL;

function getAxiosInstance() {
  //typeof window === "undefined" - we are on the server - ssr enabled
  const headers =
    typeof window === "undefined"
      ? {
          "User-Agent": "Next.js SSR",
        }
      : {
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
