/**
 * Odonto Excellence Canela - API Serverless de Envio de Contatos / Agendamentos
 * Endpoint: /api/contato
 * Integração: Resend API via fetch nativo (Node 18+ / Vercel Serverless)
 * Destinatário: odontoexcellence.canela@gmail.com (ou process.env.CONTACT_EMAIL_TO)
 */

// Memória simples de rate limit por IP (janela de 60 segundos)
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;

  const timestamps = (rateLimitMap.get(ip) || []).filter(t => now - t < windowMs);
  if (timestamps.length >= maxRequests) {
    return false;
  }
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

// Limpeza periódica leve do mapa de rate limit
if (rateLimitMap.size > 1000) {
  const now = Date.now();
  for (const [key, timestamps] of rateLimitMap.entries()) {
    const valid = timestamps.filter(t => now - t < 60000);
    if (valid.length === 0) rateLimitMap.delete(key);
    else rateLimitMap.set(key, valid);
  }
}

function isOriginAllowed(origin, allowedOriginsEnv) {
  if (!origin) return true; // Requisição direta do mesmo host ou sem cabeçalho Origin

  try {
    const originUrl = new URL(origin);
    const hostname = originUrl.hostname.toLowerCase();

    // Sempre aceita localhost para desenvolvimento local
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;

    // Aceita qualquer preview deployment oficial da Vercel (*.vercel.app)
    if (hostname.endsWith('.vercel.app')) return true;

    // Lista de origens autorizadas da clínica
    const configuredOrigins = (allowedOriginsEnv || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    const defaultOrigins = [
      'odontoexcellencecanela.com.br',
      'www.odontoexcellencecanela.com.br',
      'odonto-excellence-canela.vercel.app'
    ];

    const allAllowed = new Set([...configuredOrigins, ...defaultOrigins]);
    return Array.from(allAllowed).some(domain => {
      return hostname === domain || hostname.endsWith(`.${domain}`);
    });
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  const origin = req.headers.origin || req.headers.referer || '';
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';

  // Configuração de CORS Dinâmico Seguro
  if (isOriginAllowed(origin, allowedOriginsEnv)) {
    if (origin) {
      try {
        const originUrl = new URL(origin);
        res.setHeader('Access-Control-Allow-Origin', originUrl.origin);
      } catch {
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  // Preflight CORS (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Apenas método POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

  // Rate Limiting por IP
  const clientIp = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown')
    .split(',')[0]
    .trim();

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Muitas tentativas em pouco tempo. Por favor, aguarde um minuto ou chame direto no WhatsApp.'
    });
  }

  // Parse do corpo da requisição
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  if (!body || typeof body !== 'object') {
    body = {};
  }

  // 1. Verificação de Honeypot Anti-Spam
  if (body._hp || body._hp_security_check) {
    // Retorna 200 para enganar robôs de spam sem disparar o e-mail
    return res.status(200).json({ success: true, message: 'Requisição processada com sucesso.' });
  }

  // 2. Extração e sanitização dos dados
  const nome = typeof body.nome === 'string' ? body.nome.trim() : '';
  const rawPhone = typeof body.whatsapp === 'string' ? body.whatsapp.replace(/\D/g, '') : '';
  const whatsappFormatted = typeof body.whatsappFormatted === 'string' && body.whatsappFormatted.trim()
    ? body.whatsappFormatted.trim()
    : rawPhone;
  const tratamento = typeof body.tratamento === 'string' && body.tratamento.trim()
    ? body.tratamento.trim()
    : 'Avaliação Geral';
  const mensagem = typeof body.mensagem === 'string' ? body.mensagem.trim() : '';
  const pagina = typeof body.pagina === 'string' && body.pagina.trim() ? body.pagina.trim() : '/';
  const dominio = typeof body.dominio === 'string' && body.dominio.trim()
    ? body.dominio.trim()
    : (req.headers.host || 'odontoexcellencecanela.com.br');
  const emailPaciente = typeof body.email === 'string' && body.email.includes('@')
    ? body.email.trim()
    : null;

  // 3. Validação no Back-end
  if (!nome || nome.length < 2) {
    return res.status(400).json({ error: 'Nome completo é obrigatório (mínimo 2 caracteres).' });
  }

  if (!rawPhone || rawPhone.length < 10 || rawPhone.length > 11) {
    return res.status(400).json({ error: 'Número de WhatsApp inválido com DDD (deve conter 10 ou 11 dígitos).' });
  }

  // 4. Data e Hora com fuso America/Sao_Paulo (Horário de Brasília)
  const dataHora = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'America/Sao_Paulo'
  }).format(new Date());

  // Link direto do WhatsApp para a recepção responder imediatamente
  const cleanPhone = rawPhone.startsWith('55') ? rawPhone.slice(2) : rawPhone;
  const waLink = `https://wa.me/55${cleanPhone}`;

  // 5. Assunto padronizado
  const emailSubject = `Novo agendamento pelo site – ${tratamento} – ${nome}`;

  // 6. Template HTML profissional e limpo
  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6F8; margin: 0; padding: 24px 12px; color: #222222; }
    .card { max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .header { background: #222222; padding: 24px; border-bottom: 3px solid #E30613; text-align: center; }
    .header h1 { margin: 0; font-size: 19px; color: #FFFFFF; letter-spacing: 0.5px; font-weight: 700; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #D1D5DB; }
    .content { padding: 28px 24px; }
    .badge { display: inline-block; background: #FDE8EA; color: #E30613; font-weight: 700; font-size: 13px; padding: 5px 14px; border-radius: 20px; margin-bottom: 20px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .info-table th { text-align: left; padding: 11px 12px; font-size: 12px; text-transform: uppercase; color: #6B7280; font-weight: 600; width: 36%; border-bottom: 1px solid #F3F4F6; }
    .info-table td { padding: 11px 12px; font-size: 15px; color: #111827; font-weight: 500; border-bottom: 1px solid #F3F4F6; }
    .btn-wa { display: block; text-align: center; background: #25D366; color: #FFFFFF !important; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 20px; border-radius: 8px; margin: 24px 0 12px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3); }
    .footer { background: #FAFAFB; padding: 16px 24px; font-size: 12px; color: #6B7280; text-align: center; border-top: 1px solid #E5E7EB; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>ODONTO EXCELLENCE CANELA</h1>
      <p>Novo Lead / Agendamento Recebido pelo Site</p>
    </div>
    <div class="content">
      <div class="badge">${tratamento}</div>
      <table class="info-table">
        <tr>
          <th>Nome do Paciente</th>
          <td><strong>${nome}</strong></td>
        </tr>
        <tr>
          <th>WhatsApp</th>
          <td><strong>${whatsappFormatted}</strong></td>
        </tr>
        <tr>
          <th>Tratamento</th>
          <td>${tratamento}</td>
        </tr>
        ${mensagem ? `<tr><th>Observações</th><td>${mensagem}</td></tr>` : ''}
        <tr>
          <th>Página de Origem</th>
          <td><code>${pagina}</code></td>
        </tr>
        <tr>
          <th>Domínio de Origem</th>
          <td><code>${dominio}</code></td>
        </tr>
        <tr>
          <th>Data e Hora</th>
          <td>${dataHora}</td>
        </tr>
      </table>

      <a href="${waLink}" target="_blank" class="btn-wa">
        💬 Responder no WhatsApp do Paciente
      </a>
    </div>
    <div class="footer">
      Mensagem enviada automaticamente a partir do site da Odonto Excellence Canela.<br>
      Destinatário: <strong>odontoexcellence.canela@gmail.com</strong>
    </div>
  </div>
</body>
</html>
  `.trim();

  // 7. Versão em Texto Puro (Fallback)
  const textContent = `
NOVO AGENDAMENTO PELO SITE - ODONTO EXCELLENCE CANELA
=====================================================

Nome Completo: ${nome}
WhatsApp: ${whatsappFormatted} (Link: ${waLink})
Tratamento de Interesse: ${tratamento}
${mensagem ? `Observações: ${mensagem}\n` : ''}
Página de Origem: ${pagina}
Domínio de Origem: ${dominio}
Data e Hora: ${dataHora} (Horário de Brasília)

-----------------------------------------------------
Clique no link abaixo para iniciar atendimento direto no WhatsApp:
${waLink}
  `.trim();

  // 8. Despacho via Resend API
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL_TO || 'odontoexcellence.canela@gmail.com';
  const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

  // Se a chave não estiver configurada (ex: ambiente de teste local), retorna sucesso simulado
  if (!resendApiKey) {
    console.warn('⚠️ [AVISO] RESEND_API_KEY não definida no ambiente. Simulando envio com sucesso (modo teste/staging).');
    return res.status(200).json({
      success: true,
      mocked: true,
      message: 'Simulação de envio realizada com sucesso (defina RESEND_API_KEY na Vercel para envio real).',
      data: {
        to: toEmail,
        from: fromEmail,
        subject: emailSubject,
        nome,
        whatsapp: whatsappFormatted,
        tratamento,
        pagina,
        dominio,
        dataHora
      }
    });
  }

  try {
    const resendPayload = {
      from: fromEmail,
      to: [toEmail],
      subject: emailSubject,
      html: htmlContent,
      text: textContent
    };

    if (emailPaciente) {
      resendPayload.reply_to = emailPaciente;
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resendPayload)
    });

    const resendResult = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      console.error('❌ Falha na API do Resend:', resendResult);
      return res.status(502).json({
        error: 'Falha ao despachar e-mail via provedor Resend',
        details: resendResult
      });
    }

    return res.status(200).json({
      success: true,
      id: resendResult.id,
      message: 'E-mail enviado com sucesso para a clínica!'
    });
  } catch (err) {
    console.error('❌ Erro inesperado ao disparar e-mail:', err);
    return res.status(500).json({
      error: 'Erro interno ao processar envio de e-mail.',
      message: err.message
    });
  }
}
