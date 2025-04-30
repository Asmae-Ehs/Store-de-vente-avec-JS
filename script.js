
import { products } from './data.js';

//1) Panier vide
let cart = [];


 //2) Affiche la liste des produits 

function showProducts(productsToShow = products) {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    
    productsToShow.forEach(product => {
        container.innerHTML += `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price}  MAD</p>
                <button class="details-btn">Voir détails</button>
                <button class="add-to-cart-btn">Ajouter au panier</button>
            </div>
        `;
    });
}

// 3) Fonction de recherche 
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    showProducts(filteredProducts);
}

// 4) Gestion du panier 
function addToCart(product) {
    cart.push(product);
    updateCartDropdown();
    
     
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `${product.name} ajouté au panier`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}


function updateCartUI() {
    const countElement = document.getElementById('cart-count');
    if (countElement) countElement.textContent = cart.length;
}

// 5) Initialisation
window.addEventListener('DOMContentLoaded', () => {
    // Affiche tous les produits au départ
    populateCategoryFilter(); 
    populatePriceRanges();   
    showProducts();
    
    // Écouteurs pour la recherche 
    document.getElementById('search-btn').addEventListener('click', searchProducts);
    document.getElementById('search-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') searchProducts();
    });
    
    // Gestion du panier via délégation d'événements
    document.getElementById('product-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.closest('.product-card').dataset.id);
            const product = products.find(p => p.id === productId);
            if (product) addToCart(product);
        }
    });
    // Gestion de la modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('product-modal')) {
            closeModal();
        }
    });

        // Écouteurs pour la recherche
        document.getElementById('search-btn').addEventListener('click', filterProducts);
        // écouteur pour le filtre de prix
        document.getElementById('price-filter').addEventListener('change', filterProducts);
        // 
        document.getElementById('cart-icon').addEventListener('click', toggleCart);
        document.getElementById('checkout-btn').addEventListener('click', checkout);
        document.getElementById('search-input').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') filterProducts();
        });
        
        //  écouteur pour le filtre
        document.getElementById('category-filter').addEventListener('change', filterProducts);
        
});


//6) Fonction pour afficher detailproduit
function showProductDetails(product) {
    const modal = document.getElementById('product-modal');//  fenêtre pop-up 
    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = product.price;
    document.getElementById('modal-description').textContent = product.description;
    modal.style.display = 'block';

    // Bouton Ajouter au panier
    document.getElementById('modal-add-to-cart').onclick = () => {
        addToCart(product);
        modal.style.display = 'none';
    };
}

// 7) Fonction pour fermer la modal
function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}


document.getElementById('product-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('details-btn')) {
        const productId = parseInt(e.target.closest('.product-card').dataset.id);
        const product = products.find(p => p.id === productId);
        showProductDetails(product);
    }
    
});


//fonction pour filtrer
function filterProducts() {
    const selectedCategory = document.getElementById('category-filter').value;
    const selectedPrice = document.getElementById('price-filter').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    let filteredProducts = products;
    
   
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(
            product => product.category.toLowerCase() === selectedCategory.toLowerCase()
        );
    }
    
    // Filtre par prix
    if (selectedPrice !== 'all') {
        const [min, max] = selectedPrice.split('-').map(Number);
        filteredProducts = filteredProducts.filter(product => {
            if (selectedPrice === '200+') return product.price > 200;
            return product.price >= min && product.price <= max;
        });
    }
    
    // Filtre par recherche
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(
            product => product.name.toLowerCase().includes(searchTerm)
        );
    }
    
    showProducts(filteredProducts);
}



//  Affiche w masque le panier
function toggleCart() {
    const dropdown = document.getElementById('cart-dropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    if (dropdown.style.display === 'block') updateCartDropdown();
}

//actualiser contenu du panier
function updateCartDropdown() {
    const container = document.getElementById('cart-items');
    if (cart.length === 0) {
        container.innerHTML = '<p>Panier vide</p>';
        return;
    }

    // Regrouper les produits par ID
    const groupedCart = {};
    cart.forEach(item => {
        if (!groupedCart[item.id]) {
            groupedCart[item.id] = {
                ...item,
                quantity: 1,
                total: item.price
            };
        } else {
            groupedCart[item.id].quantity++;
            groupedCart[item.id].total += item.price;
        }
    });

    // Générer l'affichage
    container.innerHTML = Object.values(groupedCart).map(item => `
        <div class="cart-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>${item.total.toFixed(2)} DH</span>
        </div>
    `).join('');

    // Mettre à jour le nombre total d'articles
    document.getElementById('cart-count').textContent = cart.length;
}

// Valider la commande
function checkout() {
    if (cart.length === 0) return;
    alert(`Commande validée : ${cart.length} article(s)`);
    cart = [];
    document.getElementById('cart-count').textContent = '0';
    document.getElementById('cart-dropdown').style.display = 'none';
}
// boutons de navigation
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        
        const target = this.getAttribute('href').toLowerCase();
        
        if (target === '#accueil') {
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } 
        else if (target === '#contact') {
            
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                alert("Section Contact en développement !");
            }
        }
    });
});


function populateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    
    // 1. Récupère toutes les catégories UNIQUES depuis le tableau products
    const categories = [...new Set(products.map(product => product.category.toLowerCase()))];
    
    // 2. Ajoute dynamiquement les options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1); 
        categoryFilter.appendChild(option);
    });
}


function populatePriceRanges() {
    const priceFilter = document.getElementById('price-filter');
    const prices = products.map(product => product.price);
    const maxPrice = Math.max(...prices); 

    // Crée des tranches de 100DH jusqu'au prix max
    for (let i = 0; i < maxPrice; i += 100) {
        const option = document.createElement('option');
        option.value = `${i}-${i + 100}`;
        option.textContent = `${i} DH - ${i + 100} DH`;
        priceFilter.appendChild(option);
    }

    // Option finale :Plus de X DH
    const lastThreshold = Math.ceil(maxPrice / 100) * 100;
    const lastOption = document.createElement('option');
    lastOption.value = `${lastThreshold}+`;
    lastOption.textContent = `Plus de ${lastThreshold} DH`;
    priceFilter.appendChild(lastOption);
}