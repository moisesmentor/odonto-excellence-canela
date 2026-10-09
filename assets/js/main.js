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

  // 5. Integração dos Formulários com WhatsApp
  const bookingForms = document.querySelectorAll('.appointment-form, .conversion-form');
  const WHATSAPP_PHONE = '5554999990000'; // Número oficial Canela/RS (padrão 54)

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

      // Mensagem personalizada de alta conversão
      const message = `Olá! Gostaria de agendar uma avaliação na Odonto Excellence Canela.\n\n*Nome:* ${name}\n*WhatsApp:* ${phone}\n*Interesse:* ${treatment}\n*Unidade:* Canela/RS`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;

      // Abre o WhatsApp diretamente
      window.open(whatsappUrl, '_blank');
      
      // Feedback visual
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
