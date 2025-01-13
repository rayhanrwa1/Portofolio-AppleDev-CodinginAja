import React, { useState, useEffect } from "react";
import Breadcrumb from "@/src/common/breadcrumbs/breadcrumb";
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import TeamDetailsArea from "./team-details-area";
import Footer from "@/src/layout/footers/footer";
import Swal from "sweetalert2";
import axios from "axios"; // Axios to handle HTTP requests

const TeamDetails = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        let timer;

        // Function to reset the session timer
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                handleLogout();
            }, 5 * 30 * 1000); // 5 minutes timeout
        };

        // Function to check login status via Laravel API
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get("/api/user"); // Laravel endpoint to check login status
                if (response.data.loggedIn) {
                    setLoggedIn(true);
                    resetTimer(); // Reset session timeout if the user is logged in
                } else {
                    setLoggedIn(false);
                    showLoginAlert(); // Show alert if user is not logged in
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setLoggedIn(false);
                showLoginAlert(); // Show alert on error
            }
        };

        checkLoginStatus(); // Check login status on component mount

        // Event listeners to reset session timeout on user activity
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
        };
    }, []);

    // Function to handle logout via Laravel API
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

    // Show alert if user is not logged in
    const showLoginAlert = () => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Access Denied!",
            footer: '<a href="/panduan">Login Guidelines</a>',
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonColor: "#111F2C",
            didOpen: () => {
                document.body.classList.add("blur"); // Add blur effect on body
            },
            willClose: () => {
                document.body.classList.remove("blur"); // Remove blur effect on body
                window.location.href = "/"; // Redirect to homepage if user is not logged in
            }
        });
    };

    return (
        <>
            {loggedIn ? <HeaderTwo /> : <HeaderOne />}
            <main>
                <Breadcrumb title="Disya Nabila Setiawan" innertitle="Disya Nabila" />
                <TeamDetailsArea />
            </main>
            <Footer />
        </>
    );
};

export default TeamDetails;
