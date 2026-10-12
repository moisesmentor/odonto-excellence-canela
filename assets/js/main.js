/**
 * Odonto Excellence Canela - Main Scripts
 * Menu mobile, sticky header, accordions, formulários e integração WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky / Transparent Header (>60px)
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Menu Drawer
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');

  function openDrawer() {
    if (mobileDrawer && drawerBackdrop) {
      mobileDrawer.classList.add('open');
      drawerBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (mobileDrawer && drawerBackdrop) {
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  // Fecha drawer ao clicar em links internos
  const drawerLinks = document.querySelectorAll('.mobile-nav-drawer a:not(.has-submenu)');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 3. Submenu Toggle Mobile
  const drawerSubmenuToggles = document.querySelectorAll('.toggle-submenu-btn');
  drawerSubmenuToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = btn.closest('.drawer-link-group');
      if (parent) {
        parent.classList.toggle('open');
      }
    });
  });

  // 4. Accordion FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Fecha outros itens para efeito sanfona limpo
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // 5. Inicialização e Bind Dinâmico de Botões WhatsApp Centralizados
  if (typeof window.buildWhatsAppLink === 'function') {
    const whatsappElements = document.querySelectorAll('[data-whatsapp]');
    whatsappElements.forEach(el => {
      const key = el.getAttribute('data-whatsapp');
      if (key && el.tagName === 'A') {
        el.href = window.buildWhatsAppLink(key);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  // 6. Integração dos Formulários com WhatsApp Dinâmico por Contexto
  const bookingForms = document.querySelectorAll('.appointment-form, .conversion-form');

  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('input[name="nome"]');
      const phoneInput = form.querySelector('input[name="whatsapp"], input[name="telefone"]');
      const treatmentInput = form.querySelector('select[name="tratamento"], input[name="tratamento"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const treatment = treatmentInput ? treatmentInput.value : 'Avaliação Geral';

      if (!name) {
        alert('Por favor, informe seu nome completo.');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!phone || phone.replace(/\D/g, '').length < 10) {
        alert('Por favor, informe um número de WhatsApp válido com DDD.');
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Constrói URL usando a função helper centralizada
      let whatsappUrl = '';
      if (typeof window.buildFormWhatsAppLink === 'function') {
        whatsappUrl = window.buildFormWhatsAppLink(name, phone, treatment);
      } else {
        const actionsMap = {
          "Avaliação Geral": "agendar uma avaliação geral",
          "Avaliação Geral / Check-up": "agendar uma avaliação geral",
          "Implantes Dentários": "um orçamento para implante dentário",
          "Facetas de Porcelana": "um orçamento para facetas de porcelana",
          "Clareamento Dental": "um orçamento para clareamento dental",
          "Ortodontia e Aparelhos": "um orçamento para aparelho ou alinhador invisível",
          "Próteses Dentárias": "um orçamento para prótese dentária",
          "Odontopediatria": "agendar uma consulta de odontopediatria",
          "Odontopediatria (Crianças)": "agendar uma consulta de odontopediatria"
        };
        const action = actionsMap[treatment] || "agendar uma avaliação geral";
        const message = `Olá! Meu nome é ${name}. Vim pelo site e gostaria de ${action} na Odonto Excellence Canela. Meu WhatsApp: ${phone}.`;
        whatsappUrl = `https://wa.me/5554984389347?text=${encodeURIComponent(message)}`;
      }

      // Abre o WhatsApp diretamente em nova aba
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      // Feedback visual no botão
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Redirecionando para WhatsApp...';
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  });
});
