import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({ name: '', age: '', phone: '', email: '' });
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:3001');
    
    socket.on('totalUsersUpdate', (count) => {
      setTotalUsers(count);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || isNaN(formData.age) || formData.age <= 0) newErrors.age = 'Valid age is required';
    if (!formData.phone.match(/^\d{10,}$/)) newErrors.phone = 'Phone number must be at least 10 digits';
    if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmittedData(formData);
      setFormData({ name: '', age: '', phone: '', email: '' });
      setErrors({});
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="mb-4">Total Users Connected</h1>
        <button className={`btn btn-primary ${isAnimating ? 'pulse' : ''}`}>
          Connected Users: {totalUsers}
        </button>
      </div>

      <div className="card p-4 mt-4 mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center">User Information Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" name="name" className="form-control" placeholder="Name" value={formData.name} onChange={handleChange} />
            {errors.name && <div className="text-danger small">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <input type="text" name="age" className="form-control" placeholder="Age" value={formData.age} onChange={handleChange} />
            {errors.age && <div className="text-danger small">{errors.age}</div>}
          </div>

          <div className="mb-3">
            <input type="text" name="phone" className="form-control" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
            {errors.phone && <div className="text-danger small">{errors.phone}</div>}
          </div>

          <div className="mb-3">
            <input type="email" name="email" className="form-control" placeholder="Email" value={formData.email} onChange={handleChange} />
            {errors.email && <div className="text-danger small">{errors.email}</div>}
          </div>

          <button type="submit" className="btn btn-success w-100">Submit</button>
        </form>
      </div>

      {submittedData && (
        <div className="alert alert-success mt-4 mx-auto" style={{ maxWidth: '400px' }}>
          <h4>Submitted Data</h4>
          <p><strong>Name:</strong> {submittedData.name}</p>
          <p><strong>Age:</strong> {submittedData.age}</p>
          <p><strong>Phone:</strong> {submittedData.phone}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
        </div>
      )}

      <footer className="text-center mt-5 text-muted">
        <p>Made by Anshum Gupta</p>
      </footer>
    </div>
  );
}

export default App;