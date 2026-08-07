import React, { useState, useEffect, useRef, useCallback } from 'react';
import heroImg from '../assets/hero.png';

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

const ChatBox = ({ name, message, onClose }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const playBlip = useTypingSound();

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;

    const interval = setInterval(() => {
      if (i < message.length) {
        setDisplayedText((prev) => prev + message.charAt(i));
        // Play sound for non-space characters
        if (message.charAt(i) !== ' ' && i % 2 === 0) {
          playBlip();
        }
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 40); // typing speed

    return () => clearInterval(interval);
  }, [message, playBlip]);

  // If clicked while typing, skip to end
  const handleClick = () => {
    if (isTyping) {
      setDisplayedText(message);
      setIsTyping(false);
    }
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
        {!isTyping && <div className="chat-arrow">▼</div>}
      </div>
    </div>
  );
};

export default ChatBox;
