/* ─────────────────────────────────────────────────────────────────────────
   9nau Web Offer Page — main.js
   Dynamic Toggle + FAQ accordion + Contact API submission + mailto fallback
   ───────────────────────────────────────────────────────────────────────── */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── Regional Data Configuration ───────────────────────────────────────────
  const regionalData = {
    ve: {
      eyebrow: 'El venezolano sabe resolver. Pero resolver ya no basta.',
      title: 'Ahora hay que <span class="text-gradient">verse profesional</span>.',
      bannerText: 'Muchos tienen seguidores. Pocos tienen presencia profesional y control sobre su plataforma.',
      currency: 'US$',
      amount: '360',
      billing: 'Pago único · Dominio incluido',
      features: [
        '🌐 Web profesional a medida',
        '⚡ Lista y online en 48 horas',
        '💬 Integración de WhatsApp directo',
        '🛡️ Dominio propio (.com o similar) incluido',
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
    cl: {
      eyebrow: 'Esta semana · Tu negocio necesita algo más que Instagram.',
      title: 'Una web que transmite <span class="text-gradient">confianza y orden</span>.',
      bannerText: 'Hoy muchas personas buscan primero en internet antes de decidir con quién trabajar. Una buena web marca la diferencia.',
      currency: 'CLP $',
      amount: '360.000',
      billing: 'Pago único · Dominio y Hosting incluidos',
      features: [
        '🌐 Web profesional a medida',
        '⚡ Lista y online en 48 horas',
        '💬 Integración de WhatsApp directo',
        '🛡️ Dominio propio y hosting incluidos',
        '📱 Adaptada 100% a celulares',
        '🎨 Diseño moderno de alto impacto',
        '📈 SEO base para indexación en Google'
      ],
      idealFor: [
        'Emprendedores y tiendas locales',
        'Profesionales independientes',
        'Negocios en crecimiento',
        'Marcas personales que buscan destacar'
      ]
    }
  };

  let activeRegion = 've';

  // ── DOM Elements ──────────────────────────────────────────────────────────
  const switcherBtnVe = document.getElementById('switch-ve');
  const switcherBtnCl = document.getElementById('switch-cl');
  
  const heroEyebrow    = document.getElementById('hero-eyebrow');
  const heroTitle      = document.getElementById('hero-title');
  const contrastBanner = document.getElementById('contrast-banner');
  
  const priceCurrency  = document.getElementById('price-currency');
  const priceAmount    = document.getElementById('price-amount');
  const priceBilling   = document.getElementById('price-billing');
  
  const featureList    = document.getElementById('feature-list');
  const idealList      = document.getElementById('ideal-list');

  // ── Update Content with Fade Animation ─────────────────────────────────────
  function updateContent(region) {
    if (!regionalData[region]) return;
    activeRegion = region;
    const data = regionalData[region];

    // Toggle switcher active button
    switcherBtnVe.classList.toggle('active', region === 've');
    switcherBtnCl.classList.toggle('active', region === 'cl');

    // Smooth transition: fade out elements, update content, fade in
    const animElements = [heroEyebrow, heroTitle, contrastBanner, priceCurrency, priceAmount, priceBilling, featureList, idealList];
    
    animElements.forEach(el => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(8px)';
        el.style.transition = 'opacity 200ms ease, transform 200ms ease';
      }
    });

    setTimeout(() => {
      // 1. Hero text updates
      if (heroEyebrow) heroEyebrow.textContent = data.eyebrow;
      if (heroTitle) heroTitle.innerHTML = data.title;
      if (contrastBanner) contrastBanner.textContent = data.bannerText;

      // 2. Pricing updates
      if (priceCurrency) priceCurrency.textContent = data.currency;
      if (priceAmount) priceAmount.textContent = data.amount;
      if (priceBilling) priceBilling.textContent = data.billing;

      // 3. Features updates
      if (featureList) {
        featureList.innerHTML = data.features.map(feat => `
          <li class="pricing-details__item">
            <span class="pricing-details__icon">✓</span>
            <span>${feat}</span>
          </li>
        `).join('');
      }

      // 4. Ideal For list updates
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
    }, 200);
  }

  // ── Switcher Event Listeners ──────────────────────────────────────────────
  if (switcherBtnVe) switcherBtnVe.addEventListener('click', () => updateContent('ve'));
  if (switcherBtnCl) switcherBtnCl.addEventListener('click', () => updateContent('cl'));

  // Initialize with 've' (Venezuela/Global) or check if query param specifies 'cl'
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('ref') === 'cl' || urlParams.get('country') === 'cl') {
    updateContent('cl');
  } else {
    updateContent('ve');
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
      const regionLabel = activeRegion === 've' ? 'Venezuela / USD' : 'Chile / CLP';

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
            service: `Oferta Web US$360 (${regionLabel})`,
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
        const subject = encodeURIComponent(`[9nau Oferta Web] Consulta de ${name} (${regionLabel})`);
        const body = encodeURIComponent(
          `Nombre: ${name}\n` +
          `Email: ${email}\n` +
          `Oferta de origen: ${regionLabel}\n\n` +
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
