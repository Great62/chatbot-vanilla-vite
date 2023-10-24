import { styles } from './asset.js';

export let clientId = '';
export let shopProvider = 'shopify';
export let chatBotWebsiteHostName = window.location.hostname;
export let faq = [];

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

    document.body.classList.add('show-home');
    // if local storage value kp-chat-open is set to true, open the chatbot
    if (localStorage.getItem('kp-chat-open') === 'true') {
      document.body.classList.add('show-chatbot');
    }
  
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
        <div class="nw-contact-human-banner">
          <a href="#" target="_blank" rel="noopener noreferrer">
            Speak to a Human
          </a>
        </div>
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
        <span class="menu-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </span>
      </header>
      <ul class="chatbox">
      
      </ul>
      <div class="chat-input">
        <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
        <span id="send-btn" class="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--nw-primary-color)" class="w-10 h-10">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </span>
      </div>
      <div class="chat-home">
        <h3>
          Hey I'm <span style="color:var(--nw-secondary-color)">KIPP</span>,
          <br>
          How can I help?
        </h3>
        <div class="chat-faq">
          <div class="send-message-btn">
            Send a message
          </div>
          <p style="text-align:center;font-size:0.8em;margin-top:0.8em;">Instant Answers</p>
          <div class='spinner' />
        </div>
      </div>
    `);
    
    document.body.appendChild(chatbotToggler);
    document.body.appendChild(chatbot);

    // we set this event listener to true so that the user can open the bot before KIPP data is fetched
    const chatbotOpenState = "kp-chat-open";

    const toggleChatbot = () => {
      document.body.classList.toggle("show-chatbot");
      const chatbotOpen = document.body.classList.contains("show-chatbot");
      localStorage.setItem(chatbotOpenState, chatbotOpen);
    }

    chatbotToggler.addEventListener("click", toggleChatbot);
    
    // fetching KIPP data
    const fetchKIPP = async () => {
      let KIPPDataRes;
      try {
        KIPPDataRes = await fetch(
          'https://us-central1-sales-chatbot-f1521.cloudfunctions.net/fetchKIPP',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${''}`, // idToken
            },
            body: JSON.stringify({ shopProvider, chatBotWebsiteHostName, clientId })
          }
        );
        
        if (!KIPPDataRes.ok) {
          throw new Error('Something went wrong. Please try again later.');
        }
        
        const KIPPData = await KIPPDataRes.json();

        // setting contactBtn link
        const contactUrl = KIPPData?.contactBtnUrl
        const contactBtn = document.querySelector('.nw-contact-human-banner a');
        
        if (contactUrl) {
          contactBtn && contactBtn.setAttribute('href', contactUrl);
        }

        // setting chatbot colours
        const root = document.documentElement;
        KIPPData?.colour1 && root.style.setProperty('--nw-primary-color', KIPPData?.colour1);
        KIPPData?.colour2 && root.style.setProperty('--nw-secondary-color', KIPPData?.colour2);

        // setting faq
        faq = KIPPData.faq;

        // setting global variable faq
        window.nwKIPPChatbotData.faq = faq;
        
        const faqContainer = document.querySelector('.chat-faq');
        // delete only .spinner div
        const spinner = faqContainer.querySelector('.spinner');
        if (spinner) {
          faqContainer.removeChild(spinner);
        }
        
        faq.forEach((faqItem, index) => {
          faqContainer.innerHTML += `
            <div class="question" id="${index}">
              ${faqItem.question}
            </div>
          `;
        });
      } catch (error) {
        console.error(error);
        faq = await KIPPDataRes?.text();
        const faqContainer = document.querySelector('.chat-faq');
        // delete only .spinner div
        const spinner = faqContainer.querySelector('.spinner');
        if (spinner) {
          faqContainer.removeChild(spinner);
        }
    
        if (faq === 'FAQ not found') {
          faqContainer.querySelector('p').innerHTML = 'No instant answers.';
        } else {
          faqContainer.innerHTML += `
            <div class="errorMsg">
              Something went wrong. Please try again later.
            </div>
          `;
        }
      }
    };
    

    // fetching KIPP data
    await fetchKIPP();

    // appending script tag to body to load chatbot.js
    const script = document.createElement('script');
    script.src = 'https://rawcdn.githack.com/Great62/chatbot-vanilla-vite/589e5e808046cff4c1b8f0c0a388aca027dce4d0/chatbot.js';
    // script.src = 'https://raw.githack.com/Great62/chatbot-vanilla-vite/main/chatbot.js';
    // script.src = './chatbot.js';
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
  shopProvider = shopProviderWeb || 'shopify';

  if (!clientId) {
    console.error('Please set the clienId in the initializeChatbot function');
    return;
  }
  if (!shopProvider) {
    console.error('Please set the shopProvider in the initializeChatbot function');
    return;
  }

  window.nwKIPPChatbotData.clientId = clientId;
  window.nwKIPPChatbotData.shopProvider = shopProvider;
  
  new ChatBotWidget();
}

window.nwKIPPChatbotData = {
  clientId,
  shopProvider,
  faq,
};

window.nwKIPPChatbot = {
  initializeChatbot: initializeChatbot,
};
