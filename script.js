
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

// Imagem padrão caso o bot não encontre uma foto ou o link quebre
const imgFallback = "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500";
let db = []; 
let cart = [];
let tempProduct = null;

/**
 * FUNÇÃO DE CARREGAMENTO (Sincronizada com o Bot Python)
 * Adicionamos um carimbo de data/hora (?v=) para garantir que o navegador
 * baixe o arquivo 'produtos.json' novo que o bot acabou de enviar ao GitHub.
 */
async function carregarDados() {
    try {
        // O Date.now() evita que o cliente veja preços antigos por causa do cache
        const response = await fetch('produtos.json?v=' + Date.now());
        const dados = await response.json();
        
        // Mapeia o JSON gerado pelo bot.py para a classe Produto
        db = dados.map(p => new Produto(
            p.id, 
            p.nome, 
            p.preco, 
            p.tipo, 
            p.link, 
            p.specs, 
            p.imgs
        ));
        
        render(db);
    } catch (error) {
        console.error("Erro ao carregar banco de dados do KobiStudio:", error);
    }
}

/**
 * RENDERIZAÇÃO DA VITRINE
 * Note que p.imgs[0] agora pode ser um link direto do Google Imagens (via SerpApi)
 */
function render(lista) {
    const vitrine = document.getElementById('vitrine');
    if (!vitrine) return;

    if (lista.length === 0) {
        vitrine.innerHTML = "<p style='color:gray; text-align:center;'>Nenhum item encontrado.</p>";
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
    // Gera as imagens do modal (suporta as fotos automáticas do bot)
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
    const msg = "Olá! Gostaria de verificar a disponibilidade dos seguintes itens:\n\n" + 
                cart.map(i => `• ${i.nome} (ID: ${i.id}) - ${i.preco}`).join('\n') +
                "\n\nVi no catálogo online da BFSTORYS.";
    
    // Seu número de Serra Talhada configurado
    window.open(`https://wa.me/558788044077?text=${encodeURIComponent(msg)}`);
}

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}

function toggleTheme() { 
    document.body.classList.toggle('dark-mode'); 
    toggleMenu(); 
}

// Inicializa o site buscando os dados que o bot.py enviou para o GitHub
carregarDados();