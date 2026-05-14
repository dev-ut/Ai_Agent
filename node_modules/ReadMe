Project Title: LLM Chat Agent with External Function Calling

Short description
A Node.js-based LLM chat agent that demonstrates function-calling integration: the model can call external functions (math helpers, crypto price, weather, etc.), 
your backend executes them and returns structured results, and the agent continues the conversation using those results. 
This repo contains the backend agent code and a simple CLI chat runner.

Quick features
- LLM-driven conversation with function-calling support.  
- Example external tools implemented: sum, prime check, crypto price (CoinGecko), weather (OpenWeather).  
- Conversation history maintained so the model keeps context.  
- Run locally with Node.js (no frontend required).  
- I’m providing a short live demo video link in the repo (see VIDEO.md or the top of README).

Run it locally
1. Clone the repo and install dependencies:
   git clone <repo-url>
   cd <repo>
   npm install
   npm i @google/genai
   npm i readline-sync

2. Create a .env file and add your API keys (do NOT commit .env):
   - GENAI_API_KEY=your_genai_key
   - OPENWEATHER_API_KEY=your_openweather_key
   (use real service keys; keys must be stored in env vars)

3. Start the agent (CLI chat):
   node aiagents.js
   Then type your question and press Enter. The agent will call tools when needed and reply.

What to expect
- Ask practical queries: math, prime checks, crypto prices, weather, or general questions. The model may call an external function when it needs factual data, then use that result in its reply.  
- The console prints debug info (tool calls and raw responses) for transparency.

Important notes
- Do NOT push API keys or secrets to the repository. Use .gitignore (this repo includes .env.example).  
- This project is for demo/learning purposes. Remove or secure any keys before sharing publicly.  
- Function-calling behavior depends on the LLM and SDK version; see docs in docs/ for SDK-specific notes.



That’s it — run node aiagents.js and start chatting.
