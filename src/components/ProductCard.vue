<template>
    <div class="max-w-md mx-auto py-10">
        <h1 class="text-center text-2xl font-bold text-pink-600 mb-6">🌟 為你推薦</h1>

        <Swiper :modules="[EffectCards, Pagination]" effect="cards" grabCursor :pagination="{ clickable: true }"
            class="rounded-2xl shadow-lg overflow-hidden">
            <SwiperSlide v-for="product in recommended" :key="product.id">
                <div class="relative p-4 h-[400px] flex flex-col justify-between rounded-xl"
                    :class="rarityClasses[product.rarity]">
                    <!-- 🔰 稀有度角標 -->
                    <span class="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded shadow"
                        :class="rarityTagClass[product.rarity]">
                        {{ product.rarity }}
                    </span>

                    <img :src="`${apiUrl}/images/${product.productId}`" alt="商品圖" class="h-48 object-cover rounded-md shadow" />

                    <div class="mt-4">
                        <h3 class="font-semibold text-lg text-white drop-shadow">{{ product.productName }}</h3>
                        <p class="text-white drop-shadow">NT$ {{ product.price }}</p>
                    </div>

                    <div class="flex justify-between mt-4">
                        <button @click="addToFavorite(product.id)"
                            class="bg-white/80 text-pink-600 hover:bg-white px-4 py-2 rounded-lg text-sm shadow">
                            💖 收藏
                        </button>
                        <button @click="addToCart(product.id)"
                            class="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-lg text-sm shadow">
                            加入購物車
                        </button>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCards, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cards'
import 'swiper/css/pagination'
import axios from '@/plugins/axios.js'
import { ref, onMounted } from 'vue'

const apiUrl = import.meta.env.VITE_API_URL

const recommended = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('/categories/saleType/推薦商品');
    const allItems = response.data;

    // ✅ 稀有度池
    const rarityPool = ['Rare', 'SR', 'SSR'];

    // ✅ 每筆商品加上隨機稀有度
    const itemsWithRarity = allItems.map(item => ({
      ...item,
      rarity: rarityPool[Math.floor(Math.random() * rarityPool.length)]
    }));

    // ✅ 打亂順序 & 取前六筆
    recommended.value = itemsWithRarity
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    console.log(recommended.value);
  } catch (error) {
    console.error('取得商品分類失敗：', error);
  }
});





const rarityClasses = {
    Rare: 'bg-gradient-to-br from-yellow-100 to-pink-200 border-2 border-yellow-400',
    SR: 'bg-gradient-to-br from-pink-200 to-pink-400 border-2 border-pink-500',
    SSR: 'bg-gradient-to-br from-purple-300 to-pink-500 border-4 border-purple-400'
}

const rarityTagClass = {
    Rare: 'bg-yellow-400',
    SR: 'bg-pink-500',
    SSR: 'bg-purple-700'
}

function addToFavorite(id) {
    console.log('💖 加入收藏：', id)
}

function addToCart(id) {
    console.log('🛒 加入購物車：', id)
}
</script>
