<template>
  <div
    class="bg-gradient-to-r from-purple-950 to-pink-900 text-white text-sm py-2 px-4 h-12 z-10 flex items-center justify-center gap-6">

    <!-- 中間排一排按鈕 -->


    <!-- <button class="shimmer-text text-2xl font-bold transition-all duration-300 cursor-pointer" @click="openTest()">
      🛒 購物車
    </button> -->

    <button class="shimmer-text text-xl font-bold transition-all duration-300 cursor-pointer hover:!text-pink-300"
      style="position: relative; z-index: 10" @click="openTest()">
      | 購物車
    </button>
    <button class="shimmer-text text-xl font-bold transition-all duration-300 cursor-pointer hover:!text-pink-300"
      style="position: relative; z-index: 10" @click="openTest()">
      | 訂單查詢
    </button>
    <button class="shimmer-text text-xl font-bold transition-all duration-300 cursor-pointer hover:!text-pink-300"
      style="position: relative; z-index: 10" @click="openTest()">
      | 會員登入
    </button>
    <button class="shimmer-text text-xl font-bold transition-all duration-300 cursor-pointer hover:!text-pink-300"
      style="position: relative; z-index: 10" @click="openTest()">
      | 註冊
    </button>
  </div>


  <div
    class="relative starry-bg bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200/70 shadow-[0_4px_15px_rgba(200,182,220,0.3)] px-6 py-6 animate-fade-in-down backdrop-blur-sm">
    <div class="max-w-screen-xl mx-auto flex items-center gap-8 justify-center">

      <!-- Logo -->
      <div class="flex items-center space-x-4 min-w-[220px]">
        <img src="/image/dream3.png" alt="Logo"
          class="h-16 w-16 rounded-full shadow-[0_0_15px_rgba(255,192,203,0.6)] ring-4 ring-pink-300/70" />
        <div class="flex flex-col">
          <span class="text-3xl font-light text-purple-400 tracking-wide drop-shadow-[0_0_5px_rgba(255,182,193,0.7)]">
            星光商城
          </span>
          <small class="text-xs text-purple-400 tracking-wide italic select-none">
            夢幻般的購物體驗
          </small>
        </div>
      </div>

      <!-- 搜尋欄 -->
      <div class="flex-1 max-w-xl">
        <div
          class="flex border border-pink-300/50 bg-white/40 rounded-full overflow-hidden shadow-md shadow-pink-200/40 focus-within:ring-4 ring-pink-300/50 transition backdrop-blur-sm">
          <input type="text" placeholder="搜尋商品、品牌、分類..."
            class="w-full px-4 py-2 outline-none bg-transparent placeholder-pink-300 text-pink-600" />
          <button
            class="bg-pink-300/60 text-white px-6 hover:bg-pink-400/80 hover:scale-110 transition transform backdrop-blur">
            🔍
          </button>
        </div>
        <div class="mt-2 overflow-x-auto z-10">
          <Swiper :slides-per-view="'auto'" :space-between="12" :grab-cursor="true" :simulate-touch="true"
            :touch-ratio="1.5" :observer="true" :observe-parents="true" class="w-full cursor-grab">

            <SwiperSlide v-for="(keyword, i) in ['氣炸鍋', '防曬乳', 'Switch', '行李箱', '手搖飲', '電風扇', '蘋果耳機', '吸塵器']" :key="i"
              class="!w-auto">
              <button
                class="px-3 py-1 bg-gray-100/60 rounded-full hover:bg-pink-300/60 text-pink-600 text-sm whitespace-nowrap shadow-sm transition backdrop-blur-sm">
                🔥 {{ keyword }}
              </button>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <!-- 廣告圖 -->
      <div class="w-44 h-24 shrink-0 hidden md:block">
        <img src="/image/dream1.png" alt="促銷圖"
          class="w-full h-full object-cover rounded-lg shadow-[0_0_15px_rgba(255,192,203,0.7)] hover:scale-105 transition-transform" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import Swal from 'sweetalert2'

import { ref, onMounted } from 'vue'

const showSwiper = ref(false)


onMounted(() => {
  // 稍微延遲一下再顯示 Swiper
  setTimeout(() => {
    showSwiper.value = true
  }, 100) // 延遲 100ms 可解 Swiper 初始化尺寸錯誤
})

function openTest() {
  Swal.fire({
    title: '🔮 魔法提醒',
    html: '<p style="font-weight:bold;">你的魔法值已回復！</p>',
    icon: 'info',
    background: '#fff0f0',
    showConfirmButton: true,
    confirmButtonText: '好耶！',
    // confirmButtonColor: '#a78bfa', // 紫色系
    iconColor: '#f9a8d4', // 粉紅 icon

    // 自訂 class，加上玻璃特效
    customClass: {
      popup: 'glass-alert',
    }
  })
}

function closeTest() {
  open.value = false
}


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
    radial-gradient(rgb(255, 210, 8) 3px, transparent 0),
    /* 小星星 */
    radial-gradient(rgb(255, 204, 0) 4px, transparent 0),
    /* 中星星 */
    radial-gradient(rgb(255, 207, 13) 6px, transparent 0);
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

.hovering {
  transform: scale(1.05);
  filter: brightness(1.2);
}

/* 閃亮發光文字動畫 */
.shimmer-text {
  background: linear-gradient(90deg, #f058d9, #a4c4ff, #ffffff);
  background-size: 200% auto;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  animation: shimmerText 3s ease-in-out infinite;

  text-shadow:
    0 0 5px rgba(246, 254, 255, 0.5);
  /* 水藍光暈 */
  /* 0 0 1px rgba(255, 255, 255, 0.8); */
  /* 白色立體光 */
}

@keyframes shimmerText {
  0% {
    background-position: 0% center;
  }

  50% {
    background-position: 100% center;
  }

  100% {
    background-position: 0% center;
  }
}
</style>
