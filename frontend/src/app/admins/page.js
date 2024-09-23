"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from "next/image";
import AppNavBar from '../components/AppNavBar';
import AdminsTable from '../components/AdminsTable';
import SearchBar from '../components/SearchBar';
import { MdPersonAdd } from "react-icons/md";

export default function Admins() {

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [adminsData, setAdminsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminsData();
  }, []);

  // Fetch the list of admins
  const fetchAdminsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/viewAdmins');
      setAdminsData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admins data:', error);
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Password validation
  const validatePasswordStrength = (password) => {
    const lengthRegex = /.{8,}/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!lengthRegex.test(password)) {
      return 'Password must be at least 8 characters long';
    }
    if (!uppercaseRegex.test(password)) {
      return 'Password must include at least one uppercase letter';
    }
    if (!numberRegex.test(password)) {
      return 'Password must include at least one number';
    }
    if (!specialCharRegex.test(password)) {
      return 'Password must include at least one special character';
    }
    return 'strong';
  };

  // Handle adding a new admin
  const handleAddAdmin = async () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    const passwordStrength = validatePasswordStrength(password);
    if (passwordStrength !== 'strong') {
      setMessage(passwordStrength);
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/addAdmin', { username: username, password: password });
      if (response.status === 200) {
        setMessage('Admin added successfully!');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        await fetchAdminsData();

        // Close the modal after a short delay so the message is visible
        setTimeout(() => {
          setShowAddPopup(false);
          setMessage(''); // Clear the message after closing the modal
        }, 1500);
      } else {
        setMessage('Failed to add admin');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      if (error.response && error.response.status === 409) {
        setMessage('Admin already exists. Please choose a different username.');
      } else {
        setMessage('Error occurred while adding admin');
      }
    }
  };

  // Handle modal cancel
  const handleCancelAdd = () => {
    setShowAddPopup(false);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setMessage(""); // Clear the message when the modal is closed
  };

  // Filter admin data based on search term
  const filteredData = adminsData.filter(item =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AppNavBar onLogin={false} onHome={false} />
      <div className="relative min-h-screen">
        <Image
          src="/assets/padel2.jpg"
          alt="Padel Background"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="center-container" style={{ marginTop: "5rem", textAlign: "center" }}>
        <div className='horizontal-container2'>
          <div className="page-title">Manage Admins</div>
          <button onClick={() => {
            setShowAddPopup(true);
            setMessage(''); // Clear message when opening modal
          }}>
            <MdPersonAdd className="icon-button" />
          </button>
        </div>
        <SearchBar className="search-bar" onSearch={handleSearch} />
        <AdminsTable searchTerm={searchTerm} adminsData={filteredData} loading={loading} fetchAdminsData={fetchAdminsData} />
      </div>

      {showAddPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Add New Admin</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="modal-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modal-input"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="modal-input"
            />
            {message && <p className="modal-message2">{message}</p>}
            <button className="modal-button confirm" onClick={handleAddAdmin}>
              Confirm
            </button>
            <button className="modal-button cancel" onClick={handleCancelAdd}>
              Cancel
            </button>

          </div>
        </div>
      )}
    </>

  );
}
