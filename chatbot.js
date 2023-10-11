import { clientId, shopProvider, chatBotWebsiteHostName } from './inject.js';
import * as getPageDetailsMethods from './getPageDetails.js';
import { generateUserId } from './generateId.js';

console.log('clientId: ', clientId);
console.log('shopProvider: ', shopProvider);
console.log('chatBotWebsiteHostName: ', chatBotWebsiteHostName);

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const deleteBtn = document.querySelector(".delete-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

const { pageType, productName } = getPageDetailsMethods?.[shopProvider + 'PageDetails']();
console.log('pageType: ', pageType);
console.log('productName: ', productName);
let isCouponGiven = false;
const welcomeMessage = 'Hi there 👋! I\'m your friendly assistant here to help you. Whether you have questions, need assistance, or just want to chat, I\'m here for you. Feel free to type in your message.'
const welcomeQuestion = 'How can I help you?'
let userMessage = null; // Variable to store user's message
let messages = [{ id: 0, speaker: 'salesman', text: welcomeMessage }, { id: 1, speaker: 'salesman', text: welcomeQuestion }];  // Variable to store all the messages including the starter message
const inputInitHeight = chatInput.scrollHeight;
let userId = null
let conversationId = 0;

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

    // update messages variable
    messages = [{ id: 0, speaker: 'salesman', text: welcomeMessage }, { id: 1, speaker: 'salesman', text: welcomeQuestion }];

    // update local storage
    localStorage.setItem('messages', JSON.stringify(messages));
  }
  console.log('MESSAGES FROM LOCAL STORAGE: ', messagesFromLocalStorage)

  // get isCouponGiven from local storage
  const isCouponGivenFromLocalStorage = JSON.parse(localStorage.getItem('isCouponGiven'));
  if (isCouponGivenFromLocalStorage) {
    isCouponGiven = isCouponGivenFromLocalStorage;
  }

  // get userId from local storage
  const userIdFromLocalStorage = JSON.parse(localStorage.getItem('kp-userId'));
  if (userIdFromLocalStorage) {
    userId = userIdFromLocalStorage;
  } else {
    userId = generateUserId(20)
    localStorage.setItem('kp-userId', JSON.stringify(userId));
  }
}

init();

const deleteMessages = () => {
  messages = [];
  localStorage.setItem('messages', JSON.stringify(messages));
  chatbox.innerHTML = '';
  init();
}

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
        body: JSON.stringify({ messages: messages, productName: 'Ecomobl ET Electric Skateboard', pageType: pageType, isCouponGiven: isCouponGiven, clientId: clientId, chatBotWebsiteHostName: chatBotWebsiteHostName, shopProvider: shopProvider, userId: userId, conversationId: conversationId })
      }
    );

    const data = await response.json();
    console.log(data);
    if (data?.response?.text?.replace('[salesman]:', '')?.includes('|||')) {
      console.log('splitting message...')
      const split = data?.response?.text?.replace('[salesman]:', '')?.split('|||')
      messages = [...messages, {id: messages.length, speaker: 'salesman', text: split[0].trim()}, {id: messages.length + 1, speaker: 'salesman', text: split[1].trim().replace('Question: ', '')}]
      chatElement.querySelector('span').classList.add("hidden");
      messageElement.textContent = messages[messages.length - 2].text;
      const incomingChatLi = createChatLi(messages[messages.length - 1].text, "incoming");
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);
    } else {
      console.log('no need to split message')
      messages = [...messages, {id: messages.length, speaker: 'salesman', text: data?.response?.text?.replace('[salesman]:', '').trim()}]
      messageElement.textContent = messages[messages.length - 1].text;
    }

    // update the isCouponGiven variable and set local storage
    if (data?.response?.isCouponGiven) {
      isCouponGiven = true;
      localStorage.setItem('isCouponGiven', JSON.stringify(isCouponGiven));
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
deleteBtn.addEventListener("click", deleteMessages);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));