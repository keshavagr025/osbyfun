import React, { useState, useEffect, useRef } from 'react';

const initialFileSystem = {
  '~': {
    type: 'dir',
    children: {
      'readme.txt': { type: 'file', content: 'Welcome to bunny OS!\nThis is a simulated terminal.\nFeel free to explore the file system.' },
      'projects': {
        type: 'dir',
        children: {
          'bunny.md': { type: 'file', content: '# bunny OS\nA retro browser OS built with React.' }
        }
      }
    }
  }
};

const TerminalApp = () => {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to bunny OS Terminal' },
    { type: 'output', text: '[INFO] Type "help" for the full command list.' }
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState(['~']); // Array of path segments
  const [fileSystem, setFileSystem] = useState(initialFileSystem);

  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // helper to get a node from the filesystem
  const getNode = (pathArray) => {
    let current = fileSystem['~'];
    for (let i = 1; i < pathArray.length; i++) {
      if (!current || current.type !== 'dir' || !current.children) return null;
      current = current.children[pathArray[i]];
    }
    return current;
  };

  const getAbsolutePath = (target) => {
    if (!target) return currentPath;
    if (target === '/') return ['~'];
    if (target === '~') return ['~'];

    let base = [...currentPath];
    if (target.startsWith('/')) {
      base = ['~']; // treat root as ~ for this simulation
      target = target.substring(1);
    } else if (target.startsWith('~/')) {
      base = ['~'];
      target = target.substring(2);
    }

    const segments = target.split('/').filter(s => s !== '' && s !== '.');
    for (const segment of segments) {
      if (segment === '..') {
        if (base.length > 1) base.pop();
      } else {
        base.push(segment);
      }
    }
    return base;
  };

  const handleCommand = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Enter') {
      const cmdString = input.trim();
      if (!cmdString) return;

      const currentDirStr = currentPath.join('/').replace(/^~/, '~');
      const promptStr = `enna@bunny-os:${currentDirStr}$ ${cmdString}`;
      let newHistory = [...history, { type: 'input', text: promptStr }];

      setCmdHistory([...cmdHistory, cmdString]);
      setHistoryIndex(-1);

      const parts = cmdString.split(' ').filter(Boolean);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      const updateFileSystem = (updater) => {
        setFileSystem(prev => {
          const nextFs = JSON.parse(JSON.stringify(prev));
          updater(nextFs);
          return nextFs;
        });
      };

      try {
        switch (cmd) {
          case 'help':
            newHistory.push({ type: 'output', text: 'Available commands: help, clear, echo, date, whoami, pwd, ls, cd, cat, mkdir, touch, rm' });
            break;
          case 'clear':
            setHistory([]);
            setInput('');
            return;
          case 'echo':
            newHistory.push({ type: 'output', text: args.join(' ') });
            break;
          case 'date':
            newHistory.push({ type: 'output', text: new Date().toString() });
            break;
          case 'whoami':
            newHistory.push({ type: 'output', text: 'enna' });
            break;
          case 'pwd':
            newHistory.push({ type: 'output', text: '/' + (currentPath.join('/').replace(/^~/, 'home/dash')) });
            break;
          case 'ls': {
            const targetPath = getAbsolutePath(args[0]);
            const node = getNode(targetPath);
            if (!node) {
              newHistory.push({ type: 'output', text: `ls: cannot access '${args[0]}': No such file or directory` });
            } else if (node.type !== 'dir') {
              newHistory.push({ type: 'output', text: args[0] });
            } else {
              const children = Object.keys(node.children || {}).sort();
              if (children.length > 0) {
                newHistory.push({ type: 'output', text: children.join('  ') });
              }
            }
            break;
          }
          case 'cd': {
            const targetPath = getAbsolutePath(args[0] || '~');
            const node = getNode(targetPath);
            if (!node) {
              newHistory.push({ type: 'output', text: `cd: ${args[0]}: No such file or directory` });
            } else if (node.type !== 'dir') {
              newHistory.push({ type: 'output', text: `cd: ${args[0]}: Not a directory` });
            } else {
              setCurrentPath(targetPath);
            }
            break;
          }
          case 'cat': {
            if (!args[0]) {
              newHistory.push({ type: 'output', text: `cat: missing operand` });
              break;
            }
            const targetPath = getAbsolutePath(args[0]);
            const node = getNode(targetPath);
            if (!node) {
              newHistory.push({ type: 'output', text: `cat: ${args[0]}: No such file or directory` });
            } else if (node.type === 'dir') {
              newHistory.push({ type: 'output', text: `cat: ${args[0]}: Is a directory` });
            } else {
              newHistory.push({ type: 'output', text: node.content });
            }
            break;
          }
          case 'mkdir': {
            if (!args[0]) {
              newHistory.push({ type: 'output', text: `mkdir: missing operand` });
              break;
            }
            const targetPath = getAbsolutePath(args[0]);
            const newDirName = targetPath.pop();
            const parentNode = getNode(targetPath);
            if (!parentNode || parentNode.type !== 'dir') {
              newHistory.push({ type: 'output', text: `mkdir: cannot create directory '${args[0]}': No such file or directory` });
            } else if (parentNode.children[newDirName]) {
              newHistory.push({ type: 'output', text: `mkdir: cannot create directory '${args[0]}': File exists` });
            } else {
              updateFileSystem(fs => {
                let current = fs['~'];
                for (let i = 1; i < targetPath.length; i++) {
                  current = current.children[targetPath[i]];
                }
                current.children = current.children || {};
                current.children[newDirName] = { type: 'dir', children: {} };
              });
            }
            break;
          }
          case 'touch': {
            if (!args[0]) {
              newHistory.push({ type: 'output', text: `touch: missing operand` });
              break;
            }
            const targetPath = getAbsolutePath(args[0]);
            const newFileName = targetPath.pop();
            const parentNode = getNode(targetPath);
            if (!parentNode || parentNode.type !== 'dir') {
              newHistory.push({ type: 'output', text: `touch: cannot touch '${args[0]}': No such file or directory` });
            } else if (!parentNode.children[newFileName]) {
              updateFileSystem(fs => {
                let current = fs['~'];
                for (let i = 1; i < targetPath.length; i++) {
                  current = current.children[targetPath[i]];
                }
                current.children = current.children || {};
                current.children[newFileName] = { type: 'file', content: '' };
              });
            }
            break;
          }
          case 'rm': {
            if (!args[0]) {
              newHistory.push({ type: 'output', text: `rm: missing operand` });
              break;
            }
            const targetPath = getAbsolutePath(args[0]);
            const fileName = targetPath.pop();
            const parentNode = getNode(targetPath);

            if (!parentNode || parentNode.type !== 'dir' || !parentNode.children[fileName]) {
              newHistory.push({ type: 'output', text: `rm: cannot remove '${args[0]}': No such file or directory` });
            } else if (parentNode.children[fileName].type === 'dir' && !args.includes('-r') && !args.includes('-rf')) {
              newHistory.push({ type: 'output', text: `rm: cannot remove '${args[0]}': Is a directory` });
            } else {
              updateFileSystem(fs => {
                let current = fs['~'];
                for (let i = 1; i < targetPath.length; i++) {
                  current = current.children[targetPath[i]];
                }
                delete current.children[fileName];
              });
            }
            break;
          }
          default:
            newHistory.push({ type: 'output', text: `Command not found: ${cmd}` });
        }
      } catch (err) {
        newHistory.push({ type: 'output', text: `Error: ${err.message}` });
      }

      setHistory(newHistory);
      setInput('');
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const displayPath = currentPath.join('/').replace(/^~/, '~');

  return (
    <div onClick={focusInput} style={{ background: '#111', color: '#33ff00', height: '100%', padding: '12px', margin: '-12px', fontFamily: '"VT323", monospace', fontSize: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', cursor: 'text' }}>
      {history.map((line, i) => (
        <p key={i} style={{ margin: '0 0 6px 0', color: line.type === 'input' ? '#fff' : (line.text.startsWith('[INFO]') ? '#aaa' : '#33ff00'), whiteSpace: 'pre-wrap' }}>
          {line.text}
        </p>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', color: '#ff3366', marginTop: '4px' }}>
        <span style={{ marginRight: '8px', whiteSpace: 'nowrap' }}>dash@bunny-os:{displayPath}$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontFamily: '"VT323", monospace', fontSize: '20px', flex: 1, textShadow: 'none' }}
        />
      </div>
      <div ref={endRef} />
    </div>
  );
};

export default TerminalApp;
