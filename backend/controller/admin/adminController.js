const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const company=require('../../models/company/companymodel');

const mockFindOne = async (query) => {
    if (query.email === "taskapp24@gmail.com") {
      return {
        _id: "66cf349b738065c2ca28c480",
        email: "taskapp24@gmail.com",
        password: await bcrypt.hash("TaskApp@2024", 10), // Assuming the password is hashed
        role: "admin"
      };
    }
    return null; // Simulate user not found
  };

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const adminExist = await mockFindOne({ email });
      if (!adminExist) {
        console.log("Admin does not exist");
        return res.status(404).json({ message: 'Admin does not exist' });
      }
  
      const isValid = await bcrypt.compare(password, adminExist.password);
      if (!isValid) {
        console.log("Invalid password");
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      const tokenPayload = {
        _id: adminExist._id,
       
        email: adminExist.email,
       
        role: adminExist.role,
       
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


  const displayCompanies=async(req,res)=>{
    console.log("Displaying Companies");
    
    try{
      const companies =await company.find();
      if(companies===0){
        res.status(404).json({message: 'No Company Found'});
      }
      res.json(companies);
    }
    catch(err){
      res.status(500).json({message:err.message});
    }
  }



  const deleteCompany=async(req,res)=>{
    const {id}=req.params;
  
    
  
    try{
      const deleteCompany=await company.findByIdAndDelete(id)
  
      if(!deleteCompany){
        res.status(404).json({message:'Company not found'});
      }
  
      res.status(200).json({message:"deleted Sucessfully"});
    }
    catch(err){
      console.error('Error deleting companies:', err);
      res.status(500).send('Server error');
    }
  }

  module.exports={
    loginAdmin,
    displayCompanies,
    deleteCompany
  }