import React, { useState, useEffect } from "react";
import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Privacy from "../components/privacy_center/privacy/index";
import PrivacyLoggedIn from "../components/privacy_center/privacy_user"; // Component for logged-in users
import axios from "axios"; // For making API calls
import Swal from 'sweetalert2';

const Index = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [timer, setTimer] = useState(null); // Timer for session timeout

    useEffect(() => {
        // Function to check login status from Laravel backend
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get("/api/user"); // Endpoint to check login status
                if (response.data.loggedIn) {
                    setLoggedIn(true);
                    resetTimer(); // Start session timeout timer when logged in
                } else {
                    setLoggedIn(false);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setLoggedIn(false); // If error, assume not logged in
            }
        };

        // Function to handle auto logout after inactivity
        const resetTimer = () => {
            if (timer) {
                clearTimeout(timer); // Clear existing timer
            }

            const newTimer = setTimeout(() => {
                handleLogout(); // Logout after 30 seconds of inactivity
            }, 30 * 1000); // 30 seconds
            setTimer(newTimer);
        };

        // Function to handle logout
        const handleLogout = async () => {
            try {
                await axios.post("/api/logout"); // Laravel logout API call
                setLoggedIn(false);
                Swal.fire({
                    title: "Session Expired",
                    text: "Please log in again!",
                    icon: "info",
                });
                window.location.href = '/login'; // Redirect to login page after logout
            } catch (error) {
                console.error("Error logging out:", error);
            }
        };

        // Listen for user activity to reset the session timeout timer
        const handleUserActivity = () => {
            resetTimer();
        };

        checkLoginStatus(); // Check login status on component mount
        window.addEventListener("mousemove", handleUserActivity);
        window.addEventListener("keypress", handleUserActivity);

        // Cleanup the event listeners and timer on component unmount
        return () => {
            clearTimeout(timer); // Clean up the timer
            window.removeEventListener("mousemove", handleUserActivity);
            window.removeEventListener("keypress", handleUserActivity);
        };
    }, [timer]);

    return (
        <Wrapper>
            <SEO pageTitle={"Privacy Center"} />
            {loggedIn ? <PrivacyLoggedIn /> : <Privacy />}
        </Wrapper>
    );
};

export default Index;
