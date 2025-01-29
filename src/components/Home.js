import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const joinRoom = () => {
    if (username && room) {
      navigate('/chat', { state: { username, room } });
    }
  };

  return (
    <div className="home-container">
      <h1>Join a Chat Room</h1>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Room Name"
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join</button>
    </div>
  );
}

export default Home;
