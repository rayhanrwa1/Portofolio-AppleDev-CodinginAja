import React, { useState, useEffect } from "react";
import Breadcrumb from "@/src/common/breadcrumbs/breadcrumb";
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import TeamDetailsArea from "./team-details-area";
import Footer from "@/src/layout/footers/footer";
import Swal from "sweetalert2";
import axios from "axios"; // Import Axios for API requests

const TeamDetails = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        let timer;

        // Function to reset session timer
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                handleLogout();
            }, 5 * 30 * 1000); // 5 minutes inactivity timeout
        };

        // Check login status by making an API call to Laravel backend
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get("/api/user"); // Laravel endpoint to check if the user is logged in
                if (response.data.loggedIn) {
                    setLoggedIn(true);
                    resetTimer(); // Reset timer if the user is logged in
                } else {
                    setLoggedIn(false);
                    showLoginAlert(); // Show login alert if user is not logged in
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setLoggedIn(false);
                showLoginAlert(); // Show login alert if there is an error
            }
        };

        checkLoginStatus(); // Check login status on component mount

        // Reset session timer on user activity (mouse move or keypress)
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
        };
    }, []);

    // Handle logout
    const handleLogout = async () => {
        try {
            await axios.post("/api/logout"); // Laravel logout endpoint
            setLoggedIn(false);
            Swal.fire({
                title: "Session Expired",
                text: "Please log in again!",
                icon: "info"
            });
            window.location.href = "/login"; // Redirect to login page after logout
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // Show login alert if user is not logged in
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
                document.body.classList.add("blur"); // Add blur effect to body
            },
            willClose: () => {
                document.body.classList.remove("blur"); // Remove blur effect from body
                window.location.href = "/"; // Redirect to home page
            }
        });
    };

    return (
        <>
            {loggedIn ? <HeaderTwo /> : <HeaderOne />}
            <main>
                <Breadcrumb title="Laras Suprapti" innertitle="Laras Suprapti" />
                <TeamDetailsArea />
            </main>
            <Footer />
        </>
    );
};

export default TeamDetails;
