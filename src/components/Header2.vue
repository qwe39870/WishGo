<template>
  <div
    class="relative starry-bg bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200/70 shadow-[0_4px_15px_rgba(200,182,220,0.3)] px-6 py-6 animate-fade-in-down backdrop-blur-sm">
    <div class="max-w-screen-xl mx-auto flex items-center gap-8 pl-28">

      <!-- Logo -->
      <div class="flex items-center space-x-4 min-w-[220px]">
        <img src="/image/8.png" alt="Logo"
          class="h-16 w-16 rounded-full shadow-[0_0_15px_rgba(255,192,203,0.6)] ring-4 ring-pink-300/70" />
        <div class="flex flex-col">
          <span class="text-2xl font-light text-pink-400 tracking-wide drop-shadow-[0_0_5px_rgba(255,182,193,0.7)]">
            星光商城
          </span>
          <small class="text-xs text-pink-300 tracking-wide italic select-none">
            夢幻般的購物體驗
          </small>
        </div>
      </div>

      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const keywords = ['氣炸鍋', '防曬乳', 'Switch', '行李箱', '手搖飲', '電風扇', '蘋果耳機', '吸塵器']
const ready = ref(false)

onMounted(() => {
  nextTick(() => {
    ready.value = true
  })
})
</script>

<style scoped>
@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.6s ease-out;
}

.starry-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 300%;
  background-image:
    radial-gradient(rgb(255, 213, 24) 3px, transparent 0),
    /* 小星星 */
    radial-gradient(rgb(255, 215, 54) 4px, transparent 0),
    /* 中星星 */
    radial-gradient(rgb(255, 215, 54) 6px, transparent 0);
  /* 大星星 */
  background-size:
    100px 100px,
    150px 150px,
    200px 200px;
  background-position:
    0 0,
    30px 60px,
    70px 20px;
  opacity: 0.2;
  animation: starScroll 90s linear infinite;
  z-index: 0;
}

@keyframes starScroll {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(-200px, -200px);
  }
}

/* 讓內容不被蓋住 */
.starry-bg>* {
  position: relative;
  z-index: 1;
}
</style>
