import { styles } from './asset.js';

export let clientId = '';
export let shopProvider = '';
export let chatBotWebsiteHostName = window.location.hostname;

class ChatBotWidget {
  constructor() {
    this.initialize();
    this.injectStyles();
  }

  async initialize() {
    const createHTMLElement = (tagName, attributes = {}, content = '') => {
      const element = document.createElement(tagName);
      for (const [attr, value] of Object.entries(attributes)) {
        element.setAttribute(attr, value);
      }
      element.innerHTML = content;
      return element;
    };
  
    const chatbotToggler = createHTMLElement('button', { class: 'chatbot-toggler' }, `
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
        </svg>        
      </span>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    `);
  
    const chatbot = createHTMLElement('div', { class: 'chatbot' }, `
      <header>
        <h2>Assistance</h2>
        <span class="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      </header>
      <ul class="chatbox">
        
      </ul>
      <div class="chat-input">
        <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
        <span id="send-btn" class="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </span>
      </div>
    `);
  
    document.body.appendChild(chatbotToggler);
    document.body.appendChild(chatbot);

    // appending script tag to body to load chatbot.js
    const script = document.createElement('script');
    script.src = 'https://raw.githack.com/Great62/chatbot-vanilla-vite/main/chatbot.js';
    script.type = 'module';
    script.defer = true; // Optionally, set defer or async attribute
    document.body.appendChild(script);
  
    // icons
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0';
    document.head.appendChild(link1);
  
    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0';
    document.head.appendChild(link2);
  }

  injectStyles() {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles.replace(/^\s+|\n/gm, "");
    document.head.appendChild(styleTag);
  }
}

const initializeChatbot = ({
  shopProviderWeb,
  clientIdWeb
}) => {
  clientId = clientIdWeb;
  shopProvider = shopProviderWeb;
  if (!clientId) {
    console.error('Please set the clienId in the initializeChatbot function');
    return;
  }
  if (!shopProvider) {
    console.error('Please set the shopProvider in the initializeChatbot function');
    return;
  }
  new ChatBotWidget();
}

window.salesChatbot = {
  initializeChatbot: initializeChatbot,
};
