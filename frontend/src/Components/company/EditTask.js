import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const EditTaskModal = ({ task, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3001/api/tasks/${task._id}`, formData);
            onUpdate(response.data);
            onClose();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Task</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="formDueDate">
                                <Form.Label>Due Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="formPriority">
                                <Form.Label>Priority</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Priority</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </Form.Control>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="formStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value={formData.status}>{formData.status}</option>
                                    <option value="Reassigned">Reassigned</option>
                                </Form.Control>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="formAssignedTo">
                                <Form.Label>Assigned To</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="assignedTo"
                                    value={formData.assignedTo}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button type="submit" variant="primary">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditTaskModal;
