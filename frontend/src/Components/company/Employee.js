import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditEmpModal from './EditEmpModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import AddModal from './EmpModal';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [errorMessage, setErrorMessage] = useState('');

    const fetchEmployees = async () => {
        const storedCompanyId = localStorage.getItem('companyId');
        const storedRole = localStorage.getItem('role');
        try {
            const response = await axios.get('http://localhost:3001/api/employees', {
                params: {
                    companyId: storedCompanyId,
                    role: storedRole
                },
            });

            if (response.data.message === 'Access denied') {
                setErrorMessage('Access denied. You do not have permission to view the employees.');
            } else {
                setEmployees(response.data);
                setErrorMessage('');
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            setErrorMessage('An error occurred while fetching employees.');
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleViewClick = (employee) => setSelectedEmployee(employee);
    const handleDeleteClick = (employee) => setEmployeeToDelete(employee);
    const handleModalClose = () => setSelectedEmployee(null);
    const handleDeleteModalClose = () => setEmployeeToDelete(null);

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/removeEmp/${employeeToDelete._id}`);
            const updatedEmployees = employees.filter(emp => emp._id !== employeeToDelete._id);
            setEmployees(updatedEmployees);
            setEmployeeToDelete(null);
            if (currentItems.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handleUpdateEmployee = (updatedEmployee) => {
        setEmployees(employees.map(emp => emp._id === updatedEmployee._id ? updatedEmployee : emp));
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const filteredEmployees = employees.filter((employee) => (
        employee.empId.toLowerCase().includes(searchQuery) ||
        employee.name.toLowerCase().includes(searchQuery) ||
        employee.email.toLowerCase().includes(searchQuery) ||
        employee.phone.toLowerCase().includes(searchQuery) ||
        employee.team.toLowerCase().includes(searchQuery) ||
        employee.role.toLowerCase().includes(searchQuery)
    ));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const renderPagination = () => {
        let pages = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (totalPages > 1) {
            if (currentPage > 1) {
                pages.push(
                    <li key="prev" className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
                    </li>
                );
            }

            if (startPage > 1) {
                pages.push(
                    <li key="first" className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
                    </li>
                );
                if (startPage > 2) {
                    pages.push(<li key="ellipsis-start" className="page-item disabled"><span className="page-link">...</span></li>);
                }
            }

            for (let page = startPage; page <= endPage; page++) {
                pages.push(
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                    </li>
                );
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push(<li key="ellipsis-end" className="page-item disabled"><span className="page-link">...</span></li>);
                }
                pages.push(
                    <li key="last" className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                    </li>
                );
            }

            if (currentPage < totalPages) {
                pages.push(
                    <li key="next" className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
                    </li>
                );
            }
        }

        return pages;
    };

    return (
        <div>
            <div className="card shadow border-0 mb-7">
                {errorMessage ? (
                    <div className="alert alert-danger" role="alert">
                        <h3>Access Denied</h3>
                    </div>
                ) : (
                    <>
                        <div>
                            <AddModal fetchEmployees={fetchEmployees} />
                        </div>
                        <div className="card-header d-flex justify-content-between">
                            <h5 className="mb-0">Employees</h5>
                            <input
                                type="text"
                                placeholder="Search employees..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="form-control w-25"
                            />
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover table-nowrap">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Team</th>
                                        <th scope="col">Role</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((employee) => (
                                        <tr key={employee._id}>
                                            <td>{employee.empId}</td>
                                            <td>{employee.name}</td>
                                            <td>{employee.email}</td>
                                            <td>{employee.phone}</td>
                                            <td>{employee.team}</td>
                                            <td>{employee.role}</td>
                                            <td className="text-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-neutral"
                                                    onClick={() => handleViewClick(employee)}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-square btn-neutral text-danger-hover"
                                                    onClick={() => handleDeleteClick(employee)}
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
                            <span className="text-muted text-sm">
                                Showing {currentItems.length} of {filteredEmployees.length} items
                            </span>
                        </div>
                    </>
                )}
            </div>
            {!errorMessage && (
                <nav>
                    <ul className="pagination justify-content-center">
                        {renderPagination()}
                    </ul>
                </nav>
            )}
            {selectedEmployee && (
                <EditEmpModal
                    employee={selectedEmployee}
                    onClose={handleModalClose}
                    onUpdate={handleUpdateEmployee}
                />
            )}
            {employeeToDelete && (
                <DeleteConfirmModal
                    employee={employeeToDelete}
                    onClose={handleDeleteModalClose}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
};

export default Employee;
