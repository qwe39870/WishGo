import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Member from '../views/Member.vue'
import Pink from '@/views/Pink.vue'
import Register from '@/views/Register.vue'
import Product from '@/views/Product.vue'
import OAuthSuccess from '@/views/OAuthSuccess.vue'
import SearchView from '@/views/SearchView.vue'
import Order from '@/views/Order.vue'
import OrderDetail from '@/views/OrderDetail.vue'
import OrderList from '@/views/OrderList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/member',
      component: Member
    },
    {
      path: '/pink',
      name: 'Pink',
      component: Pink,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/products/:id',
      name: 'product',
      component: Product,
    },
    {
      path: '/oauth-success',
      name: 'OAuthSuccess',
      component: OAuthSuccess
    },
    {
      path: '/search',
      name: 'Search',
      component: SearchView,
    },
    {
      path: '/order',
      name: 'Order',
      component: Order,
    },
    {
      path: '/orderdetail',
      name: 'OrderDetail',
      component: OrderDetail,
    },
    {
      path: '/orderList',
      name: 'OrderList',
      component: OrderList,
    },
    // { 
    //   path: '/products/:id', 
    //   component: ProductDetail 
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
