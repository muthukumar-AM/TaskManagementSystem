const express = require('express');
const company= require('../controller/company/companyController');
const employee=require('../controller/employee/employeeController');
const verifymail=require('../middleware/emailVerify');
const admin=require('../controller/admin/adminController')

const router = express.Router();

router.post('/companySignup', company.registerCompany);
router.get('/verify-email',verifymail.verifyEmail);
router.post('/reset-password',company.resetPassword);
router.post('/companyLogin',company.loginCompany);
router.post('/addEmployee',company.addEmployee);
router.get('/employees',company.displayEmployees);
router.put('/employees/:id',company.updateEmployee);
router.delete('/removeEmp/:id',company.deleteEmployee);
router.post('/addTask',company.addTask);
router.get('/tasks',company.displayTasks);
router.put('/tasks/:id',company.updateTask);
router.delete('/removeTask/:id',company.deleteTask);
router.post('/empLogin',employee.loginEmployee);
router.get('/myTasks/:empId',employee.displayTasks);
router.post('/addProject',company.addProject);
router.get('/projects',company.displayProjects);
router.put('/projects/:id',company.updateProject);
router.put('/updateProjectStatus/:id',company.updateProjectStatus);
router.delete('/removeProject/:id',company.deleteProject);
router.get('/myProjects',employee.displayProjects);
router.post('/forgot-password',employee.forgotPassword);
router.post('/company-reset-password',company.CompanyResetPassword);
router.post('/company-forgot-password',company.CompanyforgotPassword);
// router.post('/myTask',employee.createTask);
// router.post('/myTasks',);
router.post('/adminLogin',admin.loginAdmin);
router.get('/companies',admin.displayCompanies);
router.delete('/removeCompany/:id',admin.deleteCompany);

router.get('/users/:empId',company.getEmployees);
router.put('/users/:empId', company.updateUserByEmpId);

router.get('/company/:companyId',company.getCompany);
router.put('/company/:companyId', company.updateCompanyById);

router.get('/dashboard-data',company.dashboardData);

module.exports = router;
