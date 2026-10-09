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

console.log(`\n========================================`);
console.log(`Resumo dos Testes: ${passed} passaram, ${failed} falharam.`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Todos os testes passaram com 100% de sucesso!");
}
