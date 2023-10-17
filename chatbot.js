import { clientId, shopProvider, chatBotWebsiteHostName, faq } from './inject.js';
import * as getPageDetailsMethods from './getPageDetails.js';
import { generateUserId } from './generateId.js';

console.log('clientId: ', clientId);
console.log('shopProvider: ', shopProvider);

// const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const deleteBtn = document.querySelector(".delete-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const menuBtn = document.querySelector(".menu-btn");
const sendMessageBtn = document.querySelector(".send-message-btn");

let pageDetails = null;
try {
  pageDetails = getPageDetailsMethods?.[shopProvider + 'PageDetails']();
} catch (error) {
  console.error('error getting page details: ', error);
}
const { pageType, productName, productId } = pageDetails && pageDetails;
console.log('pageType: ', pageType);
console.log('productName: ', productName);
let couponGivenDate = null;
const welcomeMessage = 'Hi there 👋! I\'m KIPP, your friendly assistant here to help you. Whether you have questions, need assistance, or just want to chat, I\'m here for you. Feel free to type in your message.'
const welcomeQuestion = 'How can I help you?'
let userMessage = null; // Variable to store user's message
let messages = [{ id: 0, speaker: 'salesman', text: welcomeMessage }, { id: 1, speaker: 'salesman', text: welcomeQuestion }];  // Variable to store all the messages including the starter message
const inputInitHeight = chatInput.scrollHeight || 54.99;
let userId = null
let conversationId = 0;
let isResponseLoading = false;

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
  let messagesFromLocalStorage = null;
  try {
    messagesFromLocalStorage = JSON.parse(localStorage.getItem('messages'));
  } catch (error) {
    console.log('error parsing messages from local storage: ', error);
  }
  if (messagesFromLocalStorage && messagesFromLocalStorage.length > 0) {
    messages = messagesFromLocalStorage;
    messages.forEach((message, index) => {
      const hidePicture = index + 1 !== messages.length && messages[index + 1]?.speaker === message.speaker;
      const chatElement = createChatLi(message.text, message.speaker === 'user' ? 'outgoing' : 'incoming', hidePicture);
      chatbox.appendChild(chatElement);
    });
    chatbox.scrollTo(0, chatbox.scrollHeight, {behavior: 'smooth'});
  } else {
    const chatElement = createChatLi(welcomeMessage, "incoming", true);
    chatbox.appendChild(chatElement);
    chatbox.scrollTo(0, chatbox.scrollHeight, {behavior: 'smooth'});
    const chatElement2 = createChatLi(welcomeQuestion, "incoming");
    chatbox.appendChild(chatElement2);
    chatbox.scrollTo(0, chatbox.scrollHeight, {behavior: 'smooth'});

    // update messages variable
    messages = [{ id: 0, speaker: 'salesman', text: welcomeMessage }, { id: 1, speaker: 'salesman', text: welcomeQuestion }];

    // update local storage
    localStorage.setItem('messages', JSON.stringify(messages));
  }

  // get couponGivenDate from local storage
  const couponGivenDateFromLocalStorageRaw = localStorage.getItem('kp-couponGivenDate');
  let couponGivenDateFromLocalStorage = null;
  try {
    couponGivenDateFromLocalStorage = JSON.parse(couponGivenDateFromLocalStorageRaw);
  } catch (error) {
    console.log('error parsing couponGivenDate from local storage: ', error);
  }
  if (couponGivenDateFromLocalStorage) {
    couponGivenDate = couponGivenDateFromLocalStorage;
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

  try {
    isResponseLoading = true;

    // call cloud function
    const response = await fetch(
      `https://us-central1-sales-chatbot-f1521.cloudfunctions.net/openAISalesConversation`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${''}`, // idToken
        },
        body: JSON.stringify({ messages: messages, productName: productName, productId: productId, pageType: pageType, couponGivenDate: couponGivenDate, clientId: clientId, chatBotWebsiteHostName: chatBotWebsiteHostName, shopProvider: shopProvider, userId: userId, conversationId: conversationId })
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong. Please try again later.');
    }

    const data = await response.json();
    if (data?.response?.text?.replace('[salesman]:', '')?.includes('|||')) {
      const split = data?.response?.text?.replace('[salesman]:', '')?.split('|||')
      messages = [...messages, {id: messages.length, speaker: 'salesman', text: split[0].trim()}, {id: messages.length + 1, speaker: 'salesman', text: split[1].trim().replace('Question: ', '')}]
      chatElement.querySelector('span').classList.add("hidden");
      messageElement.textContent = messages[messages.length - 2].text;
      const incomingChatLi = createChatLi(messages[messages.length - 1].text, "incoming");
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight, {behavior: 'smooth'});
    } else {
      messages = [...messages, {id: messages.length, speaker: 'salesman', text: data?.response?.text?.replace('[salesman]:', '').trim()}]
      messageElement.textContent = messages[messages.length - 1].text;
      chatbox.scrollTo(0, chatbox.scrollHeight, {behavior: 'smooth'});
    }

    // update the couponGivenDate variable and set local storage
    if (data?.response?.couponGivenDate) {
      couponGivenDate = data?.response?.couponGivenDate;
      try {
        localStorage.setItem('kp-couponGivenDate', couponGivenDate);
      } catch (error) {
        console.log('error setting couponGivenDate in local storage: ', error);
      }
    }

    // update local storage
    localStorage.setItem('messages', JSON.stringify(messages));

    isResponseLoading = false;
  } catch (error) {
    messageElement.classList.add("error");
    messageElement.textContent = "Oops! Something went wrong. Please try again.";
    isResponseLoading = false;
  }
}

const sendFaqResponse = async (chatElement, questionId) => {
  const messageElement = chatElement.querySelector("p");
  const response = faq[questionId].answer;
  messages = [...messages, {id: messages.length, speaker: 'user', text: faq[questionId].question}, {id: messages.length + 1, speaker: 'salesman', text: response}]
  setTimeout(() => {
    messageElement.textContent = messages[messages.length - 1].text;
    chatbox.scrollTo(0, chatbox.scrollHeight, {behavior: 'smooth'});
  }, 600);
  localStorage.setItem('messages', JSON.stringify(messages));
}

const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
  if(!userMessage) return;
  if(isResponseLoading) return;
  isResponseLoading = true;

  // Clear the input textarea and set its height to default
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight, {behavior: 'smooth'});
  
  setTimeout(() => {
    // Display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight, {behavior: 'smooth'});
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
// chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
menuBtn.addEventListener("click", () => document.body.classList.toggle("show-home"));
sendMessageBtn.addEventListener("click", () => (document.body.classList.remove("show-home"), chatInput.focus()));

// FAQ
const chatbot = document.querySelector('.chatbot');
const faqElement = chatbot.querySelector('.chat-faq');
const faqQuestions = faqElement.querySelectorAll('.question');
faqQuestions.forEach((question, index) => {
  question.addEventListener('click', () => {
    document.body.classList.remove("show-home");
    const questionText = faq[index].question;
    const chatElement = createChatLi(questionText, "outgoing");
    chatbox.appendChild(chatElement);
    chatbox.scrollTo(0, chatbox.scrollHeight, {behavior: 'smooth'});

    // displaying "Thinking..." before sending the response
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight, {behavior: 'smooth'});
    sendFaqResponse(incomingChatLi, index); // TODO make a question after giving the response, so that it will hook the user and push him to start a convo (make it so that the shop owner can choose that question)
  })
})