import React from 'react';
import '../styles/game.css';

const Message = ({ message }) => {
  return (
    <div className="message-box">
      {message}
    </div>
  );
};

export default Message;