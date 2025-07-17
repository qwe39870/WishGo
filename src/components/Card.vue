<template>
    <div class="relative max-w-6xl bg-gradient-to-r from-pink-200 via-purple-200 to-cyan-100 shadow-inner mx-auto mt-8">
        <div class="flex flex-row items-stretch gap-4">
            <!-- 👈 左側固定：優惠總覽卡片 -->
            <div class="w-44 shrink-0 h-full bg-pink-900 py-6 flex flex-col justify-between items-center text-center">
                <div class="text-white text-lg font-bold">銀行、電子支付<br>優惠總覽</div>
                <button class="gradient-btn text-white px-4 py-2 rounded-full text-sm">
                    查看全部
                </button>
            </div>

            <!-- 👉 右側 Swiper -->
            <div class="flex-1 overflow-hidden max-w-full py-4 z-10">
                <Swiper :modules="[Navigation, Pagination]" :slides-per-view="2.2" :space-between="20" :breakpoints="{
                    768: { slidesPerView: 3.5 },
                    1024: { slidesPerView: 4.5 }
                }" navigation class="coupon-swiper">
                    <SwiperSlide v-for="(coupon, index) in coupons" :key="index">
                        <div
                            class="relative mt-2 mb-2 p-[2px] rounded-xl bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-300 shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
                            <div
                                class="bg-white/80 backdrop-blur-md rounded-xl p-4 h-full flex flex-row items-center gap-4">
                                <!-- LOGO 在左 -->
                                <img :src="coupon.logo" alt="bank logo"
                                    class="w-12 h-12 object-contain rounded-md" />

                                <!-- 文字在右 -->
                                <div class="flex flex-col justify-center">
                                    <div class="text-pink-600 font-semibold text-base">{{ coupon.bank }}</div>
                                    <div class="text-gray-700 text-sm mt-1">{{ coupon.offer }}</div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>

                </Swiper>
            </div>

        </div>
    </div>
</template>




<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// const coupons = [
//     { bank: '玉山銀行', offer: '滿3000折300' },
//     { bank: '台新銀行', offer: '最高回饋6%' },
//     { bank: 'LINE Pay', offer: '筆筆享5%點數回饋' },
//     { bank: '街口支付', offer: '滿1000送200' },
//     { bank: '永豐銀行', offer: '3期0利率＋折100' },
// ];

const coupons = [
    { bank: '玉山銀行', offer: '滿3000折300', logo: 'https://fs-a.ecimg.tw/img/h24/v2/layout/bank/index/index/0683b1be118d7e683b1be118dc3ecman2/6_0_20250612153309.png' },
    { bank: '台新銀行', offer: '最高回饋6%', logo: 'https://fs-a.ecimg.tw/img/h24/v2/layout/bank/index/index/0683b1be118d7e683b1be118dc3ecman2/7_0_20250612153310.png' },
    { bank: 'LINE Pay', offer: '享5%點數回饋', logo: 'https://fs-a.ecimg.tw/img/h24/v2/layout/bank/index/index/0683b1be118d7e683b1be118dc3ecman2/8_0_20250612153310.png' },
    { bank: '街口支付', offer: '滿1000送200', logo: 'https://fs-a.ecimg.tw/img/h24/v2/layout/bank/index/index/0683b1be118d7e683b1be118dc3ecman2/10_0_20250612153310.png' },
    { bank: '永豐銀行', offer: '3期0利率', logo: 'https://fs-a.ecimg.tw/img/h24/v2/layout/bank/index/index/0683b1be118d7e683b1be118dc3ecman2/5_0_20250612153309.png' },
];
</script>

<style scoped>
/* 自訂漸層框線效果 */
.gradient-border-box {
    border: 2px solid transparent;
    background-image: linear-gradient(white, white), linear-gradient(90deg, #f9a8d4, #c084fc, #a5f3fc);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    box-shadow: 0 6px 12px rgba(255, 192, 203, 0.3);
}

::v-deep(.swiper-button-prev),
::v-deep(.swiper-button-next) {
  /* 放上面那段樣式 */
  /* 漂亮圓形箭頭按鈕 */

  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #f9a8d4, #f472b6); /* 淡粉到深粉漸層 */
  border-radius: 50%;
  box-shadow: 0 6px 12px rgba(244, 114, 182, 0.4); /* 粉色陰影 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0.85;
  
}



::v-deep(.swiper-button-prev::after),
::v-deep(.swiper-button-next::after) {
  color: white;
  font-size: 20px;
  font-weight: bold;
}




/* 再次使用你的亮晶晶漸層按鈕 */
.gradient-btn {
    background: linear-gradient(90deg, #f9a8d4, #c084fc, #a5f3fc);
    background-size: 300% 300%;
    animation: shimmer 5s linear infinite;
    box-shadow: 0 4px 15px rgba(245, 158, 185, 0.6);
    transition: all 0.3s ease-in-out;
}

.gradient-btn:hover {
    box-shadow: 0 0 5px rgb(255, 202, 202), 0 0 20px rgba(226, 179, 179, 0.678);
    transform: scale(1.05);
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
</style>