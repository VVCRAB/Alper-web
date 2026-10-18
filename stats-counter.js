// Count each statistic once when the section enters the viewport.
(() => {
  const section = document.querySelector('.ab-stats');
  if (!section) return;
  const numbers = Array.from(section.querySelectorAll('.ab-stat-num'));
  const stats = numbers.map(element => {
    const text = element.textContent.trim();
    const match = text.match(/^(\d+)(.*)$/);
    return match ? { element, text, target: Number(match[1]), suffix: match[2] } : null;
  }).filter(Boolean);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame;
  let observer;
  const finish = () => {
    cancelAnimationFrame(frame);
    stats.forEach(stat => { stat.element.textContent = stat.text; });
  };
  // Keep the final value available to assistive technology throughout the animation.
  stats.forEach(stat => {
    const label = stat.element.nextElementSibling?.textContent.trim() || '';
    stat.element.parentElement.setAttribute('aria-label', `${stat.text} ${label}`);
    stat.element.setAttribute('aria-hidden', 'true');
    stat.element.nextElementSibling?.setAttribute('aria-hidden', 'true');
  });
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / 1600, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      stats.forEach(stat => {
        stat.element.textContent = `${Math.floor(stat.target * eased)}${stat.suffix}`;
      });
      if (progress < 1) frame = requestAnimationFrame(tick);
      else finish();
    };
    frame = requestAnimationFrame(tick);
  }, { threshold: 0.25 });
  observer.observe(section);
  reducedMotion.addEventListener('change', event => {
    if (event.matches) { observer.disconnect(); finish(); }
  });
})();
