class Produto {
    constructor(id, nome, preco, tipo, link, specs, imgs) {
        this.id = id; this.nome = nome; this.preco = preco;
        this.tipo = tipo; this.link = link; this.specs = specs; this.imgs = imgs;
    }
}

let db = [];
let cart = [];

async function carregarDados() {
    try {
        // O v=Date.now() força o navegador a buscar a versão mais nova do GitHub
        const response = await fetch('produtos.json?v=' + Date.now());
        const dados = await response.json();
        
        // CORREÇÃO CRÍTICA: Acessa a lista dentro de 'estoque'
        const listaProdutos = dados.estoque || [];
        
        db = listaProdutos.map(p => new Produto(
            p.id, p.nome, p.preco, p.tipo, p.link, p.specs, p.imgs
        ));

        render(db);
        console.log("✅ Sistema restabelecido com " + db.length + " itens.");
    } catch (e) {
        console.error("❌ Erro ao ler produtos.json:", e);
    }
}

function render(lista) {
    const vitrine = document.getElementById('vitrine');
    if (!vitrine) return;
    
    if (lista.length === 0) {
        vitrine.innerHTML = "<p style='text-align:center; padding:20px;'>Nenhum produto encontrado.</p>";
        return;
    }

    vitrine.innerHTML = lista.map(p => `
        <div class="product-card" onclick="openModal('${p.id}')">
            <span class="id-badge">#ID ${p.id}</span>
            <img src="${p.imgs[0]}" onerror="this.src='https://via.placeholder.com/500'" alt="${p.nome}">
            <h3>${p.nome}</h3>
            <p style="color:var(--primary); font-weight:bold;">${p.preco}</p>
        </div>
    `).join('');
}

// Inicializa o site assim que carregar
carregarDados();

// Funções de interface originais
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if(sidebar) sidebar.classList.toggle('open');
    if(overlay) overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}
