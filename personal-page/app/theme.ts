// Runs in the document head so the saved theme is applied before first paint.
// Event delegation also keeps the control usable before React loads.
export function initializeTheme() {
  const root = document.documentElement;
  const key = 'site-theme';
  let theme = 'dark';
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch {}

  function apply() {
    root.dataset.theme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    });
    document.querySelectorAll('[data-theme-dark]').forEach((source) => {
      source.setAttribute('media', theme === 'dark' ? 'all' : 'not all');
      const image = source.parentElement?.querySelector('img');
      const path = theme === 'dark' ? source.getAttribute('srcset') : image?.getAttribute('src');
      if (path) source.closest('a')?.setAttribute('href', path);
    });
  }

  apply();
  document.addEventListener('DOMContentLoaded', apply);
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('[data-theme-toggle]')) return;
    theme = theme === 'dark' ? 'light' : 'dark';
    apply();
    try {
      localStorage.setItem(key, theme);
    } catch {}
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== key) return;
    theme = event.newValue === 'light' ? 'light' : 'dark';
    apply();
  });
  window.addEventListener('pageshow', () => {
    try {
      theme = localStorage.getItem(key) === 'light' ? 'light' : 'dark';
    } catch {}
    apply();
  });
}
