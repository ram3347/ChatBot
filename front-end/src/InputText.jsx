import React, { useState } from 'react';
import axios from 'axios';

const InputText = ({ addMessage }) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    addMessage({ message: trimmed });
    setMessage('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      const fileUrl = res.data.fileUrl;

      alert(`Uploaded file: ${file.name}`);
      addMessage({ message: fileUrl }); // Send the URL to others in the group
    } catch (err) {
      alert('Upload failed.');
      console.error(err);
    }
  };

  return (
    <div className="inputtext_container">
      <textarea
        rows="4"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button onClick={sendMessage}>Send</button>
        <label style={{ cursor: 'pointer', background: '#eee', padding: '6px', borderRadius: '6px' }}>
          📎 Upload
          <input type="file" hidden onChange={handleFileUpload} />
        </label>
      </div>
    </div>
  );
};

export default InputText;
