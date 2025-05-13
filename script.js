function updateGreeting() {
    const nameInput = document.getElementById('nameInput');
    const welcomeMessage = document.getElementById('welcome-message');
    const name = nameInput.value.trim();
    
    if (name) {
        welcomeMessage.textContent = `Herzlich willkommen ${name}, du hast es geschafft, schön dass du hier bist.`;
    } else {
        welcomeMessage.textContent = 'Herzlich willkommen, du hast es geschafft, schön dass du hier bist.';
    }
}
