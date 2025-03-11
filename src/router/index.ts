import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import RetouchingView from '../views/RetouchingView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import PortfolioView from '../views/PortfolioView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: StartView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/retouch',
      name: 'retouch',
      component: RetouchingView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfileView,
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: PortfolioView,
    },
  ],
})

export default router
