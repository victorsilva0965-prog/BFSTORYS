class Produto {
    constructor(id, nome, preco, tipo, link, specs, imgs) {
        this.id = id; this.nome = nome; this.preco = preco;
        this.tipo = tipo; this.link = link; this.specs = specs; this.imgs = imgs;
    }
}

let db = [];

async function carregarDados() {
    try {
        const response = await fetch('produtos.json?v=' + Date.now());
        const data = await response.json();

        // Garante que a interface esteja sempre destravada
        document.body.style.overflow = 'auto';
        document.body.style.pointerEvents = 'auto';
        document.documentElement.style.pointerEvents = 'auto';

        // Carrega do 'estoque' (seja objeto ou lista corrigida)
        const listaProdutos = data.estoque || (Array.isArray(data) ? data : []);
        
        db = listaProdutos.map(p => new Produto(p.id, p.nome, p.preco, p.tipo, p.link, p.specs, p.imgs));
        render(db);
    } catch (e) {
        console.error("Erro ao carregar vitrine:", e);
    }
}

function render(lista) {
    const vitrine = document.getElementById('vitrine');
    if (!vitrine) return;
    
    vitrine.innerHTML = lista.map(p => `
        <div class="product-card" onclick="openModal('${p.id}')">
            <span class="id-badge">#ID ${p.id}</span>
            <img src="${p.imgs[0]}" onerror="this.src='https://via.placeholder.com/500'" alt="${p.nome}">
            <h3>${p.nome}</h3>
            <p style="color:var(--primary); font-weight:bold;">${p.preco}</p>
        </div>
    `).join('');
}

// Inicializa o site
carregarDados();

// Mantém as funções de navegação originais
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    if (overlay) overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}
