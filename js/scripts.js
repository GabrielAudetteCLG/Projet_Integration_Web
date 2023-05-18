document.addEventListener("DOMContentLoaded", function () {
  const navbarLinks = document.querySelectorAll(".navbar-brand");
  const cartIcon = document.getElementById("cart-icon");
  const currentPath = window.location.pathname;

  // Mettre en surbrillance le lien actif dans la barre de navigation
  navbarLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  if (currentPath === "/checkout") {
    cartIcon.classList.add("active-icon");
  } else {
    cartIcon.classList.remove("active-icon");
  }
});

//chatbot scripts
const chatbotContainer = document.getElementById("chatbot-container");
      const chatbotMessages = document.getElementById("chatbot-messages");
      const chatbotInput = document.getElementById("chatbot-input");

      function toggleChatbot() {
        // Afficher ou masquer le chatbot
        chatbotContainer.style.display =
          chatbotContainer.style.display === "none" ? "flex" : "none";
      }

      async function sendMessage() {
        const message = chatbotInput.value;
        if (!message) return;

        chatbotInput.value = "";

        // Afficher le message del'utilisateur
        const userMessage = document.createElement("div");
        userMessage.textContent = message;
        userMessage.classList.add("chatbot-message-sent"); // Ajouter la classe CSS pour les messages envoyés
        chatbotMessages.appendChild(userMessage);

        // Envoyer la requête au serveur
        try {
          const response = await fetch("/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
          });

          const data = await response.json();

          // Afficher la réponse du chatbot
          const chatbotMessage = document.createElement("div");
          chatbotMessage.textContent = data.message;
          chatbotMessage.classList.add("chatbot-message-received"); // Ajouter la classe CSS pour les messages reçus
          chatbotMessages.appendChild(chatbotMessage);
        } catch (error) {
          console.error(error);
        }

        // Faire défiler vers le bas pour afficher les nouveaux messages
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      }

      // Ajouter le message d'accueil lorsque la page se charge
      window.onload = function() {
        const greetingMessage = "Bienvenue chez CGI! Vous discutez maintenant avec un assistant IA. Comment puis-je vous aider aujourd'hui?";
        const chatbotGreeting = document.createElement("div");
        chatbotGreeting.textContent = greetingMessage;
        chatbotGreeting.classList.add("chatbot-message-received"); // Ajouter la classe CSS pour les messages reçus
        chatbotMessages.appendChild(chatbotGreeting);
      };