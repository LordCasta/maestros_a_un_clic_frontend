import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import ClientLayout from '@/layouts/ClientLayout.vue'
import ProfessionalLayout from '@/layouts/ProfessionalLayout.vue'

// Public Views
import Home from '@/views/public/Home.vue'
import ProfessionalDetail from '@/views/public/ProfessionalDetail.vue'
import SearchResults from '@/views/public/SearchResults.vue'

// Auth Views
import Login from '@/views/auth/Login.vue'
import RegisterClient from '@/views/auth/RegisterClient.vue'
import RegisterProfessional from '@/views/auth/RegisterProfessional.vue'

// Client Views (placeholder for now)
const ClientDashboard = () => import('@/views/client/Dashboard.vue')
const MyBookings = () => import('@/views/client/MyBookings.vue')
const BookingDetail = () => import('@/views/client/BookingDetail.vue')
const MyFavorites = () => import('@/views/client/MyFavorites.vue')

// Professional Views (placeholder for now)
const ProfessionalDashboard = () => import('@/views/professional/Dashboard.vue')
const MyServices = () => import('@/views/professional/MyServices.vue')
const Availability = () => import('@/views/professional/Availability.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: Home,
          meta: { hideNavbar: true, showSidebar: false },
        },
        {
          path: 'professional/:id',
          name: 'ProfessionalDetail',
          component: ProfessionalDetail,
        },
        {
          path: 'search',
          name: 'SearchResults',
          component: SearchResults,
        },
      ],
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'Login',
          component: Login,
          meta: { layout: 'auth' },
        },
        {
          path: '/register/client',
          name: 'RegisterClient',
          component: RegisterClient,
          meta: { layout: 'auth' },
        },
        {
          path: '/register/professional',
          name: 'RegisterProfessional',
          component: RegisterProfessional,
          meta: { layout: 'auth' },
        },
      ],
    },
    {
      path: '/login',
      component: AuthLayout,
      children: [
        {
          path: '',
          component: Login,
        },
      ],
    },
    {
      path: '/register/client',
      component: AuthLayout,
      children: [
        {
          path: '',
          component: RegisterClient,
        },
      ],
    },
    {
      path: '/register/professional',
      component: AuthLayout,
      children: [
        {
          path: '',
          component: RegisterProfessional,
        },
      ],
    },
    {
      path: '/client',
      component: ClientLayout,
      meta: { requiresAuth: true, role: 'client' },
      children: [
        {
          path: 'dashboard',
          name: 'ClientDashboard',
          component: ClientDashboard,
        },
        {
          path: 'bookings',
          name: 'MyBookings',
          component: MyBookings,
        },
        {
          path: 'bookings/:id',
          name: 'BookingDetail',
          component: BookingDetail,
        },
        {
          path: 'favorites',
          name: 'MyFavorites',
          component: MyFavorites,
        },
      ],
    },
    {
      path: '/professional',
      component: ProfessionalLayout,
      meta: { requiresAuth: true, role: 'professional' },
      children: [
        {
          path: 'dashboard',
          name: 'ProfessionalDashboard',
          component: ProfessionalDashboard,
        },
        {
          path: 'services',
          name: 'MyServices',
          component: MyServices,
        },
        {
          path: 'availability',
          name: 'Availability',
          component: Availability,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// Navigation guard for authenticated routes
router.beforeEach((to, from) => {
  // TODO: Implement authentication logic
  // const isAuthenticated = localStorage.getItem('token')
  // if (to.meta.requiresAuth && !isAuthenticated) {
  //   return { path: '/login' }
  // }
  return true
})

export default router
