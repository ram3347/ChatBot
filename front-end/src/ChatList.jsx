import React from 'react';

const ChatList = ({ chats, currentUser }) => {
  return (
    <div className="chat_list" style={{ padding: '20px' }}>
      {chats.map((chat, index) => {
        const isSender = chat.sender === currentUser;
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: isSender ? 'flex-end' : 'flex-start',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                backgroundColor: isSender ? '#d4f7d4' : '#ffffff',
                padding: '10px',
                borderRadius: '10px',
                maxWidth: '60%',
              }}
            >
              <strong>{chat.sender}</strong>
              <p>
                {chat.message.startsWith('http') ? (
                  <a href={chat.message} target="_blank" rel="noopener noreferrer">
                    {chat.message.includes('.pdf') ? '📄 View PDF' : '🖼️ View File'}
                  </a>
                ) : (
                  chat.message
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
