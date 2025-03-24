import { createRouter, createWebHistory } from 'vue-router';
// import Home from '../views/Home.vue'; // 假设你有一个Home组件

const routes = [
    // {
    //     path: '/',
    //     name: 'Home',
    //     component: Home
    // },
    // 其他路由
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;