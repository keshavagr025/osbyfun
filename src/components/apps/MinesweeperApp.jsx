import React, { useState, useEffect } from 'react';

const MinesweeperApp = () => {
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const rows = 8, cols = 8, minesCount = 10;

  const initGame = () => {
    let newGrid = Array(rows).fill().map(() => Array(cols).fill({ isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0 }));
    let placed = 0;
    while(placed < minesCount) {
      let r = Math.floor(Math.random() * rows);
      let c = Math.floor(Math.random() * cols);
      if(!newGrid[r][c].isMine) {
        newGrid[r][c] = { ...newGrid[r][c], isMine: true };
        placed++;
      }
    }
    for(let r=0; r<rows; r++) {
      for(let c=0; c<cols; c++) {
        if(!newGrid[r][c].isMine) {
          let count = 0;
          for(let i=-1; i<=1; i++) {
            for(let j=-1; j<=1; j++) {
              if(r+i>=0 && r+i<rows && c+j>=0 && c+j<cols && newGrid[r+i][c+j].isMine) count++;
            }
          }
          newGrid[r][c] = { ...newGrid[r][c], neighborMines: count };
        }
      }
    }
    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
  };

  useEffect(() => { initGame(); }, []);

  const reveal = (r, c) => {
    if(gameOver || win || grid[r][c].isRevealed || grid[r][c].isFlagged) return;
    let newGrid = [...grid.map(row => [...row.map(cell => ({...cell}))])];
    
    if(newGrid[r][c].isMine) {
      newGrid[r][c].isRevealed = true;
      setGrid(newGrid);
      setGameOver(true);
      return;
    }

    const floodFill = (row, col) => {
      if(row<0 || row>=rows || col<0 || col>=cols || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
      newGrid[row][col].isRevealed = true;
      if(newGrid[row][col].neighborMines === 0) {
        for(let i=-1; i<=1; i++) {
          for(let j=-1; j<=1; j++) floodFill(row+i, col+j);
        }
      }
    };
    floodFill(r, c);
    
    let unrevealedSafe = 0;
    newGrid.forEach(row => row.forEach(cell => {
      if(!cell.isMine && !cell.isRevealed) unrevealedSafe++;
    }));
    
    setGrid(newGrid);
    if(unrevealedSafe === 0) setWin(true);
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if(gameOver || win || grid[r][c].isRevealed) return;
    let newGrid = [...grid.map(row => [...row.map(cell => ({...cell}))])];
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
    setGrid(newGrid);
  };

  return (
    <div className="minesweeper-app">
      <div className="minesweeper-header">
        <div className="minesweeper-score">{minesCount}</div>
        <button className="minesweeper-face retro-btn" onClick={initGame}>{gameOver ? '😵' : (win ? '😎' : '🙂')}</button>
        <div className="minesweeper-time">000</div>
      </div>
      <div className="minesweeper-grid">
        {grid.map((row, r) => row.map((cell, c) => (
          <div 
            key={`${r}-${c}`} 
            className={`minesweeper-cell ${cell.isRevealed ? 'revealed' : ''} ${cell.isMine && cell.isRevealed ? 'mine' : ''} ${gameOver && cell.isMine && !cell.isRevealed ? 'revealed mine' : ''}`}
            onClick={() => reveal(r, c)}
            onContextMenu={(e) => toggleFlag(e, r, c)}
            data-neighbors={cell.neighborMines}
          >
            {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 ? cell.neighborMines : ''}
            {(cell.isRevealed || (gameOver && cell.isMine)) && cell.isMine ? '💣' : ''}
            {!cell.isRevealed && cell.isFlagged ? '🚩' : ''}
          </div>
        )))}
      </div>
    </div>
  );
};

export default MinesweeperApp;
