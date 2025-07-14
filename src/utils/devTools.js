/**
 * Development tools and utilities
 * Only available in development mode
 */

import { enableMockMode, disableMockMode } from '../services/mockAuth.js'

/**
 * Initialize development tools
 */
export function initDevTools() {
  // Make dev tools available globally in development
  if (process.env.NODE_ENV !== 'production') {
    window.devTools = {
      enableMockAuth: () => {
        enableMockMode()
        window.location.reload()
      },
      disableMockAuth: () => {
        disableMockMode()
        window.location.reload()
      },
      status: () => {
        const isMock = localStorage.getItem('USE_MOCK_AUTH') === 'true'
        console.log(`🔧 Development Mode: ${process.env.NODE_ENV}`)
        console.log(`🎭 Mock Auth: ${isMock ? 'ENABLED' : 'DISABLED'}`)
        if (isMock) {
          console.log('📧 Demo accounts:')
          console.log('   - demo@example.com / demo123')
          console.log('   - test@example.com / test123')
        }
      },
      help: () => {
        console.log('🛠️ Available Dev Tools:')
        console.log('   devTools.enableMockAuth()  - Enable mock authentication')
        console.log('   devTools.disableMockAuth() - Disable mock authentication')
        console.log('   devTools.status()          - Show current status')
        console.log('   devTools.help()            - Show this help')
      },
    }

    console.log('🛠️ Dev tools loaded! Type "devTools.help()" for commands')
  }
}
