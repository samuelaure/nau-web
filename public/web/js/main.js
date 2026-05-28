/* ─────────────────────────────────────────────────────────────────────────
   9nau Web Offer Page — main.js
   Dynamic Currency Toggle + FAQ accordion + Contact API submission + mailto fallback
   ───────────────────────────────────────────────────────────────────────── */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── Currency Data Configuration ──────────────────────────────────────────
  const currencyData = {
    usd: {
      currency: 'US$',
      amount: '360',
      billing: 'Pago único · Dominio y Hosting incluidos',
      features: [
        '🌐 Web profesional a medida',
        '⚡ Lista y online en 48 horas',
        '💬 Integración de WhatsApp directo',
        '🛡️ Dominio y hosting incluidos',
        '📱 Adaptada 100% a celulares',
        '🎨 Diseño moderno de alto impacto',
        '📈 SEO base para indexación en Google'
      ],
      idealFor: [
        'Captar clientes internacionales',
        'Vender servicios profesionales',
        'Monetizar una audiencia propia',
        'Construir una marca seria y confiable'
      ]
    },
    clp: {
      currency: 'CLP $',
      amount: '360.000',
      billing: 'Pago único · Dominio y Hosting incluidos',
      features: [
        '🌐 Web profesional a medida',
        '⚡ Lista y online en 48 horas',
        '💬 Integración de WhatsApp directo',
        '🛡️ Dominio y hosting incluidos',
        '📱 Adaptada 100% a celulares',
        '🎨 Diseño moderno de alto impacto',
        '📈 SEO base para indexación en Google'
      ],
      idealFor: [
        'Emprendedores y marcas locales',
        'Profesionales independientes',
        'Negocios y servicios locales',
        'Marcas personales que buscan destacar'
      ]
    }
  };

  let activeCurrency = 'usd';

  // ── DOM Elements ──────────────────────────────────────────────────────────
  const switcherBtnUsd = document.getElementById('switch-usd');
  const switcherBtnClp = document.getElementById('switch-clp');
  
  const priceCurrency  = document.getElementById('price-currency');
  const priceAmount    = document.getElementById('price-amount');
  const priceBilling   = document.getElementById('price-billing');
  
  const featureList    = document.getElementById('feature-list');
  const idealList      = document.getElementById('ideal-list');

  // ── Update Content with Fade Animation ─────────────────────────────────────
  function updateContent(curr) {
    if (!currencyData[curr]) return;
    activeCurrency = curr;
    const data = currencyData[curr];

    // Toggle switcher active button
    if (switcherBtnUsd) switcherBtnUsd.classList.toggle('active', curr === 'usd');
    if (switcherBtnClp) switcherBtnClp.classList.toggle('active', curr === 'clp');

    // Smooth transition: fade out elements, update content, fade in
    const animElements = [priceCurrency, priceAmount, priceBilling, featureList, idealList];
    
    animElements.forEach(el => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(6px)';
        el.style.transition = 'opacity 180ms ease, transform 180ms ease';
      }
    });

    setTimeout(() => {
      // 1. Pricing updates
      if (priceCurrency) priceCurrency.textContent = data.currency;
      if (priceAmount) priceAmount.textContent = data.amount;
      if (priceBilling) priceBilling.textContent = data.billing;

      // 2. Features updates
      if (featureList) {
        featureList.innerHTML = data.features.map(feat => `
          <li class="pricing-details__item">
            <span class="pricing-details__icon">✓</span>
            <span>${feat}</span>
          </li>
        `).join('');
      }

      // 3. Ideal For list updates
      if (idealList) {
        idealList.innerHTML = data.idealFor.map(item => `
          <li class="pricing-details__item">
            <span class="pricing-details__icon" style="color: var(--c-accent);">◈</span>
            <span>${item}</span>
          </li>
        `).join('');
      }

      // Fade back in
      animElements.forEach(el => {
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
    }, 180);
  }

  // ── Switcher Event Listeners ──────────────────────────────────────────────
  if (switcherBtnUsd) switcherBtnUsd.addEventListener('click', () => updateContent('usd'));
  if (switcherBtnClp) switcherBtnClp.addEventListener('click', () => updateContent('clp'));

  // Initialize with 'usd' or check if query param specifies 'clp'
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref') || urlParams.get('currency');
  if (ref === 'clp' || ref === 'cl') {
    updateContent('clp');
  } else {
    updateContent('usd');
  }

  // ── FAQ Accordion Toggle ──────────────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all items
      faqItems.forEach(i => i.classList.remove('open'));
      
      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // ── Toast Notification Helper ─────────────────────────────────────────────
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message, type = 'success') {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast toast--${type} show`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // ── Contact Form API Post with Mailto Fallback ───────────────────────────
  const form = document.getElementById('offer-contact-form');
  const submitBtn = document.getElementById('form-submit-btn');

  if (form && submitBtn) {
    const btnText = submitBtn.querySelector('.btn__text') || submitBtn;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.elements['name'].value.trim();
      const email = form.elements['email'].value.trim();
      const message = form.elements['message'].value.trim();
      const currencyLabel = activeCurrency === 'usd' ? 'USD ($360)' : 'CLP ($360.000)';

      // Validation
      if (!name || !email || !message) {
        showToast('Por favor, completa todos los campos obligatorios.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Por favor, introduce una dirección de correo válida.', 'error');
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Enviando consulta…';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            service: `Oferta Web ${currencyLabel}`,
            message: message
          }),
        });

        if (response.ok) {
          showToast('¡Consulta recibida! Samuel te responderá vía Telegram/Email en menos de 24h. 🎉', 'success');
          form.reset();
        } else {
          throw new Error('Server returned error status');
        }
      } catch (err) {
        console.warn('API submission failed, falling back to mailto:', err);
        
        // Mailto fallback
        const subject = encodeURIComponent(`[9nau Oferta Web] Consulta de ${name} (${currencyLabel})`);
        const body = encodeURIComponent(
          `Nombre: ${name}\n` +
          `Email: ${email}\n` +
          `Moneda de interés: ${currencyLabel}\n\n` +
          `Mensaje:\n${message}`
        );
        window.location.href = `mailto:hola@9nau.com?subject=${subject}&body=${body}`;
        showToast('Abriendo cliente de correo para enviar mensaje…', 'success');
      } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Enviar Consulta';
      }
    });
  }
});
