<template>
  <div class="profile-container">
    <div class="profile-card">
      <h2>Мой профиль</h2>
      
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Загрузка...</p>
      </div>

      <div v-else-if="user" class="profile-info">
        <div class="info-item">
          <strong>ID:</strong>
          <span>{{ user.id }}</span>
        </div>
        
        <div class="info-item">
          <strong>Имя пользователя:</strong>
          <span>{{ user.username }}</span>
        </div>
        
        <div class="info-item">
          <strong>Email:</strong>
          <span>{{ user.email }}</span>
        </div>
        
        <div class="info-item">
          <strong>Имя:</strong>
          <span>{{ user.first_name || 'Не указано' }}</span>
        </div>
        
        <div class="info-item">
          <strong>Фамилия:</strong>
          <span>{{ user.last_name || 'Не указано' }}</span>
        </div>
        
        <div class="info-item">
          <strong>Дата регистрации:</strong>
          <span>{{ formatDate(user.date_joined) }}</span>
        </div>

        <div class="token-info">
          <h3>JWT Токены</h3>
          <div class="token-item">
            <strong>Access Token:</strong>
            <code>{{ accessToken }}</code>
          </div>
          <div class="token-item">
            <strong>Refresh Token:</strong>
            <code>{{ refreshToken }}</code>
          </div>
        </div>

        <button @click="handleLogout" class="btn-logout">
          Выйти из системы
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const isLoading = ref(true);
const user = computed(() => authStore.currentUser);
const accessToken = computed(() => authStore.accessToken);
const refreshToken = computed(() => authStore.refreshToken);

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const handleLogout = async () => {
  if (confirm('Вы уверены, что хотите выйти?')) {
    await authStore.logout();
    router.push('/login');
  }
};

onMounted(async () => {
  if (!user.value) {
    await authStore.fetchUserProfile();
  }
  isLoading.value = false;
});
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.profile-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.info-item strong {
  color: #555;
}

.info-item span {
  color: #333;
  font-weight: 500;
}

.token-info {
  background: #f0f4ff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.token-info h3 {
  margin: 0 0 1rem 0;
  color: #667eea;
  font-size: 1.2rem;
}

.token-item {
  margin-bottom: 1rem;
}

.token-item strong {
  display: block;
  color: #555;
  margin-bottom: 0.5rem;
}

.token-item code {
  display: block;
  background: white;
  padding: 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
  word-break: break-all;
  color: #333;
  border: 1px solid #e0e0e0;
}

.btn-logout {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;
}

.btn-logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(245, 87, 108, 0.4);
}

@media (max-width: 768px) {
  .profile-card {
    padding: 2rem;
  }
}
</style>