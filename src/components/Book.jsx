import React, { useState } from 'react';
import '../styles/book.css';

const Book = ({ flipBook, lastRun, pageNumber, gameOver }) => {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleClick = () => {
    if (isFlipping || gameOver) return;
    
    setIsFlipping(true);
    flipBook();
    
    setTimeout(() => {
      setIsFlipping(false);
    }, 1000);
  };

  return (
    <div className="book-container">
      <div className={`book ${isFlipping ? 'flipping' : ''}`} onClick={handleClick}>
        {/* Front Cover */}
        <div className="book-front">
          <div className="cover-design">
            <div className="cricket-stumps"></div>
            <div className="title">Book Cricket</div>
            <div className="subtitle">Flip to Play</div>
          </div>
        </div>
        
        {/* Back Cover - Shows results */}
        <div className="book-back">
          {pageNumber !== null && <div className="page-number">Page: {pageNumber}</div>}
          {lastRun !== null && (
            <div className={`runs-display ${lastRun === 6 ? 'maximum' : ''}`}>
              {lastRun === 6 ? 'MAXIMUM 6!' : `${lastRun} run${lastRun !== 1 ? 's' : ''}`}
            </div>
          )}
          <div className="click-hint">Click to continue</div>
        </div>
      </div>
      
      {gameOver && <div className="game-over-overlay">Game Over</div>}
    </div>
  );
};

export default Book;