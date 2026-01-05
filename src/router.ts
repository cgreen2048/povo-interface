import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import PlansPage from './components/PlansPage.vue';
import RegistrationPage from './components/RegistrationPage.vue';
import HomePage from './components/HomePage.vue';
import SearchPage from './components/SearchPage.vue';
import SchedulePage from './components/SchedulePage.vue';
import TestPage from './components/TestPage.vue';

const routes = [
    {
        path: '/',
        component: HomePage,
        name: 'Home'
    },
    {
        path: '/plans',
        component: PlansPage,
        name: 'Plans'
    },
    {
        path: '/registration',
        component: RegistrationPage,
        name: 'Registration'
    },
    {
        path: '/search',
        component: SearchPage,
        name: 'Search'
    },
    {
        path: '/schedule',
        component: SchedulePage,
        name: 'Schedule'
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router