import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes: [{
            path: '/',
            name: 'Home',
            component: () =>
                import ('../views/HomeView.vue')
        },
        {
            path: '/login',
            name: 'Login',
            component: () =>
                import ('../views/LoginView.vue'),
            meta: { requiresGuest: true }
        },
        {
            path: '/register',
            name: 'Register',
            component: () =>
                import ('../views/RegisterView.vue'),
            meta: { requiresGuest: true }
        },
        {
            path: '/profile',
            name: 'Profile',
            component: () =>
                import ('../views/ProfileView.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

router.beforeEach(async(to, from, next) => {
    const authStore = useAuthStore()

    // Инициализируем аутентификацию
    if (!authStore.user && localStorage.getItem('user')) {
        authStore.initializeAuth()
    }

    // Проверка на авторизацию
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Login', query: { redirect: to.fullPath } })
        return
    }

    // Проверка на гостя (если авторизован, не пускаем на логин/регистрацию)
    if (to.meta.requiresGuest && authStore.isAuthenticated) {
        next({ name: 'Profile' })
        return
    }

    next()
})

export default router