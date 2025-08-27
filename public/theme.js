(function () {
  const root = document.documentElement;
  const body = document.body;
  const toggleBtn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const THEME_KEY = 'theme';

  const applyInitialTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = saved === 'dark' || (!saved && prefersDark);

    if (shouldUseDark) {
      root.classList.add('dark-mode');
      icon.classList.replace('bx-sun', 'bx-moon');
    }
  };

  const toggleTheme = () => {
    body.classList.add('theme-transitioning');

    setTimeout(() => {
      const isDark = root.classList.toggle('dark-mode');
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');

      icon.classList.replace(isDark ? 'bx-sun' : 'bx-moon', isDark ? 'bx-moon' : 'bx-sun');
      body.classList.remove('theme-transitioning');
    }, 150); 
  };

  if (toggleBtn && icon) {
    toggleBtn.addEventListener('click', toggleTheme);
  }

  applyInitialTheme();
})();
