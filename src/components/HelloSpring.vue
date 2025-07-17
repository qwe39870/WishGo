<template>
    
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Enter username"
          required
        />
  
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter password"
          required
        />
  
        <input
          type="checkbox"
          id="rememberMe"
          v-model="rememberMe"
        />
        <label for="rememberMe">Remember Me</label>
  
        <button type="submit">Login</button>
      </form>
  
      <button @click="handleLogout" style="margin-top: 16px;">登出</button>
  
      <div v-if="loginMessage" class="error">{{ loginMessage }}</div>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <div v-if="logoutMessage" class="info">{{ logoutMessage }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const username = ref('')
  const password = ref('')
  const rememberMe = ref(false)
  
  const loginMessage = ref('')
  const errorMessage = ref('')
  const logoutMessage = ref('')
  
  async function handleLogin() {
  loginMessage.value = ''
  errorMessage.value = ''
  logoutMessage.value = ''

  try {
    await axios.post(
      'http://localhost:7010/youbike/login',
      new URLSearchParams({
        username: username.value,
        password: password.value
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true
      }
    )
    loginMessage.value = '登入成功，歡迎回來！'
    errorMessage.value = ''
    logoutMessage.value = ''
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Invalid username or password.'
    } else {
      errorMessage.value = '登入時發生錯誤，請稍後再試。'
    }
  }
}

  
  async function handleLogout() {
    try {
      await axios.post('/logout', {}, { withCredentials: true })
      logoutMessage.value = '你已登出。'
      loginMessage.value = ''
      errorMessage.value = ''
      username.value = ''
      password.value = ''
      rememberMe.value = false
    } catch (error) {
      errorMessage.value = '登出失敗，請稍後再試。'
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    max-width: 320px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }
  
  label {
    display: block;
    margin-top: 12px;
  }
  
  input[type="text"],
  input[type="password"] {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
    box-sizing: border-box;
  }
  
  button {
    margin-top: 16px;
    width: 100%;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .error {
    color: red;
    margin-top: 12px;
  }
  
  .info {
    color: green;
    margin-top: 12px;
  }
  </style>
  