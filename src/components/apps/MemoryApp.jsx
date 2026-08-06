import React, { useState, useEffect } from 'react';

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

export default MemoryApp;
