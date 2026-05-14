console.log("LLM.js loaded");
import { GoogleGenAI } from "@google/genai";
import readlineSync  from 'readline-sync';

const ai = new GoogleGenAI({apiKey:"AIzaSyA7pZ2dZLPYXKv0TIHhHAfJGA17rkew_O0"});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: "Write a shayari for me in english",
//   });
  
//   console.log(response.text);

// }

// await main();

const history = []; // to mainatin the context of the conversation, we will store the history of the conversation in an array

// now to make it a chatbot, we can use the following code
async function chatting(UserInput){
  history.push(
    {role:"user", 
    parts:[{text: UserInput}]}
    ); // we will push the user input to the history array
     
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: history
  });
  history.push(
    {role:"model", 
    parts:[{text: response.text}]}
    ); // we will push the model response to the history array
  console.log(response.text);

}

async function main(){
   const UserInput = readlineSync.question("Ask me anything: ");
   await chatting(UserInput);
   main();
}

main();

