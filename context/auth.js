"use client";

import getAxiosInstance from "@/lib/request";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  let http = getAxiosInstance();
  const [isLogged, setLogged] = useState(false);
  const [user, setUser] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function fetchUser(withLoader = true) {
    //to make sure to get last update in localstorage
    http = getAxiosInstance();
    try {
      //if it the first fetching a loader should be shown
      //but if it is fetching after updating no need to load
      if (withLoader) setLoading(true);
      const res = await http.get("/users/me");
      setLogged(true);
      setUser({ ...res.data, ...(res?.data?.profile || {}) });
    } catch (error) {
      setLogged(false);
    } finally {
      setLoading(false);
    }
  }

  async function login(credentials) {
    try {
      const { data } = await http.post("/auth/login", credentials);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      setLogged(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        status: error.status,
        message:
          error?.response?.data?.message ||
          "Une erreur est survenue. Veuillez réesayez plus tard.",
        code: error?.response?.data?.code,
      };
    }
  }

  async function register(user) {
    try {
      const res = await http.post("/auth/signup/", user);
      localStorage.setItem("activationToken", res.data?.activationToken);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        status: error.status,
        message:
          error?.response?.data?.message ||
          "Une erreur est survenue. Veuillez réesayez plus tard.",
      };
    }
  }

  async function logout() {
    try {
      await http.post("/auth/logout");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setLogged(false);
    } catch (error) {}
  }
  useEffect(() => {
    fetchUser();
  }, [isLogged]);

  const authContextData = {
    register,
    login,
    logout,
    fetchUser,
    isLogged,
    isLoading,
    user,
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuthContext() {
  return useContext(AuthContext);
}
