<template>
    <!-- ...頁面內容... -->

    <!-- 🟣 懸浮快捷列 -->
    <div class="fixed left-[12.5%] top-1/2 -translate-y-1/2 flex flex-col space-y-1 z-40">
        <!-- 限時搶購 -->
        <div class="relative mx-auto" @mouseenter="openSale" @mouseleave="closeSale">
            <button
                class="shiny-btn mb-1 w-14 h-14 rounded-full bg-gradient-to-tr from-pink-300 to-purple-200 text-white shadow-lg hover:scale-105 transition shiny-bounce"
                @click="showLimitedOffer = true">
                推薦
            </button>
            <!-- <div v-show="showSale" class="absolute z-40 left-16 -translate-y-1/2 w-[80vw] max-w-3xl">
                <Sale />
            </div> -->
        </div>


        <!-- 瀏覽紀錄 -->
        <div v-if="recentlyViewed.length > 0" class="relative group border border-pink-300 overflow-hidden rounded-t">
            <h3 class="text-white font-bold text-sm bg-gradient-to-tr from-pink-300 to-purple-300 p-1 rounded-t">最近瀏覽
            </h3>

            <div v-if="recentlyViewed.length === 0" class="text-gray-400 text-sm text-center py-4">
                還沒有任何瀏覽紀錄
            </div>

            <div v-for="item in recentlyViewed.slice(0, 3)" :key="item.productId"
                class="flex items-center p-1 bg-white cursor-pointer border hover:bg-purple-100 transition"
                @click="goDetail(item)">
                <img :src="`${apiUrl}/images/${item.productId}`"
                    class="w-12 h-12 object-contain rounded mx-auto" alt="商品圖" />

            </div>
        </div>

        <!-- 回到頂部 -->
        <div class="relative group">
            <button class="top-btn mt-1 mx-auto" @click="scrollToTop">
                ▲<br />
                <span class="text-md">TOP</span>
            </button>
        </div>

    </div>

    <!-- 彈出視窗（你可用 Modal 組件代替） -->
    <div v-if="showLimitedOffer" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button class="absolute top-2 right-2 text-gray-500" @click="showLimitedOffer = false">✖</button>
            <h2 class="text-lg font-bold text-pink-500 mb-2">限時優惠🔥</h2>
            <p>搶購中商品列表...</p>
        </div>
    </div>


</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sale from './Sale.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const recentlyViewed = ref([])

onMounted(() => {
    const key = 'recentlyViewed'
    recentlyViewed.value = JSON.parse(localStorage.getItem(key)) || []
})

function goDetail(item) {
    window.open(`/products/${item.productId}`, '_blank')
}

const apiUrl = import.meta.env.VITE_API_URL

const showLimitedOffer = ref(false)
const showHistory = ref(false)

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const showSale = ref(false)

let hideTimeout = null

function openSale() {
    clearTimeout(hideTimeout)
    showSale.value = true
}

function closeSale() {
    hideTimeout = setTimeout(() => {
        showSale.value = false
    }, 200) // 500ms 後才關閉
}
</script>

<style scoped>
@keyframes glitter {

    0%,
    100% {
        box-shadow:
            0 0 8px rgba(255, 255, 255, 0.6),
            0 0 15px rgba(255, 192, 203, 0.8),
            inset 0 0 6px rgba(255, 255, 255, 0.4);
    }

    50% {
        box-shadow:
            0 0 12px rgba(255, 255, 255, 0.8),
            0 0 25px rgba(255, 182, 193, 1),
            inset 0 0 10px rgba(255, 255, 255, 0.6);
    }
}

.shiny-btn {
    animation: glitter 2.8s infinite ease-in-out;
    transition: all 0.3s ease;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    /* border: 1px solid rgba(255, 255, 255, 0.3); */
}

@keyframes shinyBounce {

    0%,
    100% {
        transform: translateY(0);
        box-shadow: 0 0 8px #fce3f0, 0 0 12px #ffdcee;
    }

    50% {
        transform: translateY(-8px);
        box-shadow: 0 0 16px #ffddf0, 0 0 24px #eea9ff;
    }
}

.shiny-bounce {
    animation: shinyBounce 2s infinite ease-in-out;
}

.top-btn {
    width: 56px;
    height: 56px;
    border-radius: 9999px;
    background: linear-gradient(to top right, #f9a8d4, #d8b4fe);
    /* 粉紅到紫色漸層 */
    color: white;
    font-weight: bold;
    font-size: 14px;
    line-height: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.1),
        0 4px 12px rgba(236, 72, 153, 0.3);
    transition: transform 0.2s ease;
}

.top-btn:hover {
    transform: translateY(-3px) scale(1.05);
}
</style>