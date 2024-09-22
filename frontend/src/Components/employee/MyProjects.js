import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button,Form } from 'react-bootstrap';

const MyProject = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Adjust as needed

    const fetchProjects = async () => {
        const storedEmpId = localStorage.getItem('employeeId');
        const role = localStorage.getItem('role');
        setUserRole(role);

        try {
            const response = await axios.get('http://localhost:3001/api/myProjects', {
                params: {
                    empId: storedEmpId,
                },
            });
            setEmployees(response.data);
            setFilteredEmployees(response.data); // Initialize filteredEmployees
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        // Filter employees based on search term
        setFilteredEmployees(
            employees.filter(employee =>
                employee.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        // Reset to the first page when search term changes
        setCurrentPage(1);
    }, [searchTerm, employees]);

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

    const handleStatusChange = (newStatus) => {
        if (currentEmployee) {
            setSelectedStatuses((prevStatuses) => ({
                ...prevStatuses,
                [currentEmployee._id]: newStatus,
            }));
        }
    };

    const handleStatusUpdate = async () => {
        if (currentEmployee) {
            const newStatus = selectedStatuses[currentEmployee._id] || currentEmployee.status;

            try {
                await axios.put(`http://localhost:3001/api/updateProjectStatus/${currentEmployee._id}`, {
                    status: newStatus,
                });
                setEmployees((prevEmployees) =>
                    prevEmployees.map((emp) =>
                        emp._id === currentEmployee._id ? { ...emp, status: newStatus } : emp
                    )
                );
                setFilteredEmployees((prevFiltered) =>
                    prevFiltered.map((emp) =>
                        emp._id === currentEmployee._id ? { ...emp, status: newStatus } : emp
                    )
                );
                setShowModal(false);
                setSelectedStatuses((prevStatuses) => ({
                    ...prevStatuses,
                    [currentEmployee._id]: undefined,
                }));
                setCurrentEmployee(null);
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }
    };

    const openModal = (employee) => {
        setCurrentEmployee(employee);
        setShowModal(true);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <div className="card shadow border-0 mb-7">
                <div className="card-header">
                    <h5 className="mb-0">Projects</h5>
                    <Form.Control
            type="text"
            placeholder="Search ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "200px",marginLeft: '75%' }}
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
                                {userRole === 'Manager' && <th scope="col">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((employee) => (
                                <tr key={employee._id}>
                                    <td>{employee.title}</td>
                                    <td>
                                        {employee.team && employee.team.length > 0 
                                            ? employee.team.join(', ') 
                                            : 'No Team'}
                                    </td>
                                    <td>{employee.start}</td>
                                    <td>{employee.end}</td>
                                    <td className={getStatusColorClass(employee.status)}>
                                        {employee.status}
                                    </td>
                                    {userRole === 'Manager' && (
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => openModal(employee)}
                                            >
                                                Update
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer border-0 py-5">
                    <span className="text-muted text-sm">Showing {currentItems.length} of {filteredEmployees.length} items</span>
                </div>
            </div>

            {/* Pagination controls */}
            <nav>
                <ul className="pagination justify-content-center">
                    {[...Array(totalPages).keys()].map((number) => (
                        <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(number + 1)}>
                                {number + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Modal for updating status */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="statusSelect">Select Status</label>
                        <select
                            id="statusSelect"
                            value={selectedStatuses[currentEmployee?._id] || currentEmployee?.status || ''}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="form-select"
                        >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleStatusUpdate}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MyProject;
