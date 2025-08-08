import React, { useState } from 'react';
import '../css/Auth.css';
import Dashboard from '../assets/dashboard.png';
import Logo from '../assets/logo.png';
import { apiClient } from '../utils/FetchNodeService';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  var navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (!isLogin && form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async () => {
  if (!validateForm()) return;

  setLoading(true);
  try {
    if (isLogin) {
      const res = await apiClient("post", "/admin/login", {
        email: form.email,
        password: form.password
      });
      console.log("Login success:", res);
      if (res.ok) {
        toast.success('Login successful!', {
          position: "top-center",
          autoClose: 1000,
          onClose: () => navigate('/dashboard')
        });
      }
    } else {
      const res = await apiClient("post", "/admin", {
        name: form.name,
        email: form.email,
        password: form.password
      });
      console.log("Registration success:", res);

      toast.success('Admin registered successfully. Now login.', {
        position: "top-center",
        autoClose: 2000,
        onClose: () => setIsLogin(true)
      });

      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    }
  } catch (error) {
    console.error("API error:", error);
    toast.error("Something went wrong!");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="auth-container">
      <ToastContainer />

      {/* Logo */}
      <div className="authfull-logo">
        <div className="authfull-logo-text"></div>
        <img src={Logo} alt="Logo" className="auth-image" />
      </div>

      {/* Auth Card */}
      <div className="auth-card">
        {/* Left Section */}
        <div className="auth-left">
          <img src={Dashboard} alt="Dashboard" className="auth-image" />
          <h2 className="auth-heading">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </h2>
          <p className="auth-text">
            Tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>

        {/* Right Section (Form) */}
        <div className="auth-right">
          <h2 className="auth-title">Welcome to Dashboard</h2>

          {!isLogin ? (
            <>
              <input
                className="auth-input"
                type="text"
                placeholder="Full name*"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onFocus={() => handleChange('name', form.name)}
              />
              {errors.name && <p className="auth-error">{errors.name}</p>}

              <input
                className="auth-input"
                type="email"
                placeholder="Email Address*"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onFocus={() => handleChange('email', form.email)}
              />
              {errors.email && <p className="auth-error">{errors.email}</p>}

              <input
                className="auth-input"
                type="password"
                placeholder="Password*"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onFocus={() => handleChange('password', form.password)}
              />
              {errors.password && <p className="auth-error">{errors.password}</p>}

              <input
                className="auth-input"
                type="password"
                placeholder="Confirm Password*"
                value={form.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onFocus={() => handleChange('confirmPassword', form.confirmPassword)}
              />
              {errors.confirmPassword && <p className="auth-error">{errors.confirmPassword}</p>}

              <button className="auth-button" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>

              <p className="auth-switch">
                Already have an account?{' '}
                <span onClick={() => setIsLogin(true)} className="auth-link">Login</span>
              </p>
            </>
          ) : (
            <>
              <input
                className="auth-input"
                type="email"
                placeholder="Email Address*"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onFocus={() => handleChange('email', form.email)}
              />
              {errors.email && <p className="auth-error">{errors.email}</p>}

              <input
                className="auth-input"
                type="password"
                placeholder="Password*"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onFocus={() => handleChange('password', form.password)}
              />
              {errors.password && <p className="auth-error">{errors.password}</p>}

              <a href="#" className="auth-forgot">Forgot password?</a>
              <button className="auth-button" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <p className="auth-switch">
                Don't have an account?{' '}
                <span onClick={() => setIsLogin(false)} className="auth-link">Register</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
