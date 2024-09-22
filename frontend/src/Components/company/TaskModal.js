import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddTaskModal = ({ show, handleClose, handleAddTask, fetchTasks }) => {
  const [employees, setEmployees] = useState([]);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedCompanyId = localStorage.getItem('companyId');
    if (storedRole) setRole(storedRole);
    if (storedCompanyId) setCompanyId(storedCompanyId);

    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://taskmanagementsystem-64t8.onrender.com/api/projects', {
          params: { companyId: storedCompanyId }
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://taskmanagementsystem-64t8.onrender.com/api/employees', {
          params: { companyId: storedCompanyId }
        });
        setEmployees(response.data);
        if (response.data.length > 0) setEmail(response.data[0].email); // Assuming you want the first employee's email
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
    fetchProjects();
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Task title is required'),
    description: Yup.string().required('Task description is required'),
    dueDate: Yup.date().required('Due date is required'),
    priority: Yup.string().required('Priority is required'),
    assignedTo: Yup.string().required('Assigned To is required'),
  });

  const initialValues = {
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    assignedTo: '',
    createdDate: new Date().toISOString().split('T')[0],
    assignedBy: role,
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    const taskData = {
      ...values,
      companyId,
    };

    try {
      await axios.post('https://taskmanagementsystem-64t8.onrender.com/api/addTask', taskData); // Adjust the API endpoint as necessary
      handleAddTask(taskData);
      setSubmitting(false);
      resetForm();
      handleClose();
      fetchTasks(); // Un-comment this line if you want to refetch tasks after adding
    } catch (error) {
      console.error('Error adding task:', error);
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Task</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <FormikForm>
            <Modal.Body>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Task Title</Form.Label>
                    <Field name="title" as="select" className="form-control">
                      <option value="">Select Project</option>
                      {projects.map((project) => (
                        <option key={project._id} value={project.title}>
                          {project.title}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="title" component="div" className="text-danger" />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Task Description</Form.Label>
                    <Field name="description" as="textarea" className="form-control" />
                    <ErrorMessage name="description" component="div" className="text-danger" />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Due Date</Form.Label>
                    <Field name="dueDate" type="date" className="form-control" />
                    <ErrorMessage name="dueDate" component="div" className="text-danger" />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Priority</Form.Label>
                    <Field name="priority" as="select" className="form-control">
                      <option value="">Select Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </Field>
                    <ErrorMessage name="priority" component="div" className="text-danger" />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Assigned To</Form.Label>
                    <Field name="assignedTo" as="select" className="form-control">
                      <option value="">Select Employee</option>
                      {employees.map((employee) => (
                        <option key={employee.empId} value={employee.empId}>
                          {employee.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="assignedTo" component="div" className="text-danger" />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Assigned By</Form.Label>
                    <Field name="assignedBy" type="text" className="form-control" value={role} readOnly />
                    <ErrorMessage name="assignedBy" component="div" className="text-danger" />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Created Date</Form.Label>
                    <Field name="createdDate" type="date" className="form-control" readOnly />
                    <ErrorMessage name="createdDate" component="div" className="text-danger" />
                  </Form.Group>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Add Task
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};

const TaskManager = ({ fetchTasks }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAddTask = (task) => {
    // Handle task addition logic (e.g., update the state or refetch tasks)
    console.log('Task added:', task);
  };

  return (
    <div className="TaskManager">
      <Button variant="primary" onClick={handleShowModal}>
        Add Task
      </Button>
      <AddTaskModal show={showModal} handleClose={handleCloseModal} handleAddTask={handleAddTask} fetchTasks={fetchTasks} />
    </div>
  );
};

export default TaskManager;
