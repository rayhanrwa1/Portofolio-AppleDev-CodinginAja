import React, { useState, useEffect } from "react";
import Breadcrumb from "@/src/common/breadcrumbs/breadcrumb";
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import TeamDetailsArea from "./team-details-area";
import Footer from "@/src/layout/footers/footer";
import Swal from "sweetalert2";
import axios from "axios"; // Axios for API requests

const TeamDetails = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        let timer;

        // Function to reset session timeout
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                handleLogout();
            }, 5 * 30 * 1000); // 5 minutes timeout
        };

        // Check the user's login status by making an API call to the Laravel backend
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get("/api/user"); // Laravel endpoint for user info
                if (response.data.loggedIn) {
                    setLoggedIn(true);
                    resetTimer(); // Reset timer if the user is logged in
                } else {
                    setLoggedIn(false);
                    showLoginAlert(); // Show login alert if the user is not logged in
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setLoggedIn(false);
                showLoginAlert(); // Show alert if there is an error
            }
        };

        checkLoginStatus(); // Call checkLoginStatus on component mount

        // Add event listeners to reset session timeout on user activity
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);

        return () => {
            clearTimeout(timer); // Clean up the timer when the component is unmounted
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
        };
    }, []);

    // Handle logout by calling Laravel API to logout the user
    const handleLogout = async () => {
        try {
            await axios.post("/api/logout"); // Laravel logout API
            setLoggedIn(false);
            Swal.fire({
                title: "Session Expired",
                text: "Please log in again!",
                icon: "info"
            });
            window.location.href = "/login"; // Redirect to login page
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // Show an alert if the user is not logged in
    const showLoginAlert = () => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Access Restricted!",
            footer: '<a href="/panduan">Login Instructions</a>',
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonColor: "#111F2C",
            didOpen: () => {
                document.body.classList.add("blur"); // Add blur effect on the body
            },
            willClose: () => {
                document.body.classList.remove("blur"); // Remove blur effect when the alert is closed
                window.location.href = "/"; // Redirect to home if user is not logged in
            }
        });
    };

    return (
        <>
            {loggedIn ? <HeaderTwo /> : <HeaderOne />}
            <main>
                <Breadcrumb title="Rahmat Fadilah" innertitle="Rahmat Fadilah" />
                <TeamDetailsArea />
            </main>
            <Footer />
        </>
    );
};

export default TeamDetails;
