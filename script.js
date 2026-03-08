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

const imgFallback = "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500";
let db = []; 
let cart = [];
let tempProduct = null;

/**
 * CARREGAMENTO E CONTROLO DE MANUTENÇÃO
 * Esta função limpa qualquer bloqueio antes de renderizar a loja.
 */
async function carregarDados() {
    try {
        const response = await fetch('produtos.json?v=' + Date.now());
        const data = await response.json();
        
        const vitrine = document.getElementById('vitrine');
        const searchBox = document.querySelector('.search-box');

        // --- DESTRAVAMENTO AUTOMÁTICO ---
        // Remove o modal de bloqueio se ele existir
        const modalAtivo = document.getElementById('lock-screen');
        if (modalAtivo) {
            modalAtivo.remove();
        }
        // Devolve o controlo de scroll e toque ao utilizador
        document.body.style.overflow = 'auto';

        // VERIFICA SE DEVE ATIVAR A MANUTENÇÃO
        if (data.status === "manutencao") {
            if (searchBox) searchBox.style.display = 'none';
            exibirBloqueioTotal();
            return; 
        }

        // SE ESTIVER ONLINE: Carrega o estoque
        db = data.estoque.map(p => new Produto(
            p.id, p.nome, p.preco, p.tipo, p.link, p.specs, p.imgs
        ));
        
        if (searchBox) searchBox.style.display = 'flex';
        render(db);

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

/**
 * CRIA O MODAL DE BLOQUEIO
 */
function exibirBloqueioTotal() {
    if (document.getElementById('lock-screen')) return;

    const lock = document.createElement('div');
    lock.id = 'lock-screen';
    
    // Estilos para cobrir 100% da tela e impedir interações
    Object.assign(lock.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        backgroundColor: '#0a0b1a', zIndex: '99999', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
        color: 'white', textAlign: 'center', padding: '20px'
    });

    lock.innerHTML = `
        <div style="max-width:400px; font-family: sans-serif;">
            <div style="font-size:70px; margin-bottom:20px;">🛠️</div>
            <h2 style="color:#00d2ff; margin-bottom:15px;">Loja em Manutenção</h2>
            <p style="line-height:1.6;">Estamos a atualizar o estoque da <b>BF Vendas</b> para lhe trazer novidades.</p>
            <button onclick="location.reload()" style="
                margin-top:25px; padding:12px 30px; border-radius:25px; 
                background:#00d2ff; border:none; font-weight:bold; cursor:pointer;
                box-shadow: 0 4px 15px rgba(0,210,255,0.3);
            ">Verificar Agora</button>
        </div>
    `;

    document.body.appendChild(lock);
    document.body.style.overflow = 'hidden'; // Trava o scroll
}

function render(lista) {
    const vitrine = document.getElementById('vitrine');
    if (!vitrine) return;

    if (lista.length === 0) {
        vitrine.innerHTML = "<p style='color:gray; text-align:center; width:100%;'>Nenhum item disponível.</p>";
        return;
    }

    vitrine.innerHTML = lista.map(p => `
        <div class="product-card" onclick="openModal('${p.id}')">
            <span class="id-badge">#ID ${p.id}</span>
            <img src="${p.imgs[0]}" onerror="this.src='${imgFallback}'" alt="${p.nome}">
            <h3>${p.nome}</h3>
            <p style="color:var(--primary); font-weight:800; margin:0;">${p.preco}</p>
        </div>
    `).join('');
}

// ... (Podes manter as tuas funções de openModal, addToCart e sendOrder abaixo)

carregarDados();
