import { handleLogout } from '../../controllers/authController.js';
import cD from '../../utils/createDocument.js';

export const Logout = () => {
  const logout = cD({
    tagName: 'button',
    styles:
      'px-4 py-1 bg-theme-surface-2 text-sm text-theme-text-0 rounded-md hover:bg-theme-surface-3 transition-colors',
    textContent: 'Logout',
  });
  logout.addEventListener('click', handleLogout);

  return logout;
};
