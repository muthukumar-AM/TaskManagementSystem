import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  team: Yup.array().min(1, 'At least one team member is required'),
  resources: Yup.array().min(1, 'At least one resource is required'),
  start: Yup.string().required('Start Date is required'),
  end: Yup.string().required('End Date is required'),
});

const ProjectModal = ({ fetchProjects }) => {
  const [show, setShow] = useState(false);
  const [teamOptions, setTeamOptions] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [resources, setResources] = useState(['']); // Initialize with an empty input

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const storedCompanyId = localStorage.getItem('companyId');

  useEffect(() => {
    // Fetch team members from the backend
    axios.get('http://localhost:3001/api/employees',{
      params: { companyId: storedCompanyId } // Pass companyId if required
    })
      .then(response => {
        console.log(response);
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

  const addResourceInput = () => {
    setResources([...resources, '']); // Add an empty string for a new input
  };

  const removeResourceInput = (index) => {
    setResources(resources.filter((_, i) => i !== index)); // Remove the resource at the specified index
  };

  return (
    <div className="maincontainer">
      <div className="container py-5">
        <Button variant="primary" onClick={handleShow}>
          Add Project
        </Button>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              title: '',
              description: '',
              team: [],
              resources: [],
              start: '',
              end: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              // Add company ID to values
              values.companyId = storedCompanyId;
              // Extract selected team members' IDs
              values.team = selectedTeamMembers.map(member => member.value);
              // Filter out empty resources
              values.resources = resources.filter(res => res.trim() !== '');

              axios.post('http://localhost:3001/api/addProject', values)
                .then(response => {
                  console.log(response.data);
                  setSubmitting(false);
                  fetchProjects();  // Fetch the updated project list
                  handleClose();
                })
                .catch(error => {
                  console.error(error);
                  setSubmitting(false);
                });
            }}
          >
            {({ handleSubmit, isSubmitting, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                <h5 className="mb-3">Project Details</h5>
                <Row>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label htmlFor="title">Title</Form.Label>
                      <Field name="title" type="text" className="form-control" />
                      <ErrorMessage name="title" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label htmlFor="description">Description</Form.Label>
                      <Field name="description" type="text" className="form-control" />
                      <ErrorMessage name="description" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group>
                  <Form.Label htmlFor="team">Team Members</Form.Label>
                  <Select
                    isMulti
                    name="team"
                    options={teamOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(selectedOptions) => {
                      setSelectedTeamMembers(selectedOptions);
                      setFieldValue('team', selectedOptions); // Set Formik's field value
                    }}
                  />
                  <ErrorMessage name="team" component="div" className="text-danger mt-2" />
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="resources">Resources</Form.Label>
                  {resources.map((resource, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <Field
                        name={`resources.${index}`} // Use dynamic field name
                        type="text"
                        className="form-control"
                        value={resource}
                        onChange={(e) => {
                          const newResources = [...resources];
                          newResources[index] = e.target.value; // Update the specific resource input
                          setResources(newResources);
                          setFieldValue('resources', newResources); // Update Formik's field value
                        }}
                        placeholder="Enter resource name"
                      />
                      <Button
                        variant="danger"
                        onClick={() => removeResourceInput(index)}
                        className="ms-2"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline-secondary" onClick={addResourceInput}>
                    Add Resource
                  </Button>
                  <ErrorMessage name="resources" component="div" className="text-danger mt-2" />
                </Form.Group>

                <Row>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label htmlFor="start">Start Date</Form.Label>
                      <Field name="start" type="date" className="form-control" />
                      <ErrorMessage name="start" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label htmlFor="end">End Date</Form.Label>
                      <Field name="end" type="date" className="form-control" />
                      <ErrorMessage name="end" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" type="submit" disabled={isSubmitting} className="w-100 mt-4">
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProjectModal;
