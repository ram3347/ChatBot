import React, { useState } from 'react';
import { FaReact } from 'react-icons/fa6';
import './style.css';

const UserLogin = ({ setUser }) => {
  const [username, updateUsername] = useState('');

  const handleLogin = () => {
    if (username.trim()) {
      localStorage.setItem('chat_username', username);
      setUser(username);
    }
  };

  return (
    <div className="login_container">
      <div className="login_title">
        <FaReact />
        <h1>Chat App</h1>
      </div>
      <div className="login_form">
        <input
          type="text"
          placeholder="Enter a Unique Name"
          value={username}
          onChange={(e) => updateUsername(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default UserLogin;
