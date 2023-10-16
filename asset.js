export const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
:root {
  --nw-primary-color: #0057ff;
  --nw-secondary-color: #0057ff;
}
.chatbot-toggler,
.chatbot * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
  transition: all 0.2s ease;
}
.chatbot-toggler {
  z-index: 9999;
  position: fixed;
  bottom: 30px;
  right: 35px;
  outline: none;
  border: none;
  height: 50px;
  width: 50px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--nw-primary-color);
  transition: all 0.2s ease;
}
.chatbot-toggler:hover {
  scale: 1.05;
  background: var(--nw-secondary-color);
}
body.show-chatbot .chatbot-toggler {
  transform: rotate(90deg);
}
.chatbot-toggler span {
  color: #fff;
  position: absolute;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chatbot-toggler span:last-child,
body.show-chatbot .chatbot-toggler span:first-child  {
  opacity: 0;
}
body.show-chatbot .chatbot-toggler span:last-child {
  opacity: 1;
}
.chatbot {
  z-index: 9999;
  height: 80vh;
  max-height: 800px;
  position: fixed;
  right: 35px;
  bottom: 90px;
  width: 420px;
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transform: scale(0.5);
  transform-origin: bottom right;
  box-shadow: 0 0 128px 0 rgba(0,0,0,0.1), 0 32px 64px -48px rgba(0,0,0,0.5);
  transition: all 0.1s ease;
}
body.show-chatbot .chatbot {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1);
}
.chatbot header {
  padding: 16px 0;
  position: relative;
  text-align: center;
  color: #fff;
  background: var(--nw-primary-color);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.chatbot header .close-btn {
  position: absolute;
  right: 15px;
  width: 30px;
  height: 30px;
  top: 50%;
  display: none;
  cursor: pointer;
  transform: translateY(-50%);
}
.chatbot header .delete-btn {
  position: absolute;
  left: 15px;
  width: 30px;
  height: 30px;
  top: 50%;
  display: block;
  cursor: pointer;
  transform: translateY(-50%);
}
.chatbot header .menu-btn {
  position: absolute;
  right: 15px;
  width: 30px;
  height: 30px;
  top: 50%;
  cursor: pointer;
  transform: translateY(-50%);
}
header h2 {
  font-size: 1.4em;
  font-weight: 600;
  color: #fff;
}
header .nw-contact-human-banner {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  bottom: -20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  background: #fff;
  color: var(--nw-primary-color);
  padding: 5px 10px;
  border-radius: 0 0 5px 5px;
  font-size: 0.8em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
header .nw-contact-human-banner:hover {
  background: var(--nw-primary-color);
  color: #fff;
}
.nw-contact-human-banner a {
  width: 100%;
  height: 100%;
  color: var(--nw-primary-color);
  text-decoration: none;
}
header .nw-contact-human-banner:hover a {
  color: #fff;
}
.chatbot .chatbox {
  overflow-y: auto;
  height: 90%;
  padding: 30px 20px 100px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.chatbot :where(.chatbox, textarea)::-webkit-scrollbar {
  width: 6px;
}
.chatbot :where(.chatbox, textarea)::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 25px;
}
.chatbot :where(.chatbox, textarea)::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 25px;
}
.chatbox .chat {
  display: flex;
  list-style: none;
}
.chatbox .outgoing {
  margin: 20px 0;
  justify-content: flex-end;
}
.chatbox .incoming span {
  width: 32px;
  height: 32px;
  color: #fff;
  cursor: default;
  text-align: center;
  line-height: 32px;
  align-self: flex-end;
  background: var(--nw-primary-color);
  border-radius: 4px;
  margin: 0 10px 7px 0;
}
.chatbox .chat p {
  white-space: pre-wrap;
  padding: 12px 16px;
  border-radius: 10px 10px 0 10px;
  max-width: 75%;
  color: #fff;
  font-size: 0.95em;
  background: var(--nw-primary-color);
}
.chatbox .incoming p {
  border-radius: 10px 10px 10px 0;
}
.chatbox .chat p.error {
  color: #721c24;
  background: #f8d7da;
}
.chatbox .incoming p {
  color: #000;
  background: #f2f2f2;
}
.bot-picture-container {
  display: flex !important;
  align-items: center;
  justify-content: center;
}
.bot-picture {
  width: 25px;
  height: 25px;
}
.chatbot .chat-input {
  display: flex;
  gap: 5px;
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #fff;
  padding: 3px 20px;
  border-top: 1px solid #ddd;
}
.chat-input textarea {
  box-shadow: none;
  height: 55px;
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  max-height: 180px;
  padding: 15px 15px 15px 0;
  font-size: 0.95em;
}
.chat-input span {
  align-self: flex-end;
  color: var(--nw-primary-color);
  cursor: pointer;
  height: 55px;
  width: 35px;
  display: flex;
  align-items: center;
  visibility: hidden;
  font-size: 1.35em;
}
.chat-input textarea:valid ~ span {
  visibility: visible;
}
.chatbot .chat-home {
  display: none;
  flex-direction: column;
  gap: 10px;
  height: 85%;
  padding: 0 20px 20px;
  overflow-y: auto;
}
.chatbot .chat-home h3 {
  font-size: 2em;
  font-weight: 800;
  color: #000;
  width: 100%;
  margin-top: 1em;
  margin-bottom: 1em;
}
.chatbot .chat-faq {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.chat-faq .question {
  display: flex;
  justify-items: center;
  gap: 10px;
  padding: 10px 15px;
  border-radius: 10px;
  background: #f2f2f2;
  cursor: pointer;
  transition: all 0.2s ease;
}
.chat-faq .question:hover {
  background: #ddd;
}
.chat-faq .send-message-btn {
  background: var(--nw-primary-color);
  color: #fff;
  border: none;
  outline: none;
  font-weight: 600;
  text-align: center;
  padding: 10px 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.chat-faq .send-message-btn:hover {
  background: var(--nw-secondary-color);
}
body.show-home .chat-home {
  display: flex;
}
body.show-home .chatbox {
  display: none;
}
body.show-home .chat-input {
  display: none;
}
body.show-home .nw-contact-human-banner {
  display: none;
} 
body.show-home .delete-btn {
  display: none;
}

.spinner {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 4px solid #ccc;
  border-top-color: var(--nw-primary-color);
  border-left-color: var(--nw-primary-color);
  border-right-color: var(--nw-primary-color);
  animation: spin 1.5s ease infinite;
  margin: 0 auto;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 490px) {
  .chatbot-toggler {
    right: 20px;
    bottom: 20px;
  }
  .chatbot {
    right: 0;
    bottom: 0;
    height: 100%;
    border-radius: 0;
    width: 100%;
  }
  .chatbot .chatbox {
    height: 90%;
    padding: 25px 15px 100px;
  }
  .chatbot .chat-input {
    padding: 5px 15px;
  }
  .chatbot header .close-btn {
    display: block;
  }
  .chatbot header .menu-btn {
    right: 50px;
  }
}

.hidden {
  scale: 0;
}
`;