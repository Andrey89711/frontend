<template>
  <div class="home-container">
    <div class="home-content">
      <h1>Добро пожаловать в Warehouse App</h1>
      <p class="subtitle">
        Система управления складом с современной аутентификацией
      </p>

      <div class="features">
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>JWT Аутентификация</h3>
          <p>Безопасная авторизация через JSON Web Tokens</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🔄</div>
          <h3>Автоматическое обновление токенов</h3>
          <p>Access токены обновляются автоматически</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>Vue 3 + Composition API</h3>
          <p>Современный фронтенд на последних технологиях</p>
        </div>
      </div>

      <div class="cta-buttons">
        <router-link to="/register" class="btn-primary">
          Зарегистрироваться
        </router-link>
        <router-link to="/login" class="btn-secondary">
          Войти в систему
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const isLoggedIn = computed(() => authStore.isLoggedIn);

// Если пользователь авторизован, перенаправляем на профиль
if (isLoggedIn.value) {
  router.push('/profile');
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.home-content {
  text-align: center;
  max-width: 800px;
  color: white;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.feature-card p {
  opacity: 0.9;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2.5rem;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  display: inline-block;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 255, 255, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>