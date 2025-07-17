<!-- views/OAuthSuccess.vue -->
<template>
    <div>登入成功，正在跳轉...</div>
  </template>
  
  <script>
  export default {
    mounted() {
      const token = new URLSearchParams(window.location.search).get('token');
      if (token) {
        localStorage.setItem('jwt', token);
        this.$router.push('/'); // 或你想導向的頁面
      } else {
        this.$router.push('/login'); // 沒有 token 就回登入
      }
    }
  };
  </script>
  