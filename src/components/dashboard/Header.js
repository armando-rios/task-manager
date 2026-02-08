import cD from '../../utils/createDocument.js';
import { BurgerMenu } from './BurgerMenu.js';
import { UserDropdown } from '../common/UserDropdown.js';

export const Header = user => {
  const header = cD({
    tagName: 'header',
    styles:
      'bg-theme-surface-0 border-b border-theme-surface-3 px-8 h-16 flex-shrink-0 flex justify-between items-center',
  });

  const title = cD({
    tagName: 'h1',
    styles: 'text-2xl font-bold text-theme-primary',
    textContent: 'Task Manager',
  });

  const userSection = cD({
    tagName: 'div',
    styles: 'relative max-sm:hidden',
  });

  const userDropdown = UserDropdown({ user, direction: 'down' });
  userSection.append(userDropdown.element);

  const burgerMenu = BurgerMenu();

  header.append(title, burgerMenu, userSection);

  return header;
};
