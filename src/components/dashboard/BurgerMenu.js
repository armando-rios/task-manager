import cD from '../../utils/createDocument.js';

export const BurgerMenu = () => {
  const burgerMenu = cD({
    tagName: 'button',
    styles: 'sm:hidden',
  });

  burgerMenu.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-theme-text-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  `;

  burgerMenu.addEventListener('click', () => {
    const sidebar = document.querySelector('main > div');
    if (sidebar) {
      sidebar.classList.toggle('max-sm:-translate-x-full');
    }
  });

  return burgerMenu;
};
