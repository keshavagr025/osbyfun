import React, { useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';

// =========================================================================
// BACKEND CONFIGURATION
// To enable Real-Time Supabase backend:
// 1. Run: npm install @supabase/supabase-js
// 2. Uncomment the import above and the Supabase config below.
// 3. Set USE_SUPABASE to true.
// =========================================================================
const USE_SUPABASE = false;

// const supabaseUrl = 'YOUR_SUPABASE_URL';
// const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
// const supabase = createClient(supabaseUrl, supabaseKey);

const initialMessages = [
  { id: 1, name: 'T.DEEPESH', text: 'It\'s so cool man 🙏🏻', date: 'Aug 6, 2026, 10:57 PM' },
  { id: 2, name: 'madhu', text: 'lovedd it', date: 'Aug 6, 2026, 10:47 PM' },
  { id: 3, name: 'Rouhan', text: 'Lovely 😻', date: 'Aug 6, 2026, 10:47 PM' }
];

const CommunityApp = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [newMessage, setNewMessage] = useState({ name: '', text: '' });

  useEffect(() => {
    if (USE_SUPABASE) {
      // FETCH from Supabase
      /*
      const fetchMessages = async () => {
        const { data } = await supabase.from('community_feedback').select('*').order('created_at', { ascending: false });
        if (data) setMessages(data);
      };
      fetchMessages();

      // REAL-TIME Subscription
      const subscription = supabase
        .channel('public:community_feedback')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_feedback' }, payload => {
          setMessages(prev => [payload.new, ...prev]);
        })
        .subscribe();

      return () => { supabase.removeChannel(subscription); };
      */
    } else {
      // Local Storage Mock Backend
      const saved = localStorage.getItem('Bunny-community-messages');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    }
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newMessage.name.trim() || !newMessage.text.trim()) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' +
      now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    const newMsg = {
      id: Date.now(),
      name: newMessage.name,
      text: newMessage.text,
      date: formattedDate
    };

    if (USE_SUPABASE) {
      // Insert to Supabase
      /*
      const { error } = await supabase.from('community_feedback').insert([{ 
        name: newMsg.name, 
        text: newMsg.text, 
        date: newMsg.date 
      }]);
      if (error) console.error("Error posting message:", error);
      */
    } else {
      // Local Storage Update
      const updatedMessages = [newMsg, ...messages];
      setMessages(updatedMessages);
      localStorage.setItem('Bunny-community-messages', JSON.stringify(updatedMessages));
    }

    setNewMessage({ name: '', text: '' });
    setIsPosting(false);
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#f0f0f0', color: '#000', fontFamily: 'Pixelify Sans, "VT323", monospace', margin: '-12px', boxSizing: 'border-box' }}>

      {/* Left Column - Guestbook */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '2px solid #000', padding: '16px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #000', paddingBottom: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📖 Visitor Guestbook
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px' }}>Search</span>
            <input
              type="text"
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '4px 8px', border: '2px solid #000', fontFamily: 'inherit', outline: 'none' }}
            />
            <button
              onClick={() => setIsPosting(!isPosting)}
              style={{
                background: '#4a90e2', color: '#fff', border: '2px solid #000',
                padding: '6px 12px', fontFamily: 'inherit', cursor: 'pointer',
                boxShadow: '2px 2px 0 #000'
              }}
            >
              Post your own message
            </button>
          </div>
        </div>

        {isPosting && (
          <form onSubmit={handlePost} style={{ border: '2px solid #000', padding: '12px', marginBottom: '16px', background: '#fff', boxShadow: '4px 4px 0 #000' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>New Message</h3>
            <input
              type="text" placeholder="Your Name" value={newMessage.name}
              onChange={e => setNewMessage({ ...newMessage, name: e.target.value })}
              style={{ display: 'block', width: '100%', marginBottom: '8px', padding: '4px', border: '1px solid #000', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
            <textarea
              placeholder="Your Message..." value={newMessage.text}
              onChange={e => setNewMessage({ ...newMessage, text: e.target.value })}
              rows={3}
              style={{ display: 'block', width: '100%', marginBottom: '8px', padding: '4px', border: '1px solid #000', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ background: '#27c93f', color: '#fff', border: '2px solid #000', padding: '4px 12px', fontFamily: 'inherit', cursor: 'pointer' }}>Submit</button>
              <button type="button" onClick={() => setIsPosting(false)} style={{ background: '#ff5f56', color: '#fff', border: '2px solid #000', padding: '4px 12px', fontFamily: 'inherit', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        )}

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
          {filteredMessages.map(msg => (
            <div key={msg.id} style={{ border: '3px solid #000', background: '#fff', padding: '12px', boxShadow: '4px 4px 0 #000' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{msg.name}</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{msg.date}</p>
            </div>
          ))}
          {filteredMessages.length === 0 && <p style={{ textAlign: 'center' }}>No messages found.</p>}
        </div>

      </div>

      {/* Right Column - Creator Message */}
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px', borderBottom: '2px solid #000', paddingBottom: '12px' }}>
          Messages from the Creator
        </h2>

        <div style={{ flex: 1, border: '4px solid #000', background: '#fff', padding: '24px', boxShadow: '6px 6px 0 #000', overflowY: 'auto' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '22px' }}>Keshav Agrawal</h2>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Thank you for such Lovely Messages!</h3>
          <p style={{ margin: '0 0 24px 0', fontSize: '12px', color: '#666' }}>Aug 6, 2026, 10:35 PM</p>

          <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
            To everyone who has taken the time to leave a positive comment on this project, thank you so much. Reading your feedback has genuinely meant a lot to me. Every kind word, suggestion, and message of encouragement has made all the time and effort I put into this project feel worthwhile.
          </p>

          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
            I am incredibly grateful for your support, and I am excited to keep improving the project and building even more with your feedback. Thank you for being a part of this journey.
          </p>
        </div>
      </div>

    </div>
  );
};

export default CommunityApp;
