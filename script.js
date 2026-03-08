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
        const dados = await response.json();

        // DESTRAVAMENTO DE INTERAÇÃO
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        document.documentElement.style.pointerEvents = 'auto';

        // Lógica de compatibilidade: aceita tanto Lista [] quanto Objeto {estoque:[]}
        const listaBruta = Array.isArray(dados) ? dados : (dados.estoque || []);
        
        db = listaBruta.map(p => new Produto(
            p.id, p.nome, p.preco, p.tipo, p.link, p.specs, p.imgs
        ));

        render(db);
        console.log("Vitrine carregada com sucesso.");
    } catch (e) {
        console.error("Erro ao carregar banco de dados:", e);
    }
}

function render(lista) {
    const vitrine = document.getElementById('vitrine');
    if (!vitrine) return;
    
    if (lista.length === 0) {
        vitrine.innerHTML = "<p style='grid-column:1/-1; text-align:center; padding:50px;'>Nenhum item disponível no momento.</p>";
        return;
    }

    vitrine.innerHTML = lista.map(p => `
        <div class="product-card" onclick="openModal('${p.id}')">
            <span class="id-badge">#${p.id}</span>
            <img src="${p.imgs[0]}" onerror="this.src='https://via.placeholder.com/500'">
            <h3>${p.nome}</h3>
            <p style="color:var(--primary); font-weight:bold;">${p.preco}</p>
        </div>
    `).join('');
}

// Inicia o processo
carregarDados();

// Funções de Menu (Mantendo seu layout original)
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}
