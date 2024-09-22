import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CompanyProfile = () => {
  const [userData, setUserData] = useState({
    companyId: '',
    companyName: '',
    service:'',
    email: '',
    phoneNo: '',
    role: '',
    address: ''
  });
  const [logoPath, setLogoPath] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const companyId = localStorage.getItem('companyId');
    setLogoPath(localStorage.getItem('logo'));
    
    axios.get(`https://taskmanagementsystem-64t8.onrender.com/api/company/${companyId}`)
      .then(response => {
        setUserData(response.data);
        const updatedLogoPath = response.data.companyLogo;
    localStorage.setItem('logo', updatedLogoPath);
    
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

  const handleLogoChange = (e) => {
    setLogoFile(e.target.files[0]);
    setLogoPath(URL.createObjectURL(e.target.files[0])); // Update the preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const companyId = localStorage.getItem('companyId');

    const formData = new FormData();
    formData.append('companyId', userData.companyId);
    formData.append('companyName', userData.companyName);
    formData.append('service', userData.service);
    formData.append('email', userData.email);
    formData.append('phoneNo', userData.phoneNo);
    formData.append('role', userData.role);
    formData.append('address', userData.address);

    if (logoFile) {
      formData.append('companyLogo', logoFile);
    }

    try {
      await axios.put(`https://taskmanagementsystem-64t8.onrender.com/api/company/${companyId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowModal(true); // Show the modal after a successful update
    } catch (error) {
      console.error('There was an error updating the profile!', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Company Profile</h5>
          <div className="d-flex justify-content-center mb-4">
            <img src={logoPath ? `https://taskmanagementsystem-64t8.onrender.com/${logoPath}` : 'default-placeholder.png'} alt="Company Logo" style={{ width: '100px' }} />
          </div>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row mb-3">
              <div className="col-md-12 text-center">
                <label className="form-label">Change Logo</label>
                <input
                  type="file"
                  className="form-control"
                  name="companyLogo"
                  onChange={handleLogoChange}
                  accept="image/*"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Company ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="companyId"
                  value={userData.companyId}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="companyName"
                  value={userData.companyName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Service</label>
                <input
                  type="text"
                  className="form-control"
                  name="service"
                  value={userData.service}
                  onChange={handleChange}
                />
              </div>
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
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phoneNo"
                  value={userData.phoneNo}
                  onChange={handleChange}
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
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
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

export default CompanyProfile;
