import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap'; // Import Spinner
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  empId: Yup.string().required('Employee ID is required'),
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().matches(/^\d+$/, 'Phone number is not valid').required('Phone number is required'),
  team: Yup.string().required('Team is required'),
  role: Yup.string().required('Role is required'),
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  permissions: Yup.array().min(1, 'At least one permission is required'),
});

const AddModal = ({ fetchEmployees }) => {
  const [show, setShow] = useState(false);
  const [companyId, setCompanyId] = useState('');

  useEffect(() => {
    const storedCompanyId = localStorage.getItem('companyId');
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
    }
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="maincontainer">
      <div className="container py-5">
        <div className="py-5">
          <div className="row">
            <div className="col-lg-6 mb-5">
              <Button variant="primary" onClick={handleShow}>
                Add Employee
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              empId: '',
              name: '',
              email: '',
              phone: '',
              team: '',
              role: '',
              password: '',
              permissions: [],
              companyId: companyId
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              axios.post('https://taskmanagementsystem-64t8.onrender.com/api/addEmployee', values)
                .then(response => {
                  console.log(response.data);
                  setSubmitting(false);
                  fetchEmployees();  // Fetch the updated employee list
                  handleClose();
                })
                .catch(error => {
                  console.error(error);
                  setSubmitting(false);
                });
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <h5 className="mb-3">Personal Details</h5>
                <Row>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label htmlFor="empId">Employee ID</Form.Label>
                      <Field name="empId" type="text" className="form-control" />
                      <ErrorMessage name="empId" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label htmlFor="name">Name</Form.Label>
                      <Field name="name" type="text" className="form-control" />
                      <ErrorMessage name="name" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                  <Col lg={12}>
                    <Form.Group>
                      <Form.Label htmlFor="phone">Phone Number</Form.Label>
                      <Field name="phone" type="text" className="form-control" />
                      <ErrorMessage name="phone" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mt-4 mb-3">Credentials</h5>
                <Row>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label htmlFor="email">Email</Form.Label>
                      <Field name="email" type="email" className="form-control" />
                      <ErrorMessage name="email" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label htmlFor="password">Password</Form.Label>
                      <Field name="password" type="password" className="form-control" />
                      <ErrorMessage name="password" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mt-4 mb-3">Company</h5>
                <Row>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label htmlFor="team">Team</Form.Label>
                      <Field name="team" type="text" className="form-control" />
                      <ErrorMessage name="team" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label htmlFor="role">Role</Form.Label>
                      <Field as="select" name="role" className="form-control">
                        <option value="">Select role</option>
                        <option value="Manager">Manager</option>
                        <option value="Lead">Lead</option>
                        <option value="Employee">Employee</option>
                      </Field>
                      <ErrorMessage name="role" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mt-4 mb-3">Permissions</h5>
                <Form.Group>
                  <Field type="checkbox" name="permissions" value="read" />
                  <label className="ml-2">Read</label>
                  <Field type="checkbox" name="permissions" value="write" className="ml-4" />
                  <label className="ml-2">Write</label>
                  <Field type="checkbox" name="permissions" value="assign" className="ml-4" />
                  <label className="ml-2">Assign</label>
                  <Field type="checkbox" name="permissions" value="update" className="ml-4" />
                  <label className="ml-2">Update</label>
                  <ErrorMessage name="permissions" component="div" className="text-danger mt-2" />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isSubmitting} className="w-100 mt-4">
                  {isSubmitting ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="sr-only">Submitting...</span>
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddModal;
