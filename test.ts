/**
 * Odonto Excellence Canela - Teste Automatizado de Rotas & Validação de Conteúdo
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";

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

const assetsToTest = [
  "assets/css/main.css",
  "assets/css/components.css",
  "assets/css/pages.css",
  "assets/js/phone-mask.js",
  "assets/js/carousel.js",
  "assets/js/whatsapp-config.js",
  "config/whatsapp.js",
  "assets/js/main.js",
  "assets/images/logo.svg",
  "assets/images/logo-white.svg",
  "assets/images/logo-official.png",
  "assets/images/logo-official-white.png",
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

console.log("\n🔍 Verificando Configuração e Ausência de Números Legados...");

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

// 4. Garante que nenhum arquivo HTML contém números antigos
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
console.log("✅ [OK] Verificado: 0 ocorrências de 5554999990000 ou 99999-0000 em todas as páginas.");

// 5. Garante que o Instagram oficial está presente
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

console.log(`\n========================================`);
console.log(`Resumo dos Testes: ${passed} passaram, ${failed} falharam.`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Todos os testes passaram com 100% de sucesso!");
}
