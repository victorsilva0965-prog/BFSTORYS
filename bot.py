import json
import requests
import os
import time

# --- CONFIGURAÇÕES KOBISTUDIO ---
CAMINHO_SITE = "/storage/emulated/0/SiteFB/produtos.json"
SERPAPI_KEY = "850a6148a8a6efabdf1615c1a1420be7ac0e83e65f28b87d967c6634fba9001d"

# --- DADOS DE ACESSO TIINY.HOST ---
SITE_URL = "bfstorys.tiiny.site" # O endereço do seu site
EMAIL_LOGIN = "viniciussilva3595@gmail.com"
SENHA_LOGIN = "SiteFBbot9"

def buscar_dados_br(nome_produto):
    """Busca Preço em R$ e Imagem Profissional"""
    print(f"  🔍 Sincronizando: {nome_produto}...")
    params = {
        "engine": "google_shopping",
        "q": nome_produto,
        "location": "Brazil",
        "hl": "pt", "gl": "br", "currency": "BRL",
        "api_key": SERPAPI_KEY
    }
    params_img = {
        "engine": "google_images",
        "q": nome_produto + " produto oficial",
        "gl": "br", "api_key": SERPAPI_KEY
    }
    try:
        res_s = requests.get("https://serpapi.com/search", params=params, timeout=15).json()
        res_i = requests.get("https://serpapi.com/search", params=params_img, timeout=15).json()
        
        preco = res_s["shopping_results"][0].get("price") if "shopping_results" in res_s else None
        img = res_i["images_results"][0].get("thumbnail") if "images_results" in res_i else None
        return preco, img
    except:
        return None, None

def enviar_via_requisicao():
    """Envia o arquivo usando o protocolo WebDAV (Requisição PUT)"""
    print("\n🚀 Enviando requisição para o servidor...")
    
    # O Tiiny host permite acesso via WebDAV neste formato
    url_destino = f"https://{SITE_URL}/produtos.json"
    
    try:
        with open(CAMINHO_SITE, 'rb') as f:
            conteudo = f.read()
            
        # Fazemos uma requisição PUT (que serve para enviar/substituir arquivos)
        # Usamos o seu email e senha como autenticação
        response = requests.put(
            url_destino, 
            data=conteudo, 
            auth=(EMAIL_LOGIN, SENHA_LOGIN),
            headers={'Content-Type': 'application/json'}
        )
            
        if response.status_code in [200, 201, 204]:
            print("✨ SUCESSO! O produtos.json foi atualizado no site.")
        else:
            print(f"⚠️ Servidor respondeu: {response.status_code}")
            print("Dica: Verifique se o Tiiny.host permite PUT direto no seu plano ou se precisa de WebDAV.")
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")

def sincronizar_total():
    """Processo completo do KobiStudio"""
    if not os.path.exists(CAMINHO_SITE):
        print("❌ Arquivo local não encontrado!")
        return

    with open(CAMINHO_SITE, 'r', encoding='utf-8') as f:
        db = json.load(f)

    for p in db:
        p_preco, p_img = buscar_dados_br(p['nome'])
        if p_preco: p['preco'] = p_preco
        if p_img: p['imgs'] = [p_img]
        time.sleep(1)

    # Resolve problema de escrita no Android antes de enviar
    with open(CAMINHO_SITE, 'w', encoding='utf-8') as f:
        json.dump(db, f, indent=4, ensure_ascii=False)
    
    enviar_via_requisicao()

if __name__ == "__main__":
    sincronizar_total()
