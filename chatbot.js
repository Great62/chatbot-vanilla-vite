import { appId, shopProvider } from './inject.js';
import * as getPageDetailsMethods from './getPageDetails.js';

console.log('appId: ', appId);
console.log('shopProvider: ', shopProvider);

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

const { pageType, productName } = getPageDetailsMethods[shopProvider + 'PageDetails']();
console.log('pageType: ', pageType);
const welcomeMessage = 'Hi there 👋! I\'m your friendly assistant here to help you. Whether you have questions, need assistance, or just want to chat, I\'m here for you. Feel free to type in your message'
const welcomeQuestion = 'How can I help you?'
let userMessage = null; // Variable to store user's message
let messages = [{ id: 0, speaker: 'salesman', text: welcomeMessage }, { id: 1, speaker: 'salesman', text: welcomeQuestion }];  // Variable to store all the messages including the starter message
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className, pictureHidden = false) => {
  // Create a chat <li> element with passed message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent = className === "outgoing" ? `<p></p>` : `<span class="bot-picture-container ${pictureHidden ? 'hidden' : ''}"><img class='bot-picture' src='https://cdn.jsdelivr.net/gh/Great62/chatbot-vanilla-vite@main/public/icon-bot-96.png'/></span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi; // return chat <li> element
}

const init = () => {
  // get messages from local storage
  const messagesFromLocalStorage = JSON.parse(localStorage.getItem('messages'));
  if (messagesFromLocalStorage && messagesFromLocalStorage.length > 0) {
    messages = messagesFromLocalStorage;
    messages.forEach((message, index) => {
      const hidePicture = index + 1 !== messages.length && messages[index + 1]?.speaker === message.speaker;
      const chatElement = createChatLi(message.text, message.speaker === 'user' ? 'outgoing' : 'incoming', hidePicture);
      chatbox.appendChild(chatElement);
    });
    chatbox.scrollTo(0, chatbox.scrollHeight);
  } else {
    const chatElement = createChatLi(welcomeMessage, "incoming", true);
    chatbox.appendChild(chatElement);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    const chatElement2 = createChatLi(welcomeQuestion, "incoming");
    chatbox.appendChild(chatElement2);
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
  console.log('MESSAGES FROM LOCAL STORAGE: ', messagesFromLocalStorage)
}

init();

const generateResponse = async (chatElement) => {
  if (userMessage.trim() === '') return;
  const messageElement = chatElement.querySelector("p");
  messages = [...messages, {id: messages.length, speaker: 'user', text: userMessage}]
  console.log('submitting message...');
  console.log('usermessage: ', userMessage);
  console.log('messages: ', messages);

  try {
    // // User is logged in, get the Firebase ID token
    // const idToken = await auth.currentUser?.getIdToken();

    // call cloud function
    const response = await fetch(
      `https://us-central1-sales-chatbot-f1521.cloudfunctions.net/openAISalesConversation`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${''}`, // idToken
        },
        body: JSON.stringify({ messages: messages, productName: productName, namespace: `app-${appId}` })
      }
    );

    const data = await response.json();
    console.log(data);
    if (data?.response?.replace('[salesman]:', '')?.includes('|||')) {
      const split = data?.response?.replace('[salesman]:', '')?.split('|||')
      messages = [...messages, {id: messages.length, speaker: 'salesman', text: split[0].trim()}, {id: messages.length + 1, speaker: 'salesman', text: split[1].trim().replace('Question: ', '')}]
      chatElement.querySelector('span').classList.add("hidden");
      messageElement.textContent = messages[messages.length - 2].text;
      const incomingChatLi = createChatLi(messages[messages.length - 1].text, "incoming");
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);
    } else {
      messages = [...messages, {id: messages.length, speaker: 'salesman', text: data?.response?.replace('[salesman]:', '').trim()}]      
    }

    // update local storage
    localStorage.setItem('messages', JSON.stringify(messages));

    console.log(messages);
  } catch (error) {
    messageElement.classList.add("error");
    messageElement.textContent = "Oops! Something went wrong. Please try again.";
  }
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));