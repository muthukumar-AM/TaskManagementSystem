import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './Components/company/RegistrationForm';
import VerifyEmail from './Components/company/verifyEmail';
import LoginForm from './Components/company/LoginForm';
import DashBoard from './Components/DashBoard';
import Employee from './Components/company/Employee';
import EmpModal from './Components/company/EmpModal';
import EmpLogin from './Components/employee/EmpLogin';
import MyTasks from './Components/employee/myTasks';
import ResetPassword from './Components/company/ResetPassword';
import Tasks from './Components/company/Tasks';
import Project from './Components/company/Projects';
import MyProject from './Components/employee/MyProjects';
import ForgotPassword from './Components/employee/ForgotPassword';
import CompanyForgotPassword from './Components/company/CompanyForgotPassword';
import CompanyResetPassword from './Components/company/CompanyResetPassword';
import AdminLogin from './Components/admin/AdminLogin';
import Companies from './Components/admin/Companies';
import UserProfile from './Components/employee/Account';
import CompanyProfile from './Components/company/Profile';
import DashboardHome from './Components/company/DashBoardHome';
import TaskAppHome from './TaskAppHome';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<TaskAppHome/>}/>
          <Route path='/companySignup' element={<SignupForm />} />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/companyLogin' element={<LoginForm />} />
          <Route path='/Dashboard/*' element={<DashBoard />}>
            {/* Default route */}
            <Route index element={<DashboardHome />} />
            <Route path='employee' element={<Employee />} />
            <Route path='tasks' element={<Tasks />} />
            <Route path='myTasks' element={<MyTasks />} />
            <Route path='projects' element={<Project />} />
            <Route path='myProjects' element={<MyProject />} />
            <Route path='companies' element={<Companies />} />
            <Route path='profile' element={<UserProfile />} />
            <Route path='companyProfile' element={<CompanyProfile />} />
          </Route>
          <Route path='/emp' element={<EmpModal />} />
          <Route path='/empLogin' element={<EmpLogin />} />
          <Route path='/empForgotPassword' element={<ForgotPassword />} />
          <Route path='/companyForgotPassword' element={<CompanyForgotPassword />} />
          <Route path='/company-reset-password' element={<CompanyResetPassword />} />
          <Route path='/adminLogin' element={<AdminLogin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
