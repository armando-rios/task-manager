import auth from '../pages/auth.js'
import dashboard from '../pages/dashboard.js'
import notFound from '../pages/notFound.js'
import verifyEmail from '../pages/verifyEmail.js'
import waitingVerification from '../pages/waitingVerification.js'
import { authGuard, guestGuard } from './guards.js'

export const routes = [
  {
    path: '/',
    component: dashboard,
    guard: authGuard,
    redirectOnFail: '/auth',
  },
  {
    path: '/auth',
    component: auth,
    guard: guestGuard,
  },
  {
    path: '/waiting-verification',
    component: waitingVerification,
  },
  {
    path: '/verify-email',
    component: verifyEmail,
  },
  {
    path: '*',
    component: notFound,
  },
]
