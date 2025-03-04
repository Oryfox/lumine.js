import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import CallbackView from "@/views/CallbackView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
    },
    {
      path: "/callback",
      name: "callback",
      component: CallbackView
    }
  ],
})

export default router
