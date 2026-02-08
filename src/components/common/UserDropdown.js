import cD from '../../utils/createDocument.js';
import { handleLogout } from '../../controllers/authController.js';

const ARROW_DOWN =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>';
const ARROW_UP =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>';
const ICON_SETTINGS = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
const ICON_LOGOUT = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`;
const ICON_LOADING = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"></path></svg>`;

export function UserDropdown({ user, direction = 'down' }) {
  const userData = user || {};
  const avatarInitial = userData?.name ? userData.name.charAt(0).toUpperCase() : '?';

  const container = cD({
    tagName: 'div',
    styles: 'relative',
  });

  const userButton = cD({
    tagName: 'button',
    styles:
      'flex items-center gap-2 text-theme-text-0 hover:bg-theme-surface-2 px-2 py-1 rounded-md transition-colors',
  });

  const avatarCircle = cD({
    tagName: 'div',
    styles:
      'w-8 h-8 rounded-full bg-theme-primary flex items-center justify-center text-theme-surface-0 font-semibold text-sm',
    textContent: avatarInitial,
  });

  const arrowDown = cD({
    tagName: 'span',
    styles: 'text-xs pointer-events-none',
    innerHTML: ARROW_DOWN,
  });

  userButton.append(avatarCircle, arrowDown);

  const dropdownStyles =
    direction === 'up'
      ? 'hidden absolute right-0 bottom-full mb-2 w-56 bg-theme-surface-0 border border-theme-surface-3 rounded-md shadow-lg z-50'
      : 'hidden absolute right-0 mt-2 w-56 bg-theme-surface-0 border border-theme-surface-3 rounded-md shadow-lg z-50';

  const dropdown = cD({
    tagName: 'div',
    styles: dropdownStyles,
  });

  const dropdownHeader = cD({
    tagName: 'div',
    styles: 'px-4 py-3 border-b border-theme-surface-3',
  });

  const dropdownUserInfo = cD({
    tagName: 'div',
    styles: 'flex items-center gap-3',
  });

  const dropdownAvatar = cD({
    tagName: 'div',
    styles:
      'w-10 h-10 rounded-full bg-theme-primary flex items-center justify-center text-theme-surface-0 font-semibold text-lg',
    textContent: avatarInitial,
  });

  const dropdownUserName = cD({
    tagName: 'div',
    styles: 'text-theme-text-0 font-medium truncate max-w-[140px]',
    textContent: userData?.name || 'User',
  });

  dropdownUserInfo.append(dropdownAvatar, dropdownUserName);
  dropdownHeader.append(dropdownUserInfo);

  const dropdownOptions = cD({
    tagName: 'div',
    styles: 'py-1',
  });

  const settingsOption = cD({
    tagName: 'button',
    styles:
      'w-full px-4 py-2 text-left text-theme-text-0 hover:bg-theme-surface-2 flex items-center gap-3 transition-colors',
  });
  settingsOption.innerHTML = `${ICON_SETTINGS}<span>Ajustes</span>`;

  const logoutOption = cD({
    tagName: 'button',
    styles:
      'w-full px-4 py-2 text-left text-theme-text-0 hover:bg-theme-surface-2 flex items-center gap-3 transition-colors',
  });
  logoutOption.innerHTML = `${ICON_LOGOUT}<span>Cerrar sesión</span>`;

  let isDropdownOpen = false;
  let isLoggingOut = false;

  userButton.addEventListener('click', e => {
    e.stopPropagation();
    isDropdownOpen = !isDropdownOpen;
    dropdown.classList.toggle('hidden', !isDropdownOpen);
    arrowDown.innerHTML = isDropdownOpen ? ARROW_UP : ARROW_DOWN;
  });

  logoutOption.addEventListener('click', async e => {
    e.stopPropagation();
    if (isLoggingOut) return;
    isLoggingOut = true;
    logoutOption.innerHTML = `${ICON_LOADING}<span>Cerrando...</span>`;
    try {
      await handleLogout();
    } finally {
      isLoggingOut = false;
    }
  });

  document.addEventListener('click', e => {
    if (!container.contains(e.target)) {
      isDropdownOpen = false;
      dropdown.classList.add('hidden');
      arrowDown.innerHTML = ARROW_DOWN;
    }
  });

  dropdownOptions.append(settingsOption, logoutOption);
  dropdown.append(dropdownHeader, dropdownOptions);
  container.append(userButton, dropdown);

  return {
    element: container,
    closeDropdown: () => {
      if (isDropdownOpen) {
        isDropdownOpen = false;
        dropdown.classList.add('hidden');
        arrowDown.innerHTML = ARROW_DOWN;
      }
    },
  };
}
