// Basic service to talk to Groq API
const SYSTEM_PROMPT = `You are Enna, an AI assistant living inside a retro computer operating system called Bunny OS. 
Your personality is cool, a bit sarcastic but helpful. You have a pompadour haircut and wear sunglasses.
Keep your responses relatively short (1-3 sentences max) since they are displayed in a retro dialogue box.
Do not use markdown formatting, just plain text.`;

export const chatWithDash = async (messageHistory, apiKey) => {
  if (!apiKey) {
    return "Error: I need an API key to think! Set VITE_GROQ_API_KEY in .env.local.";
  }

  const endpoint = `https://api.groq.com/openai/v1/chat/completions`;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messageHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.text
    }))
  ];

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'groq/compound-mini',
        messages: messages
      })
    });

    const data = await response.json();

    if (data.error) {
      return `Oops, API error: ${data.error.message}`;
    }

    return data.choices[0].message.content;
  } catch (err) {
    return "Hmm, I couldn't connect to the mainframe. (Network Error)";
  }
};
