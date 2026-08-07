import React, { useState, useEffect, useRef, useCallback } from 'react';
import heroImg from '../assets/hero.png';
import { chatWithDash } from '../services/ai';

const useTypingSound = () => {
  const audioCtxRef = useRef(null);

  const playBlip = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'square';
    // Base frequency for voice
    osc.frequency.setValueAtTime(400 + Math.random() * 100, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }, []);

  return playBlip;
};

const ChatBox = ({ name, message: initialMessage, onClose }) => {
  const [history, setHistory] = useState([{ role: 'assistant', text: initialMessage }]);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  
  const playBlip = useTypingSound();

  const currentMessage = history[history.length - 1].text;

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;

    const interval = setInterval(() => {
      if (i < currentMessage.length) {
        setDisplayedText((prev) => prev + currentMessage.charAt(i));
        // Play sound for non-space characters
        if (currentMessage.charAt(i) !== ' ' && i % 2 === 0) {
          playBlip();
        }
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 40); // typing speed

    return () => clearInterval(interval);
  }, [currentMessage, playBlip]);

  // If clicked while typing, skip to end
  const handleClick = (e) => {
    if (isTyping) {
      setDisplayedText(currentMessage);
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isWaiting || isTyping) return;
    
    const userText = inputText.trim();
    setInputText('');
    setIsWaiting(true);
    
    const newHistory = [...history, { role: 'user', text: userText }];
    setHistory([...newHistory, { role: 'assistant', text: '...' }]);
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const responseText = await chatWithDash(newHistory, apiKey);
    
    setHistory([...newHistory, { role: 'assistant', text: responseText }]);
    setIsWaiting(false);
  };

  return (
    <div className="chat-overlay" onClick={handleClick}>
      <div className="chat-avatar-container">
        <img src={heroImg} alt="Avatar" className="chat-avatar" />
      </div>
      <div className="chat-bubble-container">
        <div className="chat-name-tag">{name}</div>
        <button className="chat-close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>×</button>
        <div className="chat-text">
          {displayedText}
        </div>
        
        {!isTyping && !isWaiting && (
          <div className="chat-input-wrapper" onClick={e => e.stopPropagation()}>
            <span className="chat-prompt-arrow">{'>'}</span>
            <input 
              type="text" 
              className="chat-reply-input" 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Reply to Dash..."
              autoFocus
            />
          </div>
        )}
        
        {(!isTyping || isWaiting) && !inputText && <div className="chat-arrow">▼</div>}
      </div>
    </div>
  );
};

export default ChatBox;
