# Odonto Excellence Canela - Site Oficial

Site institucional e de alta conversão da clínica odontológica **Odonto Excellence Canela** (Canela/RS), desenvolvido com foco em SEO local, velocidade máxima (Lighthouse 100) e conversão de pacientes via WhatsApp e formulários.

---

## 🎨 Identidade Visual & Design System

- **Paleta de Cores**:
  - Vermelho (`#E30613`): Utilizado estrategicamente em botões de ação (CTAs), destaques, badges e ícones de conversão.
  - Grafite (`#222222`): Faixa de diferenciais, tipografia escura e elementos de autoridade.
  - Cinza (`#8A8A8A` / `#555555`): Textos corridos, bordas e subtítulos.
  - Branco (`#FFFFFF`): Espaço em branco generoso e legibilidade premium.
- **Tipografia**:
  - **Montserrat** (títulos, subtítulos, CTAs e números de destaque com `font-display: swap`).
  - **Plus Jakarta Sans / Inter** (textos corridos e parágrafos de alta legibilidade).
- **Estilo**: Limpo, cantos arredondados (`border-radius: 14px` a `22px`), sombras suaves, ícones de linha vermelhos vetoriais e mobile-first.

---

## 🗺️ Arquitetura de Páginas & URLs Limpas

Todas as páginas são rotas reais, sem hash `#`, sem parâmetros e sem a extensão `.html` visível na barra de endereços:

| Rota Amigável | Arquivo Físico | Descrição |
| :--- | :--- | :--- |
| `/` | `index.html` | Home (Landing page com as 7 seções completas) |
| `/sobre` | `sobre/index.html` | Sobre a clínica, valores e estrutura física |
| `/tratamentos` | `tratamentos/index.html` | Catálogo geral com todos os procedimentos |
| `/implantes` | `implantes/index.html` | Implantes Dentários e carga imediata |
| `/clareamento` | `clareamento/index.html` | Clareamento dental a laser e caseiro |
| `/facetas` | `facetas/index.html` | Facetas de porcelana e lentes de contato dental |
| `/ortodontia` | `ortodontia/index.html` | Ortodontia, alinhadores transparentes e aparelhos |
| `/proteses` | `proteses/index.html` | Próteses dentárias fixas e protocolo |
| `/odontopediatria` | `odontopediatria/index.html` | Odontopediatria e atendimento infantil lúdico |
| `/contato` | `contato/index.html` | Contato, mapa interativo em Canela/RS e formulário |
| `/404` | `404.html` | Página 404 personalizada |

---

## 🚀 Como Rodar Localmente

O projeto utiliza o runtime ultrarrápido **Bun** (ou qualquer servidor HTTP estático):

```bash
# Entrar no diretório do projeto
cd /Users/moisesrodrigues/.gemini/antigravity/scratch/odonto-excellence-canela

# Iniciar o servidor com suporte a URLs limpas
bun run dev
# ou
bun run start
```

Acesse no seu navegador: **`http://localhost:3000`**

### Testes Automatizados de Integridade:
```bash
bun test.ts
```

---

## 🌐 Deploy em Produção

O projeto já inclui as configurações completas para os principais ambientes de hospedagem:

1. **Vercel**: `vercel.json` incluso com `"cleanUrls": true`. Basta conectar o repositório ou rodar `vercel`.
2. **Netlify**: `netlify.toml` incluso com redirecionamentos e regras de cache de assets.
3. **Apache / cPanel / Hospedagem Compartilhada no Brasil**: Arquivo `.htaccess` incluso com `mod_rewrite`, compressão Gzip e expiração de cache.

---

## 📍 SEO Local Especializado (Canela / Serra Gaúcha)

- **Dados Estruturados Schema.org (`Dentist` / `LocalBusiness` / `MedicalProcedure`)** em formato JSON-LD em todas as páginas.
- **Geolocalização exata de Canela/RS** (`latitude: -29.3653`, `longitude: -50.8122`).
- **Palavras-chave regionais integradas**: "facetas de porcelana em Canela", "implante dentário Canela RS", "clareamento dental Canela", "dentista Serra Gaúcha".
- **Sitemap XML (`sitemap.xml`)** e **`robots.txt`** prontos para envio ao Google Search Console.
- **Integração de WhatsApp com máscara brasileira**: formulário formata números em `(54) 9XXXX-XXXX` e gera mensagem pronta personalizada para a recepção da clínica.
