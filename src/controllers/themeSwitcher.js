export function initThemeSwitcher() {
  const savedTheme = localStorage.getItem('selected-theme') || 'catppuccin';

  [
    'catppuccin',
    'kanagawa',
    'tokyo-night',
    'gruvbox',
    'nord',
    'dracula',
    'everforest',
    'solarized',
  ].forEach(theme => {
    document.body.classList.remove(theme);
  });

  document.body.classList.add(savedTheme);

  document.querySelectorAll('[data-theme]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      const themeName = e.currentTarget.dataset.theme;

      [
        'catppuccin',
        'kanagawa',
        'tokyo-night',
        'gruvbox',
        'nord',
        'dracula',
        'everforest',
        'solarized',
      ].forEach(theme => {
        document.body.classList.remove(theme);
      });

      document.body.classList.add(themeName);
      localStorage.setItem('selected-theme', themeName);

      document.getElementById('current-theme-name').textContent = e.currentTarget.textContent;

      document
        .querySelectorAll('[data-theme]')
        .forEach(el => el.classList.remove('bg-theme-surface-2'));
      e.currentTarget.classList.add('bg-theme-surface-2');

      const dropdown = document.querySelector('#theme-dropdown > div');
      if (dropdown) dropdown.classList.add('hidden');
    });
  });

  const dropdownButton = document.querySelector('#theme-dropdown > button');
  if (dropdownButton) {
    dropdownButton.addEventListener('click', () => {
      const menu = document.querySelector('#theme-dropdown > div');
      menu.classList.toggle('hidden');
    });
  }

  document.addEventListener('click', e => {
    const dropdown = document.getElementById('theme-dropdown');
    if (dropdown && !dropdown.contains(e.target)) {
      const menu = document.querySelector('#theme-dropdown > div');
      if (menu) menu.classList.add('hidden');
    }
  });
}
