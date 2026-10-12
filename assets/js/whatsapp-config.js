/**
 * Configuração Centralizada do WhatsApp - Odonto Excellence Canela
 * Número Oficial: 5554984389347 / (54) 98438-9347
 */

const WHATSAPP_NUMBER = "5554984389347";
const WHATSAPP_DISPLAY = "(54) 98438-9347";

const WHATSAPP_MESSAGES = {
  // Geral (header, hero, rodapé, botão flutuante da home, /sobre, /tratamentos, /404)
  geral: "Olá! Vim pelo site da Odonto Excellence Canela e gostaria de agendar uma avaliação.",

  // "Conversar com nossa equipe" (home)
  equipe_home: "Olá! Vim pelo site e gostaria de saber mais sobre os tratamentos da Odonto Excellence Canela.",

  // /implantes
  implantes: "Olá! Vim pelo site e gostaria de um orçamento para implante dentário na Odonto Excellence Canela.",

  // /clareamento
  clareamento: "Olá! Vim pelo site e gostaria de um orçamento para clareamento dental na Odonto Excellence Canela.",

  // /facetas
  facetas: "Olá! Vim pelo site e gostaria de um orçamento para facetas de porcelana na Odonto Excellence Canela.",

  // /ortodontia
  ortodontia: "Olá! Vim pelo site e gostaria de um orçamento para aparelho ou alinhador invisível na Odonto Excellence Canela.",

  // /proteses
  proteses: "Olá! Vim pelo site e gostaria de um orçamento para prótese dentária na Odonto Excellence Canela.",

  // /odontopediatria
  odontopediatria: "Olá! Vim pelo site e gostaria de agendar uma consulta de odontopediatria para meu filho(a) na Odonto Excellence Canela.",

  // /contato
  contato: "Olá! Vim pelo site da Odonto Excellence Canela e gostaria de mais informações."
};

const FORM_TREATMENT_ACTIONS = {
  "Avaliação Geral": "agendar uma avaliação geral",
  "Avaliação Geral / Check-up": "agendar uma avaliação geral",
  "Implantes Dentários": "um orçamento para implante dentário",
  "Facetas de Porcelana": "um orçamento para facetas de porcelana",
  "Clareamento Dental": "um orçamento para clareamento dental",
  "Ortodontia e Aparelhos": "um orçamento para aparelho ou alinhador invisível",
  "Próteses Dentárias": "um orçamento para prótese dentária",
  "Odontopediatria": "agendar uma consulta de odontopediatria",
  "Odontopediatria (Crianças)": "agendar uma consulta de odontopediatria",
  "Outro assunto": "mais informações sobre os tratamentos"
};

/**
 * Retorna a URL completa do WhatsApp para um determinado contexto ou texto direto.
 * @param {string} messageKey - Chave da mensagem (ex.: 'geral', 'implantes') ou mensagem literal
 * @returns {string} URL no formato https://wa.me/5554984389347?text=...
 */
function buildWhatsAppLink(messageKey) {
  const message = WHATSAPP_MESSAGES[messageKey] || messageKey || WHATSAPP_MESSAGES.geral;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Monta dinamicamente a mensagem do formulário a partir dos campos preenchidos.
 * @param {string} name - Nome do paciente
 * @param {string} phone - Telefone do paciente
 * @param {string} treatment - Tratamento selecionado
 * @returns {string} Mensagem personalizada
 */
function buildFormWhatsAppMessage(name, phone, treatment) {
  const action = FORM_TREATMENT_ACTIONS[treatment] || "agendar uma avaliação geral";
  return `Olá! Meu nome é ${name}. Vim pelo site e gostaria de ${action} na Odonto Excellence Canela. Meu WhatsApp: ${phone}.`;
}

/**
 * Retorna o link completo do WhatsApp montado a partir dos dados do formulário.
 * @param {string} name - Nome do paciente
 * @param {string} phone - Telefone do paciente
 * @param {string} treatment - Tratamento selecionado
 * @returns {string} URL no formato https://wa.me/5554984389347?text=...
 */
function buildFormWhatsAppLink(name, phone, treatment) {
  const message = buildFormWhatsAppMessage(name, phone, treatment);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Exportação universal (Browser globals + ES Modules / CommonJS)
if (typeof window !== "undefined") {
  window.WHATSAPP_NUMBER = WHATSAPP_NUMBER;
  window.WHATSAPP_DISPLAY = WHATSAPP_DISPLAY;
  window.WHATSAPP_MESSAGES = WHATSAPP_MESSAGES;
  window.FORM_TREATMENT_ACTIONS = FORM_TREATMENT_ACTIONS;
  window.buildWhatsAppLink = buildWhatsAppLink;
  window.buildFormWhatsAppMessage = buildFormWhatsAppMessage;
  window.buildFormWhatsAppLink = buildFormWhatsAppLink;
  window.WhatsAppConfig = {
    WHATSAPP_NUMBER,
    WHATSAPP_DISPLAY,
    WHATSAPP_MESSAGES,
    FORM_TREATMENT_ACTIONS,
    buildWhatsAppLink,
    buildFormWhatsAppMessage,
    buildFormWhatsAppLink
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    WHATSAPP_NUMBER,
    WHATSAPP_DISPLAY,
    WHATSAPP_MESSAGES,
    FORM_TREATMENT_ACTIONS,
    buildWhatsAppLink,
    buildFormWhatsAppMessage,
    buildFormWhatsAppLink
  };
}
