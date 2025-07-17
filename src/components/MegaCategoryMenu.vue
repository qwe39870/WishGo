<template>
  <div class="relative">
    <!-- ✅ 浮在上面的分類區 -->
    <div class="absolute top-12 left-[18.5%] w-[150px] z-10"
      @mouseleave="() => { isHoveringMenu = false; handleMouseLeave() }">
      <!-- 主分類 -->
      <ul class="w-full bg-purple-400 divide-y divide-purple-800 border border-purple-800 rounded-md shadow">
        <li v-for="category in categories" :key="category.id"
          @mouseenter="() => { hoveredCategoryId = category.id; isHoveringMenu = true }"
          class="px-4 py-3 text-white cursor-pointer hover:bg-purple-800 transition"
          :class="{ 'bg-pink-100 font-bold': hoveredCategoryId === category.id }">
          {{ category.name }}
        </li>
      </ul>

      <!-- 子分類浮出 -->
      <div v-if="hoveredCategoryId"
        class="absolute left-full top-0 w-[600px] min-h-full bg-white border border-l-pink-100 p-6 z-50 shadow-lg"
        @mouseenter="isHoveringMenu = true" @mouseleave="() => { isHoveringMenu = false; handleMouseLeave() }">


        <!-- 品牌與供應商 -->

        <p class="text-pink-500 font-bold mb-2">品牌</p>
        <ul class="flex flex-wrap gap-2 text-sm text-gray-600">
          <li v-for="(b, index) in brands" :key="'b' + index" class="bg-pink-100 px-2 py-1 rounded-full shadow">
            {{ b }}
          </li>
        </ul>

        <p class="text-pink-500 font-bold mt-4 mb-2">供應商</p>
        <ul class="flex flex-wrap gap-2 text-sm text-gray-600">
          <li v-for="(s, index) in suppliers" :key="'s' + index" class="bg-purple-100 px-2 py-1 rounded-full shadow">
            {{ s }}
          </li>
        </ul>
      </div>
    </div>


    <!-- ✅ 底下正常頁面內容 -->
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from '@/plugins/axios.js'
const hoveredCategoryId = ref(null)
const isHoveringMenu = ref(false)

const handleMouseLeave = () => {
  setTimeout(() => {
    if (!isHoveringMenu.value) hoveredCategoryId.value = null
  }, 100)
}

// 主分類
const categories = [
  { id: 1, name: '美妝用品' },
  { id: 2, name: '電子產品' },
  { id: 3, name: '服飾配件' },
  { id: 4, name: '文具用品' },
  { id: 5, name: '家居裝飾' }
]

// 子分類（測試資料）
const subcategories = [
  { id: 101, categoryId: 1, name: '口紅', image: 'https://placekitten.com/80/80' },
  { id: 102, categoryId: 1, name: '護手霜', image: 'https://placekitten.com/81/81' },
  { id: 201, categoryId: 2, name: '耳機', image: 'https://placekitten.com/82/82' },
  { id: 202, categoryId: 2, name: '滑鼠', image: 'https://placekitten.com/83/83' }
]

// 從後端取得的資料
const brands = ref([])
const suppliers = ref([])

// 子分類過濾
const currentSubcategories = computed(() =>
  subcategories.filter(sub => sub.categoryId === hoveredCategoryId.value)
)

// 每次滑入分類 → 取該分類的品牌與供應商
watch(hoveredCategoryId, async (newId) => {
  if (newId != null) {
    const category = categories.find(c => c.id === newId)
    if (!category) return

    try {
      const res = await axios.get(`/categories/brand-supplier/${category.name}`, {
        params: { type: category.name }
      })
      brands.value = res.data.brands
      suppliers.value = res.data.suppliers
    } catch (err) {
      console.error('❌ 無法取得品牌與供應商', err)
    }
  }
})
</script>
