import axios from "axios";
import { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [empId, setEmpId] = useState(localStorage.getItem("employeeId"));
  const [status, setStatus] = useState({});
  const [isSubmitting, setIsSubmitting] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/myTasks/${empId}`
        );
        setTasks(response.data);
        setFilteredTasks(response.data);
      } catch (err) {
        setError("Failed to load tasks. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTasks();
  }, [empId]);

  useEffect(() => {
    const filtered = tasks.filter((task) =>
      Object.values(task).some((value) =>
        value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
    setFilteredTasks(filtered);
    setCurrentPage(1); // Reset to the first page on new search
  }, [searchTerm, tasks]);

  const handleInputChange = (e, taskId) => {
    setStatus({ ...status, [taskId]: e.target.value });
  };

  const handleSubmit = async (taskId) => {
    setIsSubmitting({ ...isSubmitting, [taskId]: true });
    try {
      const taskToUpdate = tasks.find((task) => task._id === taskId);
      const updatedTask = { ...taskToUpdate, status: status[taskId] };

      await axios.put(`http://localhost:3001/api/tasks/${taskId}`, updatedTask);

      setTasks(
        tasks.map((task) => (task._id === taskId ? updatedTask : task))
      );
      console.log("Task updated successfully");
    } catch (err) {
      setError("Failed to update the task. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting({ ...isSubmitting, [taskId]: false });
      setShowModal(false);
    }
  };

  const handleShowModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
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

  // Pagination calculations
  const indexOfLastTask = currentPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="card shadow border-0 mb-7">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">My Tasks</h5>
          <Form.Control
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "200px" }}
          />
        </div>
        <div className="table-responsive">
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <table className="table table-hover table-nowrap">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Assigned Date</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentTasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.title}</td>
                      <td>{task.createdDate}</td>
                      <td>{task.dueDate}</td>
                      <td className={getPriorityColorClass(task.priority)}>
                        {task.priority}
                      </td>
                      <td className={getStatusColorClass(task.status)}>
                        {task.status}
                      </td>
                      <td>
                        <Button
                          variant="info"
                          onClick={() => handleShowModal(task)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <nav>
                <ul className="pagination justify-content-center">
                  {[...Array(totalPages)].map((_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <Button
                        className="page-link"
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
            </>
          )}
        </div>
        <div className="card-footer border-0 py-5">
          <span className="text-muted text-sm">
            Showing {currentTasks.length} of {filteredTasks.length} tasks
          </span>
        </div>
      </div>

      {selectedTask && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Task Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={selectedTask.title}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                className="form-control"
                id="description"
                value={selectedTask.description}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="createdDate">Assigned Date</label>
              <input
                type="text"
                className="form-control"
                id="createdDate"
                value={selectedTask.createdDate}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="text"
                className="form-control"
                id="dueDate"
                value={selectedTask.dueDate}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <input
                type="text"
                className="form-control"
                id="priority"
                value={selectedTask.priority}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="assignedTo">Assigned To</label>
              <input
                type="text"
                className="form-control"
                id="assignedTo"
                value={selectedTask.assignedTo}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="assignedBy">Assigned By</label>
              <input
                type="text"
                className="form-control"
                id="assignedBy"
                value={selectedTask.assignedBy}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                className="form-control"
                id="status"
                value={status[selectedTask._id] || selectedTask.status}
                onChange={(e) => handleInputChange(e, selectedTask._id)}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSubmit(selectedTask._id)}
              disabled={isSubmitting[selectedTask._id]}
            >
              {isSubmitting[selectedTask._id] ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Submit"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default MyTasks;
