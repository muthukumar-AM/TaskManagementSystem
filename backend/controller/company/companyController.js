const TempRegistration = require('../../models/company/tempRegistration');

const { validationResult, check } = require('express-validator');
const bcrypt = require('bcrypt');
const company = require('../../models/company/companymodel'); // Adjust path if necessary
const Employee=require('../../models/company/employeemodel');
const Task=require('../../models/company/taskmodel');
const Project=require('../../models/company/projectmodel');
const upload = require('../../middleware/multerConfig');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { getSystemErrorMap } = require('util');



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const registerCompany = async (req, res) => {
  console.log("Register Company...");
  console.log('Session ID during registration:', req.sessionID);

  // Handle file upload
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    } else {
      // Validate and sanitize input
      await check('companyId').trim().notEmpty().withMessage('Company ID is required').escape().run(req);
      await check('companyName').trim().notEmpty().withMessage('Company Name is required').escape().run(req);
      await check('service').trim().notEmpty().withMessage('Service is required').escape().run(req);
      await check('email').trim().isEmail().withMessage('Invalid email').normalizeEmail().escape().run(req);
      await check('phoneNo').trim().notEmpty().withMessage('Phone number is required').escape().run(req);
      await check('address').trim().notEmpty().withMessage('Address is required').escape().run(req);
      await check('password').trim().notEmpty().withMessage('Password is required').escape().run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { companyId, companyName, service, email, phoneNo, address, password } = req.body;

      try {
        const companyExists = await TempRegistration.findOne({ email });

        if (companyExists) {
          return res.status(400).json({ message: 'Company already exists' });
        }

        // Store registration data in the temporary collection
    const tempRegistration = new TempRegistration({
      companyId,
      companyName,
      service,
      email,
      phoneNo,
      address,
      password,
      companyLogoPath: req.file ? req.file.path : ''
    });

    await tempRegistration.save();

        // Generate a token for email verification
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        

        const mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: email,
          subject: 'Verify Your Email',
          text: `Please verify your email by clicking the following link: ${process.env.BASE_URL}/verify-email?token=${token}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Verification email sent. Please check your email to complete the registration.' });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
      }
    }
  });
};


const loginCompany = async (req, res) => {
  const { companyId, password } = req.body;

  try {
    const companyExist = await company.findOne({ companyId });
    if (!companyExist) {
      console.log("Company does not exist");
      return res.status(404).json({ message: 'Company does not exist' });
    }

    const isValid = await bcrypt.compare(password, companyExist.password);
    if (!isValid) {
      console.log("Invalid password");
      return res.status(401).json({ message: 'Invalid password' });
    }

    const tokenPayload = {
      _id: companyExist._id,
      companyId: companyExist.companyId,
      companyName: companyExist.companyName,
      service: companyExist.service,
      email: companyExist.email,
      phoneNo: companyExist.phoneNo,
      address: companyExist.address,
      companyLogo: companyExist.companyLogo,
      role: companyExist.role,
      permissions: companyExist.permissions,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login Successful',
      token,
    });
  } catch (err) {
    console.error('Server error:', err.message); // Log the error message
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const addEmployee = async (req, res) => {
  console.log("addEmployee");

  // Validate and sanitize input
  await check('empId').trim().escape().not().isEmpty().withMessage('Employee ID is required').run(req);
  await check('name').trim().escape().not().isEmpty().withMessage('Name is required').run(req);
  await check('email').isEmail().normalizeEmail().withMessage('Invalid email address').run(req);
  await check('phone').trim().escape().isNumeric().withMessage('Phone number is not valid').run(req);
  await check('team').trim().escape().not().isEmpty().withMessage('Team is required').run(req);
  await check('role').trim().escape().not().isEmpty().withMessage('Role is required').run(req);
  await check('password').trim().escape().isLength({ min: 8 }).withMessage('Password must be at least 8 characters').run(req);
  await check('permissions').isArray({ min: 1 }).withMessage('Permissions are required').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { empId, name, email, phone, team, role, password, permissions, companyId } = req.body;

    // Check if the employee ID or email already exists
    const employeeExists = await Employee.findOne({ $or: [{ empId }, { email }] });
    if (employeeExists) {
      return res.status(400).json({ message: 'Employee ID or email already exists', field: employeeExists.empId === empId ? 'empId' : 'email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = new Employee({
      empId,
      name,
      email,
      phone,
      team,
      role,
      password: hashedPassword,
      permissions,
      companyId,
      resetPasswordToken: null,
      resetPasswordExpires: null,
     
    });

    await newEmployee.save();
    console.log("Employee added successfully.");

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    newEmployee.resetPasswordToken = resetTokenHash;
    newEmployee.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await newEmployee.save();

    // Send email with password reset link
    const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Set Your Password',
      text: `Hi ${name}, Welcome\n\nPlease click the link below to set your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nBest regards,\nCompany Name`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully.");

    res.status(201).json({ message: 'Employee added and password reset email sent successfully' });
  } catch (err) {
    if (err.code === 11000) { // Duplicate key error
      const field = Object.keys(err.keyValue)[0];
      console.error(`Duplicate key error on field: ${field}`, err);
      res.status(400).json({ message: `Duplicate key error on field: ${field}`, error: err.message });
    } else {
      console.error('Server error:', err.message); // Log the error message
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    // Hash the token and find the employee
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    console.log('Received token:', token);
console.log('Hashed token:', resetTokenHash);

    const employee = await Employee.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!employee) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update password and clear the reset token fields
    employee.password = await bcrypt.hash(password, 10);
    employee.resetPasswordToken = null;
    employee.resetPasswordExpires = null;
    await employee.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Server error:', err.message); // Log the error message
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const CompanyforgotPassword = async (req, res) => {
  console.log("forgot password");
  const { email } = req.body;

  try {
      // Check if the user exists
      const companyEmail = await company.findOne({ email });
      if (!companyEmail) {
          return res.status(404).json({ message: 'Company not found' });
      }

      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      const resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

      // Save token and expiry time to the user's record
      companyEmail.resetPasswordToken = resetTokenHash;
      companyEmail.resetPasswordExpires = resetPasswordExpires;
      await companyEmail.save();

      const mailOptions = {
          to: companyEmail.email,
          from: process.env.EMAIL_USERNAME,
          subject: 'Password Reset',
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          
          http://${process.env.BASE_URL}/company-reset-password?token=${resetToken}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
  }
};



const forgotPassword = async (req, res) => {
  console.log("forgot password");
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await Employee.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Employee not found' });
        }


      


        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

        // Save token and expiry time to the user's record
        Employee.resetPasswordToken = resetToken;
        Employee.resetPasswordExpires = resetPasswordExpires;
        await Employee.save();

       

        const mailOptions = {
            to: Employee.email,
            from: process.env.EMAIL_USERNAME,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            
            http://${process.env.BASE_URL}/reset-password?token=${resetToken}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}






const CompanyResetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    // Hash the token and find the employee
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    console.log('Received token:', token);
console.log('Hashed token:', resetTokenHash);

    const companyToken = await company.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!companyToken) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update password and clear the reset token fields
    companyToken.password = await bcrypt.hash(password, 10);
    companyToken.resetPasswordToken = null;
    companyToken.resetPasswordExpires = null;
    await companyToken.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Server error:', err.message); // Log the error message
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const updateEmployee=async(req,res)=>{
  const {id}=req.params;

  const {empId,name,email,phone,team,role,permissions}=req.body;

  try{
    const updateEmployee=await Employee.findByIdAndUpdate(
      id,
      {empId,name,email,phone,team,role,permissions},
      {new:true}
    );

    if(!updateEmployee){
      res.status(404).json({message:'Employee not found'});
    }

    res.status(200).json({message:"updated Sucessfully"});
  }
  catch(err){
    res.status(500).send('Server error');
  }
}

const deleteEmployee=async(req,res)=>{
  const {id}=req.params;

  

  try{
    const deleteEmployee=await Employee.findByIdAndDelete(id)

    if(!deleteEmployee){
      res.status(404).json({message:'Employee not found'});
    }

    res.status(200).json({message:"deleted Sucessfully"});
  }
  catch(err){
    console.error('Error deleting employee:', err);
    res.status(500).send('Server error');
  }
}

const displayEmployees = async (req, res) => {
  console.log("Displaying Employees");
  const { companyId, role } = req.query;

  try {
    if (role === "company") {
      const employees = await Employee.find({ companyId: companyId });

      if (employees.length === 0) {
        return res.status(404).json({ message: 'No Employees Found' });
      }

      return res.status(200).json(employees);
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



const getEmployees=async (req, res) => {
  try {
    const user = await Employee.findOne({ empId: req.params.empId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


const addTask = async (req, res) => {
  console.log("Add task...");

  const { title, description, dueDate, priority, assignedTo, assignedBy, createdDate, companyId } = req.body;
  console.log(assignedTo);
  try {
    // Fetch the employee's email using the assignedTo ID
    const employee = await Employee.findOne({empId: assignedTo});
    if (!employee) {
      return res.status(404).json({ message: 'Assigned employee not found' });
    }
    const email = employee.email;
    console.log(email);
    // Store the task data
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      assignedBy,
      createdDate,
      status: 'Assigned',
      companyId,
      email
    });

    await newTask.save();

    // Send an email to the assigned employee
    const mailOptions = {
      from: process.env.EMAIL_USERNAME, // Replace with your email
      to: email, // Send to the employee's email
      subject: 'New Task Assigned: ' + title,
      text: `Hi,

      You have been assigned a new task by ${assignedBy}.

      Task Details:
      - Title: ${title}
      - Description: ${description}
      - Due Date: ${dueDate}
      - Priority: ${priority}

      Please complete the task by the due date.

      Regards,
      Your Company
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Task assigned but email failed to send.' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: 'Task assigned successfully, and email sent.' });
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};




const displayTasks=async(req,res)=>{
  console.log("Displaying tasks");
  const { companyId,role,empId } = req.query;
  try{
    let tasks;

    if (role === "company") {
      // Company sees all tasks assigned within the company
      tasks = await Task.find({ companyId });
    } else if (role === "Manager") {
      // Manager sees tasks assigned by managers or leads
      tasks = await Task.find({ 
        companyId, 
        assignedBy: { $in: ["Manager", "Lead"] }
      });
    } else if (role === "Lead") {
      // Lead sees only tasks they have assigned
      tasks = await Task.find({ companyId, assignedBy: 'Lead' });
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    if(tasks===0){
      res.status(404).json({message: 'No Tasks Found'});
    }
    res.json(tasks);
  }
  catch(err){
    res.status(500).json({message:err.message});
  }
}


const updateTask=async(req,res)=>{
  const {id}=req.params;

  const {title,description,dueDate,priority,status,assignedTo}=req.body;

  try{
    const updateTask=await Task.findByIdAndUpdate(
      id,
      {title,description,dueDate,priority,status,assignedTo},
      {new:true}
    );

    if(!updateTask){
      res.status(404).json({message:'Task not found'});
    }

    res.status(200).json({message:"updated Sucessfully"});
  }
  catch(err){
    res.status(500).send('Server error');
  }
}



const deleteTask=async(req,res)=>{
  const {id}=req.params;

  

  try{
    const deleteTask=await Task.findByIdAndDelete(id)

    if(!deleteTask){
      res.status(404).json({message:'Task not found'});
    }

    res.status(200).json({message:"deleted Successfully"});
  }
  catch(err){
    console.error('Error deleting task:', err);
    res.status(500).send('Server error');
  }
}



// const addProject= async (req, res) => {
//   const { title, description, team, resources, start, end,companyId } = req.body;
// console.log("company Id");
//   const newProject = new Project({
//     title,
//     description,
//     team,
//     resources,
//     start,
//     end,
//     status:'Assigned',
//     companyId
//   });

//   try {
//     const savedProject = await newProject.save();
//     res.status(201).json(savedProject);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }

// }






const addProject = async (req, res) => {
  const { title, description, team, resources, start, end, companyId } = req.body;

  const newProject = new Project({
    title,
    description,
    team,
    resources,
    start,
    end,
    status: 'Assigned',
    companyId
  });

  try {
    const savedProject = await newProject.save();

    // Fetch the employee emails using the team member IDs
    const employeeEmails = await getEmployeeEmails(team);

    // Send email to each employee
    await sendEmailsToEmployees(employeeEmails, title);

    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Function to fetch employee emails from their IDs
const getEmployeeEmails = async (team) => {
  // Assuming you have an Employee model to fetch employee details
  const employees = await Employee.find({ empId: { $in: team } }).select('email');
  return employees.map(emp => emp.email);
};


const updateUserByEmpId = async (req, res) => {
  try {
    const updatedUser = await Employee.findOneAndUpdate(
      { empId: req.params.empId },
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Function to send emails to the employees
const sendEmailsToEmployees = async (emails, projectTitle) => {
  
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Replace with your email
    subject: `New Project Assigned: ${projectTitle}`,
    text: `You have been assigned to the project: ${projectTitle}. Please check the project details in the system.`,
  };

  for (const email of emails) {
    try {
      await transporter.sendMail({ ...mailOptions, to: email });
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
    }
  }
};















const displayProjects = async (req, res) => {
  console.log("Displaying Projects");
  const { companyId, role } = req.query;
  console.log(role);
  // Check for missing companyId or role
  if (!companyId || !role) {
    return res.status(400).json({ message: 'companyId and role are required' });
  }

  try {
    if (role === 'company') {
      const projects = await Project.find({ companyId });

      if (projects.length === 0) {
        return res.status(404).json({ message: 'No Projects Found' });
      }

      return res.status(200).json({ message: 'Projects found', projects });
    } else {
      return res.status(403).json({ message: 'Access Denied' });
    }
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
};




const updateProject=async(req,res)=>{
  const {id}=req.params;

  const {title,description,team,resources,start,end,status}=req.body;

  try{
    const updateProject=await Project.findByIdAndUpdate(
      id,
      {title,description,team,resources,start,end,status},
      {new:true}
    );

    if(!updateProject){
      res.status(404).json({message:'Project not found'});
    }

    res.status(200).json({message:"updated Sucessfully"});
  }
  catch(err){
    res.status(500).send('Server error');
  }
}


const updateProjectStatus=async(req,res)=>{
  const {id}=req.params;

  const {status}=req.body;

  try{
    const updateProject=await Project.findByIdAndUpdate(
      id,
      {status},
      {new:true}
    );

    if(!updateProject){
      res.status(404).json({message:'Project not found'});
    }

    res.status(200).json({message:"updated Sucessfully"});
  }
  catch(err){
    res.status(500).send('Server error');
  }
}


const deleteProject=async(req,res)=>{
  const {id}=req.params;

  

  try{
    const deleteProject=await Project.findByIdAndDelete(id)

    if(!deleteProject){
      res.status(404).json({message:'Project not found'});
    }

    res.status(200).json({message:"deleted Sucessfully"});
  }
  catch(err){
    console.error('Error deleting employee:', err);
    res.status(500).send('Server error');
  }
}



const getCompany=async (req, res) => {
  try {
    const user = await company.findOne({ companyId: req.params.companyId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};




const updateCompanyById = async (req, res) => {
  try {
    // Handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Prepare update object
      const updateData = req.body;

      // If a new logo is uploaded, include the file path in the update
      if (req.file) {
        updateData.companyLogo = req.file.path;
      }

      const updatedUser = await company.findOneAndUpdate(
        { companyId: req.params.companyId },
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'Company not found' });
      }

      res.json(updatedUser);
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};


const dashboardData=async(req,res)=>{
  const companyId = req.query.companyId; // Retrieve companyId from the query parameters
  
  if (!companyId) {
    return res.status(400).json({ message: 'Company ID is required' });
  }

  try {
    const employeeCount = await Employee.countDocuments({ companyId }); // Filter employees by companyId
    const totalProjects = await Project.countDocuments({ companyId }); // Filter projects by companyId
    const completedProjects = await Project.countDocuments({ companyId, status: 'Completed' }); // Filter completed projects by companyId
    const ongoingProjects = await Project.countDocuments({ companyId, status: { $ne: 'Completed' } }); // Filter ongoing projects by companyId

    res.status(200).json({
      employeeCount,
      totalProjects,
      completedProjects,
      ongoingProjects
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }

}




module.exports = {
  registerCompany,
  loginCompany,
  addEmployee,
  displayEmployees,
  updateEmployee,
  deleteEmployee,
  addTask,
  displayTasks,
  updateTask,
  deleteTask,
  addProject,
  displayProjects,
  updateProject,
  deleteProject,
  updateProjectStatus,
  resetPassword,
  forgotPassword,
  CompanyResetPassword,
  CompanyforgotPassword,
  getEmployees,
  updateUserByEmpId,
  getCompany,
  updateCompanyById,
  dashboardData
};
