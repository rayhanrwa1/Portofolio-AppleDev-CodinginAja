//index pada course 3
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/src/common/breadcrumbs/breadcrumb_4_setting";
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import Footer from "@/src/layout/footers/footer";
import SettingComponent from "./SettingComponent"; // Sesuaikan path jika perlu
import Swal from "sweetalert2";
import useAuth from "../../../../Database/Auth/auth"; // Import fungsi dari Auth.jsx (pastikan path sesuai)

const SetProfil = () => {
    const { isLoggedIn, checkLoginStatus, handleLogout } = useAuth(); // Ambil fungsi dan state dari Auth.jsx
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        let timer; // Timer untuk logout otomatis

        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                handleLogout(); // Logout setelah 5 menit tidak ada aktivitas
            }, 5 * 60 * 1000); // 5 menit
        };

        const initializeLoginStatus = async () => {
            try {
                const loggedInStatus = await checkLoginStatus(); // Panggil fungsi dari Auth.jsx
                setLoggedIn(loggedInStatus);

                if (!loggedInStatus) {
                    showLoginAlert(); // Tampilkan peringatan jika tidak login
                } else {
                    resetTimer(); // Reset timer jika login
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                showLoginAlert(); // Tampilkan peringatan jika terjadi kesalahan
            }
        };

        initializeLoginStatus(); // Periksa status login saat komponen dimuat

        // Reset timer setiap ada aktivitas pengguna (mouse move atau key press)
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
        };
    }, [checkLoginStatus, handleLogout]);

    // Fungsi untuk menampilkan peringatan login
    const showLoginAlert = () => {
        Swal.fire({
            icon: "error",
            title: "Akses Dibatasi",
            text: "Silakan login untuk mengakses konten!",
            footer: '<a href="/panduan">Ketentuan Login</a>',
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonColor: "#111F2C",
            backdrop: true, // Efek blur pada latar belakang
            didOpen: () => {
                const backdrop = document.querySelector(".swal2-backdrop");
                if (backdrop) {
                    backdrop.style.backdropFilter = "blur(100px)";
                }
            },
            didClose: () => {
                window.location.href = "/"; // Redirect ke homepage
            },
        });
    };

    return (
        <>
            {loggedIn ? <HeaderTwo /> : <HeaderOne />}
            <Breadcrumb title="Setting" innertitle="Edit Profile" />
            <SettingComponent />
            <Footer />
        </>
    );
};

export default SetProfil;
