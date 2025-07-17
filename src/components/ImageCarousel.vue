<template>
    <div class="flex flex-col md:flex-row-reverse gap-4 w-full max-w-6xl mx-auto">
        <!-- 大圖 -->
        <div class="flex-1">
            <Swiper  @swiper="onMainSwiper" ref="mainSwiper" :modules="[Navigation, Thumbs, Pagination, Autoplay, EffectFade]"
                :thumbs="{ swiper: thumbsSwiper || null }" :loop="true" 
                :fade-effect="{ crossFade: true }"
                :autoplay="{ delay: 3000, disableOnInteraction: false}" 
                navigation
                :pagination="{ clickable: true }" class="w-full max-w-4xl h-[450px] rounded-lg overflow-hidden shadow-lg">



                <SwiperSlide v-for="(img, i) in images" :key="i"
                    class="cursor-pointer rounded-md overflow-hidden border-2 transition"
                    :class="thumbsSwiper?.clickedIndex === i ? 'border-pink-400' : 'border-transparent'">

                    <img :src="img" class="w-full h-full object-cover" />
                </SwiperSlide>
            </Swiper>
        </div>

        <!-- 縮圖 -->
        <div class="w-full md:w-60 flex flex-col gap-2 overflow-y-auto h-[450px]">
            <Swiper direction="vertical" :space-between="10" :slides-per-view="3" :loop="true"
                :looped-slides="images.length" @swiper="setThumbsSwiper" class="w-full h-full">
                <SwiperSlide v-for="(img, i) in images" :key="i"
                    class="cursor-pointer rounded-md overflow-hidden border border-transparent hover:border-pink-400 transition">
                    <img :src="img" class="w-full h-full object-cover" />
                </SwiperSlide>
            </Swiper>
        </div>
    </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Thumbs, Pagination, Autoplay, EffectFade } from 'swiper/modules'; // ✅ 加入 Pagination
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination'; // ✅ 加入樣式


import { ref, onMounted, watch } from 'vue';

const mainSwiper = ref(null)
const thumbsSwiper = ref(null);


function onMainSwiper(swiperInstance) {
  console.log('✅ Swiper 實體已準備好')
  mainSwiper.value = swiperInstance
  console.log('🚴‍♂️ autoplay running:', swiperInstance.autoplay?.running)

  // 保險起見可強制啟動
  swiperInstance.autoplay?.start?.()
}


// ✅ 確保 thumbsSwiper ready 後才啟動 autoplay
watch(thumbsSwiper, (val) => {
  if (val && mainSwiper.value?.swiper?.autoplay) {
    mainSwiper.value.swiper.autoplay.start()
  }
})

const setThumbsSwiper = (swiper) => {
    thumbsSwiper.value = swiper;
};

const images = [
    '/image/8.png',
    '/image/9.png',
    '/image/10.png',
    '/image/8.png',
    '/image/9.png',
    '/image/10.png'
];
</script>

<style scoped>
::v-deep(.swiper-button-prev),
::v-deep(.swiper-button-next) {
    /* 放上面那段樣式 */
    /* 漂亮圓形箭頭按鈕 */

    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #f9a8d4, #f472b6);
    /* 淡粉到深粉漸層 */
    border-radius: 9999px;
    box-shadow: 0 6px 12px rgba(244, 114, 182, 0.4);
    /* 粉色陰影 */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    opacity: 0.85;
}

/* Hover 效果 */
.swiper-button-prev:hover,
.swiper-button-next:hover {
    opacity: 1;
    transform: scale(1.1);
    box-shadow: 0 8px 16px rgba(244, 114, 182, 0.6);
}

/* 箭頭本體樣式 */
.swiper-button-prev::after,
.swiper-button-next::after {
    color: white;
    font-size: 20px;
    font-weight: bold;
}

::v-deep(.swiper-button-prev::after),
::v-deep(.swiper-button-next::after) {
    color: white;
    font-size: 20px;
    font-weight: bold;
}

::v-deep(.swiper-pagination-bullet) {
    background-color: #ffc2e4;
    /* 粉色圓點 */
    opacity: 0.7;
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    margin: 0 6px !important;
    transition: all 0.3s ease;
}

::v-deep(.swiper-pagination-bullet-active) {
    background-color: #ff5dae;
    /* 深粉長條 */
    width: 32px;
    height: 8px;
    border-radius: 9999px;
    opacity: 1;
    box-shadow: 0 0 8px rgba(236, 72, 153, 0.4);
}
</style>
