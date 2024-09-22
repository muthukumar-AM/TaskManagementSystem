const jwt = require('jsonwebtoken');
const emp=require('../../models/company/employeemodel');
const bcrypt = require('bcrypt');
const Task=require('../../models/company/myTaskModel');
const myTask=require('../../models/company/taskmodel');
const Project=require('../../models/company/projectmodel');
const User=require('../../models/company/employeemodel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});



const loginEmployee = async (req, res) => {
    const { empId, password } = req.body;
  
    try {
      const employeeExist = await emp.findOne({ empId });
      if (!employeeExist) {
        console.log("Employee does not exist");
        return res.status(404).json({ message: 'Employee does not exist' });
      }
  
      const isValid = await bcrypt.compare(password, employeeExist.password);
      if (!isValid) {
        console.log("Invalid password");
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      const tokenPayload = {
        _id: employeeExist._id,
        empId: employeeExist.empId,
        name: employeeExist.empName,
        email: employeeExist.email,
        phone: employeeExist.phone,
        team: employeeExist.address,
       
        role: employeeExist.role,
        permissions: employeeExist.permissions,
        companyId: employeeExist.companyId
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



  exports.createTask = async (req, res) => {
    try {
      const task = new Task({
        title: req.body.title,
        description: req.body.description,
        createdDate: req.body.createdDate,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        assignedTo: req.body.assignedTo,
        assignedBy: req.body.assignedBy,
        comment: req.body.comment,
        status: req.body.status,
      });
  
      const newTask = await task.save();
      res.status(201).json(newTask);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };


  const displayTasks = async (req, res) => {
    console.log("Displaying tasks");
    const { empId } = req.params; // Assuming empId is passed in the URL parameters
    console.log(empId);
    try {
      const tasks = await myTask.find({ assignedTo: empId }); // Filter tasks by empId
  
      if (tasks.length === 0) {
        return res.status(404).json({ message: 'No Tasks Found' });
      }
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


  const displayProjects=async(req,res)=>{
    console.log("Displaying Projects");
    const { empId } = req.query;
    console.log(empId);
    try{
      const projects =await Project.find({ team: empId });
      console.log(projects);
      if(projects===0){
        res.status(404).json({message: 'No Projects Found'});
      }
      res.json(projects);
    }
    catch(err){
      res.status(500).json({message:err.message});
    }
  }



const forgotPassword = async (req, res) => {
  console.log("forgot password");
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


      


        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

        // Save token and expiry time to the user's record
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

       

        const mailOptions = {
            to: user.email,
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
  

  module.exports = {
    loginEmployee,
    displayTasks,
    displayProjects,
    forgotPassword
  };