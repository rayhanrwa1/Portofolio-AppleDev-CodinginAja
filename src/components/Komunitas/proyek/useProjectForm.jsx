//useProjectForm

import { useState } from "react";

export const useProjectForm = () => {
    // Define state for projectForm and setProjectForm here
    const [projectForm, setProjectForm] = useState({
        project_name: "",
        description: "",
        start_date: "",
        end_date: "",
        project_status: "",
        technologies_used: "",
        difficulty_level: "",
        repository_link: "",
        demo_link: "",
        photo: null,
    });

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectForm((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return {
        projectForm,
        setProjectForm,
        handleInputChange,
    };
};
