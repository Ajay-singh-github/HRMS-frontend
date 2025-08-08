import React, { useState, useEffect } from 'react';
import '../css/AddCandidateModal.css';
import { FiUpload } from 'react-icons/fi';
import { apiClient } from '../utils/FetchNodeService';
import { ToastContainer, toast } from 'react-toastify';

export default function AddCandidateModal({ setIsModalOpen, selectedEmployeeData, activeItem }) {
  const isEmployee = activeItem === 'Employees';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null,
    declaration: false,
    createdAt: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill data if editing employee
  useEffect(() => {
    if (isEmployee && selectedEmployeeData) {
      setFormData({
        fullName: selectedEmployeeData.fullName || '',
        email: selectedEmployeeData.email || '',
        phone: selectedEmployeeData.phone || '',
        position: selectedEmployeeData.position || '',
        experience: selectedEmployeeData.experience || '',
        resume: null, // resume not pre-filled
        declaration: true,
        createdAt: selectedEmployeeData.createdAt
          ? new Date(selectedEmployeeData.createdAt).toISOString().split('T')[0]
          : '',
      });
    }
  }, [isEmployee, selectedEmployeeData]);

  // Validate form
  useEffect(() => {
    const { fullName, email, phone, position, experience, resume, declaration, createdAt } = formData;

    const isValid =
      fullName.trim() &&
      email.trim() &&
      phone.trim() &&
      position.trim() &&
      experience &&
      (isEmployee ? createdAt.trim() : declaration) &&
      (!isEmployee ? resume : true); // resume required only for new candidates

    setIsFormValid(isValid);
  }, [formData, isEmployee]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 250);
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const body = new FormData();
      body.append('fullName', formData.fullName);
      body.append('email', formData.email);
      body.append('phone', formData.phone);
      body.append('position', formData.position);
      body.append('experience', formData.experience);

      if (formData.resume) {
        body.append('resume', formData.resume);
      }

      if (isEmployee) {
        body.append('createdAt', formData.createdAt);
      } else {
        body.append('declarationAccepted', formData.declaration);
      }

      const endpoint = isEmployee
        ? `/candidate/${selectedEmployeeData._id}`
        : '/candidate';

      const method = isEmployee ? 'put' : 'post';

      const response = await apiClient(method, endpoint, body, true);

      if (response.status === 200 || response.status === 201) {
        toast.success(`${isEmployee ? 'Employee updated' : 'Candidate added'} successfully!`);
        setTimeout(() => {
          handleClose();
        }, 1200);
      } else {
        toast.error('Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Server error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={`modal-overlay ${isClosing ? 'closing' : ''}`}>
        <div className={`modal ${isClosing ? 'closing' : ''}`}>
          <div className="modal-header">
            <h4>{isEmployee ? 'Update Employee' : 'Add New Candidate'}</h4>
            <button className="close-btn" onClick={handleClose}>×</button>
          </div>

          <div className="modal-body">
            <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name*"
                value={formData.fullName}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address*"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number*"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                type="text"
                name="position"
                placeholder="Position*"
                value={formData.position}
                onChange={handleChange}
              />
              <input
                type="text"
                name="experience"
                placeholder="Experience*"
                value={formData.experience}
                onChange={handleChange}
              />

              {isEmployee && (
                <input
                  type="date"
                  name="createdAt"
                  placeholder="Date of Joining*"
                  value={formData.createdAt}
                  onChange={handleChange}
                  className="styled-date-input"
                />
              )}

              <div className="resume-upload-wrapper">
                <label className="resume-upload-box">
                  <span className="resume-text">
                    Upload Resume{!isEmployee && <span className="required-star">*</span>}
                  </span>
                  <FiUpload className="upload-icon" />
                  <input type="file" name="resume" onChange={handleChange} />
                </label>
              </div>
            </form>

            {!isEmployee && (
              <div className="checkbox-row">
                <input
                  type="checkbox"
                  id="declaration"
                  name="declaration"
                  checked={formData.declaration}
                  onChange={handleChange}
                />
                <label htmlFor="declaration" className="declaration-label">
                  I hereby declare that the above information is true to the best of my knowledge and belief.
                </label>
              </div>
            )}

            <button
              className={`save-btn ${isFormValid && !isSubmitting ? 'enabled' : ''}`}
              disabled={!isFormValid || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting
                ? isEmployee
                  ? 'Updating...'
                  : 'Saving...'
                : isEmployee
                ? 'Update'
                : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={1500} hideProgressBar />
    </>
  );
}
