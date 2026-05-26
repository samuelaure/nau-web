/* ─────────────────────────────────────────────────────────────────────────
   9nau — main.js
   Nav scroll + mobile menu + scroll reveal + contact form + footer year
   ───────────────────────────────────────────────────────────────────────── */

'use strict';

// ── Footer year ────────────────────────────────────────────────────────────
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Nav: add .scrolled class on scroll ─────────────────────────────────────
const nav = document.getElementById('nav');
function handleNavScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ── Mobile burger menu ──────────────────────────────────────────────────────
const burger    = document.getElementById('nav-burger');
const navLinks  = document.getElementById('nav-links');

burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ── Scroll reveal (IntersectionObserver) ───────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // Stagger siblings within the same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.is-visible)'));
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

// ── Toast helper ────────────────────────────────────────────────────────────
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast toast--${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ── Contact form (mailto fallback) ──────────────────────────────────────────
const form         = document.getElementById('contact-form');
const submitBtn    = document.getElementById('contact-submit');
const btnText      = submitBtn.querySelector('.btn__text');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = form.elements['name'].value.trim();
  const email   = form.elements['email'].value.trim();
  const service = form.elements['service'].value;
  const message = form.elements['message'].value.trim();

  // Basic client-side validation
  if (!name || !email || !message) {
    showToast('Por favor, completa todos los campos requeridos.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Por favor, introduce un email válido.', 'error');
    return;
  }

  // Show loading state
  submitBtn.disabled  = true;
  btnText.textContent = 'Enviando…';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, service, message }),
    });

    if (response.ok) {
      showToast('¡Mensaje enviado! Te respondemos en menos de 24h. 🎉');
      form.reset();
    } else {
      throw new Error('server error');
    }
  } catch {
    // Fallback to mailto
    const subject  = encodeURIComponent(`[9nau] Contacto de ${name}`);
    const body     = encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\nServicio: ${service || 'No especificado'}\n\n${message}`
    );
    window.location.href = `mailto:hola@9nau.com?subject=${subject}&body=${body}`;
    showToast('Abriendo tu cliente de correo…', 'success');
  } finally {
    submitBtn.disabled  = false;
    btnText.textContent = 'Enviar mensaje';
  }
});

// ── Smooth active nav highlight on scroll ──────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));
