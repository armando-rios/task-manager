import cD from '../../utils/createDocument.js';

/**
 * Creates auth tabs component for switching between login and register
 * @param {Function} onTabChange - Callback when tab is changed, receives 'login' or 'register'
 * @returns {Object} Object containing tabs container and methods
 */
export function AuthTabs(onTabChange) {
  const tabsContainer = cD({
    tagName: 'div',
    styles: 'flex border-b border-theme-surface-3 mb-6',
  });

  const activeStyles = 'border-b-2 border-theme-primary font-semibold';
  const inactiveStyles = 'border-b-2 border-transparent text-theme-text-1 hover:text-theme-text-0';

  const loginTab = cD({
    tagName: 'button',
    styles: `flex-1 py-2 px-4 text-center ${activeStyles}`,
    textContent: 'Login',
    type: 'button',
  });

  const registerTab = cD({
    tagName: 'button',
    styles: `flex-1 py-2 px-4 text-center ${inactiveStyles}`,
    textContent: 'Register',
    type: 'button',
  });

  let currentTab = 'login';

  /**
   * Sets the active tab
   * @param {string} tab - 'login' or 'register'
   */
  function setActiveTab(tab) {
    currentTab = tab;

    if (tab === 'login') {
      loginTab.className = `flex-1 py-2 px-4 text-center ${activeStyles}`;
      registerTab.className = `flex-1 py-2 px-4 text-center ${inactiveStyles}`;
    } else {
      loginTab.className = `flex-1 py-2 px-4 text-center ${inactiveStyles}`;
      registerTab.className = `flex-1 py-2 px-4 text-center ${activeStyles}`;
    }

    if (onTabChange) {
      onTabChange(tab);
    }
  }

  loginTab.addEventListener('click', () => setActiveTab('login'));
  registerTab.addEventListener('click', () => setActiveTab('register'));

  tabsContainer.append(loginTab, registerTab);

  return {
    container: tabsContainer,
    setActiveTab,
    getCurrentTab: () => currentTab,
  };
}
