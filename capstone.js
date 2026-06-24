// ==========================================================================
// 1. Modular Data & Views
// ==========================================================================
const products = [
    { id: 1, name: "Mechanical Dev Keyboard", price: "$129", icon: "⌨️" },
    { id: 2, name: "Noise Cancelling Headphones", price: "$199", icon: "🎧" },
    { id: 3, name: "Ultra-Wide Monitor", price: "$349", icon: "🖥️" },
    { id: 4, name: "Ergonomic Mouse", price: "$79", icon: "🖱️" }
];

// View Module: Home
const HomeView = () => `
    <section class="hero">
        <h1>Upgrade Your Workspace</h1>
        <p>Premium gear for developers and designers.</p>
        <a href="#/catalog" class="cta-button">Shop Now</a>
    </section>
`;

// View Module: Catalog
const CatalogView = () => `
    <h2>Product Catalog</h2>
    <div class="product-grid">
        ${products.map(p => `
            <div class="product-card">
                <div class="product-icon">${p.icon}</div>
                <h3>${p.name}</h3>
                <p class="price">${p.price}</p>
                <button onclick="alert('Added to cart!')">Add to Cart</button>
            </div>
        `).join('')}
    </div>
`;

// ==========================================================================
// 2. Client-Side Hash Router
// ==========================================================================
const routes = {
    "/": HomeView,
    "/catalog": CatalogView
};

function router() {
    // Get the current URL hash, default to '/' if empty
    const path = window.location.hash.slice(1) || "/";
    
    // Find the matching view, or default to Home
    const view = routes[path] || routes["/"];
    
    // Inject the modular view into the DOM
    document.getElementById("app-root").innerHTML = view();
}

// Listen for navigation changes without reloading the page
window.addEventListener('hashchange', router);

// Run the router when the page initially loads
window.addEventListener('load', router);
// ==========================================================================
// 3. AI Smart Assistant Interface Logic
// ==========================================================================
const aiToggleBtn = document.getElementById('ai-toggle-btn');
const aiChatWindow = document.getElementById('ai-chat-window');
const aiCloseBtn = document.getElementById('ai-close-btn');
const aiForm = document.getElementById('ai-form');
const aiInput = document.getElementById('ai-input');
const aiMessages = document.getElementById('ai-messages');

// Open/Close Widget
aiToggleBtn.addEventListener('click', () => {
    aiChatWindow.style.display = 'flex';
    aiToggleBtn.style.display = 'none';
});

aiCloseBtn.addEventListener('click', () => {
    aiChatWindow.style.display = 'none';
    aiToggleBtn.style.display = 'block';
});

// Process Questions
aiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = aiInput.value.trim();
    if (!query) return;

    // Render User Message
    appendMessage(query, 'user');
    aiInput.value = '';

    // Automated Expert Parsing Logic
    setTimeout(() => {
        let response = "I can help you find workspace gear! Try asking about keyboards, mice, or displays.";
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('keyboard')) {
            response = "Our Mechanical Dev Keyboard ($129) features highly responsive switches perfect for rapid compilation.";
        } else if (lowerQuery.includes('mouse') || lowerQuery.includes('ergonomic')) {
            response = "The Ergonomic Mouse ($79) prevents wrist fatigue during long engineering or system development sessions.";
        } else if (lowerQuery.includes('monitor') || lowerQuery.includes('screen') || lowerQuery.includes('display')) {
            response = "The Ultra-Wide Monitor ($349) is ideal for managing multi-window code reviews and tracking background server instances.";
        } else if (lowerQuery.includes('headphone') || lowerQuery.includes('audio')) {
            response = "The Noise Cancelling Headphones ($199) are great for locking into continuous development cycles without distractions.";
        }

        appendMessage(response, 'system');
    }, 600);
});

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = text;
    aiMessages.appendChild(msgDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight; // Auto-scroll
}