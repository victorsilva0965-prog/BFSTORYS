class Produto {
    constructor(id, nome, preco, tipo, link, specs, imgs) {
        this.id = id; this.nome = nome; this.preco = preco; this.tipo = tipo; this.link = link; this.specs = specs; this.imgs = imgs;
    }
}

const imgFallback = "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500";
let db = []; // Começa vazio e será preenchido pelo JSON
let cart = [];
let tempProduct = null;

// FUNÇÃO AUTOMÁTICA: Busca os dados atualizados pelo Python
async function carregarDados() {
    try {
        const response = await fetch('produtos.json');
        const dados = await response.json();
        // Converte os dados do JSON para objetos da classe Produto
        db = dados.map(p => new Produto(p.id, p.nome, p.preco, p.tipo, p.link, p.specs, p.imgs));
        render(db);
    } catch (error) {
        console.error("Erro ao carregar banco de dados:", error);
    }
}

function render(lista) {
    const vitrine = document.getElementById('vitrine');
    if (!vitrine) return;
    vitrine.innerHTML = lista.map(p => `
        <div class="product-card" onclick="openModal('${p.id}')">
            <span class="id-badge">#ID ${p.id}</span>
            <img src="${p.imgs[0]}" onerror="this.src='${imgFallback}'">
            <h3>${p.nome}</h3>
            <p style="color:var(--primary); font-weight:800; margin:0;">${p.preco}</p>
        </div>
    `).join('');
}

function openModal(id) {
    tempProduct = db.find(p => p.id === id);
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = tempProduct.imgs.map(img => `<img src="${img}" onerror="this.src='${imgFallback}'">`).join('');
    document.getElementById('mTitle').innerText = tempProduct.nome;
    document.getElementById('mPrice').innerText = tempProduct.preco;
    document.getElementById('mSpecs').innerHTML = `<b>Especificações:</b><br>${tempProduct.specs}`;
    document.getElementById('mShopeeBtn').href = tempProduct.link;
    document.getElementById('modalOverlay').style.display = 'flex';
}

// Mantenha suas outras funções (searchProduct, filterCat, closeModal, addToCart, sendOrder, toggleMenu, toggleTheme) iguais

function closeModal() { document.getElementById('modalOverlay').style.display = 'none'; }

function searchProduct() {
    const term = document.getElementById('searchID').value.toLowerCase();
    render(db.filter(p => p.id.toLowerCase().includes(term) || p.nome.toLowerCase().includes(term)));
}

function filterCat(tipo, el) {
    document.querySelectorAll('.cat-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    render(tipo === 'todos' ? db : db.filter(p => p.tipo === tipo));
}

function addToCart() {
    if(!cart.some(item => item.id === tempProduct.id)) {
        cart.push(tempProduct);
        document.getElementById('cart-counter').innerText = cart.length;
        document.getElementById('cart-fab').style.display = 'flex';
    }
    closeModal();
}

function sendOrder() {
    const msg = "Olá gostaria de saber se há em estoque? \n\n *Item:* \n" + cart.map(i => `• ${i.nome} (ID: ${i.id})`).join('\n');
    window.open(`https://wa.me/558788044077?text=${encodeURIComponent(msg)}`);
}

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    const overlay = document.getElementById('overlay');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
}

function toggleTheme() { document.body.classList.toggle('dark-mode'); toggleMenu(); }

// Inicializa buscando os dados do arquivo editado pelo Python
carregarDados();
