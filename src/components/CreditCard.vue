<template>
  <!-- version1.0 -->
  <div
    v-if="visible"
    class="promo-bar gradient-bg flex items-center justify-between px-4 py-2 rounded-md max-w-6xl mx-auto mb-6 cursor-pointer select-none mt-4"
    style="position: relative; z-index: 10"
    @click="handleClick"
  >
    <div class="flex items-center gap-2 text-white font-semibold sparkle-text">
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M12 8v4l3 3"></path>
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
      <span>{{ messages[currentIndex] }}</span>
    </div>
    <button @click.stop="close" class="text-white text-lg font-bold">×</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const messages = [
  '銀行卡優惠，最高回饋10%',
  '滿千送百，限時特惠中',
  '信用卡分期0利率，快來享受',
  '新會員專屬優惠，立即註冊'
]

const currentIndex = ref(0)
const visible = ref(true)
let timer = null

const nextMessage = () => {
  currentIndex.value = (currentIndex.value + 1) % messages.length
}

const close = () => {
  visible.value = false
  clearInterval(timer)
}

onMounted(() => {
  timer = setInterval(nextMessage, 4000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const handleClick = () => {
  alert('點擊了優惠條')
}
</script>

<style scoped>
.promo-bar {
  /* 基本圓角陰影可以保留或改 */
  box-shadow: 0 4px 15px rgba(245, 158, 185, 0.6);
}

/* 漸層移動背景 */
.gradient-bg {
  background: linear-gradient(90deg, #f9a8d4, #c084fc, #a5f3fc);
  background-size: 300% 300%;
  animation: shimmer 5s linear infinite;
  color: white;
}

@keyframes shimmer {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 文字閃耀效果 */
.sparkle-text {
  text-shadow: 0 0 5px rgb(67, 67, 67)
    /* 0 0 5px #fff7ff,
    0 0 10px #f9a8d4,
    0 0 20px #c084fc,
    0 0 30px #a5f3fc;
  animation: sparkle 3s ease-in-out infinite; */
}

@keyframes sparkle {
  0%, 100% {
    text-shadow:
      0 0 5px #fff7ff,
      0 0 10px #f9a8d4,
      0 0 20px #c084fc,
      0 0 30px #a5f3fc;
  }
  50% {
    text-shadow:
      0 0 8px #fff7ff,
      0 0 15px #f9a8d4,
      0 0 25px #c084fc,
      0 0 40px #a5f3fc;
  }
}

/* 關閉按鈕 */
button {
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
}
button:hover {
  color: #f9a8d4;
}
</style>
