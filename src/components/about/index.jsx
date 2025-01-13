import React, { useState, useEffect } from "react";
import Breadcrumb from "@/src/common/breadcrumbs/breadcrumb";
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import AboutArea from "./about-area";
import Footer from "@/src/layout/footers/footer";
import Swal from "sweetalert2";

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

const About = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [logoutTimer, setLogoutTimer] = useState(null);

    const logout = () => {
        localStorage.removeItem("auth_token");
        setLoggedIn(false);
        window.location.href = "/login";
    };

    const showSessionExpiredAlert = () => {
        Swal.fire({
            title: "Sesi Anda Habis",
            text: "Silahkan Login Kembali!",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Login"
        }).then(() => {
            logout();
        });
    };

    const startTimer = () => {
        const timer = setTimeout(showSessionExpiredAlert, SESSION_TIMEOUT);
        setLogoutTimer(timer);
    };

    const resetTimer = () => {
        if (logoutTimer) {
            clearTimeout(logoutTimer);
            startTimer();
        }
    };

    const checkLoginStatus = () => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            setLoggedIn(true);
            startTimer();
        } else {
            setLoggedIn(false);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            checkLoginStatus();

            // Add event listeners for user activity
            const resetTimerOnActivity = () => {
                if (loggedIn) {
                    resetTimer();
                }
            };

            window.addEventListener('mousemove', resetTimerOnActivity);
            window.addEventListener('keypress', resetTimerOnActivity);

            return () => {
                if (logoutTimer) {
                    clearTimeout(logoutTimer);
                }
                window.removeEventListener('mousemove', resetTimerOnActivity);
                window.removeEventListener('keypress', resetTimerOnActivity);
            };
        }
    }, [loggedIn, logoutTimer]);

    // Initial server-side render state
    if (typeof window === 'undefined') {
        return (
            <>
                <HeaderOne />
                <Breadcrumb title="Tentang Kami" innertitle="Tentang Kami" />
                <AboutArea />
                <Footer />
            </>
        );
    }

    return (
        <>
            {loggedIn ? <HeaderTwo /> : <HeaderOne />}
            <Breadcrumb title="Tentang Kami" innertitle="Tentang Kami" />
            <AboutArea />
            <Footer />
        </>
    );
};

export default About;