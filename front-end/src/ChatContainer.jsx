import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import ChatList from './ChatList';
import InputText from './InputText';
import UserLogin from './UserLogin';

const socketio = socketIOClient('http://localhost:5000');

const GROUPS = ['10th friends', 'fc25', 'family', 'gitam'];

const ChatContainer = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(localStorage.getItem('chat_username') || '');
  const [chats, setChats] = useState([]);
  const [currentGroup, setCurrentGroup] = useState('10th friends');

  useEffect(() => {
    const storedUser = localStorage.getItem('chat_username');
    if (storedUser) {
      setUser(storedUser);
      socketio.emit('login', storedUser);
      socketio.emit('join_group', currentGroup);
    } else {
      navigate('/');
    }

    socketio.on('connect', () => {
      console.log('Connected to backend:', socketio.id);
    });

    socketio.on('group_message', ({ sender, message, timestamp }) => {
      setChats((prev) => [...prev, { sender, message, timestamp }]);
    });

    return () => {
      socketio.off('group_message');
    };
  }, [navigate, currentGroup]);

  const addMessage = ({ message }) => {
    if (!user || !message.trim()) return;
    socketio.emit('group_message', { sender: user, message });
  };

  const handleGroupChange = (e) => {
    const selectedGroup = e.target.value;
    setChats([]); // clear previous chats
    setCurrentGroup(selectedGroup);
    socketio.emit('join_group', selectedGroup);
  };

  const handleLogout = () => {
    localStorage.removeItem('chat_username');
    setUser('');
    navigate('/');
  };

  return (
    <div className="chat_container">
      {user ? (
        <div>
          <div className="chats_header">
            <h4>Username: {user}</h4>
            <p>Current Group: {currentGroup}</p>
            <select value={currentGroup} onChange={handleGroupChange}>
              {GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            <p
              className="chats_logout"
              onClick={handleLogout}
              style={{ cursor: 'pointer', color: 'red' }}
            >
              <strong>Logout</strong>
            </p>
          </div>
          <ChatList currentUser={user} chats={chats} />
          <InputText addMessage={addMessage} />
        </div>
      ) : (
        <UserLogin setUser={setUser} />
      )}
    </div>
  );
};

export default ChatContainer;
