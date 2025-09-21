import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
  },
  {
    path: '/:uuid',
    name: 'menu',
    component: () => import('@/views/MenuPage.vue'),
    props: true,
  },
]

export const createAppRouter = () =>
  createRouter({
    history: createWebHistory(),
    routes,
  })

export const createMemoryRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes,
  })

const router = createAppRouter()

export default router
