import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import './Chat.css';

const socket = io.connect('http://localhost:4000');

function Chat() {
  const location = useLocation();
  const { username, room } = location.state;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState([]);

  useEffect(() => {
    socket.emit('join_room', room);

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('typing_status', (users) => {
      setTypingStatus(users);
    });

    return () => {
      socket.disconnect();
    };
  }, [room]);

  const sendMessage = () => {
    if (message) {
      const data = { room, username, message };
      socket.emit('send_message', data);
      setMessages((prev) => [...prev, data]);
      setMessage('');
    }
  };

  const handleTyping = (isTyping) => {
    socket.emit('typing', { room, username, typing: isTyping });
  };

  return (
    <div className="chat-container">
      <h2>Room: {room}</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.username}: </strong>
            {msg.message}
          </p>
        ))}
      </div>
      {typingStatus.length > 0 && (
        <p>{typingStatus.join(', ')} is typing...</p>
      )}
      <input
        type="text"
        value={message}
        placeholder="Type a message..."
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={() => handleTyping(true)}
        onKeyUp={() => handleTyping(false)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;


