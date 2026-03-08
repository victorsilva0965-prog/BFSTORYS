class Produto {
    constructor(id, nome, preco, tipo, link, specs, imgs) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.tipo = tipo;
        this.link = link;
        this.specs = specs;
        this.imgs = imgs;
    }
}

let db = [];
let cart = [];
let tempProduct = null;

// 1. CARREGAMENTO DE DADOS
async function carregarDados() {
    try {
        const response = await fetch('produtos.json?v=' + Date.now());
        const dadosBrutos = await response.json();

        // Compatibilidade com os dois formatos de JSON
        const lista = Array.isArray(dadosBrutos) ? dadosBrutos : (dadosBrutos.estoque || []);

        db = lista.map(p => new Produto(
            p.id, p.nome, p.preco, p.tipo, 
            p.link || "#", p.specs || "Disponível", p.imgs || []
        ));

        render(db);
    } catch (e) {
        console.error("Erro ao carregar dados:", e);
        document.getElementById('vitrine').innerHTML = "<p>Erro ao carregar produtos.</p>";
    }
}

// 2. RENDERIZAÇÃO DA VITRINE
function render(lista) {
    const vitrine = document.getElementById('vitrine');
    if (!vitrine) return;

    if (lista.length === 0) {
        vitrine.innerHTML = "<p style='grid-column: 1/-1; text-align:center; padding: 50px; opacity: 0.5;'>Nenhum item encontrado.</p>";
        return;
    }

    vitrine.innerHTML = lista.map(p => `
        <div class="product-card" onclick="openModal('${p.id}')">
            <span class="id-badge">#${p.id}</span>
            <img src="${p.imgs[0] || 'https://via.placeholder.com/500'}" onerror="this.src='https://via.placeholder.com/500'">
            <h3>${p.nome}</h3>
            <p style="color:var(--primary); font-weight:800; font-size: 0.9rem;">${p.preco}</p>
        </div>
    `).join('');
}

// 3. FILTROS E BUSCA (Vinculados ao seu HTML)
function searchProduct() {
    const termo = document.getElementById('searchID').value.toLowerCase();
    const filtrados = db.filter(p => 
        p.nome.toLowerCase().includes(termo) || 
        p.id.toLowerCase().includes(termo)
    );
    render(filtrados);
}

function filterCat(tipo, elemento) {
    // Atualiza visual dos botões de categoria
    document.querySelectorAll('.cat-item').forEach(item => item.classList.remove('active'));
    elemento.classList.add('active');

    if (tipo === 'todos') {
        render(db);
    } else {
        const filtrados = db.filter(p => p.tipo === tipo);
        render(filtrados);
    }
}

// 4. MODAL E INTERAÇÃO
function openModal(id) {
    const p = db.find(i => i.id === id);
    if (!p) return;

    tempProduct = p;
    document.getElementById('mTitle').innerText = p.nome;
    document.getElementById('mPrice').innerText = p.preco;
    document.getElementById('mSpecs').innerText = p.specs;

    // Carousel Simples (primeira imagem)
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = `<img src="${p.imgs[0] || 'https://via.placeholder.com/500'}" style="width:100%; height:100%; object-fit:cover;">`;

    // Botão Shopee
    const btnShopee = document.getElementById('mShopeeBtn');
    if (p.link && p.link !== "#") {
        btnShopee.href = p.link;
        btnShopee.style.display = "flex";
    } else {
        btnShopee.style.display = "none";
    }

    document.getElementById('modalOverlay').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Trava scroll do fundo
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    document.body.style.overflow = 'auto'; // Destrava scroll
}

// 5. CARRINHO E WHATSAPP
function addToCart() {
    if (tempProduct && !cart.some(item => item.id === tempProduct.id)) {
        cart.push(tempProduct);
        document.getElementById('cart-counter').innerText = cart.length;
        document.getElementById('cart-fab').style.display = 'flex';
    }
    closeModal();
}

function sendOrder() {
    if (cart.length === 0) return;

    const texto = "Olá! Tenho interesse nos seguintes itens:\n\n" + 
        cart.map(i => `• ${i.nome} (#${i.id}) - ${i.preco}`).join('\n') +
        "\n\nAinda estão disponíveis?";
    
    const url = `https://wa.me/558788044077?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

// 6. MENU LATERAL (Sidebar)
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Inicialização
window.onload = carregarDados;
