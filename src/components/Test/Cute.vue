<template>
  <div>
    <!-- 彈出廣告 -->
    <transition name="fade">
      <div
        v-if="showAd"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div class="relative rounded-xl p-0 overflow-hidden max-w-sm w-full">
          <!-- 關閉按鈕 -->
          <button
            @click="closeAd"
            class="absolute top-2 right-2 text-white bg-black/40 hover:bg-black/60 rounded-full w-8 h-8 flex items-center justify-center text-lg z-10"
          >
            ×
          </button>

          <!-- GIF 廣告 -->
          <img src="https://cdn.discordapp.com/emojis/1306637899596562542.webp?size=96&animated=true" alt="限時優惠" class="w-full h-auto" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showAd = ref(false)

const closeAd = () => {
  showAd.value = false
}

onMounted(() => {
  // 可改為 window.addEventListener('click', ...) 變成點擊才跳出
  setTimeout(() => {
    showAd.value = true
  }, 500) // 3 秒後自動跳出
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
