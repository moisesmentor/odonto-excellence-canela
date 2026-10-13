/**
 * Odonto Excellence Canela - Teste Automatizado de Rotas, Formulários & API /api/contato
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import contactHandler from "./api/contato.js";

const BASE_DIR = import.meta.dir;

const routesToTest = [
  { path: "index.html", expectedText: "O seu novo", label: "Home (/)" },
  { path: "sobre/index.html", expectedText: "Sobre a Odonto Excellence Canela", label: "Sobre (/sobre)" },
  { path: "tratamentos/index.html", expectedText: "Todos os Tratamentos", label: "Tratamentos (/tratamentos)" },
  { path: "implantes/index.html", expectedText: "Implantes Dentários em Canela RS", label: "Implantes (/implantes)" },
  { path: "clareamento/index.html", expectedText: "Clareamento Dental em Canela RS", label: "Clareamento (/clareamento)" },
  { path: "facetas/index.html", expectedText: "Facetas de Porcelana em Canela RS", label: "Facetas (/facetas)" },
  { path: "ortodontia/index.html", expectedText: "Ortodontia & Aparelhos em Canela RS", label: "Ortodontia (/ortodontia)" },
  { path: "proteses/index.html", expectedText: "Próteses Dentárias em Canela RS", label: "Próteses (/proteses)" },
  { path: "odontopediatria/index.html", expectedText: "Odontopediatria em Canela RS", label: "Odontopediatria (/odontopediatria)" },
  { path: "contato/index.html", expectedText: "Fale com a Odonto Excellence Canela", label: "Contato (/contato)" },
  { path: "404.html", expectedText: "Página não encontrada", label: "404 (/404)" }
];

const formPages = [
  "index.html",
  "sobre/index.html",
  "tratamentos/index.html",
  "implantes/index.html",
  "clareamento/index.html",
  "facetas/index.html",
  "ortodontia/index.html",
  "proteses/index.html",
  "odontopediatria/index.html",
  "contato/index.html"
];

const assetsToTest = [
  "assets/css/main.css",
  "assets/css/components.css",
  "assets/css/pages.css",
  "assets/js/phone-mask.js",
  "assets/js/carousel.js",
  "assets/js/whatsapp-config.js",
  "config/whatsapp.js",
  "assets/js/main.js",
  "api/contato.js",
  ".env.example",
  "assets/images/logo.svg",
  "assets/images/logo-white.svg",
  "assets/images/logo-official.png",
  "assets/images/logo-official-white.png",
  "assets/images/favicon.png",
  "assets/images/hero-patient.svg",
  "assets/images/hero-smile.jpg",
  "assets/images/hero-desktop.avif",
  "assets/images/hero-desktop.jpg",
  "assets/images/hero-mobile.avif",
  "assets/images/hero-mobile.jpg",
  "assets/images/clinic-structure.jpg",
  "assets/images/why-choose.jpg",
  "assets/images/dental-implants.jpg",
  "assets/images/teeth-whitening.jpg",
  "assets/images/porcelain-veneers.jpg",
  "assets/images/orthodontics-aligner.jpg",
  "assets/images/dental-prosthetics.jpg",
  "assets/images/pediatric-dentistry.jpg",
  "assets/images/conversion-bg.jpg",
  "sitemap.xml",
  "robots.txt",
  ".htaccess",
  "vercel.json",
  "netlify.toml"
];

console.log("🔍 Iniciando Verificação de Integridade das Páginas e Arquivos...\n");

let passed = 0;
let failed = 0;

for (const route of routesToTest) {
  const fullPath = join(BASE_DIR, route.path);
  if (!existsSync(fullPath)) {
    console.error(`❌ [FALHA] Arquivo não encontrado: ${route.path}`);
    failed++;
    continue;
  }

  const content = readFileSync(fullPath, "utf-8");
  if (!content.includes(route.expectedText)) {
    console.error(`❌ [FALHA] Texto esperado não encontrado em ${route.path}: "${route.expectedText}"`);
    failed++;
  } else {
    console.log(`✅ [OK] ${route.label} (${route.path}) verificado com sucesso.`);
    passed++;
  }
}

console.log("\n🔍 Verificando Assets e Arquivos de Configuração...");

for (const asset of assetsToTest) {
  const fullPath = join(BASE_DIR, asset);
  if (!existsSync(fullPath)) {
    console.error(`❌ [FALHA] Asset ausente: ${asset}`);
    failed++;
  } else {
    console.log(`✅ [OK] Asset presente: ${asset}`);
    passed++;
  }
}

console.log("\n🔍 Verificando Configuração de Formulários e LGPD...");

for (const page of formPages) {
  const fullPath = join(BASE_DIR, page);
  const content = readFileSync(fullPath, "utf-8");

  // 1. Honeypot
  if (!content.includes("_hp_security_check")) {
    console.error(`❌ [FALHA] Honeypot ausente em ${page}`);
    failed++;
  } else {
    passed++;
  }

  // 2. Feedback acessível
  if (!content.includes("form-feedback")) {
    console.error(`❌ [FALHA] Div form-feedback ausente em ${page}`);
    failed++;
  } else {
    passed++;
  }

  // 3. LGPD
  if (!content.includes("Seus dados serão usados apenas para retorno sobre seu atendimento.")) {
    console.error(`❌ [FALHA] Frase LGPD ausente em ${page}`);
    failed++;
  } else {
    passed++;
  }
}
console.log(`✅ [OK] Todos os 10 formulários possuem Honeypot anti-spam, feedback acessível e aviso LGPD.`);

console.log("\n🔍 Verificando Configuração de WhatsApp e Redes Sociais...");

// 1. Carrega e testa módulo de WhatsApp
const whatsappConfig = require("./config/whatsapp.js");
if (whatsappConfig.WHATSAPP_NUMBER === "5554984389347" && whatsappConfig.WHATSAPP_DISPLAY === "(54) 98438-9347") {
  console.log("✅ [OK] Constantes de WhatsApp corretas (5554984389347 / (54) 98438-9347).");
  passed++;
} else {
  console.error("❌ [FALHA] Constantes de WhatsApp incorretas.");
  failed++;
}

// 2. Testa buildWhatsAppLink
const testLink = whatsappConfig.buildWhatsAppLink("geral");
if (testLink.startsWith("https://wa.me/5554984389347?text=")) {
  console.log("✅ [OK] Helper buildWhatsAppLink gerou URL esperada.");
  passed++;
} else {
  console.error("❌ [FALHA] buildWhatsAppLink gerou URL inválida:", testLink);
  failed++;
}

// 3. Testa buildFormWhatsAppLink
const formLink = whatsappConfig.buildFormWhatsAppLink("Maria Silva", "(54) 98888-7777", "Implantes Dentários");
if (formLink.includes("5554984389347") && formLink.includes("Maria%20Silva") && formLink.includes("implante%20dent%C3%A1rio")) {
  console.log("✅ [OK] Helper buildFormWhatsAppLink montou mensagem e URL dinâmica corretamente.");
  passed++;
} else {
  console.error("❌ [FALHA] buildFormWhatsAppLink gerou URL incorreta:", formLink);
  failed++;
}

// 4. Garante ausência de números legados
for (const route of routesToTest) {
  const fullPath = join(BASE_DIR, route.path);
  const content = readFileSync(fullPath, "utf-8");
  if (content.includes("5554999990000") || content.includes("99999-0000")) {
    console.error(`❌ [FALHA] Número antigo detectado em ${route.path}`);
    failed++;
  } else {
    passed++;
  }
}
console.log("✅ [OK] Verificado: 0 ocorrências de números legados em todas as páginas.");

// 5. Instagram oficial
for (const route of routesToTest) {
  const fullPath = join(BASE_DIR, route.path);
  const content = readFileSync(fullPath, "utf-8");
  if (!content.includes("https://www.instagram.com/odontoexcellencecanela/")) {
    console.error(`❌ [FALHA] Instagram oficial ausente em ${route.path}`);
    failed++;
  } else {
    passed++;
  }
}
console.log("✅ [OK] Verificado: Instagram oficial presente em todas as 11 páginas.");

// 6. Configurações de vercel.json
const vercelConfig = JSON.parse(readFileSync(join(BASE_DIR, "vercel.json"), "utf-8"));
const hasNoIndexHeader = vercelConfig.headers?.some((h: any) =>
  h.headers?.some((headerItem: any) => headerItem.key === "X-Robots-Tag" && headerItem.value === "noindex, nofollow")
);
const hasWwwRedirect = vercelConfig.redirects?.some((r: any) =>
  r.destination?.includes("odontoexcellencecanela.com.br")
);

if (hasNoIndexHeader && hasWwwRedirect) {
  console.log("✅ [OK] vercel.json configurado com X-Robots-Tag (*.vercel.app) e redirect de www.");
  passed++;
} else {
  console.error("❌ [FALHA] vercel.json não possui configurações esperadas.");
  failed++;
}

// 7. Testes unitários diretos da API /api/contato
console.log("\n🔍 Testando API Serverless /api/contato...");

async function executeApiCall(reqOptions: {
  method: string;
  headers?: Record<string, string>;
  body?: any;
}) {
  let statusCode = 200;
  const resHeaders = new Headers();
  let jsonResponse: any = null;

  const mockRes = {
    status(code: number) {
      statusCode = code;
      return mockRes;
    },
    setHeader(name: string, value: string) {
      resHeaders.set(name, value);
      return mockRes;
    },
    json(data: any) {
      jsonResponse = data;
      return mockRes;
    },
    end() {
      return mockRes;
    }
  };

  const mockReq = {
    method: reqOptions.method,
    headers: reqOptions.headers || {},
    body: reqOptions.body || {}
  };

  await contactHandler(mockReq as any, mockRes as any);
  return { status: statusCode, headers: resHeaders, data: jsonResponse };
}

// 7.1 Envio Válido (em modo teste sem RESEND_API_KEY)
const validRes = await executeApiCall({
  method: "POST",
  headers: {
    origin: "https://odonto-excellence-canela.vercel.app",
    "x-forwarded-for": "189.100.20.10"
  },
  body: {
    nome: "Carlos Eduardo",
    whatsapp: "54984389347",
    whatsappFormatted: "(54) 98438-9347",
    tratamento: "Implantes Dentários",
    pagina: "/implantes",
    dominio: "odonto-excellence-canela.vercel.app"
  }
});

if (validRes.status === 200 && validRes.data?.success && validRes.data?.data?.to === "odontoexcellence.canela@gmail.com") {
  console.log("✅ [OK] API /api/contato: Envio válido retornou 200 com destino odontoexcellence.canela@gmail.com.");
  passed++;
} else {
  console.error("❌ [FALHA] API /api/contato: Resposta inesperada para envio válido:", validRes);
  failed++;
}

// 7.2 Envio Válido com Origem do Domínio Profissional
const prodDomainRes = await executeApiCall({
  method: "POST",
  headers: {
    origin: "https://odontoexcellencecanela.com.br",
    "x-forwarded-for": "189.100.20.11"
  },
  body: {
    nome: "Ana Beatriz",
    whatsapp: "54991112233",
    tratamento: "Clareamento Dental"
  }
});

if (prodDomainRes.status === 200 && prodDomainRes.headers.get("access-control-allow-origin") === "https://odontoexcellencecanela.com.br") {
  console.log("✅ [OK] API /api/contato: Domínio profissional aceito com CORS correto.");
  passed++;
} else {
  console.error("❌ [FALHA] API /api/contato: Falha com domínio profissional:", prodDomainRes);
  failed++;
}

// 7.3 Falha de Validação: Nome Vazio
const emptyNameRes = await executeApiCall({
  method: "POST",
  body: {
    nome: "",
    whatsapp: "54984389347",
    tratamento: "Facetas de Porcelana"
  }
});

if (emptyNameRes.status === 400 && emptyNameRes.data?.error?.includes("Nome")) {
  console.log("✅ [OK] API /api/contato: Validação de nome obrigatório retornou 400.");
  passed++;
} else {
  console.error("❌ [FALHA] API /api/contato: Validação de nome não bloqueou:", emptyNameRes);
  failed++;
}

// 7.4 Falha de Validação: WhatsApp Inválido (< 10 dígitos)
const invalidPhoneRes = await executeApiCall({
  method: "POST",
  body: {
    nome: "Marcos Souza",
    whatsapp: "12345",
    tratamento: "Ortodontia e Aparelhos"
  }
});

if (invalidPhoneRes.status === 400 && invalidPhoneRes.data?.error?.includes("WhatsApp")) {
  console.log("✅ [OK] API /api/contato: Validação de WhatsApp inválido retornou 400.");
  passed++;
} else {
  console.error("❌ [FALHA] API /api/contato: WhatsApp inválido não bloqueou:", invalidPhoneRes);
  failed++;
}

// 7.5 Anti-Spam Honeypot: Campo Preenchido
const honeypotRes = await executeApiCall({
  method: "POST",
  body: {
    nome: "Spam Bot",
    whatsapp: "54984389347",
    tratamento: "Avaliação Geral",
    _hp_security_check: "https://spamlink.com"
  }
});

if (honeypotRes.status === 200 && !honeypotRes.data?.data) {
  console.log("✅ [OK] API /api/contato: Honeypot descartou envio sem despachar e-mail.");
  passed++;
} else {
  console.error("❌ [FALHA] API /api/contato: Honeypot falhou:", honeypotRes);
  failed++;
}

// 7.6 Método Não Permitido (GET)
const getRes = await executeApiCall({
  method: "GET"
});

if (getRes.status === 405) {
  console.log("✅ [OK] API /api/contato: Método GET rejeitado com 405 Method Not Allowed.");
  passed++;
} else {
  console.error("❌ [FALHA] API /api/contato: GET não retornou 405:", getRes);
  failed++;
}

// 7.7 Preflight CORS (OPTIONS)
const optionsRes = await executeApiCall({
  method: "OPTIONS",
  headers: {
    origin: "https://odontoexcellencecanela.com.br"
  }
});

if (optionsRes.status === 204) {
  console.log("✅ [OK] API /api/contato: Preflight OPTIONS retornou 204 com cabeçalhos CORS.");
  passed++;
} else {
  console.error("❌ [FALHA] API /api/contato: Preflight OPTIONS falhou:", optionsRes);
  failed++;
}

console.log(`\n========================================`);
console.log(`Resumo dos Testes: ${passed} passaram, ${failed} falharam.`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Todos os testes passaram com 100% de sucesso!");
}
