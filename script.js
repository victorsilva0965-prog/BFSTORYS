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

        // --- DESTRAVAMENTO TOTAL DE TOQUE E SCROLL ---
        const modal = document.getElementById('lock-screen');
        if (modal) modal.remove();
        
        // Garante que o corpo e o documento aceitem cliques novamente
        document.body.style.overflow = 'auto';
        document.body.style.pointerEvents = 'auto';
        document.documentElement.style.pointerEvents = 'auto';

        // VERIFICA MANUTENÇÃO
        if (data.status === "manutencao") {
            bloquearAcesso();
            return;
        }

        // CARREGA PRODUTOS (Lê da chave 'estoque')
        db = data.estoque.map(p => new Produto(p.id, p.nome, p.preco, p.tipo, p.link, p.specs, p.imgs));
        render(db);
    } catch (e) { console.error("Erro:", e); }
}

function bloquearAcesso() {
    if (document.getElementById('lock-screen')) return;
    const lock = document.createElement('div');
    lock.id = 'lock-screen';
    Object.assign(lock.style, {
        position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
        backgroundColor: '#0a0b1a', zIndex: '99999', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        color: 'white', textAlign: 'center', pointerEvents: 'all'
    });
    lock.innerHTML = `
        <div style="padding:20px; font-family:sans-serif;">
            <div style="font-size:60px;">🛠️</div>
            <h2 style="color:#00d2ff;">Loja em Manutenção</h2>
            <p>Estamos atualizando a BF Vendas.</p>
            <button onclick="location.reload()" style="margin-top:20px; padding:12px 25px; border-radius:25px; background:#00d2ff; border:none; font-weight:bold; cursor:pointer; color:#000;">Verificar Agora</button>
        </div>
    `;
    document.body.appendChild(lock);
    document.body.style.overflow = 'hidden';
}

function render(lista) {
    const vitrine = document.getElementById('vitrine');
    if (!vitrine) return;
    vitrine.innerHTML = lista.map(p => `
        <div class="product-card" onclick="openModal('${p.id}')">
            <img src="${p.imgs[0]}" alt="${p.nome}">
            <h3>${p.nome}</h3>
            <p style="color:var(--primary); font-weight:bold;">${p.preco}</p>
        </div>
    `).join('');
}

// Inicializa
carregarDados();
