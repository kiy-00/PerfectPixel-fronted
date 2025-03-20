import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import RetouchingView from '../views/RetouchingView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import PortfolioView from '../views/PortfolioView.vue'
import RetoucherPortfolioCreateView from '../views/RetoucherPortfolioCreateView.vue'
import RetoucherPortfolioDetailView from '../views/RetoucherPortfolioDetailView.vue'
import PhotographerCertificationView from '../views/PhotographerCertificationView.vue'
import PhotographerPortfolioLinksView from '../views/PhotographerPortfolioLinksView.vue'
import PhotographerVerificationView from '../views/PhotographerVerificationView.vue'
import PhotographerPortfolioCreateView from '../views/PhotographerPortfolioCreateView.vue'

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
    {
      path: '/portfolio/retoucher/create',
      name: 'retoucher-portfolio-create',
      component: RetoucherPortfolioCreateView,
      meta: {
        requiresAuth: true,
        requiresRetoucher: true,
      },
    },
    {
      path: '/portfolio/retoucher/:id',
      name: 'retoucher-portfolio-detail',
      component: RetoucherPortfolioDetailView,
      props: true,
    },
    {
      path: '/portfolio/photographer/create',
      name: 'photographer-portfolio-create',
      component: PhotographerPortfolioCreateView,
      meta: {
        requiresAuth: true,
        requiresPhotographer: true,
      },
    },
    {
      path: '/portfolio/photographer/:id',
      name: 'photographer-portfolio-detail',
      component: () => import('../views/PhotographerPortfolioDetailView.vue'),
      props: true,
    },
    {
      path: '/photographer-certification',
      name: 'photographer-certification',
      component: PhotographerCertificationView,
      meta: { requiresAuth: true },
    },
    {
      path: '/photographer-certification/portfolio-links',
      name: 'photographer-portfolio-links',
      component: PhotographerPortfolioLinksView,
      meta: { requiresAuth: true },
    },
    {
      path: '/photographer-certification/verification',
      name: 'photographer-verification',
      component: PhotographerVerificationView,
      meta: { requiresAuth: true },
    },
    {
      path: '/retoucher-certification',
      name: 'RetoucherCertification',
      component: () => import('../views/RetoucherCertificationView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/retoucher-certification/portfolio-links',
      name: 'RetoucherPortfolioLinks',
      component: () => import('../views/RetoucherPortfolioLinksView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/retoucher-certification/verification',
      name: 'RetoucherVerification',
      component: () => import('../views/RetoucherVerificationView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/retouch-service',
      name: 'RetouchService',
      component: () => import('../views/RetouchServiceView.vue'),
    },
    {
      path: '/photography-service',
      name: 'PhotographyService',
      component: () => import('../views/PhotographyServiceView.vue'),
    },
    {
      path: '/user/:id',
      name: 'user-detail',
      component: () => import('../views/UserDetailView.vue'),
      props: true,
    },
    {
      path: '/upload-photos',
      name: 'upload-photos',
      component: () => import('../views/UploadPhotosView.vue'),
      props: (route) => ({ retoucherId: Number(route.query.retoucherId) }),
      meta: { requiresAuth: true },
    },
    {
      path: '/create-retouch-order',
      name: 'create-retouch-order',
      component: () => import('../views/CreateRetouchOrderView.vue'),
      props: (route) => ({
        retoucherId: Number(route.query.retoucherId),
        photoId: route.query.photoId,
      }),
      meta: { requiresAuth: true },
    },
    {
      path: '/create-photoshoot-order',
      name: 'create-photoshoot-order',
      component: () => import('../views/CreatePhotoshootOrderView.vue'),
      props: (route) => ({ photographerId: Number(route.query.photographerId) }),
      meta: { requiresAuth: true },
    },
    {
      path: '/retouch-order-confirm',
      name: 'retouch-order-confirm',
      component: () => import('../views/RetouchOrderConfirmView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/retouch-order/:id',
      name: 'retouch-order-detail',
      component: () => import('../views/RetouchOrderDetailView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/retouch-order-process/:id',
      name: 'retouch-order-process',
      component: () => import('../views/RetouchOrderProcessView.vue'),
      props: true,
      meta: {
        requiresAuth: true,
        requiresRetoucher: true,
      },
    },
    {
      path: '/order-success',
      name: 'order-success',
      component: () => import('../views/OrderSuccessView.vue'),
    },
    {
      path: '/my-orders',
      name: 'my-orders',
      component: () => import('../views/MyOrdersView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/photography-booking/:id',
      name: 'photography-booking-detail',
      component: () => import('../views/PhotographyBookingDetailView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
  ],
})

export default router
