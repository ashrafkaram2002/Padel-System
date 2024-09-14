"use client"; 

import { useState } from 'react';
import axios from 'axios';
import Image from "next/image";
import AppNavBar from '../components/AppNavBar';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

  try {
      const response = await axios.post('http://localhost:8000/login', {
        usrename: username,
        password: password,
      });
      
      if (response.status === 200) {
        console.log('Login successful', response.data);
        // Redirect to admin dashboard or do something on success
        setErrorMessage('Done');
      } else {
        setErrorMessage('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Login failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <>
      <AppNavBar onLogin={true} onHome={false}/>
      <div className="relative min-h-screen">
        <Image
          src="/assets/padel2.jpg"
          alt="Padel Background"
          layout="fill"
          objectFit="cover"
        />
        <div className="centering-container">
      <div className="login-box">
        <h2 className="login-title">Admin Access</h2>
        <p className="login-subtitle">Sign in with your admin credentials</p>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button className="login-buttonn" type="submit" disabled={loading}>
  {loading ? (
    <div className="flex justify-center items-center h-full">
      <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white"></div>
    </div>
  ) : (
    'Login'
  )}
</button>

        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
        </div>
      </div>
    </>
    
  );
}
