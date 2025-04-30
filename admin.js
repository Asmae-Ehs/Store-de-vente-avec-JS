
import { products } from './data.js'; 

// Force l'authentification 
if (window.location.hash === '#force-auth') {
    localStorage.removeItem('adminAuth'); 
    authSection.style.display = 'flex';
    adminSection.style.display = 'none';
    window.location.hash = ''; 
}
// Configuration
const ADMIN_PASSWORD = "EdelGlow123"; 

// Éléments DOM
const authSection = document.getElementById('auth-section');
const adminSection = document.getElementById('admin-section');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const productForm = document.getElementById('productForm');
const productTable = document.getElementById('productTable');



// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Affiche  l'authentification par défaut
    authSection.style.display = 'flex';
    adminSection.style.display = 'none';
    
    if (localStorage.getItem('adminAuth') === 'true' && !window.location.hash) {
        showAdminInterface();
    }
    
    // Gestion de la connexion
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        const errorMsg = document.getElementById('errorMsg');
        
        if (password === ADMIN_PASSWORD) {
            //  Stocke l'authentification
            localStorage.setItem('adminAuth', 'true');
            
            //  Nettoie les erreurs précédentes
            errorMsg.textContent = '';
            
            //  Affiche l'interface admin 
            authSection.style.display = 'none';
            adminSection.style.display = 'block';
            renderProducts(); 
            
            //  scroll vers le haut
            window.scrollTo(0, 0);
        } else {
            errorMsg.textContent = "Mot de passe incorrect !";
        }
    });
    
    // Déconnexion
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('adminAuth');
        location.reload();
    });
    
    // Gestion des produits
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addProduct();
    });
});



function showAdminInterface() {
    // Double vérification de sécurité
    if (localStorage.getItem('adminAuth') !== 'true') {
        authSection.style.display = 'flex';
        adminSection.style.display = 'none';
        return; 
    }
    
    // Si tout est OK
    authSection.style.display = 'none';
    adminSection.style.display = 'block';
    renderProducts();
}

function addProduct() {
    const newProduct = {
        id: Date.now(), 
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        image: document.getElementById('productImage').value || 'images/default.jpg',
        description: document.getElementById('productDescription').value
    };
    
    products.push(newProduct); 
    renderProducts();
    productForm.reset();
}

// Affiche la liste des produits
function renderProducts() {
    productTable.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" width="50"></td>
            <td>${product.name}</td>
            <td>${product.price} DH</td>
            <td>${product.category}</td>
            <td>
                <button class="btn btn-primary" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}
// Fonctions globales
window.editProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productDescription').value = product.description;
        
        document.querySelector('.product-form').scrollIntoView({
            behavior: 'smooth'
        });
        
        alert("Mode édition activé pour: " + product.name);
    }
};

window.deleteProduct = function(id) {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            renderProducts();
        }
    }
};
