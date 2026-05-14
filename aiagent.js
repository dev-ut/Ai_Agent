import { GoogleGenAI } from "@google/genai";
import readlineSync  from 'readline-sync';



const ai = new GoogleGenAI({apiKey:"AIzaSyA7pZ2dZLPYXKv0TIHhHAfJGA17rkew_O0"});
const History = []; // to mainatin the context of the conversation, we will store the history of the conversation in an array

// FN ACTING AS EXTERBAL TOOLS FOR THE MODEL, THE MODEL CAN CALL THESE FUNCTIONS TO GET SOME INFORMATION OR TO PERFORM SOME ACTIONS, AND THEN THE MODEL CAN USE THE RESULT OF THESE FUNCTIONS IN ITS RESPONSE TO THE USER.
function sum({n1,n2})
{
  return n1+n2;
}

function prime({num})
{

    if(num<2)
        return false;

    for(let i=2;i<=Math.sqrt(num);i++)
        if(num%i==0) return false

    return true;
}

async function getCryptoPrice({coin}){

   const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`)
   const data = await response.json();

   return data;
}

async function weather({city})
{
    const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=AIzaSyA7pZ2dZLPYXKv0TIHhHAfJGA17rkew_O0`);
    const data= await response.json();
    return data;
}
// ab in sabke function declaertion krne honge for geeting structured data from the model, and then we will pass these functions to the model as tools, so that the model can call these functions when it needs to get some information from the user or when it needs to perform some action.
const sumfnDecl = {
    name:"sum",
    description:"This function takes two numbers as input and returns their sum.",
    parameters:{
        type:"object",
        properties:{
            n1:{type:"number", description:"The first number"},
            n2:{type:"number", description:"The second number"}
        },
        required:["n1","n2"]
    }        
}

const primeDecl={
    name:"prime",
    description:"This function takes a number as input and returns true if the number is prime, otherwise it returns false.",
    parameters:{
        type:"object",
        properties:{
            num:{type:"number", description:"The number to be checked for primality"}
        },
        required:["num"]
    }
}

const cryptoPriceDecl={
    name:"getCryptoPrice",
    description:"This function takes the name of a cryptocurrency as input and returns the current price of that cryptocurrency in USD.",
    parameters:{
        type:"object",
        properties:{
            coin:{type:"string", description:"The name of the cryptocurrency for which to get the price"}
        },
        required:["coin"]
    }
}   

const weatherDecl={
    name:"weather",
    description:"This function takes a city name as input and returns the current weather information for that city.",
    parameters:{
        type:"object",
        properties:{
            city:{type:"string", description:"The name of the city for which to get weather information"}
        },
        required:["city"]
    }
}
const availableTools = {
    sum:sum,
    prime:prime,
    getCryptoPrice:getCryptoPrice,
    weather:weather
}


async function aiAgent(userInput) {
    History.push({role:"user", parts:[{text: userInput}]});

    while(true)
    {

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents:History,
    config: {
      systemInstruction: `You are an AI Agent, You have access of 3 available tools like to
        to find sum of 2 number, get crypto price of any currency and find a number is prime or not
        
        Use these tools whenever required to confirm user query.
        If user ask general question you can answer it directly if you don't need help of these three tools`,
    
    tools:[{
        functionDeclerations:[sumfnDecl, primeDecl, cryptoPriceDecl, weatherDecl]
    }]
},
});

// now udhar se model ko response me tools call karne honge, to model jab bhi kisi tool ki zarurat mehsoos karega, to wo tool ka name aur uske parameters ke sath ek special format me response karega, jise hum parse kar ke samajh sakte hai ki model ne konsa tool call kiya hai aur uske parameters kya hai, uske baad hum us tool ko call kar ke uska result le sakte hai, aur fir us result ko model ko de sakte hai taki model apne response me us result ka use kar sake.
if(response.functionCalls && response.functionCalls.length>0)
{
    console.log("function calls made by the model: ", response.functionCalls);
     const {name,args} = response.functionCalls[0];
    const toolCall=response.functionCalls[0]; // for simplicity, we are only considering the first tool call made by the model, but in real scenario, there can be multiple tool calls made by the model, so we will have to handle all the tool calls made by the model.
     const funCall =  availableTools[name];
    const result = await funCall(args);  // we will call the tool with the given arguments and get the result, and then we will pass this result
    // back to the model by pushing it to the history array, so that the model can use this result in its response to the user.
      const functionResponsePart = {  // we will create a new part for the function response, which will contain the name of the function and the result of the function call, and then we will push this part to the history array, so that the model can use this part in its response to the user.
      name: name,
      response: {
        result: result,
      },
    };

    // model ke liye function call ka response create karne ke baad, ab hume is response ko history me push karna hoga, taki model is response ko apne next response me use kar sake.
    History.push({
      role: "model",
      parts: [
        {
          functionCall: response.functionCalls[0],
        },
      ],
    });

    // result Ki history daalna

    History.push({
      role: "user",
      parts: [
        {
          functionResponse: functionResponsePart,
        },
      ],
    });
}
else{

    History.push({
        role:'model',
        parts:[{text:response.text}]
    })
    console.log(response.text);
    break;
   }

  console.log(response.text);
}
}

async function main()
{
    const userInput=readlineSync.question("Ask me anything: ");
    await aiAgent(userInput);
    main();

}
 main();