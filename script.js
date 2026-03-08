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

        if (data.status === "manutencao") {
            bloquearAcesso();
            return;
        }

        // Se online, limpa bloqueios e renderiza
        const modal = document.getElementById('lock-screen');
        if (modal) modal.remove();
        document.body.style.overflow = 'auto';

        db = data.estoque.map(p => new Produto(p.id, p.nome, p.preco, p.tipo, p.link, p.specs, p.imgs));
        render(db);
    } catch (e) { console.error("Erro KobiStudio:", e); }
}

function bloquearAcesso() {
    if (document.getElementById('lock-screen')) return;
    const lock = document.createElement('div');
    lock.id = 'lock-screen';
    Object.assign(lock.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        backgroundColor: '#0a0b1a', zIndex: '99999', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white'
    });
    lock.innerHTML = `
        <img src="https://cdn-icons-png.flaticon.com/512/3246/3246824.png" width="80">
        <h2 style="color:#00d2ff; margin:20px 0;">Loja em Manutenção</h2>
        <p>Estamos atualizando o estoque da BF Vendas.</p>
        <button onclick="location.reload()" style="margin-top:20px; padding:10px 20px; border-radius:20px; background:#00d2ff; border:none; font-weight:bold;">Verificar Agora</button>
    `;
    document.body.appendChild(lock);
    document.body.style.overflow = 'hidden';
}

function render(lista) {
    const vitrine = document.getElementById('vitrine');
    vitrine.innerHTML = lista.map(p => `
        <div class="product-card">
            <img src="${p.imgs[0]}" alt="${p.nome}">
            <h3>${p.nome}</h3>
            <p>${p.preco}</p>
        </div>
    `).join('');
}

carregarDados();
