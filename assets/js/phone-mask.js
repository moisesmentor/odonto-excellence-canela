/**
 * Odonto Excellence Canela - Brazilian Phone Mask
 * Formata números de telefone no padrão brasileiro: (XX) 9XXXX-XXXX ou (XX) XXXX-XXXX
 */
function applyPhoneMask(input) {
  if (!input) return;

  input.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito

    // Limita a 11 dígitos (DDD + 9 dígitos)
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length === 0) {
      e.target.value = '';
    } else if (value.length <= 2) {
      e.target.value = `(${value}`;
    } else if (value.length <= 6) {
      e.target.value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else if (value.length <= 10) {
      // Telefone fixo (XX) XXXX-XXXX
      e.target.value = `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6)}`;
    } else {
      // Celular com 9 dígitos (XX) 9XXXX-XXXX
      e.target.value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
    }
  });

  input.addEventListener('blur', function (e) {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length > 0 && value.length < 10) {
      input.classList.add('input-error');
    } else {
      input.classList.remove('input-error');
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="whatsapp"], input[name="telefone"]');
  phoneInputs.forEach(applyPhoneMask);
});
