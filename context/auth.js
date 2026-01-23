"use client";

import getAxiosInstance from "@/lib/request";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogged, setLogged] = useState(false);
  const [user, setUser] = useState({});
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchUser(withLoader = true) {
    const http = getAxiosInstance(); // rebuild to capture latest tokens
    try {
      if (withLoader) setLoading(true);
      const res = await http.get("/users/me");
      setLogged(true);
      setUser({ ...res.data, ...(res?.data?.profile || {}) });
      return { success: true };
    } catch (error) {
      setLogged(false);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }

  async function login(credentials) {
    const http = getAxiosInstance();
    try {
      const { data } = await http.post("/auth/login", credentials);
      const access = data?.accessToken || data?.access || null;
      const refresh = data?.refreshToken || data?.refresh || null;

      if (access) localStorage.setItem("accessToken", access);
      if (refresh) localStorage.setItem("refreshToken", refresh);

      setLogged(true);
      await fetchUser(false);
      router.push("/");
      return { success: true };
    } catch (error) {
      const status = error?.response?.status;
      const code = error?.response?.data?.code;
      return {
        success: false,
        status: status,
        message:
          error?.response?.data?.message ||
          "Une erreur est survenue. Veuillez réesayez plus tard.",
        code,
      };
    }
  }

  async function register(user) {
    const http = getAxiosInstance();
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
    const http = getAxiosInstance();
    try {
      await http.post("/auth/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setLogged(false);
      router.push("/login");
    } catch (error) {}
  }
  useEffect(() => {
    fetchUser();
  }, []);

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
