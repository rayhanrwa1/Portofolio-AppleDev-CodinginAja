import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from '../../Database/Auth/auth';
import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Register from "../components/account/register";

const RegisterPage = () => {
    const router = useRouter();
    const { isLoggedIn, loading } = useAuth(); // Use loading to handle async state
    const [isChecking, setIsChecking] = useState(true); // Local state to manage component rendering

    useEffect(() => {
        if (!loading) {
            // Redirect if logged in, otherwise allow rendering the page
            if (isLoggedIn) {
                router.replace("/404"); // Redirect to a 404 or dashboard route as needed
            } else {
                setIsChecking(false); // Allow the component to render
            }
        }
    }, [isLoggedIn, loading, router]);

    // Show a loader while checking login state
    if (loading || isChecking) {
        return <div>Loading...</div>; // Replace with a proper loading spinner if available
    }

    return (
        <Wrapper>
            <SEO pageTitle="Register" />
            <Register />
        </Wrapper>
    );
};

export default RegisterPage;
