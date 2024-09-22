import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    empId: '',
    name: '',
    email: '',
    phone: '',
    team: '',
    role: '',
    companyId: 'Prajaahita Foundation'
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const empId = localStorage.getItem('employeeId');
    
    axios.get(`http://localhost:3001/api/users/${empId}`)
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the user data!', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const empId = localStorage.getItem('employeeId');
    
    axios.put(`http://localhost:3001/api/users/${empId}`, userData)
      .then(response => {
        setShowModal(true); // Show the modal after a successful update
      })
      .catch(error => {
        console.error('There was an error updating the profile!', error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Employee Profile</h5>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Employee ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="empId"
                  value={userData.empId}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Team</label>
                <input
                  type="text"
                  className="form-control"
                  name="team"
                  value={userData.team}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Role</label>
                <input
                  type="text"
                  className="form-control"
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-12">
                <label className="form-label">Company ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="companyId"
                  value={userData.companyId}
                  readOnly
                />
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Profile Updated</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p>Your profile has been updated successfully!</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
