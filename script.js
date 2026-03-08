class Produto {
    constructor(id, nome, preco, tipo, link, specs, imgs) {
        this.id = id; this.nome = nome; this.preco = preco;
        this.tipo = tipo; this.link = link; this.specs = specs; this.imgs = imgs;
    }
}

let db = [];

async function carregarDados() {
    try {
        // Busca a lista direta de produtos
        const response = await fetch('produtos.json?v=' + Date.now());
        const dadosBrutos = await response.json();

        // Se o bot mandou o formato novo por engano, ele corrige aqui também
        const lista = Array.isArray(dadosBrutos) ? dadosBrutos : dadosBrutos.estoque;

        db = lista.map(p => new Produto(p.id, p.nome, p.preco, p.tipo, p.link, p.specs, p.imgs));
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
            <span class="id-badge">#${p.id}</span>
            <img src="${p.imgs[0]}" onerror="this.src='https://via.placeholder.com/500'">
            <h3>${p.nome}</h3>
            <p style="color:var(--primary); font-weight:800;">${p.preco}</p>
        </div>
    `).join('');
}

// Abre o Modal com o Botão da Shopee restaurado
function openModal(id) {
    const p = db.find(i => i.id === id);
    if (!p) return;

    document.getElementById('mTitle').innerText = p.nome;
    document.getElementById('mPrice').innerText = p.preco;
    document.getElementById('mSpecs').innerText = p.specs;

    const btnShopee = document.getElementById('mShopeeBtn');
    if (p.link && p.link !== "#") {
        btnShopee.href = p.link;
        btnShopee.style.display = "block";
    } else {
        btnShopee.style.display = "none";
    }

    document.getElementById('modalOverlay').style.display = 'flex';
}

carregarDados();
        
