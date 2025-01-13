import React, { useState, useEffect } from "react";
import Wrapper from "../layout/wrapper";
import SEO from "../common/seo";
import Profil from "../components/account/create-profil";
import Image from 'next/image'; // Import the next/image component

const Index = () => {
    const [isLoading, setIsLoading] = useState(true);

    // Path to the image in the public folder
    const imagePath = "/assets/video/1.gif"; // Directly reference assets from public folder

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        // Cleanup function to clear the timer if the component unmounts before timeout
        return () => clearTimeout(timer);
    }, []);

    return (
        <Wrapper>
            <SEO pageTitle={"Create Profile"} />
            {isLoading ? (
                <div className="loading-container">
                    {/* Using next/image for optimized loading */}
                    <Image
                        src={imagePath}
                        alt="Loading animation"
                        layout="intrinsic" // Ensures correct aspect ratio
                        width={500} // Adjust based on your image's size
                        height={500} // Adjust based on your image's size
                    />
                </div>
            ) : (
                <Profil />
            )}
        </Wrapper>
    );
};

export default Index;
