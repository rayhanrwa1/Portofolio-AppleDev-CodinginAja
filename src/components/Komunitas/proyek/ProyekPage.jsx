//ProyekPage

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Swal from "sweetalert2";
import useAuth from "../../../../Database/Auth/auth";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { openEditForm, openAddModal, showProjectDetails } from "../proyek/ProyekStyles";
import { useProjectForm } from "../../Komunitas/proyek/useProjectForm";
import Image from 'next/image';

const ProyekPage = () => {
    const { logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const router = useRouter();

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
        photo: null
    });

    // Handle Project Form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Add handleSubmit function for creating new projects
    const handleSubmit = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const projectsApi = axios.create({
                baseURL: 'https://jagobelajar.cloud/api',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });

            // Convert form data to FormData object if it isn't already
            const submitData = formData instanceof FormData ? formData : new FormData();
            if (!(formData instanceof FormData)) {
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        submitData.append(key, value);
                    }
                });
            }

            const response = await projectsApi.post('/projects/store', submitData);

            // Check if the message contains success in any form (including Indonesian)
            const successMessages = ['success', 'berhasil', 'proyek berhasil disimpan']; // Adjusted check for multiple languages
            if (successMessages.some(msg => response.data.message.toLowerCase().includes(msg))) {
                await Swal.fire({
                    title: "Success",
                    text: "Project created successfully!",
                    icon: "success",
                    timer: 1500
                });

                // Refresh the projects list
                await fetchProjects();
            } else {
                // Log the response message if it's not a success
                console.error("Unexpected response: ", response.data.message);
                throw new Error(response.data.message || 'Creation failed');
            }
        } catch (error) {
            console.error("Error creating project:", error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || error.message || "Failed to create project. Please try again.",
                icon: "error",
            });
        }
    };



    // Utility function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Fetch Projects
    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log("No token found in localStorage");
                setLoading(false);
                return;
            }

            const projectsApi = axios.create({
                baseURL: 'https://jagobelajar.cloud/api',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const response = await projectsApi.get('/projects');
            setProjects(response.data.data || []);
            setLoading(false);
        } catch (error) {
            if (error.response?.status === 401) {
                await handleSessionTimeout();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Failed to fetch projects. Please try again later.",
                    icon: "error",
                });
            }
            setLoading(false);
        }
    };

    const handleSessionTimeout = async () => {
        await logout();
        Swal.fire({
            title: "Session Expired",
            text: "Please login again!",
            icon: "info",
        }).then(() => {
            router.push('/login');
        });
    };

    // Modified handleUpdate function for ProyekPage.jsx
    const handleUpdate = async (projectId, formData) => {
        console.log('=== UPDATE PROCESS STARTED ===');
        console.log('Project ID:', projectId);

        if (!projectId) {
            console.error('Missing project ID');
            return Swal.fire({
                title: "Error",
                text: "Project ID is missing or invalid.",
                icon: "error",
            });
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Missing authentication token');
            return Swal.fire({
                title: "Unauthorized",
                text: "Please login again.",
                icon: "error",
            });
        }

        try {
            console.log('=== FORM DATA RECEIVED ===');
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            const projectsApi = axios.create({
                baseURL: 'https://jagobelajar.cloud/api',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });

            // Create a new FormData instance for the update
            const updatedFormData = new FormData();

            // Add the _method field for Laravel to handle it as PUT request
            updatedFormData.append('_method', 'PUT');

            // Copy all fields from the original formData
            for (let [key, value] of formData.entries()) {
                updatedFormData.append(key, value);
            }

            console.log('=== FINAL FORM DATA TO BE SENT ===');
            for (let pair of updatedFormData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            console.log('=== SENDING REQUEST ===');
            console.log('Endpoint:', `/projects/update/${projectId}`);

            const response = await projectsApi.put(`/projects/update/${projectId}`, updatedFormData);

            console.log('=== SERVER RESPONSE ===');
            console.log('Status:', response.status);
            console.log('Headers:', response.headers);
            console.log('Data:', response.data);

            if (response.data.message?.toLowerCase().includes("success")) {
                await Swal.fire({
                    title: "Success",
                    text: "Project updated successfully!",
                    icon: "success",
                    timer: 1500
                });

                // Refresh projects list
                await fetchProjects();
            } else {
                throw new Error(response.data.message || 'Update failed');
            }
        } catch (error) {
            console.error('=== ERROR DETAILS ===');
            console.error('Error object:', error);
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);
            console.error('Response headers:', error.response?.headers);

            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || error.message || "Failed to update project. Please try again.",
                icon: "error",
            });
        }
    };


    // Handle Delete Project
    const handleDelete = async (projectId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("Token not found in localStorage");
            return Swal.fire({
                title: "Unauthorized",
                text: "Please login again.",
                icon: "error",
            });
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-secondary'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const projectsApi = axios.create({
                        baseURL: 'https://jagobelajar.cloud/api',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });

                    const response = await projectsApi.delete('/projects/delete', {
                        data: { id: projectId }
                    });

                    Swal.fire({
                        title: "Deleted!",
                        text: "Project has been deleted.",
                        icon: "success",
                        timer: 1500
                    });
                    fetchProjects(); // Refresh the list of projects
                } catch (error) {
                    console.error('Error deleting project:', error);
                    Swal.fire({
                        title: "Error",
                        text: "Failed to delete project. Please try again.",
                        icon: "error",
                    });
                }
            } else {
                console.log("Deletion cancelled by user.");
            }
        });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Project List</h2>
                <button
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-gray-900 font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-lg flex items-center gap-2"
                    onClick={() => openAddModal(handleSubmit)}
                >
                    <FontAwesomeIcon icon={faPlus} className="text-gray-900" />
                    Add New Project
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-600">No projects available.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 border border-gray-100"
                        >
                            {project.photo && (
                                <Image
                                    src={`https://jagobelajar.cloud/storage/${project.photo}`}
                                    alt={project.project_name}
                                    layout="responsive"
                                    width={400}
                                    height={300}
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    unoptimized={true}
                                />
                            )}
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {project.project_name}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                                {project.description}
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${project.project_status === "Sedang Berjalan"
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {project.project_status}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-gray-900 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-medium text-sm shadow-sm hover:shadow-md"
                                    onClick={() => showProjectDetails(project, formatDate)}
                                >
                                    Detail
                                </button>
                                <button
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-medium text-sm shadow-sm hover:shadow-md"
                                    onClick={() => {
                                        setSelectedProject(project);
                                        openEditForm(project, setProjectForm, handleUpdate);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-gray-900 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium text-sm shadow-sm hover:shadow-md"
                                    onClick={() => handleDelete(project.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProyekPage;