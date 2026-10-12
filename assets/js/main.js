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

  // 6. Integração dos Formulários com Envio de E-mail (/api/contato) e WhatsApp
  const bookingForms = document.querySelectorAll('.appointment-form, .conversion-form');

  bookingForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // 1. Verificação de Honeypot anti-spam
      const hpInput = form.querySelector('input[name="_hp_security_check"]');
      if (hpInput && hpInput.value.trim() !== '') {
        console.warn('Bot submission blocked via honeypot.');
        return;
      }

      // 2. Extração dos campos
      const nameInput = form.querySelector('input[name="nome"]');
      const phoneInput = form.querySelector('input[name="whatsapp"], input[name="telefone"]');
      const treatmentInput = form.querySelector('select[name="tratamento"], input[name="tratamento"]');
      const msgInput = form.querySelector('textarea[name="mensagem"]');
      const feedbackBox = form.querySelector('.form-feedback');
      const submitBtn = form.querySelector('button[type="submit"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const rawPhone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
      const phoneFormatted = phoneInput ? phoneInput.value.trim() : '';
      const treatment = treatmentInput ? treatmentInput.value.trim() : 'Avaliação Geral';
      const message = msgInput ? msgInput.value.trim() : '';

      // Helper para feedback acessível
      const showFeedback = (msg, isSuccess = false) => {
        if (feedbackBox) {
          feedbackBox.textContent = msg;
          feedbackBox.className = `form-feedback ${isSuccess ? 'success' : 'error'}`;
          feedbackBox.style.display = 'block';
        } else {
          alert(msg);
        }
      };

      const clearFeedback = () => {
        if (feedbackBox) {
          feedbackBox.textContent = '';
          feedbackBox.className = 'form-feedback';
          feedbackBox.style.display = 'none';
        }
      };

      clearFeedback();

      // 3. Validação no Front-end
      if (!name || name.length < 2) {
        showFeedback('Por favor, informe seu nome completo.');
        if (nameInput) {
          nameInput.classList.add('input-error');
          nameInput.focus();
        }
        return;
      } else if (nameInput) {
        nameInput.classList.remove('input-error');
      }

      if (!rawPhone || rawPhone.length < 10 || rawPhone.length > 11) {
        showFeedback('Por favor, informe um WhatsApp válido com DDD (10 ou 11 dígitos).');
        if (phoneInput) {
          phoneInput.classList.add('input-error');
          phoneInput.focus();
        }
        return;
      } else if (phoneInput) {
        phoneInput.classList.remove('input-error');
      }

      // 4. Construção do Link do WhatsApp pelo contexto
      let whatsappUrl = '';
      if (typeof window.buildFormWhatsAppLink === 'function') {
        whatsappUrl = window.buildFormWhatsAppLink(name, phoneFormatted, treatment);
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
        const waMsg = `Olá! Meu nome é ${name}. Vim pelo site e gostaria de ${action} na Odonto Excellence Canela. Meu WhatsApp: ${phoneFormatted}.`;
        whatsappUrl = `https://wa.me/5554984389347?text=${encodeURIComponent(waMsg)}`;
      }

      // 5. Estado visual de envio
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span style="display:inline-flex; align-items:center; justify-content:center; gap:0.5rem;">
            <svg style="animation: spin 0.8s linear infinite; width:18px; height:18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg>
            Enviando...
          </span>
        `;
      }

      // 6. Chamada para a API Serverless (/api/contato)
      const payload = {
        nome: name,
        whatsapp: rawPhone,
        whatsappFormatted: phoneFormatted,
        tratamento: treatment,
        mensagem: message,
        pagina: window.location.pathname,
        dominio: window.location.hostname,
        _hp_security_check: hpInput ? hpInput.value : ''
      };

      let emailSuccess = false;
      try {
        const response = await fetch('/api/contato', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          emailSuccess = true;
        } else {
          console.warn('API /api/contato retornou status não-200:', response.status);
        }
      } catch (err) {
        console.warn('Erro de rede ao conectar à API /api/contato:', err);
      }

      // 7. Disparo de Analytics (Google Analytics, GTM, Meta Pixel)
      try {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'lead', {
            treatment: treatment,
            page_path: window.location.pathname
          });
        }
        if (Array.isArray(window.dataLayer)) {
          window.dataLayer.push({
            event: 'lead',
            treatment: treatment,
            page_path: window.location.pathname
          });
        }
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', {
            content_name: treatment
          });
        }
      } catch (trackingErr) {
        console.warn('Erro ao disparar evento de lead:', trackingErr);
      }

      // 8. Mensagem de Feedback
      if (emailSuccess) {
        showFeedback('Recebemos seu pedido! Em breve entraremos em contato.', true);
        form.reset();
      } else {
        // Se a API de e-mail falhar, não perde o lead: avisa e abre o WhatsApp mesmo assim
        showFeedback('Recebemos seu pedido! Conectando ao WhatsApp da clínica...', true);
      }

      // Abre o WhatsApp em nova aba com a mensagem personalizada
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Restaura o botão após alguns segundos
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnHtml;
          submitBtn.disabled = false;
        }
      }, 3500);
    });
  });
});
