// auth.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const BASE_URL = "https://jagobelajar.cloud/api/auth";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isLoginEndpoint = error.config.url.includes("/login");

    if (error.response?.status === 401 && !isLoginEndpoint) {
      localStorage.clear();
      const result = await Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#111F2C",
      });

      if (result.isConfirmed) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const showErrorAlert = useCallback(async (message) => {
    return await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
      confirmButtonText: "OK",
      confirmButtonColor: "#111F2C",
    });
  }, []);

  const checkLoginStatus = useCallback(async () => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (!token || !tokenExpiry) {
      setIsLoggedIn(false);
      setUser(null);
      setLoading(false);
      return;
    }

    const now = new Date().getTime();
    const expiryTime = parseInt(tokenExpiry, 10);

    if (now >= expiryTime) {
      localStorage.clear();
      setIsLoggedIn(false);
      setUser(null);
      const result = await showErrorAlert(
        "Session expired. Please log in again."
      );
      if (result.isConfirmed) {
        router.push("/login");
      }
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/user-data");
      setIsLoggedIn(true);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      localStorage.clear();
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [router, showErrorAlert]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const login = async (email, password) => {
    if (!email || !password) {
      return { success: false, error: "Email dan password harus diisi" };
    }

    try {
      const response = await api.post("/login", {
        email: email.trim(),
        password: password.trim(),
      });

      const { data } = response.data;

      if (!data?.token) {
        throw new Error("Token tidak ditemukan dalam respons");
      }

      localStorage.setItem("token", data.token);
      const expiryTime = new Date().getTime() + data.expired_in * 1000;
      localStorage.setItem("tokenExpiry", expiryTime.toString());

      setIsLoggedIn(true);
      setUser(data);

      return { success: true, data };
    } catch (error) {
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = "Email atau password salah. Silakan coba lagi.";
            break;
          case 404:
            errorMessage =
              "Email tidak ditemukan. Silakan daftar terlebih dahulu.";
            break;
          case 403:
            errorMessage =
              "Email belum diverifikasi. Silakan periksa kotak masuk email Anda.";
            break;
          case 429:
            errorMessage =
              "Terlalu banyak percobaan. Silakan tunggu beberapa saat.";
            break;
          default:
            errorMessage =
              error.response.data?.message || "Terjadi kesalahan pada server.";
        }
      }

      return { success: false, error: errorMessage };
    }
  };

  // Modified logout function to handle failed server logout gracefully
  const logout = async () => {
    try {
      // Try to logout from server, but proceed with local logout even if it fails
      try {
        await api.post("/logout");
      } catch (error) {
        console.warn(
          "Server logout failed, proceeding with local logout:",
          error
        );
      }

      // Always clear local storage and state
      localStorage.clear();
      setIsLoggedIn(false);
      setUser(null);

      const result = await Swal.fire({
        title: "Berhasil Logout",
        text: "Anda telah berhasil keluar dari sistem.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#111F2C",
      });

      if (result.isConfirmed) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout process failed:", error);
      // Ensure local cleanup even if something goes wrong
      localStorage.clearuser
      setIsLoggedIn(false);
      setUser(null);
      router.push("/login");
    }
  };

  return {
    isLoggedIn,
    loading,
    user,
    login,
    logout,
    checkLoginStatus,
  };
};

export default useAuth;
