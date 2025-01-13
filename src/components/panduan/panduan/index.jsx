import Footer from "@/src/layout/footers/footer";
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Privacy from "src/components/panduan/panduan/panduan-env";

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

const ResetPassword = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        let timer;

        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(handleLogout, SESSION_TIMEOUT);
        };

        const checkLoginStatus = async () => {
            try {
                const response = await axios.get("/api/user");
                if (response.data.loggedIn) {
                    setLoggedIn(true);
                    resetTimer();
                } else {
                    setLoggedIn(false);
                    showLoginAlert();
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setLoggedIn(false);
                showLoginAlert();
            }
        };

        const setupEventListeners = () => {
            window.addEventListener("mousemove", resetTimer);
            window.addEventListener("keypress", resetTimer);
        };

        const cleanupEventListeners = () => {
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
        };

        checkLoginStatus();
        setupEventListeners();

        return () => {
            clearTimeout(timer);
            cleanupEventListeners();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            setLoggedIn(false);
            Swal.fire({
                title: "Session Expired",
                text: "Please login again!",
                icon: "info",
                confirmButtonColor: "#111F2C",
            }).then(() => {
                window.location.href = "/login";
            });
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const showLoginAlert = () => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Access Denied!!",
            footer: '<a href="/panduan">Login Guidelines</a>',
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonColor: "#111F2C",
            didOpen: () => {
                document.body.classList.add('blur');
            },
            willClose: () => {
                document.body.classList.remove('blur');
                window.location.href = "/";
            },
        });
    };

    return (
        <>
            {loggedIn ? <HeaderTwo /> : <HeaderOne />}
            <main>
                <Privacy />
            </main>
            <Footer />
        </>
    );
};

export default ResetPassword;