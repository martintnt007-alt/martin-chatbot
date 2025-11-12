document.addEventListener('DOMContentLoaded', () => {

    // --- ¡¡¡ATENCIÓN AQUÍ!!! ---
    // Esta es la URL de tu API de Flask.
    // Cuando la despliegues en PythonAnywhere, cambia esta URL.
    const API_URL = 'https://martin1313.pythonanywhere.com/chat'; // URL para pruebas locales
    // const API_URL = 'https://TU_USUARIO.pythonanywhere.com/chat'; // URL de producción

    // --- Selección de elementos del DOM ---
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    // --- Lógica para abrir y cerrar el chat ---
    chatBubble.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        chatBubble.classList.add('hidden'); // Oculta la burbuja al abrir
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
        chatBubble.classList.remove('hidden'); // Muestra la burbuja al cerrar
    });

    // --- Lógica para enviar mensajes ---
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return; // No enviar mensajes vacíos

        // 1. Mostrar el mensaje del usuario en el chat
        displayMessage(message, 'user');
        userInput.value = ''; // Limpiar el campo de entrada

        // 2. Mostrar indicador de "pensando..."
        const thinkingMessage = displayMessage('Pensando...', 'bot thinking');

        // 3. Enviar el mensaje al backend (Flask API)
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 4. Reemplazar "Pensando..." con la respuesta real
            thinkingMessage.textContent = data.response;
            thinkingMessage.classList.remove('thinking');
        })
        .catch(error => {
            console.error('Error al contactar la API:', error);
            // 5. Mostrar un mensaje de error si algo falla
            thinkingMessage.textContent = 'Lo siento, no pude obtener una respuesta. Inténtalo de nuevo.';
            thinkingMessage.classList.remove('thinking');
            thinkingMessage.style.backgroundColor = '#ffdddd'; // Estilo de error
        });
    }

    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);

        // Hacer scroll automático al final
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageElement; // Devuelve el elemento por si necesitamos modificarlo (ej. "Pensando...")
    }
});