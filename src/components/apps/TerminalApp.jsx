import React, { useState, useEffect, useRef } from 'react';

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

export default TerminalApp;
