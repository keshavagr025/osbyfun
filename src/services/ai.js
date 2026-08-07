// Basic service to talk to Gemini API
const SYSTEM_PROMPT = `You are Dash, an AI assistant living inside a retro computer operating system called Retrium OS. 
Your personality is cool, a bit sarcastic but helpful. You have a pompadour haircut and wear sunglasses.
Keep your responses relatively short (1-3 sentences max) since they are displayed in a retro dialogue box.
Do not use markdown formatting, just plain text.`;

export const chatWithDash = async (messageHistory, apiKey) => {
  if (!apiKey) {
    return "Error: I need an API key to think! Set VITE_GEMINI_API_KEY in .env.local.";
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const contents = messageHistory.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  // Gemini requires the first message in the conversation to be from the user.
  if (contents.length > 0 && contents[0].role === 'model') {
    contents.unshift({
      role: 'user',
      parts: [{ text: "(User booted up the computer)" }]
    });
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: contents
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return `Oops, API error: ${data.error.message}`;
    }

    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    return "Hmm, I couldn't connect to the mainframe. (Network Error)";
  }
};
