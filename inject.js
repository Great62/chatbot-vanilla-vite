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
        <span class="delete-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" class="w-10 h-10">
            <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
          </svg>      
        </span>
      </header>
      <ul class="chatbox">
        
      </ul>
      <div class="chat-input">
        <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
        <span id="send-btn" class="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0057ff" class="w-10 h-10">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </span>
      </div>
    `);
  
    document.body.appendChild(chatbotToggler);
    document.body.appendChild(chatbot);

    // appending script tag to body to load uuid library
    const uuidScript = document.createElement('script');
    uuidScript.src = 'https://cdn.jsdelivr.net/npm/uuid@9.0.1/dist/index.min.js';
    uuidScript.type = 'text/javascript';
    document.body.appendChild(uuidScript);

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
