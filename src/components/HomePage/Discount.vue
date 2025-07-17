<template>
    <section class="coupon-area starry-bg py-12 px-4 max-w-6xl mx-auto animate-fade-in scroll-fade">
        <h2 class="text-3xl font-bold text-center text-pink-300 mb-8">
            ✨ 限時折價券專區 ✨
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(coupon, i) in coupons" :key="i"
                class="coupon-card relative p-5 rounded-2xl shadow-xl overflow-hidden starry-bg transition"
                :class="coupon.claimed ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-105'">
                <div class="relative z-10">
                    <h3 class="text-xl font-bold text-pink-600 mb-2">
                        {{ coupon.title }}
                    </h3>
                    <p class="text-gray-700 mb-4">{{ coupon.description }}</p>
                    <button class="gradient-btn text-white font-semibold px-4 py-2 rounded-full" @click="claimCoupon(i)"
                        :disabled="coupon.claimed">
                        {{ coupon.claimed ? '已領取' : '領取折價券' }}
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';

const coupons = ref([
    { title: '滿千折百', description: '全館消費滿 NT$1000 折 NT$100', claimed: false },
    { title: '新會員限定', description: '註冊即享 NT$50 折價券', claimed: false },
    { title: '夢幻美妝 9 折', description: '指定美妝品牌享九折優惠', claimed: false }
]);

const claimCoupon = (index) => {
    if (!coupons.value[index].claimed) {
        coupons.value[index].claimed = true;
    }
};
</script>

<style scoped>
.coupon-area {
    background: linear-gradient(180deg, #432e6afb, #7b475c);
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 6px 16px rgba(173, 216, 230, 0.3);
    border: 6px solid #b17ab1;
    /* 👈 柔和藍邊框 */
    margin-top: 2rem;
    position: relative;
    z-index: 1;
}


.coupon-card {
    background: linear-gradient(135deg, #ffe4f0, #fdf4ff);
    /* 柔和粉嫩 */
    box-shadow: 10px 10px 15px rgba(255, 192, 203, 0.3),
        /* 陰影小一些 */
        inset 0 0 6px rgba(255, 182, 193, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid rgba(255, 182, 193, 0.3);
    /* 增加柔邊 */
}

.coupon-card:hover {
    transform: translateY(-3px) scale(1.015);
    box-shadow: 15 15px 20px rgba(255, 182, 193, 0.4);
    /* 略微浮起 */
}


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

/* ✨ 星星背景 */
.starry-bg::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
        radial-gradient(rgb(255, 210, 8) 3px, transparent 0),
        radial-gradient(rgb(255, 204, 0) 4px, transparent 0),
        radial-gradient(rgb(255, 207, 13) 6px, transparent 0);
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

.starry-bg>* {
    position: relative;
    z-index: 1;
}

/* ✨ 滾動動畫（scroll-fade） */
.scroll-fade {
    opacity: 0;
    transform: translateY(50px);
    animation: fadeInUp 1s ease-out forwards;
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>