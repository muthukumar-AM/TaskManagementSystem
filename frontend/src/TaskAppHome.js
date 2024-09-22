import { Link } from 'react-router-dom';
import './App.css';
const TaskAppHome=()=>{
    return(
        <>

<div class="container mt-5">
<div>
          <img src="/logo.webp" className="w-32 mx-auto" alt="Logo" />
        </div>
    <h2 className='text-center text-primary mt-5'>Choose Account Type</h2>
    <div class="account-options mt-5">
    <Link to="/companyLogin">
      <div class="option">
        <img src="/company.png" alt="Company"/>
        <p>Company</p>
      </div>
      </Link>
      <div class="separator"></div>
      <Link to="/empLogin">
      <div class="option">
        <img src="user.png" alt="User"/>
        <p>Employee</p>
      </div>
      </Link>
    </div>
  </div>
        
        </>
    )
}

export default TaskAppHome;