// pages/proyek/index.js
import React from "react";
import Wrapper from "../../layout/wrapper"; 
import SEO from "../../common/seo";       
import ProyekIndexPage from "../../components/Komunitas/proyek/ProyekIndexPage";

const Index = () => {
    return (
        <Wrapper>
            <SEO pageTitle={"Proyek"} />
            <ProyekIndexPage />
        </Wrapper>
    );
};

export default Index;
