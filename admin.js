
// Configuration
const ADMIN_PASSWORD = "EdelGlow123"; 

// Éléments DOM
const authSection = document.getElementById('auth-section');
const adminSection = document.getElementById('admin-section');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const productForm = document.getElementById('productForm');
const productTable = document.getElementById('productTable');


// Tableau des produits avec catégories
let products = [
    {
        id: 1,
        name: "Bague Étoilée",
        price: 149.99 ,
        category: "bagues",
        image: "images/bague-etoile.jpg",
        description: "Bague en argent avec zirconium cubique"
    },
    {
        id: 2,
        name: "Collier Lunaire",
        price: 89.99,
        category: "colliers",
        image: "images/Collier Lunaire.jpg",
        description: "Collier en or rose avec pendentif lune"
    },
    {
        id: 3,
        name: "Bracelet Solaire",
        price: 119.99,
        category: "bracelets",
        image: "images/Bracelet Solaire.jpg",
        description: "Bracelet en or jaune avec perles"
    },
    {
        id: 4,
        name: "Bague Royale",
        price: 199.99,
        category: "bagues",
        image: "images/Bague Royale.jpg",
        description: "Bague en or blanc avec diamant"
    },
    {
        id: 5,
        name: "Alliance Éternelle",
        price: 199,
        category: "bagues",
        image: "images/Alliance Éternelle.jpg",
        description: "Alliance en platine finition brillante"
    },
    {
        id: 6,
        name: "Rosée Matinale",
        price: 159,
        category: "bagues",
        image: "images/Rosée Matinale.jpg",
        description: "Bague or rose avec quartz rose"
    },
    {
        id: 7,
        name: "Aurore Boréale",
        price: 220,
        category: "bagues",
        image: "images/Aurore Boréale.jpg",
        description: "Saphir bleu entouré de diamants"
    },
    {
        id: 8,
        name: "Serpentine",
        price: 179,
        category: "bagues",
        image: "images/Serpentine.jpg",
        description: "Bague serpent en or jaune 14k"
    },
    {
        id: 9,
        name: "Lune Mystique",
        price: 145,
        category: "bagues",
        image: "images/Lune Mystique.jpg",
        description: "Pendentif lune en argent sterling"
    }
    ,
    {
        id: 10,
        name: "Goutte Céleste",
        price: 129,
        category: "colliers",
        image: "images/Goutte Céleste.jpg",
        description: "Pendentif goutte d'eau en cristal"
    },
    {
        id: 11,
        name: "Éclipse Dorée",
        price: 189,
        category: "colliers",
        image: "images/Éclipse Dorée.jpg",
        description: "Collier soleil et lune en or jaune 14K"
    },
    {
        id: 12,
        name: "Collier Freya",
        price: 165,
        category: "colliers",
        image: "images/Collier Freya.jpg",
        description: "Pendentif étoile en platine"
    },
    {
        id: 13,
        name: "Ondine",
        price: 139,
        category: "colliers",
        image: "images/Ondine.jpg",
        description: "Collier coquillage nacré Matériaux : Argent"
    },
    {
        id: 14,
        name: "Infini",
        price: 149,
        category: "colliers",
        image: "images/Infini.jpg",
        description: "Symbole infini en or blanc"
    },
    {
        id: 15,
        name: "Vagues Océanes",
        price: 99,
        category: "bracelets",
        image: "images/Vagues Océanes.jpg",
        description: "Bracelet vagues en argent"
    },
    {
        id: 16,
        name: "Charme Étoilé",
        price: 119,
        category: "bracelets",
        image: "images/Charme Étoilé.jpg",
        description: "Bracelet à breloques personnalisables Matériaux : Argent"
    },
    {
        id: 17,
        name: "Jasmin",
        price: 89,
        category: "bracelets",
        image: "images/Jasmin.jpg",
        description: "Fleurs délicates en or rose"
    },
    {
        id: 18,
        name: "Cordelette Lunaire",
        price: 79,
        category: "bracelets",
        image: "images/Cordelette Lunaire.jpg",
        description: "Style bohème avec pierre de lune"
    },
    {
        id: 19,
        name: "Éclat de Rubis",
        price: 199,
        category: "bracelets",
        image: "images/Éclat de Rubis.jpg",
        description: "Rubis sertis Matériaux : Argent"
    },
    {
        id: 20,
        name: "Collier à pendentif chaîne et nœud papillon",
        price: 150,
        category: "colliers",
        image: "images/Collier à pendentif chaîne et nœud papillon.jpg",
        description: "Collier papillon en or, pendentif délicat, superposition de bijoux"
    }
];


// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Vérifie si déjà connecté
    if (localStorage.getItem('adminAuth') === 'true') {
        showAdminInterface();
    }
    
    // Gestion de la connexion
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        const errorMsg = document.getElementById('errorMsg');
        
        if (password === ADMIN_PASSWORD) {
            // Connexion réussie
            localStorage.setItem('adminAuth', 'true');
            showAdminInterface();
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

// Affiche l'interface admin
function showAdminInterface() {
    authSection.style.display = 'none';
    adminSection.style.display = 'block';
    renderProducts();
}

// Ajoute un nouveau produit
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
    
    alert("Produit ajouté avec succès !");
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
        
        // Scroll vers le formulaire
        document.querySelector('.product-form').scrollIntoView({
            behavior: 'smooth'
        });
        
        alert("Mode édition activé pour: " + product.name);
    }
};

window.deleteProduct = function(id) {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
        products = products.filter(p => p.id !== id);
        renderProducts();
    }
};
