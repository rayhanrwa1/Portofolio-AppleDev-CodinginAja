// ProyekStyles.jsx
import Swal from "sweetalert2";
import { useProjectForm } from "../../Komunitas/proyek/useProjectForm";

export const openAddModal = (handleSubmit) => {
    Swal.fire({
        title: "Add New Project",
        html: `
            <div class="add-edit-form">
                <div class="form-group">
                    <label for="project_name" class="block text-gray-700 font-medium mb-2">Project Name *</label>
                    <input type="text" id="project_name" name="project_name" class="swal2-input" placeholder="Enter project name (max 100 characters)" maxlength="100">
                </div>

                <div class="form-group">
                    <label for="description" class="block text-gray-700 font-medium mb-2">Description *</label>
                    <textarea id="description" name="description" class="swal2-textarea" placeholder="Enter project description" rows="4"></textarea>
                </div>

                <div class="form-group grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="start_date" class="block text-gray-700 font-medium mb-2">Start Date *</label>
                        <input type="date" id="start_date" name="start_date" class="swal2-input" required>
                    </div>
                    <div>
                        <label for="end_date" class="block text-gray-700 font-medium mb-2">End Date *</label>
                        <input type="date" id="end_date" name="end_date" class="swal2-input" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="technologies_used" class="block text-gray-700 font-medium mb-2">Technologies Used *</label>
                    <input type="text" id="technologies_used" name="technologies_used" class="swal2-input" placeholder="e.g., React, Node.js, MongoDB (max 255 characters)" maxlength="255">
                </div>

                <div class="form-group grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="project_status" class="block text-gray-700 font-medium mb-2">Project Status *</label>
                        <select id="project_status" name="project_status" class="swal2-select" required>
                            <option value="">Select Status</option>
                            <option value="Sedang Berjalan">Sedang Berjalan</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Tahap Perencanaan">Tahap Perencanaan</option>
                        </select>
                    </div>
                    <div>
                        <label for="difficulty_level" class="block text-gray-700 font-medium mb-2">Difficulty Level *</label>
                        <select id="difficulty_level" name="difficulty_level" class="swal2-select" required>
                            <option value="">Select Difficulty</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="repository_link" class="block text-gray-700 font-medium mb-2">Repository Link</label>
                    <input type="url" id="repository_link" name="repository_link" class="swal2-input" placeholder="https://github.com/..." maxlength="255">
                </div>

                <div class="form-group">
                    <label for="demo_link" class="block text-gray-700 font-medium mb-2">Demo Link</label>
                    <input type="url" id="demo_link" name="demo_link" class="swal2-input" placeholder="https://..." maxlength="255">
                </div>

                <div class="form-group">
                    <label for="photo" class="block text-gray-700 font-medium mb-2">Project Photo (JPEG, PNG, JPG, max 2MB)</label>
                    <input type="file" id="photo" name="photo" class="swal2-file" accept="image/jpeg,image/png,image/jpg">
                </div>
            </div>
        `,
        customClass: {
            container: 'add-edit-form-container',
            popup: 'add-edit-form-popup',
            content: 'add-edit-form-content',
            confirmButton: 'swal2-confirm-custom',
            cancelButton: 'swal2-cancel-custom'
        },
        width: '800px',
        showCancelButton: true,
        confirmButtonText: "Add Project",
        cancelButtonText: "Cancel",
        didOpen: () => {
            const style = document.createElement('style');
            style.textContent = addEditFormStyles;
            document.head.appendChild(style);
        },
        preConfirm: async () => {
            const form = {
                project_name: document.getElementById('project_name').value,
                description: document.getElementById('description').value,
                start_date: document.getElementById('start_date').value,
                end_date: document.getElementById('end_date').value,
                project_status: document.getElementById('project_status').value,
                technologies_used: document.getElementById('technologies_used').value,
                difficulty_level: document.getElementById('difficulty_level').value,
                repository_link: document.getElementById('repository_link').value || null,
                demo_link: document.getElementById('demo_link').value || null,
                photo: document.getElementById('photo').files[0] || null
            };

            // Validation
            if (!form.project_name) {
                Swal.showValidationMessage('Project name is required');
                return false;
            }
            if (form.project_name.length > 100) {
                Swal.showValidationMessage('Project name must not exceed 100 characters');
                return false;
            }
            if (!form.description) {
                Swal.showValidationMessage('Description is required');
                return false;
            }
            if (!form.start_date) {
                Swal.showValidationMessage('Start date is required');
                return false;
            }
            if (!form.end_date) {
                Swal.showValidationMessage('End date is required');
                return false;
            }
            if (new Date(form.end_date) <= new Date(form.start_date)) {
                Swal.showValidationMessage('End date must be after start date');
                return false;
            }
            if (!form.technologies_used) {
                Swal.showValidationMessage('Technologies used is required');
                return false;
            }
            if (form.technologies_used.length > 255) {
                Swal.showValidationMessage('Technologies used must not exceed 255 characters');
                return false;
            }
            if (!form.difficulty_level) {
                Swal.showValidationMessage('Difficulty level is required');
                return false;
            }
            if (!['Beginner', 'Intermediate', 'Advanced'].includes(form.difficulty_level)) {
                Swal.showValidationMessage('Invalid difficulty level');
                return false;
            }
            if (!form.project_status) {
                Swal.showValidationMessage('Project status is required');
                return false;
            }
            if (!['Selesai', 'Sedang Berjalan', 'Tahap Perencanaan'].includes(form.project_status)) {
                Swal.showValidationMessage('Invalid project status');
                return false;
            }
            if (form.repository_link && form.repository_link.length > 255) {
                Swal.showValidationMessage('Repository link must not exceed 255 characters');
                return false;
            }
            if (form.demo_link && form.demo_link.length > 255) {
                Swal.showValidationMessage('Demo link must not exceed 255 characters');
                return false;
            }
            if (form.photo && form.photo.size > 2 * 1024 * 1024) {
                Swal.showValidationMessage('Photo size must not exceed 2MB');
                return false;
            }

            return form;
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            await handleSubmit(result.value);
        }
    });
};

export const openEditForm = (project, setProjectForm, handleUpdate) => {
    Swal.fire({
        title: "Edit Project",
        html: `
            <div class="add-edit-form">
                <div class="form-group">
                    <label for="project_name" class="block text-gray-700 font-medium mb-2">Project Name</label>
                    <input type="text" id="project_name" name="project_name" class="swal2-input" value="${project.project_name}" placeholder="Enter project name (max 100 characters)" maxlength="100">
                </div>

                <div class="form-group">
                    <label for="description" class="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea id="description" name="description" class="swal2-textarea" placeholder="Enter project description" rows="4">${project.description}</textarea>
                </div>

                <div class="form-group grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="start_date" class="block text-gray-700 font-medium mb-2">Start Date</label>
                        <input type="date" id="start_date" name="start_date" class="swal2-input" value="${project.start_date}">
                    </div>
                    <div>
                        <label for="end_date" class="block text-gray-700 font-medium mb-2">End Date</label>
                        <input type="date" id="end_date" name="end_date" class="swal2-input" value="${project.end_date}">
                    </div>
                </div>

                <div class="form-group">
                    <label for="technologies_used" class="block text-gray-700 font-medium mb-2">Technologies Used</label>
                    <input type="text" id="technologies_used" name="technologies_used" class="swal2-input" value="${project.technologies_used}" placeholder="e.g., React, Node.js, MongoDB (max 255 characters)" maxlength="255">
                </div>

                <div class="form-group grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="project_status" class="block text-gray-700 font-medium mb-2">Project Status</label>
                        <select id="project_status" name="project_status" class="swal2-select">
                            <option value="Sedang Berjalan" ${project.project_status === "Sedang Berjalan" ? "selected" : ""}>Sedang Berjalan</option>
                            <option value="Selesai" ${project.project_status === "Selesai" ? "selected" : ""}>Selesai</option>
                            <option value="Tahap Perencanaan" ${project.project_status === "Tahap Perencanaan" ? "selected" : ""}>Tahap Perencanaan</option>
                        </select>
                    </div>
                    <div>
                        <label for="difficulty_level" class="block text-gray-700 font-medium mb-2">Difficulty Level</label>
                        <select id="difficulty_level" name="difficulty_level" class="swal2-select">
                            <option value="Beginner" ${project.difficulty_level === "Beginner" ? "selected" : ""}>Beginner</option>
                            <option value="Intermediate" ${project.difficulty_level === "Intermediate" ? "selected" : ""}>Intermediate</option>
                            <option value="Advanced" ${project.difficulty_level === "Advanced" ? "selected" : ""}>Advanced</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="repository_link" class="block text-gray-700 font-medium mb-2">Repository Link</label>
                    <input type="url" id="repository_link" name="repository_link" class="swal2-input" value="${project.repository_link || ''}" placeholder="https://github.com..." maxlength="255">
                </div>

                <div class="form-group">
                    <label for="demo_link" class="block text-gray-700 font-medium mb-2">Demo Link</label>
                    <input type="url" id="demo_link" name="demo_link" class="swal2-input" value="${project.demo_link || ''}" placeholder="https://..." maxlength="255">
                </div>

                <div class="form-group">
                    <label for="photo" class="block text-gray-700 font-medium mb-2">Project Photo (JPEG, PNG, JPG, max 2MB)</label>
                    <input type="file" id="photo" name="photo" class="swal2-file" accept="image/jpeg,image/png,image/jpg">
                    ${project.photo ? `
                        <div class="mt-2 text-sm text-gray-600">
                            Current photo: ${project.photo}
                        </div>
                    ` : ''}
                </div>
            </div>
        `,
        customClass: {
            container: 'add-edit-form-container',
            popup: 'add-edit-form-popup',
            content: 'add-edit-form-content',
            confirmButton: 'swal2-confirm-custom',
            cancelButton: 'swal2-cancel-custom'
        },
        width: '800px',
        showCancelButton: true,
        confirmButtonText: "Update Project",
        cancelButtonText: "Cancel",
        didOpen: () => {
            const style = document.createElement('style');
            style.textContent = addEditFormStyles;
            document.head.appendChild(style);

            // Store original values
            const formElements = {
                project_name: document.getElementById('project_name'),
                description: document.getElementById('description'),
                start_date: document.getElementById('start_date'),
                end_date: document.getElementById('end_date'),
                project_status: document.getElementById('project_status'),
                technologies_used: document.getElementById('technologies_used'),
                difficulty_level: document.getElementById('difficulty_level'),
                repository_link: document.getElementById('repository_link'),
                demo_link: document.getElementById('demo_link')
            };

            // Set original values as data attributes
            Object.entries(formElements).forEach(([key, element]) => {
                if (element) {
                    const originalValue = project[key] || '';
                    element.setAttribute('data-original', originalValue);
                }
            });
        },
        preConfirm: async () => {
            console.log('=== FORM SUBMISSION STARTED ===');
            const formData = new FormData();
            const changedFields = {};

            // Function to check if a field has actually changed
            const hasFieldChanged = (currentValue, originalValue) => {
                // Convert both to strings and trim for comparison
                const current = String(currentValue || '').trim();
                const original = String(originalValue || '').trim();
                return current !== original && current !== '';
            };

            // Check each field for changes
            const fields = [
                'project_name', 'description', 'start_date', 'end_date',
                'project_status', 'technologies_used', 'difficulty_level',
                'repository_link', 'demo_link'
            ];

            fields.forEach(fieldName => {
                const element = document.getElementById(fieldName);
                if (element) {
                    const currentValue = element.value.trim();
                    const originalValue = element.getAttribute('data-original');

                    if (hasFieldChanged(currentValue, originalValue)) {
                        changedFields[fieldName] = currentValue;
                        formData.append(fieldName, currentValue);
                    }
                }
            });

            // Handle photo separately
            const photoInput = document.getElementById('photo');
            if (photoInput && photoInput.files[0]) {
                changedFields.photo = photoInput.files[0];
                formData.append('photo', photoInput.files[0]);
            }

            // If no changes were made
            if (Object.keys(changedFields).length === 0) {
                Swal.showValidationMessage('No changes detected');
                return false;
            }

            console.log('Changed fields:', changedFields);

            // Validate only changed fields
            if (changedFields.project_name && changedFields.project_name.length > 100) {
                Swal.showValidationMessage('Project name must not exceed 100 characters');
                return false;
            }
            if (changedFields.technologies_used && changedFields.technologies_used.length > 255) {
                Swal.showValidationMessage('Technologies used must not exceed 255 characters');
                return false;
            }
            if (changedFields.repository_link && changedFields.repository_link.length > 255) {
                Swal.showValidationMessage('Repository link must not exceed 255 characters');
                return false;
            }
            if (changedFields.demo_link && changedFields.demo_link.length > 255) {
                Swal.showValidationMessage('Demo link must not exceed 255 characters');
                return false;
            }
            if (changedFields.photo && changedFields.photo.size > 2 * 1024 * 1024) {
                Swal.showValidationMessage('Photo size must not exceed 2MB');
                return false;
            }

            // Add _method for Laravel
            formData.append('_method', 'PUT');

            return { formData, changedFields };
        }
    }).then(async (result) => {
        if (result.isConfirmed && result.value) {
            try {
                console.log('Initiating update with changed fields...');
                const { formData, changedFields } = result.value;
                // Log final data being sent
                console.log('Final changed fields being sent:', changedFields);
                await handleUpdate(project.id, formData);
            } catch (error) {
                console.error('Error in form submission:', error);
                Swal.fire({
                    title: "Error",
                    text: "Failed to update project. Please try again.",
                    icon: "error",
                });
            }
        }
    });
};


export const showProjectDetails = (project, formatDate) => {
    Swal.fire({
        title: project.project_name,
        html: `
            <div class="project-details-popup">
                ${project.photo ? `
                    <div class="image-container mb-4">
                        <img src="https://jagobelajar.cloud/storage/${project.photo}" 
                             alt="${project.project_name}" 
                             class="rounded-lg w-full h-64 object-cover shadow-lg"
                        />
                    </div>
                ` : ''}
                
                <div class="details-grid">
                    <div class="detail-item">
                        <h3 class="detail-title">
                            <i class="fas fa-info-circle text-blue-500"></i> Description
                        </h3>
                        <p class="detail-content">${project.description || 'No description available'}</p>
                    </div>

                    <div class="detail-item">
                        <h3 class="detail-title">
                            <i class="fas fa-calendar text-green-500"></i> Timeline
                        </h3>
                        <p class="detail-content">
                            Start: ${formatDate(project.start_date)}<br>
                            End: ${formatDate(project.end_date)}
                        </p>
                    </div>

                    <div class="detail-item">
                        <h3 class="detail-title">
                            <i class="fas fa-code text-purple-500"></i> Technologies
                        </h3>
                        <p class="detail-content">${project.technologies_used || 'Not specified'}</p>
                    </div>

                    <div class="detail-item">
                        <h3 class="detail-title">
                            <i class="fas fa-chart-line text-orange-500"></i> Difficulty
                        </h3>
                        <p class="detail-content">${project.difficulty_level || 'Not specified'}</p>
                    </div>

                    <div class="detail-item">
                        <h3 class="detail-title">
                            <i class="fas fa-clock text-yellow-500"></i> Status
                        </h3>
                        <p class="detail-content">
                            <span class="${project.project_status === 'Sedang Berjalan' ? 'text-green-500' : 'text-red-500'}">
                                ${project.project_status}
                            </span>
                        </p>
                    </div>

                    <div class="detail-item">
                        <h3 class="detail-title">
                            <i class="fas fa-link text-blue-500"></i> Links
                        </h3>
                        <p class="detail-content">
                            ${project.repository_link ? `
                                <a href="${project.repository_link}" target="_blank" class="text-blue-500 hover:text-blue-700">
                                    <i class="fab fa-github"></i> Repository
                                </a>
                            ` : 'No repository link'}
                            ${project.demo_link ? `
                                <br>
                                <a href="${project.demo_link}" target="_blank" class="text-blue-500 hover:text-blue-700">
                                    <i class="fas fa-globe"></i> Live Demo
                                </a>
                            ` : ''}
                        </p>
                    </div>
                </div>
            </div>
        `,
        width: '800px',
        padding: '2rem',
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
            container: 'project-details-container',
            popup: 'project-details-popup',
            content: 'project-details-content'
        },
        didOpen: () => {
            const popup = Swal.getPopup();
            popup.style.backgroundColor = '#ffffff';
            popup.style.borderRadius = '1rem';
            popup.style.padding = '2rem';

            const style = document.createElement('style');
            style.textContent = `
                .project-details-popup {
                    color: #374151;
                }
                .project-details-popup .image-container {
                    margin: -2rem -2rem 2rem -2rem;
                    border-radius: 1rem 1rem 0 0;
                    overflow: hidden;
                }
                .project-details-popup .details-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                    text-align: left;
                }
                .project-details-popup .detail-item {
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 0.5rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .project-details-popup .detail-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1e40af;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .project-details-popup .detail-content {
                    font-size: 1rem;
                    line-height: 1.5;
                    color: #4b5563;
                }
                .project-details-popup a {
                    text-decoration: none;
                    color: #2563eb;
                    transition: color 0.2s;
                }
                .project-details-popup a:hover {
                    color: #1e40af;
                }
            `;
            document.head.appendChild(style);
        }
    });
};

// Styles remain unchanged
export const addEditFormStyles = `
    .add-edit-form {
        text-align: left;
        padding: 1.5rem;
        max-height: 80vh;
        overflow-y: auto;
    }
    .add-edit-form .form-group {
        margin-bottom: 1.5rem;
    }
    .add-edit-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #374151;
        font-size: 0.95rem;
    }
    .add-edit-form input[type="text"],
    .add-edit-form input[type="url"],
    .add-edit-form input[type="date"],
    .add-edit-form select,
    .add-edit-form textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        background-color: #f9fafb;
        color: #1f2937;
    }
    .add-edit-form input:focus,
    .add-edit-form select:focus,
    .add-edit-form textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        background-color: white;
    }
    .add-edit-form textarea {
        min-height: 120px;
        resize: vertical;
    }
    .add-edit-form input[type="file"] {
        width: 100%;
        padding: 0.75rem;
        border: 2px dashed #e5e7eb;
        border-radius: 0.5rem;
        background: #f9fafb;
        cursor: pointer;
        color: #1f2937;
    }
    .swal2-popup {
        padding: 2rem;
        border-radius: 1rem;
    }
    .swal2-confirm-custom {
        background: linear-gradient(to right, #3b82f6, #2563eb) !important;
        padding: 0.75rem 1.5rem !important;
        font-weight: 500 !important;
        border-radius: 0.5rem !important;
        transition: all 0.3s ease !important;
        color: white !important;
    }
    .swal2-confirm-custom:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2) !important;
    }
    .swal2-cancel-custom {
        background: linear-gradient(to right, #ef4444, #dc2626) !important;
        padding: 0.75rem 1.5rem !important;
        font-weight: 500 !important;
        border-radius: 0.5rem !important;
        transition: all 0.3s ease !important;
        color: white !important;
    }
    .swal2-cancel-custom:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2) !important;
    }
    .swal2-title {
        color: #1f2937 !important;
        font-size: 1.5rem !important;
        font-weight: 600 !important;
        padding: 1rem 0 !important;
    }
`;