import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import DashboardHome from './company/DashBoardHome';

const DashBoard = () => {
    const [role, setRole] = useState('');
    const [logoPath, setLogoPath] = useState('');
    const location = useLocation(); // Get the current route

    useEffect(() => {
        setRole(localStorage.getItem('role'));
        setLogoPath(localStorage.getItem('logo'));
        
        const appendCSS = (href) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
            return link;
        };

        const link1 = appendCSS('https://unpkg.com/@webpixels/css@1.1.5/dist/index.css');
        const link2 = appendCSS('https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.4.0/font/bootstrap-icons.min.css');

        return () => {
            document.head.removeChild(link1);
            document.head.removeChild(link2);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div>
            <a href="https://webpixels.io/components?ref=codepen" className="btn w-full btn-primary text-truncate rounded-0 py-2 border-0 position-relative" style={{ zIndex: '1000' }}>
            Streamline your productivity with our <strong>Task Management System</strong> →
            </a>

            <div className="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary">
                <nav className="navbar show navbar-vertical h-lg-screen navbar-expand-lg px-0 py-3 navbar-light bg-white border-bottom border-bottom-lg-0 border-end-lg" id="navbarVertical">
                    <div className="container-fluid">
                        <button className="navbar-toggler ms-n2" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarCollapse" aria-controls="sidebarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <a className="navbar-brand py-lg-2 mb-lg-5 px-lg-6 me-0" href="#">
                            <img src={`http://localhost:3001/${logoPath}`} alt="Logo" />
                        </a>

                        <div className="navbar-user d-lg-none">
                            <div className="dropdown">
                                <a href="#" id="sidebarAvatar" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <div className="avatar-parent-child">
                                        <img alt="Image Placeholder" src="https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80" className="avatar avatar- rounded-circle" />
                                        <span className="avatar-child avatar-badge bg-success"></span>
                                    </div>
                                </a>
                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="sidebarAvatar">
                                    <a href="#" className="dropdown-item">Profile</a>
                                    <a href="#" className="dropdown-item">Settings</a>
                                    <a href="#" className="dropdown-item">Billing</a>
                                    <hr className="dropdown-divider" />
                                    <a href="#" className="dropdown-item">Logout</a>
                                </div>
                            </div>
                        </div>

                        <div className="collapse navbar-collapse" id="sidebarCollapse">
                            <ul className="navbar-nav">
                                {role === 'admin' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="companies">
                                                <i className="bi bi-bar-chart"></i> Companies
                                            </Link>
                                        </li>
                                    </>
                                )}
                                {role === 'company' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="">
                                                <i className="bi bi-house"></i> Dashboard
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="employee">
                                                <i className="bi bi-people"></i> Employees
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="projects">
                                                <i className="bi bi-bookmarks"></i> Projects
                                            </Link>
                                        </li>
                                        
                                    </>
                                )}
                                {(role === "Manager" || role === "company" || role === "Lead") && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="tasks">
                                                <i className="bi bi-chat"></i> Task
                                                <span className="badge bg-soft-primary text-primary rounded-pill d-inline-flex align-items-center ms-auto">6</span>
                                            </Link>
                                        </li>
                                    </>
                                )}
                                {(role === 'Employee' || role === 'Lead' || role === 'Manager') && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="myTasks">
                                                <i className="bi bi-chat"></i> My Tasks
                                                <span className="badge bg-soft-primary text-primary rounded-pill d-inline-flex align-items-center ms-auto">6</span>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="myProjects">
                                                <i className="bi bi-chat"></i> Projects
                                                <span className="badge bg-soft-primary text-primary rounded-pill d-inline-flex align-items-center ms-auto">6</span>
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>

                            <hr className="navbar-divider my-5 opacity-20" />

                            <div className="mt-auto"></div>

                            <ul className="navbar-nav">
                                {(role === 'Employee' || role === 'Lead' || role === 'Manager') && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="profile">
                                            <i className="bi bi-person-square"></i> Account
                                        </Link>
                                    </li>
                                )}
                                {role === 'company' && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="companyProfile">
                                            <i className="bi bi-person-square"></i> Account
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <Link className="nav-link" to="#" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-left"></i> Logout
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="h-screen flex-grow-1 overflow-y-lg-auto">
                    <main className="py-6 bg-surface-secondary">
                        <div className="container-fluid">
                           
                            {/* Render other components based on the route */}
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
