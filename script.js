
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
function addToCart(product) {//Ajoute un produit au tableau cart.
    cart.push(product);// Ajoute le product à la fin du tableau cart.
    updateCartUI();//Appelle la fonction updateCartUI() pour actualiser l'affichage du panier.
}

function updateCartUI() {// Affiche le nombre d'articles dans le panier.
    const countElement = document.getElementById('cart-count');//Cherche dans le HTML un élément avec l'ID cart-count
    if (countElement) countElement.textContent = cart.length;
}

// 5) Initialisation
window.addEventListener('DOMContentLoaded', () => {// Pour éviter d'exécuter du JS avant que les éléments HTML existent.
    // Affiche tous les produits au départ
    populateCategoryFilter(); // <-- // Appelle cette fonction au chargement de la page
    populatePriceRanges();    // Pour les prix (nouveau)
    showProducts();
    
    // Écouteurs pour la recherche 
    document.getElementById('search-btn').addEventListener('click', searchProducts);//Quand on clique sur le bouton (click),ghn3mlo l appelle n searchProducts().
    document.getElementById('search-input').addEventListener('keyup', (e) => {//keyup : Se déclenche quand une touche est relâchée.
        if (e.key === 'Enter') searchProducts();//Vérifie si c'est la touche Entrée,Si oui, on lance la recherche.
    });
    
    // Gestion du panier via délégation d'événements
    document.getElementById('product-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {//e.target : L'élément cliqué (le bouton "Ajouter"). Vérifie si c'est bien un bouton d'ajout.
            const productId = parseInt(e.target.closest('.product-card').dataset.id);// Récupère l'ID du produit (stocké dans data-id en HTML).
            const product = products.find(p => p.id === productId);//Cherche le produit correspondant dans votre tableau.
            if (product) addToCart(product);//Ajoute le produit trouvé au panier.
        }
    });
    // Gestion de la modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);// Fermeture par la croix (×)
    window.addEventListener('click', (e) => {//Fermeture en cliquant à l'extérieur
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
        addToCart(product);//Ajoute le produit au panier 
        modal.style.display = 'none';//Ferme la fenêtre
    };
}

// 7) Fonction pour fermer la modal
function closeModal() {
    document.getElementById('product-modal').style.display = 'none';// none = aucun affichage
}


document.getElementById('product-list').addEventListener('click', (e) => {//Sélection de la zone des produits et  Écouteur d'événement pour les clics
    if (e.target.classList.contains('details-btn')) {//e.target : L'élément précis qui a été cliqué,Vérifie si l'élément cliqué a la classe details-btn
        const productId = parseInt(e.target.closest('.product-card').dataset.id);//parseInt() : Convertit en nombre (car dataset.id retourne une chaîne)etRécupérer l'ID du produit
        const product = products.find(p => p.id === productId);//Trouver le produit correspondant
        showProductDetails(product);
    }
    
});


//fonction pour filtrer
function filterProducts() {//Récupérer les valeurs des filtres
    const selectedCategory = document.getElementById('category-filter').value;
    const selectedPrice = document.getElementById('price-filter').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    let filteredProducts = products;//Initialiser les produits filtrés
    
    // Filtre par cat
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(
            product => product.category.toLowerCase() === selectedCategory.toLowerCase()//.toLowerCase() : Pour ignorer la casse
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
    
    showProducts(filteredProducts);//Affichage final
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
    container.innerHTML = cart.length === 0
        ? '<p>Panier vide</p>'
        : cart.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>${item.name}</span>
                <span>${item.price} DH</span>
            </div>
        `).join('');
}

// Valider la commande
function checkout() {
    if (cart.length === 0) return;
    alert(`Commande validée : ${cart.length} article(s)`);
    cart = [];
    document.getElementById('cart-count').textContent = '0';
    document.getElementById('cart-dropdown').style.display = 'none';
}
// Activation des boutons de navigation
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Récupère la cible du lien (accueil ou contact)
        const target = this.getAttribute('href').toLowerCase();
        
        if (target === '#accueil') {
            // Scroll n Accueil
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } 
        else if (target === '#contact') {
            // Scroll n Contact 
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
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Majuscule
        categoryFilter.appendChild(option);
    });
}


function populatePriceRanges() {
    const priceFilter = document.getElementById('price-filter');
    const prices = products.map(product => product.price);
    const maxPrice = Math.max(...prices); // Prix maximum dans ton catalogue

    // Crée des tranches de 100DH jusqu'au prix max
    for (let i = 0; i < maxPrice; i += 100) {
        const option = document.createElement('option');
        option.value = `${i}-${i + 100}`;
        option.textContent = `${i} DH - ${i + 100} DH`;
        priceFilter.appendChild(option);
    }

    // Option finale pour "Plus de X DH" (arrondi à la centaine supérieure)
    const lastThreshold = Math.ceil(maxPrice / 100) * 100;
    const lastOption = document.createElement('option');
    lastOption.value = `${lastThreshold}+`;
    lastOption.textContent = `Plus de ${lastThreshold} DH`;
    priceFilter.appendChild(lastOption);
}