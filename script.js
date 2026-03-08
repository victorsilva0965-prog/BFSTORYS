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

        // --- DESTRAVAMENTO AGRESSIVO DE TOQUE E INTERAÇÃO ---
        const modal = document.getElementById('lock-screen');
        if (modal) modal.remove();
        
        // Remove travas de CSS que impedem o toque no menu e categorias
        document.body.style.overflow = 'auto';
        document.body.style.pointerEvents = 'auto';
        document.documentElement.style.pointerEvents = 'auto';
        document.body.style.userSelect = 'auto';

        // VERIFICA MANUTENÇÃO
        if (data.status === "manutencao") {
            bloquearAcesso();
            return;
        }

        // CARREGA PRODUTOS
        db = data.estoque.map(p => new Produto(p.id, p.nome, p.preco, p.tipo, p.link, p.specs, p.imgs));
        render(db);
    } catch (e) { 
        console.error("Erro ao carregar dados:", e); 
    }
}

function bloquearAcesso() {
    if (document.getElementById('lock-screen')) return;
    
    const lock = document.createElement('div');
    lock.id = 'lock-screen';
    
    // Estilos para bloquear interações durante manutenção
    Object.assign(lock.style, {
        position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
        backgroundColor: '#0a0b1a', zIndex: '99999', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        color: 'white', textAlign: 'center', pointerEvents: 'all'
    });

    lock.innerHTML = `
        <div style="padding:20px; font-family:sans-serif;">
            <div style="font-size:70px; margin-bottom:10px;">🛠️</div>
            <h2 style="color:#00d2ff; margin-bottom:15px;">Loja em Manutenção</h2>
            <p style="opacity:0.8;">Estamos atualizando o estoque da <b>BF Vendas</b>.</p>
            <button onclick="location.reload()" style="
                margin-top:25px; padding:12px 30px; border-radius:25px; 
                background:#00d2ff; border:none; font-weight:bold; cursor:pointer; color:#000;
            ">Verificar Agora</button>
        </div>
    `;
    
    document.body.appendChild(lock);
    document.body.style.overflow = 'hidden';
    // Impede toques no fundo enquanto o modal estiver ativo
    document.body.style.pointerEvents = 'none';
    lock.style.pointerEvents = 'auto'; // Permite toque apenas no modal
}

// Funções de Interface (Mantendo seu design original)
function render(lista) {
    const vitrine = document.getElementById('vitrine');
    if (!vitrine) return;
    vitrine.innerHTML = lista.map(p => `
        <div class="product-card" onclick="openModal('${p.id}')">
            <span class="id-badge">#ID ${p.id}</span>
            <img src="${p.imgs[0]}" alt="${p.nome}">
            <h3>${p.nome}</h3>
            <p style="color:var(--primary); font-weight:bold;">${p.preco}</p>
        </div>
    `).join('');
}

// Inicialização automática ao carregar a página
carregarDados();

// Funções auxiliares (Certifique-se de que estão no seu arquivo ou adicione aqui)
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    if (overlay) overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}
