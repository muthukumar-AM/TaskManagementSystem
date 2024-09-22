import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditProject from './EditProject';
import DeleteConfirmModal from './DeleteConfirmModal';
import ProjectModal from './ProjectModal';

const Project = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Set the number of items per page
    const [errorMessage, setErrorMessage] = useState('');
    const [isAccessDenied, setIsAccessDenied] = useState(false); // New state for access control

    const fetchProjects = async () => {
        const storedCompanyId = localStorage.getItem('companyId');
        const storedRole = localStorage.getItem('role');
        try {
            const response = await axios.get('http://localhost:3001/api/projects', {
                params: {
                    companyId: storedCompanyId,
                    role: storedRole
                },
            });
            
                setProjects(response.data);
                setFilteredProjects(response.data); // Initialize filtered projects
                setErrorMessage('');
                setIsAccessDenied(false); // Access granted
            
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage('Access denied. You do not have permission to view the projects.');
            setIsAccessDenied(true);
        }
    };

    const getStatusColorClass = (status) => {
        switch (status) {
            case "Not Started":
                return "text-danger";
            case "In Progress":
                return "text-warning";
            case "Completed":
                return "text-success";
            default:
                return "text-secondary";
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [projects]);

    const handleViewClick = (project) => {
        setSelectedProject(project);
    };

    const handleDeleteClick = (project) => {
        setProjectToDelete(project);
    };

    const handleModalClose = () => {
        setSelectedProject(null);
    };

    const handleDeleteModalClose = () => {
        setProjectToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/removeProject/${projectToDelete._id}`);
            setProjects(projects.filter(proj => proj._id !== projectToDelete._id));
            setFilteredProjects(filteredProjects.filter(proj => proj._id !== projectToDelete._id)); // Update filtered list
            setProjectToDelete(null);
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleUpdateProject = (updatedProject) => {
        setProjects(projects.map(proj =>
            proj._id === updatedProject._id ? updatedProject : proj
        ));
        setFilteredProjects(filteredProjects.map(proj =>
            proj._id === updatedProject._id ? updatedProject : proj
        )); // Update filtered list
    };

    const handleSearch = () => {
        const query = searchQuery.toLowerCase();
        if (query === "") {
            setFilteredProjects(projects);
        } else {
            const filtered = projects.filter((project) =>
                project.title.toLowerCase().includes(query) ||
                (project.team && project.team.join(', ').toLowerCase().includes(query)) ||
                project.status.toLowerCase().includes(query)
            );
            setFilteredProjects(filtered);
        }
        setCurrentPage(1); // Reset to first page on search
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        let pages = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (totalPages > 1) {
            if (currentPage > 1) {
                pages.push(
                    <li key="prev" className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                            &laquo;
                        </button>
                    </li>
                );
            }

            if (startPage > 1) {
                pages.push(
                    <li key="first" className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(1)}>
                            1
                        </button>
                    </li>
                );
                if (startPage > 2) {
                    pages.push(
                        <li key="ellipsis-start" className="page-item disabled">
                            <span className="page-link">...</span>
                        </li>
                    );
                }
            }

            for (let page = startPage; page <= endPage; page++) {
                pages.push(
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(page)}>
                            {page}
                        </button>
                    </li>
                );
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push(
                        <li key="ellipsis-end" className="page-item disabled">
                            <span className="page-link">...</span>
                        </li>
                    );
                }
                pages.push(
                    <li key="last" className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                            {totalPages}
                        </button>
                    </li>
                );
            }

            if (currentPage < totalPages) {
                pages.push(
                    <li key="next" className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                            &raquo;
                        </button>
                    </li>
                );
            }
        }

        return pages;
    };

    return (
        <div>
            <div className="card shadow border-0 mb-7">
                {isAccessDenied ? (
                    <div className="alert alert-danger" role="alert">
                        <h3>{errorMessage}</h3>
                    </div>
                ) : (
                    <>
                        <div>
                            <ProjectModal fetchProjects={fetchProjects} />
                        </div>
                        <div className="card-header d-flex justify-content-between">
                            <h5 className="mb-0">Projects</h5>
                            <input
                                type="text"
                                className="form-control w-25"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyUp={handleSearch}
                            />
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover table-nowrap">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Title</th>
                                        <th scope="col">Team</th>
                                        <th scope="col">Start Date</th>
                                        <th scope="col">End Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((project) => (
                                        <tr key={project._id}>
                                            <td>{project.title}</td>
                                            <td>
                                                {project.team && project.team.length > 0
                                                    ? project.team.join(', ')
                                                    : 'No Team'}
                                            </td>
                                            <td>{project.start}</td>
                                            <td>{project.end}</td>
                                            <td className={getStatusColorClass(project.status)}>{project.status}</td>
                                            <td className="text-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-neutral"
                                                    onClick={() => handleViewClick(project)}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-square btn-neutral text-danger-hover"
                                                    onClick={() => handleDeleteClick(project)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer border-0 py-5">
                            <span className="text-muted text-sm">Showing {currentItems.length} of {filteredProjects.length} results</span>
                            <ul className="pagination justify-content-end">
                                {renderPagination()}
                            </ul>
                        </div>

                        {selectedProject && (
                            <EditProject
                                project={selectedProject}
                                onClose={handleModalClose}
                                onUpdateProject={handleUpdateProject}
                            />
                        )}

                        {projectToDelete && (
                            <DeleteConfirmModal
                                project={projectToDelete}
                                onClose={handleDeleteModalClose}
                                onDeleteConfirm={handleDeleteConfirm}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Project;
