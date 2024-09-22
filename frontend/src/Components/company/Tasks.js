import React, { useEffect, useState } from 'react';
import axios from 'axios';

import DeleteTaskModal from './DeleteTask';
import EditTaskModal from './EditTask';
import TaskManager from './TaskModal';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(4); // Number of tasks per page
    const [isAccessDenied, setIsAccessDenied] = useState(false); // New state for access denial

    const fetchTasks = async () => {
        const storedCompanyId = localStorage.getItem('companyId');
        const empId = localStorage.getItem('empId');
        const role = localStorage.getItem('role');
        try {
            const response = await axios.get('http://localhost:3001/api/tasks', {
                params: {
                    companyId: storedCompanyId,
                    role: role,
                    empId: empId
                },
            });
             
                setTasks(response.data);
                setFilteredTasks(response.data); // Set initially filtered tasks
                setIsAccessDenied(false); // Reset if access is allowed
            
        } catch (error) {
            console.error('Error fetching tasks:', error);
            
                setIsAccessDenied(true); // Set access denial if response indicates so
            
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Function to handle search input
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = tasks.filter(task => {
            return (
                task.title.toLowerCase().includes(query) ||
                task.createdDate.toLowerCase().includes(query) ||
                task.dueDate.toLowerCase().includes(query) ||
                task.priority.toLowerCase().includes(query) ||
                task.status.toLowerCase().includes(query) ||
                task.assignedTo.toLowerCase().includes(query)
            );
        });

        setFilteredTasks(filtered);
        setCurrentPage(1); // Reset to first page on search
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

    const getPriorityColorClass = (priority) => {
        switch (priority) {
            case "High":
                return "text-danger";
            case "Medium":
                return "text-warning";
            case "Low":
                return "text-success";
            default:
                return "text-secondary";
        }
    };

    const handleViewClick = (task) => {
        setSelectedTask(task);
    };

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
    };

    const handleModalClose = () => {
        setSelectedTask(null);
    };

    const handleDeleteModalClose = () => {
        setTaskToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/removeTask/${taskToDelete._id}`);
            setTasks(tasks.filter(task => task._id !== taskToDelete._id));
            setFilteredTasks(filteredTasks.filter(task => task._id !== taskToDelete._id));
            setTaskToDelete(null);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleUpdateTask = (updatedTask) => {
        setTasks(tasks.map(task =>
            task._id === updatedTask._id ? updatedTask : task
        ));
        setFilteredTasks(filteredTasks.map(task =>
            task._id === updatedTask._id ? updatedTask : task
        ));
    };

    // Pagination Logic
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            {isAccessDenied ? (
                <div className="alert alert-danger" role="alert">
                    Access Denied. You do not have permission to view the tasks.
                </div>
            ) : (
                <div className="card shadow border-0 mb-7">
                    <div className='mt-3 ml-3'><TaskManager fetchTasks={fetchTasks} /></div>
                    <div className="card-header d-flex justify-content-between">
                        <h5 className="mb-0">Tasks</h5>
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="form-control w-25"
                        />
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover table-nowrap">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Title</th>
                                    <th scope="col">Assigned Date</th>
                                    <th scope="col">Due Date</th>
                                    <th scope="col">Priority</th>
                                    <th scope='col'>Status</th>
                                    <th scope="col">Assigned To</th>
                                    <th scope="col">Assigned By</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTasks.map((task) => (
                                    <tr key={task._id}>
                                        <td>{task.title}</td>
                                        <td>{task.createdDate}</td>
                                        <td>{task.dueDate}</td>
                                        <td className={getPriorityColorClass(task.priority)}>{task.priority}</td>
                                        <td className={getStatusColorClass(task.status)}>{task.status}</td>
                                        <td>{task.assignedTo}</td>
                                        <td>{task.assignedBy}</td>
                                        <td className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-neutral"
                                                onClick={() => handleViewClick(task)}
                                            >
                                                View
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-square btn-neutral text-danger-hover"
                                                onClick={() => handleDeleteClick(task)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer border-0 py-5 d-flex justify-content-between">
                        <span className="text-muted text-sm">Showing {currentTasks.length} of {filteredTasks.length} items</span>
                        <Pagination
                            tasksPerPage={tasksPerPage}
                            totalTasks={filteredTasks.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </div>
                </div>
            )}

            {selectedTask && (
                <EditTaskModal
                    task={selectedTask}
                    onClose={handleModalClose}
                    onUpdate={handleUpdateTask}
                />
            )}

            {taskToDelete && (
                <DeleteTaskModal
                    task={taskToDelete}
                    onClose={handleDeleteModalClose}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
};

const Pagination = ({ tasksPerPage, totalTasks, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalTasks / tasksPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Tasks;
