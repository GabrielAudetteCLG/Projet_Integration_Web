const chatbotContainer = document.getElementById('chatbot-container');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');

function toggleChatbot() {
  chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'flex' : 'none';
}

async function sendMessage() {
  const message = chatbotInput.value;
  if (!message) return;

  chatbotInput.value = '';

  // Affichez le message de l'utilisateur
  const userMessage = document.createElement('div');
  userMessage.textContent = message;
  userMessage.classList.add('chatbot-message-sent'); // Ajoutez la classe CSS pour les messages envoyés
  chatbotMessages.appendChild(userMessage);

  // Envoyez la requête au serveur
  try {
    const response = await fetch('/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    // Affichez la réponse du chatbot
    const chatbotMessage = document.createElement('div');
    chatbotMessage.textContent = data.message;
    chatbotMessage.classList.add('chatbot-message-received'); // Ajoutez la classe CSS pour les messages reçus
    chatbotMessages.appendChild(chatbotMessage);
  } catch (error) {
    console.error(error);
  }

  // Faites défiler vers le bas pour afficher les nouveaux messages
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}