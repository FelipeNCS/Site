// ==========================================
// APP LOGIC - LEAD WEBSITE (SHARED SCRIPT)
// ==========================================

// Mock Product Database (used in Minecraft Shop)
const products = [
    { 
        id: 1, 
        name: "yBaterPonto", 
        category: "geral", 
        price: 0, 
        salesCount: 17,
        rating: 5,
        desc: "Registre os horários de entrada e saída da sua equipe de colaboradores!", 
        isFree: true,
        image: "images/plugin-ybaterponto.png",
        reviews: [
            { author: "DevMinecraftBR", rating: 5, date: "15/07/2026", text: "Plugin excelente! Muito fácil de configurar e salva todo o ponto da staff sem erros." },
            { author: "CraftMaster", rating: 5, date: "10/07/2026", text: "Atendimento top e funcionalidade de relatórios perfeita!" }
        ]
    },
    { 
        id: 2, 
        name: "yEmpregos", 
        category: "economia", 
        price: 19.90, 
        salesCount: 214,
        rating: 5,
        desc: "Sistema completo de profissões, turnos de trabalho e premiações, tornando a economia do...", 
        isFree: false,
        image: "images/plugin-yempregos.png",
        reviews: [
            { author: "EconomiaPro", rating: 5, date: "12/07/2026", text: "Meus jogadores amaram os empregos! A economia do servidor ficou super movimentada." }
        ]
    },
    { 
        id: 3, 
        name: "yCustomItems", 
        category: "vips", 
        price: 17.90, 
        salesCount: 158,
        rating: 5,
        desc: "Crie itens exclusivos com diversas ações, habilidades e funcionalidades personalizadas.", 
        isFree: false,
        image: "images/plugin-ycustomitems.png",
        reviews: [
            { author: "VipBuilder", rating: 5, date: "08/07/2026", text: "As armas e habilidades mágicas personalizadas são surreais de incríveis." }
        ]
    },
    { 
        id: 4, 
        name: "LEAD Anti-Cheat Pro", 
        category: "seguranca", 
        price: 89.90, 
        salesCount: 342,
        rating: 5,
        desc: "Proteção completa de nível corporativo contra qualquer tipo de trapaça ou hack.", 
        isFree: false,
        image: "images/minecraft-hero-banner.jpg",
        reviews: [
            { author: "AdminServer", rating: 5, date: "18/07/2026", text: "Zerou os hackers no servidor. Nota 10/10!" }
        ]
    },
    { 
        id: 5, 
        name: "Plugin Lobby VIP", 
        category: "lobby", 
        price: 29.90, 
        salesCount: 189,
        rating: 5,
        desc: "Hub interativo com efeitos visuais incríveis, pets, gadgets e cosméticos para seus jogadores.", 
        isFree: false,
        image: "images/hero-slide-3.png",
        reviews: [
            { author: "LobbyKing", rating: 5, date: "14/07/2026", text: "Os efeitos de partículas e voo deixaram o lobby parecendo um servidor gringo gigante." }
        ]
    },
    { 
        id: 6, 
        name: "Plugin Economia Global", 
        category: "economia", 
        price: 39.90, 
        salesCount: 96,
        rating: 5,
        desc: "Sistema financeiro completo com suporte a banco, juros, transações offline e loja integrada.", 
        isFree: false,
        image: "images/hero-slide-2.png",
        reviews: [
            { author: "BankerServer", rating: 5, date: "05/07/2026", text: "O mercado entre jogadores funciona perfeitamente sem duplicações de coins." }
        ]
    }
];

// Sales Tracker Helpers
window.getProductSalesCount = function(product) {
    const saved = JSON.parse(localStorage.getItem('lead_sales_data') || '{}');
    if (saved[product.id] !== undefined) {
        return saved[product.id];
    }
    return product.salesCount || 10;
};

window.formatProductSales = function(product) {
    const count = window.getProductSalesCount(product);
    return product.isFree ? `${count} Downloads` : `${count} vendas`;
};

window.incrementProductSales = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const currentCount = window.getProductSalesCount(product);
    const newCount = currentCount + 1;

    const saved = JSON.parse(localStorage.getItem('lead_sales_data') || '{}');
    saved[productId] = newCount;
    localStorage.setItem('lead_sales_data', JSON.stringify(saved));

    if (typeof renderProducts === 'function') {
        renderProducts();
    }
};

// Shopping Cart State
let cart = [
    { id: 2, name: "yEmpregos", price: 19.90 },
    { id: 3, name: "yCustomItems", price: 17.90 }
];

// DOM Elements
const body = document.body;
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = themeToggleBtn ? themeToggleBtn.querySelector('.sun-icon') : null;
const moonIcon = themeToggleBtn ? themeToggleBtn.querySelector('.moon-icon') : null;
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartBadgeCount = document.getElementById('cart-badge-count');
const productsGrid = document.getElementById('products-grid');
const filterTabs = document.querySelectorAll('.filter-tab');
const loginModalBtn = document.getElementById('login-modal-btn');
const loginModal = document.getElementById('login-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const btnNossosProdutos = document.getElementById('btn-nossos-produtos');
const orcamentoForm = document.getElementById('orcamento-form');

// ==========================================
// 1. THEME TOGGLING (Dark/Light)
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    body.className = savedTheme;
    updateThemeIcons(savedTheme);
}

function updateThemeIcons(theme) {
    if (!sunIcon || !moonIcon) return;
    
    if (theme === 'light-theme') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        themeToggleBtn.style.color = '#ffffff'; 
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        themeToggleBtn.style.color = 'rgba(255, 255, 255, 0.7)';
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            updateThemeIcons('dark-theme');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
            updateThemeIcons('light-theme');
        }
    });
}

// ==========================================
// 2. STICKY HEADER & MOBILE NAVIGATION
// ==========================================
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
}

// Close menu when clicking links on mobile
document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (mobileToggle) mobileToggle.classList.remove('active');
    });
});

// ==========================================
// 3. PRODUCT SHOWCASE & FILTERING (Minecraft page)
// ==========================================
function renderProducts(categoryFilter = 'all') {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    const filtered = categoryFilter === 'all' 
        ? products 
        : products.filter(p => p.category === categoryFilter);

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-banner-wrapper">
                <img src="${p.image}?v=5" alt="${p.name}" class="product-banner-img">
            </div>
            <div class="product-card-content">
                <h4 class="product-card-title">${p.name}</h4>
                <p class="product-card-desc">${p.desc}</p>
                
                <div class="product-stats-price-bar">
                    <div class="product-stat-info">
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <span>${window.formatProductSales(p)}</span>
                    </div>
                    <div class="product-price-tag">
                        ${p.isFree ? 'Grátis' : 'R$' + p.price.toFixed(2).replace('.', ',')}
                    </div>
                </div>

                <div class="product-actions-group">
                    ${p.isFree ? `
                        <button class="product-btn btn-cart-action" onclick="downloadFreePlugin(${p.id})">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            <span>+ Obter</span>
                        </button>
                    ` : `
                        <button class="product-btn btn-cart-action" onclick="addToCart(${p.id})">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            <span>Carrinho</span>
                        </button>
                    `}
                    <button class="product-btn btn-details-action" onclick="openPluginDetails(${p.id})">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path></svg>
                        <span>Detalhes</span>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

window.filterCategory = function(category) {
    renderProducts(category);
    
    filterTabs.forEach(tab => {
        if (tab.getAttribute('data-filter') === category) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
};

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');
        window.filterCategory(filter);
    });
});

// ==========================================
let holoTimeline = null;

function startHoloCartAnimation() {
    if (typeof gsap === 'undefined') return;
    
    if (holoTimeline) {
        holoTimeline.kill();
        holoTimeline = null;
    }

    const scene = document.getElementById('empty-cart-holo-scene');
    const panel = document.getElementById('holo-store-panel');
    const beam = document.getElementById('phone-holo-beam');
    const ghost = document.getElementById('flying-plugin-ghost');
    const toast = document.getElementById('holo-toast-confirmation');
    const targetCard = document.getElementById('holo-card-2');
    const targetBtn = document.getElementById('holo-btn-mock');
    const cartHeaderTitle = document.querySelector('.cart-header h3');

    if (!scene || !panel || !targetCard || !targetBtn) return;

    holoTimeline = gsap.timeline({ repeat: -1, repeatDelay: 2 });

    // Reset initial properties
    holoTimeline
        .set(panel, { scale: 0, y: 30, opacity: 0, rotationX: 10, x: -50 }) // Positioned above the phone
        .set(beam, { scaleY: 0, opacity: 0 })
        .set('.holo-card', { y: 10, opacity: 0 })
        .set(targetCard, { scale: 1, borderColor: "rgba(255, 255, 255, 0.08)", boxShadow: "none" })
        .set(targetBtn, { scale: 1, backgroundColor: "rgba(168, 85, 247, 0.25)" })
        .set(ghost, { opacity: 0, scale: 0.8, x: 0, y: 0 })
        .set(toast, { opacity: 0, y: 15, scale: 0.9 });

    // Delay equivalent to the character raising the phone and looking at it in the 3D animation
    holoTimeline.to(beam, { duration: 1.1 }); // Wait 1.1s before panel starts

    // 4. Painel holográfico sai de dentro do celular
    holoTimeline.to(beam, { scaleY: 1, opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.1");
    holoTimeline.to(panel, { scale: 1, y: 0, opacity: 1, rotationX: 0, duration: 0.5, ease: "back.out(1.2)" });

    // 5. Aparece um plugin (cards load)
    holoTimeline.to('.holo-card', { y: 0, opacity: 1, duration: 0.3, stagger: 0.1, ease: "power2.out" }, "-=0.2");

    // 6. Botão "Adicionar ao carrinho" é clicado (delay to match 3D thumb tap)
    holoTimeline.to(targetCard, { scale: 1.05, borderColor: "#a855f7", boxShadow: "0 0 25px rgba(168, 85, 247, 0.75)", duration: 0.3 }, "+=0.5");
    holoTimeline.to(targetBtn, { scale: 1.15, backgroundColor: "#a855f7", duration: 0.15 }, "-=0.15");
    holoTimeline.to(targetBtn, { scale: 1, duration: 0.15 });

    // 7. Plugin/partícula é recolhido de volta para dentro do baú junto com o painel
    holoTimeline.set(ghost, { x: 0, y: 0, opacity: 1, scale: 0.85 });
    holoTimeline.to(ghost, {
        x: 0, 
        y: 40,
        scale: 0.1,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in"
    });

    // 8. O painel volta para dentro do baú
    holoTimeline.to(panel, { scale: 0, y: 30, opacity: 0, rotationX: 10, duration: 0.4, ease: "power2.in" }, "-=0.3");
    holoTimeline.to(beam, { scaleY: 0, opacity: 0, duration: 0.2 }, "-=0.2");
    
    // Aguarda antes de repetir a animação
    holoTimeline.to(beam, { duration: 1.0 });
}

function stopHoloCartAnimation() {
    if (holoTimeline) {
        holoTimeline.kill();
        holoTimeline = null;
    }
}

// 4. CART FUNCTIONALITY (Minecraft page)
// ==========================================
function updateCartUI() {
    if (!cartBadgeCount || !cartItemsContainer || !cartSubtotal) return;
    
    cartBadgeCount.textContent = cart.length;
    
    cartItemsContainer.innerHTML = '';
    const holoContainer = document.getElementById('holo-container');
    
    if (cart.length === 0) {
        if (holoContainer) holoContainer.style.display = 'block';
        window.dispatchEvent(new CustomEvent('toggleHoloCart', { detail: { show: true } }));
        
        cartItemsContainer.innerHTML = `
                <h4 class="empty-cart-holo-title" style="text-align:center; color:#fff; margin-top:10px;">Seu carrinho está vazio</h4>
                <p class="empty-cart-holo-subtitle" style="text-align:center; color:rgba(255,255,255,0.6); font-size:14px;">Explore os melhores plugins de Minecraft e turbine seu servidor!</p>`;
        
        cartSubtotal.textContent = 'R$ 0,00';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    } else {
        window.dispatchEvent(new CustomEvent('toggleHoloCart', { detail: { show: false } }));
        if (holoContainer) holoContainer.style.display = 'none'; // keep it hidden just in case but React unmounts anyway
        cart.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <h5 class="cart-item-title">${item.name}</h5>
                    <span class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart(${index})" title="Remover item">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }
    
    const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
    cartSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push({ ...product });
        updateCartUI();
        openCart();
    }
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

function openCart() {
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    }
}

function closeCart() {
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }
}

if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

const checkoutBtn = document.getElementById('checkout-btn');
window.downloadFreePlugin = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Increment download count ONLY when actually downloading!
    window.incrementProductSales(productId);

    alert(`🎉 Download Iniciado! O plugin ${product.name} (Grátis) foi liberado com sucesso e adicionado à sua biblioteca.`);
};

let currentPaymentOrder = [];

window.openPaymentModal = function() {
    if (cart.length === 0) {
        alert('Adicione itens ao carrinho primeiro!');
        return;
    }
    currentPaymentOrder = [...cart];

    const modal = document.getElementById('payment-modal');
    const itemsList = document.getElementById('payment-items-list');
    const totalPrice = document.getElementById('payment-total-price');
    const statusBanner = document.getElementById('payment-status-banner');
    const statusText = document.getElementById('payment-status-text');
    const statusIcon = document.getElementById('payment-status-icon');
    const titleEl = document.getElementById('payment-modal-title');
    const subtitleEl = document.getElementById('payment-modal-subtitle');
    const payBtn = document.getElementById('simulate-pay-btn');

    if (itemsList) {
        itemsList.innerHTML = currentPaymentOrder.map(item => `<div>• <strong>${item.name}</strong> - R$ ${item.price.toFixed(2).replace('.', ',')}</div>`).join('');
    }

    const total = currentPaymentOrder.reduce((acc, item) => acc + item.price, 0);
    if (totalPrice) totalPrice.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    if (statusBanner) statusBanner.className = 'payment-status-banner status-pending';
    if (statusText) statusText.textContent = 'Status: Aguardando confirmação do Pix...';
    if (titleEl) titleEl.textContent = 'Aguardando Pagamento';
    if (subtitleEl) subtitleEl.textContent = 'Escaneie o QR Code Pix para liberar o plugin na sua conta.';
    if (statusIcon) {
        statusIcon.style.background = 'rgba(245, 158, 11, 0.12)';
        statusIcon.style.borderColor = 'rgba(245, 158, 11, 0.25)';
        statusIcon.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="#f59e0b" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
    }
    if (payBtn) payBtn.style.display = 'inline-flex';

    closeCart();
    if (modal) modal.classList.add('active');
};

window.closePaymentModal = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const modal = document.getElementById('payment-modal');
    if (modal) modal.classList.remove('active');
};

window.approveCurrentPayment = function() {
    const statusBanner = document.getElementById('payment-status-banner');
    const statusText = document.getElementById('payment-status-text');
    const statusIcon = document.getElementById('payment-status-icon');
    const titleEl = document.getElementById('payment-modal-title');
    const subtitleEl = document.getElementById('payment-modal-subtitle');
    const payBtn = document.getElementById('simulate-pay-btn');

    if (statusBanner) statusBanner.className = 'payment-status-banner status-approved';
    if (statusText) statusText.textContent = 'Status: PAGAMENTO APROVADO COM SUCESSO! 🎉';
    if (titleEl) titleEl.textContent = 'Pagamento Aprovado!';
    if (subtitleEl) subtitleEl.textContent = 'Os plugins foram liberados na sua conta e o download está disponível.';
    if (statusIcon) {
        statusIcon.style.background = 'rgba(16, 185, 129, 0.15)';
        statusIcon.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        statusIcon.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="#10b981" stroke-width="2.5" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    }
    if (payBtn) payBtn.style.display = 'none';

    // NOW and ONLY NOW: Increment sales count for each paid product after REAL approval!
    currentPaymentOrder.forEach(item => {
        window.incrementProductSales(item.id);
    });

    cart = [];
    updateCartUI();

    setTimeout(() => {
        alert('🎉 Pagamento Aprovado! O plugin foi liberado na sua conta e a contagem oficial de vendas foi atualizada.');
    }, 400);
};

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        window.openPaymentModal();
    });
}

if (btnNossosProdutos) {
    btnNossosProdutos.addEventListener('click', (e) => {
        window.filterCategory('all');
    });
}

window.filterPluginsBySearch = function(query) {
    const term = (query || '').toLowerCase().trim();
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    const cards = productsGrid.querySelectorAll('.product-card');
    cards.forEach(card => {
        const titleEl = card.querySelector('.product-card-title');
        const descEl = card.querySelector('.product-card-desc');
        const titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
        const descText = descEl ? descEl.textContent.toLowerCase() : '';

        if (!term || titleText.includes(term) || descText.includes(term)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
};

window.downloadFreePluginDirect = function(filename) {
    alert(`🎉 Download Iniciado! O arquivo ${filename} foi liberado e o download começou com sucesso.`);
};

// ==========================================
// 5. SEARCH BOX FILTERING
// ==========================================
if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            searchResults.classList.remove('active');
            return;
        }
        
        const matches = products.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));
        
        if (matches.length > 0) {
            searchResults.innerHTML = '';
            matches.forEach(p => {
                const item = document.createElement('a');
                item.href = '#showcase';
                item.className = 'search-result-item';
                item.innerHTML = `
                    <div style="font-weight: 600;">${p.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
                `;
                item.addEventListener('click', () => {
                    searchResults.classList.remove('active');
                    searchInput.value = p.name;
                    window.filterCategory(p.category);
                });
                searchResults.appendChild(item);
            });
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = '<div style="padding: 12px; color: var(--text-muted); font-size: 0.85rem; text-align: center;">Nenhum produto encontrado.</div>';
            searchResults.classList.add('active');
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
            searchResults.classList.remove('active');
        }
    });
}

// ==========================================
// 6. CLIENT AREA MODAL
// ==========================================
if (loginModalBtn && loginModal && closeModalBtn) {
    loginModalBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });
}

// ==========================================
// 7. STATS PROGRESSIVE COUNTUP ANIMATION
// ==========================================
function startCountUp(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;
    
    const countInterval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.round(target * progress);
        const formatted = currentCount.toLocaleString('pt-BR');
        el.textContent = `+${formatted}`;
        
        if (frame === totalFrames) {
            clearInterval(countInterval);
            el.textContent = `+${target.toLocaleString('pt-BR')}`;
        }
    }, frameRate);
}

const statsSection = document.getElementById('stats-section');
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

if (statsSection && statNumbers.length > 0) {
    const observerOptions = { root: null, threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(num => startCountUp(num));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    observer.observe(statsSection);
}

// ==========================================
// 8. HOME PAGE BUDGET FORM & HELPER
// ==========================================
window.selectCategoryForm = function(categoryVal) {
    const categorySelect = document.getElementById('orc-category');
    const descTextarea = document.getElementById('orc-desc');
    
    if (categorySelect) {
        categorySelect.value = categoryVal;
    }
    
    if (descTextarea) {
        if (categoryVal === 'site') {
            descTextarea.value = "Gostaria de criar um site institucional/profissional. Preciso de funcionalidades de...";
        } else if (categoryVal === 'site-dropship') {
            descTextarea.value = "Gostaria de criar um site voltado para e-commerce e dropshipping. Preciso de integração de produtos, gateway de pagamento e...";
        } else if (categoryVal === 'sistema') {
            descTextarea.value = "Gostaria de desenvolver um sistema/programa sob medida. Minha ideia consiste em...";
        }
    }
};

if (orcamentoForm) {
    orcamentoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('orc-name').value;
        const email = document.getElementById('orc-email').value;
        const phone = document.getElementById('orc-phone').value;
        const category = document.getElementById('orc-category').value;
        const desc = document.getElementById('orc-desc').value;
        
        // Show simulated success message
        alert(`Obrigado, ${name}! Recebemos seu pedido de orçamento para a categoria [${category.toUpperCase()}]. Entraremos em contato pelo e-mail: ${email} ou WhatsApp: ${phone} em breve.`);
        
        // Reset form
        orcamentoForm.reset();
    });
}



// ==========================================
// 9. HERO ILLUSTRATION SLIDESHOW
// ==========================================
function initHeroSlideshow() {
    const slideshow = document.getElementById('hero-slideshow');
    if (!slideshow) return;

    const images = slideshow.querySelectorAll('.slideshow-img');
    const slides = document.querySelectorAll('.hero-content .hero-slide');
    let currentIndex = 0;
    const totalImages = images.length;
    let intervalId = null;

    function showImage(index) {
        currentIndex = (index + totalImages) % totalImages;
        
        // Update slideshow illustration image
        images.forEach(img => img.classList.remove('active'));
        if (images[currentIndex]) {
            images[currentIndex].classList.add('active');
        }

        // Update corresponding text slide
        slides.forEach(slide => slide.classList.remove('active'));
        if (slides[currentIndex]) {
            slides[currentIndex].classList.add('active');
        }
    }

    function nextImage() {
        showImage(currentIndex + 1);
    }

    function startSlideshow() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(nextImage, 8000); // 8 seconds
    }

    // Start immediately
    startSlideshow();
}

// ==========================================
// 12. TERMS OF USE MODAL LOGIC
// ==========================================
window.openTermsModal = function(e) {
    if (e) {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
    }
    const termsModal = document.getElementById('terms-modal');
    if (termsModal) {
        termsModal.classList.add('active');
    }
};

window.closeTermsModal = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const termsModal = document.getElementById('terms-modal');
    if (termsModal) {
        termsModal.classList.remove('active');
    }
};

function initTermsModal() {
    const termsModal = document.getElementById('terms-modal');
    const closeTermsModalBtn = document.getElementById('close-terms-modal-btn');
    const acceptTermsBtn = document.getElementById('accept-terms-btn');

    // Attach click event to all "Termos de Serviço" or "Termos de Uso" links
    document.querySelectorAll('a').forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        if (text.includes('termos de serviço') || text.includes('termos de uso') || text.includes('termos')) {
            link.addEventListener('click', (e) => {
                window.openTermsModal(e);
            });
        }
    });

    if (closeTermsModalBtn) {
        closeTermsModalBtn.addEventListener('click', window.closeTermsModal);
    }

    if (acceptTermsBtn) {
        acceptTermsBtn.addEventListener('click', window.closeTermsModal);
    }

    if (termsModal) {
        termsModal.addEventListener('click', (e) => {
            if (e.target === termsModal) {
                window.closeTermsModal();
            }
        });
    }

    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && termsModal && termsModal.classList.contains('active')) {
            window.closeTermsModal();
        }
    });
}

// ==========================================
// 13. PRODUCT DETAILS & REVIEWS MODALS LOGIC
// ==========================================
let currentSelectedProductId = null;
let currentWriteRating = 5;

// TASK 1: Render transparent star SVGs (always outline)
function renderAlwaysTransparentStars(container) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "15");
        svg.setAttribute("height", "15");
        svg.setAttribute("stroke", "#f59e0b");
        svg.setAttribute("stroke-width", "1.8");
        svg.setAttribute("fill", "transparent");
        svg.innerHTML = `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>`;
        container.appendChild(svg);
    }
}

// MODAL 1: REVIEWS LIST (SCREENSHOT 1)
window.openReviewsListModal = function(pluginId) {
    if (pluginId) currentSelectedProductId = pluginId;
    const plugin = products.find(p => p.id === currentSelectedProductId);
    
    const reviews = plugin && plugin.reviews ? plugin.reviews : [];
    const count = reviews.length;
    const avgScore = count > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1)
        : '0.0';

    // Update Modal 1 Summary Elements
    const avgScoreEl = document.getElementById('rm-avg-score');
    const countTextEl = document.getElementById('rm-count-text');
    const feedContainer = document.getElementById('rm-feed-container');
    const starsRow = document.getElementById('rm-avg-stars');

    if (avgScoreEl) avgScoreEl.textContent = avgScore;
    if (countTextEl) countTextEl.textContent = `Baseada em ${count} avaliações`;

    if (starsRow) {
        starsRow.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const span = document.createElement('span');
            span.textContent = '★';
            if (i <= Math.round(parseFloat(avgScore))) {
                span.className = 'filled-star';
            }
            starsRow.appendChild(span);
        }
    }

    // Render Feed or Empty state
    if (feedContainer) {
        feedContainer.innerHTML = '';
        if (count === 0) {
            feedContainer.innerHTML = `
                <div style="text-align: center; color: #9ca3af; padding: 30px 0;">
                    <p style="margin: 0; font-size: 0.95rem;">Não há nenhuma avaliação para este plugin ainda.</p>
                </div>
            `;
        } else {
            feedContainer.style.alignItems = 'stretch';
            feedContainer.style.justifyContent = 'flex-start';
            reviews.forEach(r => {
                const item = document.createElement('div');
                item.className = 'pd-review-item';
                let starsHtml = '';
                for (let i = 1; i <= 5; i++) {
                    starsHtml += i <= r.rating ? '★' : '☆';
                }
                item.innerHTML = `
                    <div class="pd-review-header">
                        <span class="pd-review-author">${r.author}</span>
                        <span class="pd-review-date">${r.date}</span>
                    </div>
                    <div class="pd-review-stars">${starsHtml}</div>
                    <p class="pd-review-text">${r.text}</p>
                `;
                feedContainer.appendChild(item);
            });
        }
    }

    // Open Modal 1
    const modal = document.getElementById('plugin-reviews-modal');
    if (modal) modal.classList.add('active');
};

window.closeReviewsListModal = function() {
    const modal = document.getElementById('plugin-reviews-modal');
    if (modal) modal.classList.remove('active');
};

// MODAL 2: WRITE REVIEW FORM (SCREENSHOT 2)
window.openWriteReviewModal = function() {
    // TASK 1: Require login/registration to post a review
    const isLoggedIn = localStorage.getItem('lead_user_logged_in') === 'true' || window.isLoggedIn === true;
    
    if (!isLoggedIn) {
        window.closeReviewsListModal();
        window.closeProductDetailsModal();
        
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.classList.add('active');
        }
        
        alert('Você precisa estar logado para enviar uma avaliação! Faça seu login ou cadastre-se.');
        return;
    }

    const modal = document.getElementById('write-review-modal');
    if (modal) modal.classList.add('active');
    selectWriteReviewStar(5);
};

window.closeWriteReviewModal = function() {
    const modal = document.getElementById('write-review-modal');
    if (modal) modal.classList.remove('active');
};

window.selectWriteReviewStar = function(rating) {
    currentWriteRating = rating;
    updateStarPickerUI(rating);
};

window.hoverWriteReviewStar = function(rating) {
    updateStarPickerUI(rating);
};

window.resetWriteReviewStarHover = function() {
    updateStarPickerUI(currentWriteRating);
};

function updateStarPickerUI(rating) {
    const picker = document.getElementById('w-star-picker');
    if (!picker) return;
    const stars = picker.querySelectorAll('span');
    stars.forEach((star, idx) => {
        if (idx < rating) {
            star.classList.add('active-w-star');
        } else {
            star.classList.remove('active-w-star');
        }
    });
}

window.updateReviewCharCount = function(textarea) {
    const counter = document.getElementById('w-char-counter');
    if (counter && textarea) {
        counter.textContent = `${textarea.value.length}/60`;
    }
};

window.getCurrentUsername = function() {
    let name = localStorage.getItem('lead_user_name');
    if (!name) {
        const email = localStorage.getItem('lead_user_email');
        if (email) {
            name = email.split('@')[0];
        }
    }
    return name || 'FelipeValerio';
};

window.handleUserLogin = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const emailInput = document.getElementById('login-email');
    const emailVal = emailInput ? emailInput.value.trim() : '';

    let username = emailVal;
    if (emailVal.includes('@')) {
        username = emailVal.split('@')[0];
    }
    if (!username) username = 'FelipeValerio';

    localStorage.setItem('lead_user_logged_in', 'true');
    localStorage.setItem('lead_user_email', emailVal || 'cliente@lead.com');
    localStorage.setItem('lead_user_name', username);
    window.isLoggedIn = true;

    const loginModal = document.getElementById('login-modal');
    if (loginModal) loginModal.classList.remove('active');

    alert(`Bem-vindo, ${username}! Login efetuado com sucesso.`);

    if (typeof renderReviewsMarquee === 'function') {
        renderReviewsMarquee();
    }
};

window.handleWriteReviewSubmit = function(e) {
    if (e) e.preventDefault();
    const plugin = products.find(p => p.id === currentSelectedProductId);
    if (!plugin) return;

    const textInput = document.getElementById('w-review-text');
    const text = textInput ? textInput.value.trim() : '';

    if (!plugin.reviews) plugin.reviews = [];

    const authorName = window.getCurrentUsername();
    const newReview = {
        productId: plugin.id,
        productName: plugin.name,
        productImage: plugin.image,
        author: authorName,
        rating: currentWriteRating,
        date: "há 1 min",
        text: text || "Excelente plugin! Atendeu todas as expectativas do servidor."
    };

    plugin.reviews.unshift(newReview);

    // Persist custom user review
    const customReviews = JSON.parse(localStorage.getItem('lead_custom_reviews') || '[]');
    customReviews.unshift(newReview);
    localStorage.setItem('lead_custom_reviews', JSON.stringify(customReviews));

    if (textInput) textInput.value = '';
    updateReviewCharCount({ value: '' });

    closeWriteReviewModal();

    if (typeof renderReviewsMarquee === 'function') {
        renderReviewsMarquee();
    }
    openReviewsListModal(plugin.id);
};

window.switchDetailsTab = function(tabName, btn) {
    const pills = document.querySelectorAll('.pd-pill-tab');
    pills.forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const mainContent = document.querySelector('.pd-main-content');
    const demoSection = document.getElementById('pd-demo-section');

    if (tabName === 'demonstracao' && demoSection && mainContent) {
        demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tabName === 'geral' && mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

window.openPluginDetails = function(id) {
    const plugin = products.find(p => p.id === id);
    if (!plugin) return;

    currentSelectedProductId = plugin.id;

    // Populate Sidebar Elements (Screenshot 1)
    const infoImg = document.getElementById('pd-info-img');
    const infoTitle = document.getElementById('pd-info-title');
    const infoSales = document.getElementById('pd-info-sales');
    const infoDesc = document.getElementById('pd-info-desc');

    if (infoImg) infoImg.src = plugin.image + '?v=10';
    if (infoTitle) infoTitle.textContent = plugin.name;
    if (infoSales) infoSales.textContent = window.formatProductSales(plugin);
    if (infoDesc) {
        infoDesc.textContent = plugin.description || `${plugin.name} é um plugin completo de duelos para Minecraft, com múltiplas arenas, apostas, menus configuráveis, ranking, camarote, busca automática de oponentes, placeholders e integração com LeafMito.`;
    }

    // Populate Hero Elements (Screenshot 1)
    const heroTitle = document.getElementById('pd-hero-title-text');
    const heroDesc = document.getElementById('pd-hero-desc-text');
    const introPara = document.getElementById('pd-intro-paragraph-text');
    const demoImg = document.getElementById('pd-demo-img');

    if (heroTitle) heroTitle.textContent = plugin.name;
    if (heroDesc) {
        heroDesc.textContent = `Um sistema completo para transformar ${plugin.name} em uma experiência competitiva, configurável e pronta para servidores que querem o melhor desempenho.`;
    }
    if (introPara) {
        introPara.textContent = `O ${plugin.name} foi reformulado para entregar duelos mais modernos, estáveis e fáceis de configurar, com melhorias profundas em menus, comandos, arenas, apostas, inventário, mensagens, placeholders e integrações.`;
    }
    if (demoImg) {
        demoImg.src = plugin.image + '?v=10';
    }

    // Reset tabs to Geral by default
    const pills = document.querySelectorAll('.pd-pill-tab');
    pills.forEach((p, idx) => {
        if (idx === 0) p.classList.add('active');
        else p.classList.remove('active');
    });

    // CTA Button setup
    const actionBtn = document.getElementById('pd-action-btn');
    const actionLabel = document.getElementById('pd-action-label');
    if (actionBtn) {
        if (plugin.isFree) {
            if (actionLabel) actionLabel.textContent = "Baixar Grátis";
            actionBtn.onclick = function() {
                window.downloadFreePlugin(plugin.id);
                closeProductDetailsModal();
            };
        } else {
            if (actionLabel) actionLabel.textContent = "Adicionar ao Carrinho";
            actionBtn.onclick = function() {
                addToCart(plugin.id);
                closeProductDetailsModal();
            };
        }
    }

    // Open Modal
    const modal = document.getElementById('product-details-modal');
    if (modal) {
        modal.classList.add('active');
    }
};

window.closeProductDetailsModal = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const modal = document.getElementById('product-details-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

// ESC key closes modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        window.closeProductDetailsModal();
        window.closeReviewsListModal();
        window.closeWriteReviewModal();
    }
});

// Click outside closes modals
['product-details-modal', 'plugin-reviews-modal', 'write-review-modal'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});

// ==========================================
// REVIEWS MARQUEE CAROUSEL ("O que nossos usuários pensam")
// ==========================================
function renderReviewsMarquee() {
    const track = document.getElementById('reviews-track');
    if (!track) return;

    const loggedUser = window.getCurrentUsername ? window.getCurrentUsername() : 'FelipeValerio';

    const defaultList = [
        {
            productId: 3,
            productName: "yCustomItems",
            productImage: "images/plugin-ycustomitems.png",
            rating: 5,
            text: "Designs excelentes! Pra quem precisa de itens configuráveis este produto é ótimo!",
            author: "zGravityy",
            date: "há 7 dias"
        },
        {
            productId: 1,
            productName: "yBaterPonto",
            productImage: "images/plugin-ybaterponto.png",
            rating: 5,
            text: "Bem otimizado o sistema, não tenho nada a reclamar!",
            author: "MRK",
            date: "há 7 dias"
        },
        {
            productId: 2,
            productName: "yEmpregos",
            productImage: "images/plugin-yempregos.png",
            rating: 5,
            text: "Os jogadores amaram o sistema de profissões e economia. Recomendo muito!",
            author: "DevMinecraftBR",
            date: "há 3 dias"
        },
        {
            productId: 4,
            productName: "LEAD Anti-Cheat Pro",
            productImage: "images/minecraft-hero-banner.jpg",
            rating: 5,
            text: "Zerou todos os problemas com trapaças no servidor. Nota 10/10!",
            author: "AdminServer",
            date: "há 1 dia"
        },
        {
            productId: 5,
            productName: "Plugin Lobby VIP",
            productImage: "images/hero-slide-3.png",
            rating: 5,
            text: "Efeitos visuais sensacionais no lobby. Meus VIPs ficaram muito satisfeitos!",
            author: "LobbyKing",
            date: "há 5 dias"
        }
    ];

    const customReviews = JSON.parse(localStorage.getItem('lead_custom_reviews') || '[]');

    // Combine custom reviews with default list
    const combinedList = [...customReviews, ...defaultList];
    const fullList = [...combinedList, ...combinedList];

    track.innerHTML = '';
    fullList.forEach(item => {
        const card = document.createElement('div');
        card.className = 'review-user-card';
        card.innerHTML = `
            <div class="ru-header">
                <img src="${item.productImage}" alt="${item.productName}" class="ru-product-img">
                <div class="ru-product-meta">
                    <h4 class="ru-product-title">${item.productName}</h4>
                    <div class="ru-stars">
                        <span>★★★★★</span>
                        <span class="ru-rating-num">${item.rating}</span>
                    </div>
                </div>
                <button class="ru-details-btn" onclick="openPluginDetails(${item.productId})" title="Ver plugin">
                    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
            </div>
            <div class="ru-quote-box">
                <p class="ru-quote-text">"${item.text}"</p>
            </div>
            <div class="ru-author-footer">
                <div class="ru-author-avatar-wrapper">
                    <span class="ru-avatar">👤</span>
                    <span class="ru-v-badge">✔</span>
                </div>
                <div class="ru-author-info">
                    <span class="ru-author-name">${item.author}</span>
                    <span class="ru-author-date">${item.date}</span>
                </div>
            </div>
        `;
        track.appendChild(card);
    });
}

// Pixelated Purple Particle Generator for LEAD Logo
function initLogoParticles() {
    const wrappers = document.querySelectorAll('.logo-wrapper');
    if (!wrappers.length) return;

    wrappers.forEach(wrapper => {
        if (wrapper.querySelector('.logo-particles-canvas')) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'logo-particles-canvas';
        wrapper.insertBefore(canvas, wrapper.firstChild);

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        let width = 0;
        let height = 0;
        let particles = [];
        let isHovered = false;

        function resize() {
            const rect = wrapper.getBoundingClientRect();
            const margin = 20;
            canvas.width = Math.round((rect.width || 120) + margin * 2);
            canvas.height = Math.round((rect.height || 30) + margin * 2);
            width = canvas.width;
            height = canvas.height;
            canvas.style.top = `-${margin}px`;
            canvas.style.left = `-${margin}px`;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        }

        resize();
        window.addEventListener('resize', resize);

        const colors = ['#a855f7', '#c084fc', '#e9d5ff', '#9333ea', '#6f42fb', '#ffffff', '#d8b4fe'];

        function createParticle(burst = false) {
            const margin = 20;
            const size = Math.random() < 0.35 ? 3 : (Math.random() < 0.65 ? 2 : 4);
            const x = margin + Math.random() * (width - margin * 2);
            const y = margin + (height - margin * 2) * (0.3 + Math.random() * 0.7);

            return {
                x: x,
                y: y,
                size: size,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * (burst ? 2.2 : 0.8),
                vy: -(Math.random() * (burst ? 1.8 : 1.0) + 0.4),
                alpha: 1,
                decay: Math.random() * 0.02 + 0.012
            };
        }

        wrapper.parentElement.addEventListener('mouseenter', () => {
            isHovered = true;
            for (let i = 0; i < 20; i++) {
                particles.push(createParticle(true));
            }
        });

        wrapper.parentElement.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        let frameCount = 0;

        function animate() {
            frameCount++;
            ctx.clearRect(0, 0, width, height);

            if (frameCount % 4 === 0 || (isHovered && frameCount % 2 === 0)) {
                if (particles.length < (isHovered ? 45 : 22)) {
                    particles.push(createParticle(isHovered));
                }
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;

                if (p.alpha <= 0 || p.y < 0 || p.x < 0 || p.x > width) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.fillStyle = p.color;
                ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
            }

            requestAnimationFrame(animate);
        }

        // Delay initial resize slightly to ensure images are loaded
        setTimeout(resize, 100);
        animate();
    });
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderProducts();
    renderReviewsMarquee();
    updateCartUI();
    initHeroSlideshow();
    initTermsModal();
    initLogoParticles();
    initGlassCards();
});

/* ==========================================
   GLASS CARDS INTERACTIVITY
========================================== */
function initGlassCards() {
    const cards = document.querySelectorAll('.glass-card');
    const mainImg = document.getElementById('glass-main-img');

    if (!cards.length || !mainImg) return;

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Remove active from all
            cards.forEach(c => c.classList.remove('active'));
            // Add active to current
            card.classList.add('active');

            // Change image with fade effect
            const newImgSrc = card.getAttribute('data-img');
            if (mainImg.getAttribute('src') !== newImgSrc) {
                mainImg.classList.add('fade-out');
                setTimeout(() => {
                    mainImg.src = newImgSrc;
                    mainImg.classList.remove('fade-out');
                }, 150); // half of CSS transition time
            }
        });
    });
}
