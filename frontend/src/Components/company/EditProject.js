import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';  // Import react-select
import axios from 'axios';

const EditProject = ({ employee, onClose, onUpdate }) => {
    const [teamOptions, setTeamOptions] = useState([]);
    const [formData, setFormData] = useState({
        title: employee.title,
        description: employee.description,
        team: employee.team.map(member => ({ value: member, label: member })),
        resources: employee.resources || [""],  // Initialize with an array with at least one element
        start: employee.start,
        end: employee.end,
        status: employee.status
    });

    useEffect(() => {
        // Fetch team members from the backend
        const storedCompanyId = localStorage.getItem('companyId');
        axios.get('http://localhost:3001/api/employees',{
            params: { companyId: storedCompanyId } // Pass companyId if required
          })
            .then(response => {
                const options = response.data.map(member => ({
                    value: member.empId,
                    label: member.empId
                }));
                setTeamOptions(options);
            })
            .catch(error => {
                console.error('Error fetching team members:', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTeamChange = (selectedOptions) => {
        setFormData({ ...formData, team: selectedOptions });
    };

    const handleResourceChange = (index, value) => {
        const updatedResources = [...formData.resources];
        updatedResources[index] = value;
        setFormData({ ...formData, resources: updatedResources });
    };

    const handleAddResource = () => {
        setFormData({ ...formData, resources: [...formData.resources, ""] });
    };

    const handleRemoveResource = (index) => {
        const updatedResources = formData.resources.filter((_, i) => i !== index);
        setFormData({ ...formData, resources: updatedResources });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare the team data to be saved as an array of values
            const updatedFormData = {
                ...formData,
                team: formData.team.map(option => option.value)
            };

            const response = await axios.put(`http://localhost:3001/api/projects/${employee._id}`, updatedFormData);
            onUpdate(response.data);
            onClose();
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Project</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formTeam">
                        <Form.Label>Team Members</Form.Label>
                        <Select
                            isMulti
                            name="team"
                            value={formData.team}
                            options={teamOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleTeamChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formResources">
                        <Form.Label>Resources</Form.Label>
                        {formData.resources.map((resource, index) => (
                            <div key={index} className="d-flex mb-2">
                                <Form.Control
                                    type="text"
                                    value={resource}
                                    onChange={(e) => handleResourceChange(index, e.target.value)}
                                    className="me-2"
                                />
                                <Button
                                    variant="danger"
                                    onClick={() => handleRemoveResource(index)}
                                    disabled={formData.resources.length === 1}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button variant="primary" onClick={handleAddResource}>
                            Add Resource
                        </Button>
                    </Form.Group>
                    <Form.Group controlId="formStart">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="text"
                            name="start"
                            value={formData.start}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formEnd">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="text"
                            name="end"
                            value={formData.end}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            type="text"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        />
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

export default EditProject;
