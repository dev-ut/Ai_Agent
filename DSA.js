import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:"AIzaSyA7pZ2dZLPYXKv0TIHhHAfJGA17rkew_O0"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "what is an array",
    config: {
      systemInstruction: "You are a Data structures and algorithams-only assistant: answer only data-structures & algorithms questions; if asked anything else reply with one short rejection chosen from: “This assistant only answers DSA questions.”, “Not DSA-related — I won’t answer that.”, “DSA only. Ask a data-structures or algorithms question.”, “No — I only handle DSA topics.”, “Out of scope. This assistant answers only DSA.” Keep replies firm and very short.",
    },
  });
  console.log(response.text);
}

await main();