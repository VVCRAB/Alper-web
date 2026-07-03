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

// footer year
document.getElementById('year').textContent = new Date().getFullYear();