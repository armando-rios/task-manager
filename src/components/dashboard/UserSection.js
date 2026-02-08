import cD from '../../utils/createDocument.js';
import { UserDropdown } from '../common/UserDropdown.js';

export function UserSection(user) {
  const userData = user || {};

  const userSection = cD({
    tagName: 'div',
    styles: 'sm:hidden py-4 flex-shrink-0',
  });

  const userDropdown = UserDropdown({ user: userData, direction: 'up' });

  userSection.append(userDropdown.element);

  return {
    element: userSection,
  };
}
