<template>
    <section class="max-w-7xl mx-auto mt-10 px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 限時搶購 -->
            <div class="bg-gradient-to-r from-pink-100 via-pink-200 to-pink-100 rounded-xl">
                <div
                    class="p-[4px] rounded-xl bg-gradient-to-r from-purple-950 via-purple-400 to-pink-900 shadow-md hover:shadow-lg transition-transform transform">
                    <div class="bg-pink-200 h-full w-auto rounded-xl">
                        <!-- 深色提醒條 -->
                        <div
                            class="bg-gradient-to-r from-purple-950 to-pink-900 text-white text-sm py-2 px-4 flex items-center justify-between h-12 rounded-t-md">
                            <h2 class="text-2xl font-bold text-center text-pink-600 shimmer-text">限時搶購</h2>
                            <span>結束倒數：<span class="font-mono text-pink-300">{{ countdown }}</span></span>
                        </div>

                        <div class="max-w-6xl mx-auto px-4 py-4">
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div v-for="(item, i) in productCategories" :key="i"
                                    class="relative group bg-white bg-opacity-80 backdrop-blur-md p-3 rounded-lg overflow-hidden shadow-pink transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-gradient">

                                    <img :src="`${apiUrl}/images/${item.productId}`" alt="product"
                                        class="w-full h-28 object-cover rounded mb-1" />

                                    <h3 class="text-base font-semibold text-pink-700 truncate">{{ item.productName }}</h3>
                                    <div class="flex items-center gap-2 mt-1 text-sm">
                                        <p class="text-pink-500 text-xs line-through">${{ item.original }}</p>
                                        <p class="text-pink-600 text-lg font-bold">${{ item.price }}</p>
                                    </div>


                                    <button
                                        class="mt-2 w-full gradient-btn text-white py-1.5 rounded-full text-sm font-semibold"
                                        @click="goProduct(item.productId)">
                                        ✨ 立即搶購
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- 今日熱銷（暫時用相同商品展示） -->
            <div class="bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 rounded-xl">
                <div
                    class="p-[4px] rounded-xl bg-gradient-to-r from-yellow-500 via-yellow-300 to-pink-300 shadow-md hover:shadow-lg transition-transform transform">
                    <div class="bg-white h-full w-auto rounded-xl">
                        <!-- 標題 -->
                        <div
                            class="bg-gradient-to-r from-yellow-200 to-pink-300 text-white text-sm py-2 px-4 flex items-center justify-between h-12 rounded-t-md">
                            <h2 class="text-2xl font-bold text-yellow-800 shimmer-text">今日熱銷</h2>
                            <span class="text-yellow-100 text-sm italic">根據實時銷售統計</span>
                        </div>

                        <div class="max-w-6xl mx-auto px-4 py-4">
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div v-for="(item, i) in productToday" :key="i"
                                    class="relative group bg-white bg-opacity-80 backdrop-blur-md p-3 rounded-lg overflow-hidden shadow-pink transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-gradient">

                                    <img :src="`${apiUrl}/images/${item.productId}`" alt="product"
                                        class="w-full h-28 object-cover rounded mb-1" />

                                    <h3 class="text-base font-semibold text-pink-700 truncate">{{ item.productName }}</h3>
                                    <div class="flex items-center gap-2 mt-1 text-sm">
                                        <p class="text-pink-500 text-xs line-through">${{ item.original }}</p>
                                        <p class="text-pink-600 text-lg font-bold">${{ item.price }}</p>
                                    </div>


                                    <button
                                        class="mt-2 w-full gradient-btn text-white py-1.5 rounded-full text-sm font-semibold"
                                        @click="goProduct(item.productId)">
                                        ✨ 立即搶購
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import axios from '@/plugins/axios.js';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const apiUrl = import.meta.env.VITE_API_URL
const router = new useRouter()

function goProduct(id) {
  router.push(`/products/${id}`).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }) // 👈 平滑滾動到頂部
  })
}

const productCategories = ref([]);
const productToday = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('/categories/saleType/限時搶購');
    const allItems = response.data;

    // ✅ 隨機打亂並取前六筆
    productCategories.value = allItems
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    console.log(productCategories.value);
  } catch (error) {
    console.error('取得商品分類失敗：', error);
  }
});

onMounted(async () => {
  try {
    const response = await axios.get('/categories/saleType/今日熱銷');
    const allItems = response.data;

    // ✅ 隨機打亂並取前六筆
    productToday.value = allItems
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    console.log(productToday.value);
  } catch (error) {
    console.error('取得商品分類失敗：', error);
  }
});


const products = [
    {
        name: '粉紅獨角獸拖鞋',
        image: '/image/Logo.png',
        original: 890,
        price: 399
    },
    {
        name: '夢幻星星燈串',
        image: '/image/Logo.png',
        original: 690,
        price: 299
    },
    {
        name: '閃亮喵咪耳機',
        image: '/image/Logo.png',
        original: 1290,
        price: 599
    },
    {
        name: '粉紅獨角獸拖鞋',
        image: '/image/Logo.png',
        original: 890,
        price: 399
    },
    {
        name: '夢幻星星燈串',
        image: '/image/Logo.png',
        original: 690,
        price: 299
    },
    {
        name: '閃亮喵咪耳機',
        image: '/image/Logo.png',
        original: 1290,
        price: 599
    }

]

const countdown = ref('')
let endTime = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 小時後

function updateCountdown() {
    const now = new Date()
    const diff = endTime - now

    if (diff <= 0) {
        countdown.value = '00:00:00'
        return
    }

    const h = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, '0')
    const m = String(Math.floor(diff / 1000 / 60) % 60).padStart(2, '0')
    const s = String(Math.floor(diff / 1000) % 60).padStart(2, '0')
    countdown.value = `${h}:${m}:${s}`
}

onMounted(() => {
    updateCountdown()
    setInterval(updateCountdown, 1000)
})
</script>

<style scoped>
.shadow-pink {
    box-shadow: 0 10px 20px rgba(255, 192, 203, 0.4);
}

/* 漸層邊框 + 光暈 */
.border-gradient {
    position: relative;
    border-radius: 1rem;
    z-index: 0;
}

.border-gradient::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #fbcfe8, #a5f3fc, #c084fc);
    border-radius: inherit;
    z-index: -1;
    filter: blur(4px);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 2px;
}

/* 漸層按鈕 + hover 閃亮亮 */
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

/* 漸層動畫 */
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

/* 陰影粉色 */
.shadow-pink {
    box-shadow: 0 10px 20px rgba(255, 192, 203, 0.4);
}

/* 閃亮發光文字動畫 */
.shimmer-text {
    background: linear-gradient(90deg, #f472b6, #c084fc, #f9a8d4);
    background-size: 200% auto;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    animation: shimmerText 3s ease-in-out infinite;
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
