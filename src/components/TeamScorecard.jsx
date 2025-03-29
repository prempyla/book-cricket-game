import React from 'react';
import '../styles/scorecard.css';

const TeamScorecard = ({ name, totalScore, balls, isActive, players, currentPlayerIndex }) => {
  return (
    <div className={`scorecard ${isActive ? 'active' : ''}`}>
      <h3>{name}</h3>
      <div className="team-stats">
        <div className="score">Total: {totalScore}</div>
        <div className="balls">Balls: {balls}/20</div>
      </div>
      
      <div className="players-list">
        <h4>Players:</h4>
        {players.map((player, index) => (
          <div 
            key={index} 
            className={`player ${index === currentPlayerIndex ? 'batting' : ''} ${player.isOut ? 'out' : ''}`}
          >
            <span className="player-name">{player.name}</span>
            <span className="player-score">{player.score} {player.isOut && '(out)'}</span>
          </div>
        ))}
      </div>
      
      {isActive && <div className="active-indicator">Batting</div>}
    </div>
  );
};

export default TeamScorecard;