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
 * CARREGAMENTO DINÂMICO (Sincronizado com o Interruptor do Bot Python)
 */
async function carregarDados() {
    try {
        const response = await fetch('produtos.json?v=' + Date.now());
        const data = await response.json();
        
        const vitrine = document.getElementById('vitrine');
        const searchBox = document.querySelector('.search-box');

        // VERIFICA STATUS DE MANUTENÇÃO
        if (data.status === "manutencao") {
            if (searchBox) searchBox.style.display = 'none';
            vitrine.innerHTML = `
                <div style="text-align:center; padding:60px 20px; color:var(--primary); width:100%;">
                    <div style="font-size:60px; margin-bottom:20px;">🛠️</div>
                    <h2 style="margin-bottom:10px;">Loja em Manutenção</h2>
                    <p style="color:var(--text); opacity:0.8;">
                        Estamos atualizando nosso estoque para trazer novidades.<br>
                        Voltamos em alguns instantes!
                    </p>
                    <button onclick="window.location.reload()" style="margin-top:20px; padding:10px 20px; border-radius:20px; border:none; background:var(--primary); color:white; font-weight:bold;">
                        Atualizar Página
                    </button>
                </div>
            `;
            return; 
        }

        // SE ESTIVER ONLINE: Mapeia o campo 'estoque' para a classe Produto
        db = data.estoque.map(p => new Produto(
            p.id, p.nome, p.preco, p.tipo, p.link, p.specs, p.imgs
        ));
        
        if (searchBox) searchBox.style.display = 'flex';
        render(db);
    } catch (error) {
        console.error("Erro ao carregar banco de dados do KobiStudio:", error);
        document.getElementById('vitrine').innerHTML = "<p style='text-align:center;'>Erro ao carregar produtos. Tente novamente.</p>";
    }
}

function render(lista) {
    const vitrine = document.getElementById('vitrine');
    if (!vitrine) return;

    if (lista.length === 0) {
        vitrine.innerHTML = "<p style='color:gray; text-align:center; width:100%;'>Nenhum item disponível no momento.</p>";
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

function openModal(id) {
    tempProduct = db.find(p => p.id === id);
    if (!tempProduct) return;

    const carousel = document.getElementById('carousel');
    carousel.innerHTML = tempProduct.imgs.map(img => `
        <img src="${img}" onerror="this.src='${imgFallback}'">
    `).join('');

    document.getElementById('mTitle').innerText = tempProduct.nome;
    document.getElementById('mPrice').innerText = tempProduct.preco;
    document.getElementById('mSpecs').innerHTML = `<b>Especificações:</b><br>${tempProduct.specs}`;
    document.getElementById('mShopeeBtn').href = tempProduct.link;
    document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() { 
    document.getElementById('modalOverlay').style.display = 'none'; 
}

function searchProduct() {
    const term = document.getElementById('searchID').value.toLowerCase();
    const filtrados = db.filter(p => 
        p.id.toLowerCase().includes(term) || 
        p.nome.toLowerCase().includes(term)
    );
    render(filtrados);
}

function filterCat(tipo, el) {
    document.querySelectorAll('.cat-item').forEach(i => i.classList.remove('active'));
    if(el) el.classList.add('active');
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
    const msg = "Olá! Gostaria de verificar a disponibilidade dos seguintes itens:\n\n" + 
                cart.map(i => `• ${i.nome} (ID: ${i.id}) - ${i.preco}`).join('\n') +
                "\n\nVi no catálogo online da BFSTORYS.";
    
    window.open(`https://wa.me/558788044077?text=${encodeURIComponent(msg)}`);
}

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    if (overlay) overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}

function toggleTheme() { 
    document.body.classList.toggle('dark-mode'); 
    toggleMenu(); 
}

// Inicia a aplicação
carregarDados();
