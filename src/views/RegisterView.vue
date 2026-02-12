<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Регистрация</h2>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            required
            autofocus
          />
          <div v-if="errors.username" class="error-text">
            {{ errors.username[0] }}
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
          />
          <div v-if="errors.email" class="error-text">
            {{ errors.email[0] }}
          </div>
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            required
          />
          <div v-if="errors.password" class="error-text">
            {{ errors.password[0] }}
          </div>
        </div>

        <div class="form-group">
          <label for="password2">Подтвердите пароль</label>
          <input
            type="password"
            id="password2"
            v-model="form.password2"
            required
          />
          <div v-if="passwordMismatch" class="error-text">
            Пароли не совпадают
          </div>
        </div>

        <div v-if="serverError" class="error-message">
          {{ serverError }}
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Загрузка...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <p class="auth-link">
        Уже есть аккаунт? 
        <router-link to="/login">Войти</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  username: '',
  email: '',
  password: '',
  password2: '',
});

const errors = ref({});
const serverError = ref(null);
const isLoading = ref(false);

const passwordMismatch = computed(() => {
  return form.value.password && form.value.password2 && 
         form.value.password !== form.value.password2;
});

const handleSubmit = async () => {
  errors.value = {};
  serverError.value = null;

  if (passwordMismatch.value) {
    return;
  }

  isLoading.value = true;

  const result = await authStore.register(form.value);

  isLoading.value = false;

  if (result.success) {
    // Автоматически логинимся после регистрации
    const loginResult = await authStore.login({
      username: form.value.username,
      password: form.value.password,
    });

    if (loginResult.success) {
      router.push('/profile');
    }
  } else {
    if (result.errors) {
      errors.value = result.errors;
    } else {
      serverError.value = result.error;
    }
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.auth-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  width: 100%;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #555;
}

input {
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.error-text {
  color: #c33;
  font-size: 0.85rem;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.auth-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>