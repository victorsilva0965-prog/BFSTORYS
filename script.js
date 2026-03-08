// Classe padrão para manter a organização
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

// CARREGAMENTO DOS DADOS (Sincronizado com o formato do seu produtos.json)
async function carregarDados() {
    try {
        const response = await fetch('produtos.json?v=' + Date.now());
        const data = await response.json();

        // Detecta se é a lista direta ou se está dentro de 'estoque'
        const listaBruta = Array.isArray(data) ? data : (data.estoque || []);

        db = listaBruta.map(p => new Produto(
            p.id, p.nome, p.preco, p.tipo, p.link, p.specs, p.imgs
        ));

        render(db);
    } catch (e) {
        console.error("Erro na comunicação com o JSON:", e);
    }
}

// RENDERIZAÇÃO (Usa as classes do seu CSS: .product-card, .id-badge)
function render(lista) {
    const vitrine = document.getElementById('vitrine');
    if (!vitrine) return;

    vitrine.innerHTML = lista.map(p => `
        <div class="product-card" onclick="openModal('${p.id}')">
            <span class="id-badge">#${p.id}</span>
            <img src="${p.imgs[0] || 'https://via.placeholder.com/500'}" onerror="this.src='https://via.placeholder.com/500'">
            <h3>${p.nome}</h3>
            <p style="color:var(--primary); font-weight:800;">${p.preco}</p>
        </div>
    `).join('');
}

// FUNÇÃO DE BUSCA (Conectada ao onkeyup="searchProduct()" do seu HTML)
function searchProduct() {
    const term = document.getElementById('searchID').value.toLowerCase();
    const filtrados = db.filter(p => 
        p.nome.toLowerCase().includes(term) || p.id.toLowerCase().includes(term)
    );
    render(filtrados);
}

// FUNÇÃO DE FILTRO (Conectada ao onclick="filterCat()" das categorias)
function filterCat(tipo, elemento) {
    document.querySelectorAll('.cat-item').forEach(i => i.classList.remove('active'));
    elemento.classList.add('active');

    if (tipo === 'todos') {
        render(db);
    } else {
        render(db.filter(p => p.tipo === tipo));
    }
}

// MODAL (Usa as IDs do seu HTML: mTitle, mPrice, mSpecs, mShopeeBtn)
function openModal(id) {
    const p = db.find(i => i.id === id);
    if (!p) return;

    tempProduct = p;
    document.getElementById('mTitle').innerText = p.nome;
    document.getElementById('mPrice').innerText = p.preco;
    document.getElementById('mSpecs').innerText = p.specs;

    // Foto no Carousel
    document.getElementById('carousel').innerHTML = `<img src="${p.imgs[0]}" style="width:100%">`;

    // Lógica do Botão Shopee
    const btnShopee = document.getElementById('mShopeeBtn');
    if (p.link && p.link !== "#") {
        btnShopee.href = p.link;
        btnShopee.style.display = "flex";
    } else {
        btnShopee.style.display = "none";
    }

    document.getElementById('modalOverlay').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Evita rolar a página atrás
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// SIDEBAR (Conectada ao toggleMenu() e overlay do HTML)
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('open');
    overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}

// CARRINHO (Botão flutuante e contador)
function addToCart() {
    if (tempProduct && !cart.some(item => item.id === tempProduct.id)) {
        cart.push(tempProduct);
        document.getElementById('cart-counter').innerText = cart.length;
        document.getElementById('cart-fab').style.display = 'flex';
    }
    closeModal();
}

// ENVIO WHATSAPP (Ação do FAB verde)
function sendOrder() {
    const msg = "Olá! Gostaria desses itens:\n" + cart.map(i => `- ${i.nome} (#${i.id})`).join('\n');
    window.open(`https://wa.me/558788044077?text=${encodeURIComponent(msg)}`);
}

// Inicialização automática
window.onload = carregarDados;
