<template>

  <div class="py-4 px-2 w-[65%] mx-auto">
    <h2 class="text-xl font-bold text-pink-600 mb-3 text-center">探索分類</h2>

    <!-- 分類選單 -->
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-0 overflow-x-auto scrollbar-hide">
      <div
        v-for="category in categories"
        :key="category.id"
        @mouseover ="selectCategory(category)"
        class="flex flex-col items-center justify-center m-1 p-3 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer hover:ring-2 hover:ring-pink-300 transition group"
      >
        <div class="w-14 h-14 bg-pink-100 flex items-center justify-center rounded-full mb-2 group-hover:bg-pink-200">
          <component
            :is="category.icon"
            class="w-6 h-6 text-pink-500 group-hover:text-pink-700"
          />
        </div>
        <p class="text-sm text-gray-700 font-medium group-hover:text-pink-600">
          {{ category.name }}
        </p>
      </div>
    </div>

    <!-- 商品顯示區塊 -->
    <div class="mt-6">
      <h3 class="text-lg font-semibold text-pink-500 mb-4 text-center">
        {{ selectedCategory.name }} 的商品
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition"
        >
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-32 object-cover rounded-md mb-2"
          />
          <p class="text-sm font-medium text-gray-800 truncate">
            {{ product.name }}
          </p>
          <p class="text-sm text-pink-500 mt-1">
            ${{ product.price }}
          </p>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup>
import { ref, computed } from 'vue'
import { defineEmits } from 'vue'

import {
  HeartIcon,
  GiftIcon,
  StarIcon,
  CakeIcon,
  SparklesIcon,
  ShoppingBagIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['select'])

const categories = [
  { id: 1, name: '人氣推薦', icon: StarIcon },
  { id: 2, name: '生日禮物', icon: CakeIcon },
  { id: 3, name: '節慶特輯', icon: GiftIcon },
  { id: 4, name: '可愛小物', icon: SparklesIcon },
  { id: 5, name: '飾品配件', icon: HeartIcon },
  { id: 6, name: '手作雜貨', icon: ShoppingBagIcon }
]

// 模擬的商品資料
const allProducts = [
  { id: 1, name: '夢幻髮圈', categoryId: 4, price: 120, image: '/image/Logo.png' },
  { id: 2, name: '星星手鍊', categoryId: 5, price: 299, image: '/image/Logo.png' },
  { id: 3, name: '禮物包裝組', categoryId: 3, price: 180, image: '/image/Logo.png' },
  { id: 4, name: '彩虹提袋', categoryId: 6, price: 260, image: '/image/Logo.png' },
  { id: 5, name: '兔兔小夜燈', categoryId: 2, price: 350, image: '/image/Logo.png' },
  { id: 6, name: '人氣香氛蠟燭', categoryId: 1, price: 220, image: '/image/Logo.png' }
]

const selectedCategory = ref(categories[0])

function selectCategory(category) {
  selectedCategory.value = category
  emit('select', category)
}

const filteredProducts = computed(() => {
  if (!selectedCategory.value) return []
  return allProducts.filter(p => p.categoryId === selectedCategory.value.id)
})
</script>

