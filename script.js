// Shrink header on scroll
const header = document.querySelector('.site-header');

if (header) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Contact form handling 
const form = document.getElementById('contact-form');

if (form) {
  const result = document.getElementById('form-result');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Block submission if the captcha hasn't been completed
    const captchaField = form.querySelector('textarea[name="h-captcha-response"]');
    if (!captchaField || !captchaField.value) {
      result.textContent = 'Please complete the CAPTCHA before submitting.';
      result.className = 'form-result error';
      return;
    }

    result.textContent = 'Sending...';
    result.className = 'form-result';

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          result.textContent = "Thanks! Your message has been sent.";
          result.classList.add('success');
          form.reset();
        } else {
          result.textContent = data.message || 'Something went wrong. Please try again.';
          result.classList.add('error');
        }
      })
      .catch(() => {
        result.textContent = 'Something went wrong. Please check your connection and try again.';
        result.classList.add('error');
      });
  });
}

// Active nav link
const navLinks = document.querySelectorAll('.navigation > ul > li > a');
navLinks.forEach(link => {
    if (link.pathname === window.location.pathname) {
        link.classList.add('active');
    }
});

// footer year
const year = document.getElementById('year'); if(year) year.textContent = new Date().getFullYear();
const photoDialog=document.querySelector('.alper-lightbox');document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();const img=photoDialog.querySelector('img');img.src=button.dataset.photo;img.alt=button.querySelector('img').alt;photoDialog.showModal();}));photoDialog?.querySelector('button').addEventListener('click',()=>photoDialog.close());photoDialog?.addEventListener('click',e=>{if(e.target===photoDialog)photoDialog.close();});

// Accessible mobile navigation; desktop service dropdown remains available.
const menuButton=document.querySelector('.alper-menu');const mobileNav=document.querySelector('#alper-nav');
function closeMenu(returnFocus=false){menuButton?.setAttribute('aria-expanded','false');mobileNav?.classList.remove('is-open');if(returnFocus)menuButton?.focus();}
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));mobileNav.classList.toggle('is-open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuButton?.getAttribute('aria-expanded')==='true')closeMenu(true);});
mobileNav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
matchMedia('(min-width: 801px)').addEventListener('change',()=>closeMenu());

// Progressive enhancement: visible content remains available without motion or JS.

// No mailing-list backend is configured: never display a false success.
document.querySelectorAll('.newsletter-form').forEach(form=>{const status=document.createElement('p');status.className='newsletter-status';status.setAttribute('role','status');form.append(status);form.addEventListener('submit',event=>{event.preventDefault();status.textContent='La suscripción en línea aún no está disponible. Escríbanos a alperpowerservices@gmail.com para solicitar novedades.';});});

// Animate only on entry: content is never permanently hidden while waiting.
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const revealTargets=document.querySelectorAll('.split-inner,.service-detail-inner,.markets-inner>h2,.market-item,.cert-item,.alper-purpose-grid article,.alper-values li,.ab-story-inner,.ab-why-card,.ab-cert-card,.ab-area-inner,.cta-banner-inner,.ab-cta-inner,.contact-info');
let scrollObserver;
function configureReveals(){scrollObserver?.disconnect();revealTargets.forEach(el=>el.classList.remove('scroll-arrival'));if(motionPreference.matches||!('IntersectionObserver' in window))return;scrollObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){if(entry.target.getBoundingClientRect().top>0&&!entry.target.contains(document.activeElement))entry.target.classList.add('scroll-arrival');scrollObserver.unobserve(entry.target);}});},{threshold:0,rootMargin:'0px 0px -24px 0px'});revealTargets.forEach(el=>scrollObserver.observe(el));}
configureReveals();motionPreference.addEventListener('change',configureReveals);
document.addEventListener('focusin',e=>e.target.closest('.scroll-arrival')?.classList.remove('scroll-arrival'));
