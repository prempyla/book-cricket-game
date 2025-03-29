import React, { useState } from 'react';
import TeamScorecard from './TeamScorecard';
import Book from './Book';
import Message from './Message';
import '../styles/game.css';

const initialPlayers = (teamName) => [
  { name: `${teamName} Player 1`, score: 0, isOut: false, isBatting: false },
  { name: `${teamName} Player 2`, score: 0, isOut: false, isBatting: false },
  { name: `${teamName} Player 3`, score: 0, isOut: false, isBatting: false },
  { name: `${teamName} Player 4`, score: 0, isOut: false, isBatting: false }
];

const Game = () => {
  const [teams, setTeams] = useState([
    { 
      name: 'Team A', 
      totalScore: 0, 
      balls: 0, 
      isActive: true,
      players: initialPlayers('Team A'),
      currentPlayerIndex: 0
    },
    { 
      name: 'Team B', 
      totalScore: 0, 
      balls: 0, 
      isActive: false,
      players: initialPlayers('Team B'),
      currentPlayerIndex: 0
    }
  ]);
  
  const [gameMessage, setGameMessage] = useState('Click the book to start playing!');
  const [gameOver, setGameOver] = useState(false);
  const [lastRun, setLastRun] = useState(null);
  const [pageNumber, setPageNumber] = useState(null);

  const flipBook = () => {
    if (gameOver) return;

    const activeTeamIndex = teams.findIndex(team => team.isActive);
    const activeTeam = teams[activeTeamIndex];
    
    if (activeTeam.balls >= 20) {
      switchTeams();
      return;
    }

    // Generate random page number between 10 and 200
    const newPageNumber = Math.floor(Math.random() * 191) + 10;
    const lastDigit = newPageNumber % 10;
    let runs = lastDigit === 0 ? 0 : Math.min(lastDigit, 6);

    setPageNumber(newPageNumber);
    setLastRun(runs);

    const updatedTeams = [...teams];
    const currentPlayer = activeTeam.players[activeTeam.currentPlayerIndex];
    
    // Update player score
    currentPlayer.score += runs;
    
    // Update team total
    updatedTeams[activeTeamIndex] = {
      ...activeTeam,
      totalScore: activeTeam.totalScore + runs,
      balls: activeTeam.balls + 1
    };

    setTeams(updatedTeams);

    if (runs === 0) {
      // Player is out
      currentPlayer.isOut = true;
      
      // Check if all players are out
      const allOut = updatedTeams[activeTeamIndex].players.every(p => p.isOut);
      
      if (allOut || activeTeam.balls + 1 >= 20) {
        setGameMessage(`All out! ${activeTeam.name} scored ${activeTeam.totalScore + runs} runs. Switching teams...`);
        setTimeout(() => switchTeams(), 1500);
      } else {
        // Move to next player
        const nextPlayerIndex = (activeTeam.currentPlayerIndex + 1) % 4;
        updatedTeams[activeTeamIndex].currentPlayerIndex = nextPlayerIndex;
        updatedTeams[activeTeamIndex].players.forEach((p, i) => {
          p.isBatting = i === nextPlayerIndex;
        });
        
        setGameMessage(`Out! ${currentPlayer.name} is out. ${activeTeam.players[nextPlayerIndex].name} is now batting.`);
      }
    } else if (runs === 6) {
      setGameMessage(`Maximum! ${currentPlayer.name} scored 6 runs from that ball!`);
    } else {
      setGameMessage(`${currentPlayer.name} scored ${runs} runs from that ball.`);
    }

    // Check if game should end
    if (activeTeamIndex === 1 && updatedTeams[1].balls >= 20) {
      endGame();
    }
  };

  const switchTeams = () => {
    const updatedTeams = teams.map((team, index) => {
      const isNowActive = !team.isActive;
      return {
        ...team,
        isActive: isNowActive,
        players: team.players.map((p, i) => ({
          ...p,
          isBatting: isNowActive && i === 0
        })),
        currentPlayerIndex: isNowActive ? 0 : team.currentPlayerIndex
      };
    });
    
    setTeams(updatedTeams);
    setGameMessage(updatedTeams[1].isActive 
      ? `Team B is now batting! Team A scored ${teams[0].totalScore} runs.` 
      : 'Team A is now batting!');
    setLastRun(null);
    setPageNumber(null);
  };

  const endGame = () => {
    setGameOver(true);
    const winner = teams[0].totalScore > teams[1].totalScore ? teams[0].name : 
                   teams[0].totalScore < teams[1].totalScore ? teams[1].name : null;
    
    if (winner) {
      setGameMessage(`Game Over! ${winner} wins by ${Math.abs(teams[0].totalScore - teams[1].totalScore)} runs!`);
    } else {
      setGameMessage("Game Over! It's a tie!");
    }
  };

  const resetGame = () => {
    setTeams([
      { 
        name: 'Team A', 
        totalScore: 0, 
        balls: 0, 
        isActive: true,
        players: initialPlayers('Team A'),
        currentPlayerIndex: 0
      },
      { 
        name: 'Team B', 
        totalScore: 0, 
        balls: 0, 
        isActive: false,
        players: initialPlayers('Team B'),
        currentPlayerIndex: 0
      }
    ]);
    setGameMessage('Click the book to start playing!');
    setGameOver(false);
    setLastRun(null);
    setPageNumber(null);
  };

  return (
    <div className="game-container">
      <h1>Book Cricket Game</h1>
      <div className="scorecards-container">
        {teams.map((team, index) => (
          <TeamScorecard 
            key={index}
            name={team.name}
            totalScore={team.totalScore}
            balls={team.balls}
            isActive={team.isActive}
            players={team.players}
            currentPlayerIndex={team.currentPlayerIndex}
          />
        ))}
      </div>
      
      <Book 
        flipBook={flipBook} 
        lastRun={lastRun} 
        pageNumber={pageNumber}
        gameOver={gameOver} 
      />
      
      <Message message={gameMessage} />
      
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
      
      <div className="instructions">
        <h3>How to Play:</h3>
        <ul>
          <li>Click the book to "flip" a page</li>
          <li>The last digit of the page number is your runs (maximum 6)</li>
          <li>If the last digit is 0, the current batsman is out</li>
          <li>Each team gets 20 balls to score as many runs as possible</li>
          <li>Each team has 4 players who bat in order</li>
        </ul>
      </div>
    </div>
  );
};

export default Game;