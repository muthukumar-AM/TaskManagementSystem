import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const EditEmpModal = ({ employee, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        empId: employee.empId,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        team: employee.team,
        role: employee.role,
        permissions: employee.permissions || [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePermissionsChange = (e) => {
        const { value, checked } = e.target;
        const updatedPermissions = checked
            ? [...formData.permissions, value]
            : formData.permissions.filter((permission) => permission !== value);
        setFormData({ ...formData, permissions: updatedPermissions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3001/api/employees/${employee._id}`, formData);
            onUpdate(response.data);
            onClose();
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Employee</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="formEmpId">
                        <Form.Label>Employee ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="empId"
                            value={formData.empId}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formTeam">
                        <Form.Label>Team</Form.Label>
                        <Form.Control
                            type="text"
                            name="team"
                            value={formData.team}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formRole">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPermissions">
                        <Form.Label>Permissions</Form.Label>
                        {formData.permissions.map((permission) => (
                            <Form.Check
                                key={permission}
                                type="checkbox"
                                label={permission}
                                value={permission}
                                checked={formData.permissions.includes(permission)}
                                onChange={handlePermissionsChange}
                            />
                        ))}
                    </Form.Group>
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

export default EditEmpModal;
