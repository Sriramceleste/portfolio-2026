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