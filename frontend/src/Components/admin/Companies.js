import React, { useEffect, useState } from 'react';
import axios from 'axios';

import DeleteConfirmModal from '../company/DeleteConfirmModal';


const Companies = () => {
    const [companies, setCompanies] = useState([]);
   
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2; // Set the number of items per page

    const fetchCompanies = async () => {
        
        try {
            const response = await axios.get('http://localhost:3001/api/companies');
            setCompanies(response.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

   

    const handleDeleteClick = (company) => {
        setCompanyToDelete(company);
    };

    
    const handleDeleteModalClose = () => {
        setCompanyToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/removeCompany/${companyToDelete._id}`);
            setCompanies(companies.filter(company => company._id !== companyToDelete._id));
            setCompanyToDelete(null);
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    

    // Handle search query change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
        setCurrentPage(1); // Reset to first page when search changes
    };

    // Filter employees based on the search query
    const filteredCompanies = companies.filter((company) => {
        return (
            company.companyId.toLowerCase().includes(searchQuery) ||
            company.companyName.toLowerCase().includes(searchQuery) ||
            company.service.toLowerCase().includes(searchQuery) ||
            company.email.toLowerCase().includes(searchQuery) ||
            company.phoneNo.toLowerCase().includes(searchQuery) ||
            company.address.toLowerCase().includes(searchQuery)
        );
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

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
                <div className="card-header d-flex justify-content-between">
                    <h5 className="mb-0">Companies</h5>
                    <input
                        type="text"
                        placeholder="Search Company..."
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
                                <th scope="col">Service</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Address</th>
                                
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((company) => (
                                <tr key={company._id}>
                                    <td>{company.companyId}</td>
                                    <td>{company.companyName}</td>
                                    <td>{company.service}</td>
                                    <td>{company.email}</td>
                                    <td>{company.phoneNo}</td>
                                    
                                    <td>{company.address}</td>
                                    <td className="text-end">
                                       
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-square btn-neutral text-danger-hover"
                                            onClick={() => handleDeleteClick(company)}
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
                    <span className="text-muted text-sm">Showing {currentItems.length} of {filteredCompanies.length} items</span>
                </div>
            </div>

            <nav>
                <ul className="pagination justify-content-center">
                    {renderPagination()}
                </ul>
            </nav>

            
            {companyToDelete && (
                <DeleteConfirmModal
                    employee={companyToDelete}
                    onClose={handleDeleteModalClose}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
};

export default Companies;
