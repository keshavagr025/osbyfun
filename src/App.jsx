import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import './index.css';

const BootScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800); // Wait a bit at 100% before closing
          return 100;
        }
        return Math.min(100, p + Math.floor(Math.random() * 8) + 2); 
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className="boot-screen">
      <div className="boot-logo-container">
        <span className="material-symbols-outlined boot-logo">cruelty_free</span>
      </div>
      
      <div className="boot-text-container">
        <p className="boot-title">SYSTEM NOTICE</p>
        <p className="boot-desc">Retrium OS has sound. Headphones recommended.</p>
        <p className="boot-desc" style={{ marginTop: '16px' }}>Fullscreen puts the browser away<br/>and leaves only the desktop.</p>
        
        <button className="boot-fullscreen-btn" onClick={enterFullscreen}>
          Enter Fullscreen
        </button>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>Esc leaves fullscreen whenever you want.</p>
      </div>

      <div className="boot-progress-container">
        <div className="boot-progress-bar-bg">
          <div className="boot-progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="boot-progress-text">{progress}%</p>
        <p className="boot-loading-text">Starting Retrium OS...</p>
      </div>
    </div>
  );
};

const TopBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <span className="material-symbols-outlined logo-icon">cruelty_free</span>
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
      </div>
      <div className="top-bar-right">
        <span className="material-symbols-outlined">wifi</span>
        <span className="material-symbols-outlined">battery_full</span>
        <span className="time">{formatTime(time)}</span>
      </div>
    </div>
  );
};

const DockIcon = ({ icon, label, isActive, onClick }) => {
  return (
    <div className="dock-icon-container" onClick={onClick}>
      <div className={`dock-icon glass ${isActive ? 'active' : ''}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      {isActive && <div className="dock-icon-indicator" />}
      <div className="dock-tooltip">{label}</div>
    </div>
  );
};

const Dock = ({ toggleApp }) => {
  return (
    <div className="dock glass">
      <DockIcon icon="terminal" label="Terminal" isActive={true} onClick={() => toggleApp('Terminal')} />
      <DockIcon icon="language" label="Browser" isActive={false} onClick={() => toggleApp('Browser')} />
      <DockIcon icon="folder" label="Files" isActive={false} onClick={() => toggleApp('Trash')} />
      <DockIcon icon="queue_music" label="Music Player" isActive={false} onClick={() => toggleApp('Music')} />
      <DockIcon icon="calculate" label="Calculator" isActive={false} onClick={() => toggleApp('Calculator')} />
      <DockIcon icon="grid_on" label="Minesweeper" isActive={false} onClick={() => toggleApp('Minesweeper')} />
      <DockIcon icon="extension" label="Memory" isActive={false} onClick={() => toggleApp('Memory')} />
    </div>
  );
};

const DesktopIcon = ({ icon, label, onClick }) => {
  return (
    <div className="desktop-icon-container" onDoubleClick={onClick}>
      <div className="desktop-icon">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="desktop-icon-label">{label}</span>
    </div>
  );
};

const Window = ({ title, onClose, children, defaultPosition, width = 400, height = 300, zIndex, onFocus }) => {
  return (
    <Draggable handle=".window-header" defaultPosition={defaultPosition} onMouseDown={onFocus}>
      <div className="retro-window" style={{ width, height, zIndex }}>
        <div className="window-header">
          <span>{title}</span>
          <div className="window-controls">
            <div className="window-btn btn-min"></div>
            <div className="window-btn btn-max"></div>
            <div className="window-btn btn-close" onClick={onClose} onMouseDown={(e) => e.stopPropagation()}></div>
          </div>
        </div>
        <div className="window-content" onMouseDown={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </Draggable>
  );
};

// Apps content
const TerminalApp = () => {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to Retrium OS Terminal' },
    { type: 'output', text: '[INFO] Type "help" for the full command list.' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      if (!cmd) return;
      
      const newHistory = [...history, { type: 'input', text: `dash@retrium-os:~$ ${cmd}` }];
      
      const parts = cmd.toLowerCase().split(' ');
      const baseCmd = parts[0];

      if (baseCmd === 'help') {
        newHistory.push({ type: 'output', text: 'Available commands: help, clear, echo, date, whoami' });
      } else if (baseCmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (baseCmd === 'echo') {
        newHistory.push({ type: 'output', text: parts.slice(1).join(' ') });
      } else if (baseCmd === 'date') {
        newHistory.push({ type: 'output', text: new Date().toString() });
      } else if (baseCmd === 'whoami') {
        newHistory.push({ type: 'output', text: 'dash' });
      } else {
        newHistory.push({ type: 'output', text: `Command not found: ${baseCmd}` });
      }
      
      setHistory(newHistory);
      setInput('');
    }
  };

  return (
    <div style={{ background: '#111', color: '#33ff00', height: '100%', padding: '12px', margin: '-12px', fontFamily: '"VT323", monospace', fontSize: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {history.map((line, i) => (
        <p key={i} style={{ margin: '0 0 6px 0', color: line.type === 'input' ? '#fff' : (line.text.startsWith('[INFO]') ? '#aaa' : '#33ff00') }}>
          {line.text}
        </p>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', color: '#ff3366', marginTop: '4px' }}>
        <span style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>dash@retrium-os:~$</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          autoFocus
          style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontFamily: '"VT323", monospace', fontSize: '20px', flex: 1, textShadow: 'none' }}
        />
      </div>
      <div ref={endRef} />
    </div>
  );
};

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const calculate = (a, b, op) => {
    a = parseFloat(a); b = parseFloat(b);
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') return a / b;
    return b;
  };

  const handlePress = (val) => {
    if (val === 'C') {
      setDisplay('0');
      setPrevVal(null);
      setOperator(null);
      setWaitingForNewValue(false);
      return;
    }
    
    if (['+', '-', '*', '/'].includes(val)) {
      if (operator && !waitingForNewValue) {
        const result = calculate(prevVal, display, operator);
        setDisplay(String(result));
        setPrevVal(String(result));
      } else {
        setPrevVal(display);
      }
      setOperator(val);
      setWaitingForNewValue(true);
      return;
    }

    if (val === '=') {
      if (operator && prevVal) {
        const result = calculate(prevVal, display, operator);
        setDisplay(String(result));
        setPrevVal(null);
        setOperator(null);
        setWaitingForNewValue(true);
      }
      return;
    }

    // Number or dot
    if (waitingForNewValue) {
      setDisplay(val);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? val : display + val);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      <div style={{ background: '#fff', border: '2px solid #000', padding: '8px', textAlign: 'right', fontSize: '28px', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: '"VT323", monospace' }}>
        {display}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', flex: 1 }}>
        {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(btn => (
          <button 
            key={btn} 
            onClick={() => handlePress(btn)}
            style={{ 
              background: ['=','+','-','*','/','C'].includes(btn) ? '#ffbd2e' : '#e0e0e0', 
              border: '2px solid #000', 
              fontFamily: 'Pixelify Sans', 
              fontSize: '22px', 
              fontWeight: 'bold',
              cursor: 'pointer', 
              boxShadow: '2px 2px 0px #000',
              transition: 'transform 0.1s, box-shadow 0.1s'
            }}
            onMouseDown={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translate(2px, 2px)'; }}
            onMouseUp={(e) => { e.currentTarget.style.boxShadow = '2px 2px 0px #000'; e.currentTarget.style.transform = 'none'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '2px 2px 0px #000'; e.currentTarget.style.transform = 'none'; }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

const TrashApp = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
    <div style={{ textAlign: 'center' }}>
      <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#ffb74d' }}>folder</span>
      <p style={{ fontSize: '14px', marginTop: '4px' }}>DO NOT<br/>OPEN</p>
    </div>
  </div>
);

const MusicPlayerApp = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px' }}>
      <div style={{ 
        width: '120px', height: '120px', borderRadius: '50%', background: '#111', 
        border: '4px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        animation: isPlaying ? 'spin 4s linear infinite' : 'none'
      }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#4caf50', border: '2px solid #111' }}></div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', margin: '0' }}>GREEN</h2>
        <p style={{ fontSize: '16px', color: '#666' }}>Pixel Records. Stereo audio.</p>
      </div>
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        style={{ 
          background: isPlaying ? '#ff5f56' : '#27c93f', 
          color: '#fff',
          border: '2px solid #000', 
          padding: '8px 24px', 
          fontFamily: 'Pixelify Sans', 
          fontSize: '18px', 
          cursor: 'pointer', 
          boxShadow: '2px 2px 0px #000',
          transition: 'transform 0.1s, box-shadow 0.1s'
        }}
        onMouseDown={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translate(2px, 2px)'; }}
        onMouseUp={(e) => { e.currentTarget.style.boxShadow = '2px 2px 0px #000'; e.currentTarget.style.transform = 'none'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '2px 2px 0px #000'; e.currentTarget.style.transform = 'none'; }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

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

const MemoryApp = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const emojis = ['🚀','👾','🕹️','💾','🤖','🔋','📺','💻'];
  
  const initGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((id, index) => ({ id: index, emoji: id }));
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setDisabled(false);
  };

  useEffect(() => { initGame(); }, []);

  const handleClick = (index) => {
    if(disabled || flipped.includes(index) || solved.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    if(newFlipped.length === 2) {
      setDisabled(true);
      if(cards[newFlipped[0]].emoji === cards[newFlipped[1]].emoji) {
        setSolved([...solved, ...newFlipped]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="memory-app">
      <div className="memory-header">
        <span style={{fontFamily: '"VT323", monospace', fontSize: '20px'}}>Pairs: {solved.length / 2} / 8</span>
        <button className="retro-btn" onClick={initGame}>Restart</button>
      </div>
      <div className="memory-grid">
        {cards.map((card, i) => (
          <div 
            key={i} 
            className={`memory-card ${flipped.includes(i) || solved.includes(i) ? 'flipped' : ''}`}
            onClick={() => handleClick(i)}
          >
            <div className="memory-card-inner">
              <div className="memory-card-front">?</div>
              <div className="memory-card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>
      {solved.length === 16 && (
        <div className="memory-win">YOU WIN!</div>
      )}
    </div>
  );
};

function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [apps, setApps] = useState([
    { id: 'Terminal', title: 'Terminal', isOpen: false, zIndex: 1, position: { x: 50, y: 50 }, width: 450, height: 320 },
    { id: 'Calculator', title: 'Calculator', isOpen: false, zIndex: 2, position: { x: 300, y: 100 }, width: 280, height: 380 },
    { id: 'Trash', title: 'Trash', isOpen: false, zIndex: 3, position: { x: 150, y: 250 }, width: 400, height: 250 },
    { id: 'Music', title: 'Music Player', isOpen: false, zIndex: 4, position: { x: 550, y: 150 }, width: 320, height: 420 },
    { id: 'Minesweeper', title: 'Minesweeper', isOpen: false, zIndex: 5, position: { x: 200, y: 80 }, width: 310, height: 400 },
    { id: 'Memory', title: 'Memory Match', isOpen: false, zIndex: 6, position: { x: 400, y: 120 }, width: 360, height: 460 }
  ]);
  
  const [activeZIndex, setActiveZIndex] = useState(10);

  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />;
  }

  const toggleApp = (id) => {
    setApps(apps.map(app => {
      if (app.id === id) {
        if (!app.isOpen) {
          setActiveZIndex(prev => prev + 1);
          return { ...app, isOpen: true, zIndex: activeZIndex + 1 };
        }
        setActiveZIndex(prev => prev + 1);
        return { ...app, zIndex: activeZIndex + 1 };
      }
      return app;
    }));
  };

  const closeApp = (id) => {
    setApps(apps.map(app => app.id === id ? { ...app, isOpen: false } : app));
  };

  const focusApp = (id) => {
    setActiveZIndex(prev => prev + 1);
    setApps(apps.map(app => app.id === id ? { ...app, zIndex: activeZIndex + 1 } : app));
  };

  return (
    <>
      <TopBar />
      <div className="desktop">
        <DesktopIcon icon="description" label="Readme.txt" onClick={() => toggleApp('Terminal')} />
        <DesktopIcon icon="calculate" label="Calculator" onClick={() => toggleApp('Calculator')} />
        <DesktopIcon icon="grid_on" label="Minesweeper" onClick={() => toggleApp('Minesweeper')} />
        <DesktopIcon icon="extension" label="Memory" onClick={() => toggleApp('Memory')} />
        <DesktopIcon icon="delete" label="Trash" onClick={() => toggleApp('Trash')} />
      </div>

      {/* Render open windows */}
      {apps.filter(a => a.isOpen).map(app => (
        <Window 
          key={app.id} 
          title={app.title} 
          defaultPosition={app.position}
          width={app.width}
          height={app.height}
          zIndex={app.zIndex}
          onClose={() => closeApp(app.id)}
          onFocus={() => focusApp(app.id)}
        >
          {app.id === 'Terminal' && <TerminalApp />}
          {app.id === 'Calculator' && <CalculatorApp />}
          {app.id === 'Trash' && <TrashApp />}
          {app.id === 'Music' && <MusicPlayerApp />}
          {app.id === 'Minesweeper' && <MinesweeperApp />}
          {app.id === 'Memory' && <MemoryApp />}
        </Window>
      ))}

      <Dock toggleApp={toggleApp} />
    </>
  );
}

export default App;
