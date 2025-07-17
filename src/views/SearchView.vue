<template>
  <Header />
  <Nav :isVisible="isNavVisible" />
  <Categories />
  <MegaCategoryMenu />
  <div class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100 p-6">
    <div class="max-w-4xl mx-auto backdrop-blur-md rounded-xl  p-6">
      <!-- shadow-lg bg-backColor -->
      <!-- <h2 class="text-3xl font-bold text-pink-600 mb-6 text-center">搜尋結果</h2> -->

      <div v-if="loading" class="text-center text-pink-500">讀取中...</div>

      <div v-else>
        <div v-if="results.length === 0" class="text-center text-gray-500 mt-10">
          無搜尋結果
        </div>

        <!-- 商品小卡~ -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          <div v-for="item in pagedResults" :key="item.id"
            class="relative bg-white rounded-2xl shadow-md cursor-pointer group p-4 card-hover-glow"
            @click="goDetail(item)">
            <!-- 圖片區塊 -->
            <div class="relative w-full h-40 overflow-hidden rounded-xl">
              <img v-if="item.imageIds && item.imageIds.length"
                :src="`http://localhost:7010/youbike/images/${item.imageIds[0]}`" alt="商品圖片"
                class="w-full h-full object-contain rounded-xl transition duration-300" />

              <img v-else src="/image/no-image.jpg" alt="預設圖" class="w-full h-full object-contain" />

              <!-- 按鈕區塊絕對置底，左右分開 -->
              <div
                class="absolute bottom-2 left-0 right-0 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition duration-300"
                @click.stop>
                <!-- 收藏按鈕 -->
                <button @click.stop="addFavorite(item)"
                  class="p-2 bg-white bg-opacity-80 rounded-full text-gray-500 hover:text-pink-500 hover:bg-white transition shadow"
                  aria-label="收藏">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
                    :class="{ 'text-pink-500': favoriteStore.isInFavorites(item.productId), 'text-gray-400': !favoriteStore.isInFavorites(item.productId) }"
                    fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
    4.42 3 7.5 3c1.74 0 3.41 0.81 
    4.5 2.09C13.09 3.81 14.76 3 16.5 
    3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
    6.86-8.55 11.54L12 21.35z" />
                  </svg>

                </button>

                <!-- 加入購物車按鈕 -->
                <button @click.stop="addToCart(item)"
                  class="p-2 bg-white bg-opacity-80 rounded-full text-gray-600 hover:text-pink-600 hover:bg-white transition shadow"
                  aria-label="加入購物車">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h14l-1.35 6.73a1 1 0 01-.98.77H7.73a1 1 0 
              01-.98-.8L5 6h16M16 16a2 2 0 11-4 0 2 2 0 
              014 0zm-8 0a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- 商品名稱 -->
            <h3 class="text-md font-semibold text-pink-600 group-hover:underline truncate mt-3">
              {{ item.productName }}
            </h3>

            <!-- 評價星星 -->
            <div class="flex items-center text-yellow-400 text-sm mt-1">
              <span v-for="n in 5" :key="n">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                  :class="n <= (item.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-pink-100'"
                  viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.112 3.42a1 1 0 00.95.69h3.6c.969 0 1.371 1.24.588 1.81l-2.917 2.12a1 1 0 00-.364 1.118l1.112 3.42c.3.921-.755 1.688-1.538 1.118L10 13.348l-2.917 2.12c-.783.57-1.838-.197-1.538-1.118l1.112-3.42a1 1 0 00-.364-1.118L3.376 8.847c-.783-.57-.38-1.81.588-1.81h3.6a1 1 0 00.95-.69l1.112-3.42z" />
                </svg>
              </span>
              <span class="ml-1 text-gray-500 text-xs">({{ item.reviewCount || 0 }})</span>
            </div>

            <!-- 價格 -->
            <p class="text-pink-600 font-bold text-lg mt-1">NT$ {{ item.price }}</p>
          </div>
        </div>





        <!-- 分頁 -->
        <div v-if="results.length > pageSize" class="mt-6 flex justify-center space-x-3 text-pink-600">
          <button :disabled="page === 1" @click="changePage(page - 1)"
            class="px-3 py-1 rounded-full border border-pink-400 disabled:opacity-50">
            上一頁
          </button>

          <button v-for="p in totalPages" :key="p" @click="changePage(p)" :class="[
            'px-3 py-1 rounded-full border border-pink-400',
            page === p ? 'bg-pink-600 text-white' : 'hover:bg-pink-100'
          ]">
            {{ p }}
          </button>

          <button :disabled="page === totalPages" @click="changePage(page + 1)"
            class="px-3 py-1 rounded-full border border-pink-400 disabled:opacity-50">
            下一頁
          </button>
        </div>
      </div>
    </div>
  </div>

  <Top />
  <supportChat />
  <Footer />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Header from '@/components/HomePage/Header.vue';
import Nav from './Nav.vue';
import Top from '@/components/Top.vue';
import Categories from '@/components/Categories.vue';
import axios from '@/plugins/axios.js';
import { useRoute, useRouter } from 'vue-router';
import Client from '@/components/Client.vue';
import { useUserStore } from '@/stores/user.js';
import { useCartStore } from '@/stores/cart.js';
import { useToast } from 'vue-toastification'
import { useFavoriteStore } from '@/stores/favorite.js';
import supportChat from '@/components/support-chat.vue';
import Footer from '@/components/Footer.vue';
import MegaCategoryMenu from '@/components/MegaCategoryMenu.vue';

const toast = useToast()


const userStore = useUserStore()
const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()

const route = useRoute()
const router = useRouter()
const keyword = ref(route.query.keyword || '')

const results = ref([])
const loading = ref(true)

const page = ref(1)
const pageSize = 20

const totalPages = computed(() => Math.ceil(results.value.length / pageSize))
const pagedResults = computed(() => {
  const start = (page.value - 1) * pageSize
  return results.value.slice(start, start + pageSize)
})

function goDetail(item) {
  // console.log(item.productId);
  router.push(`/products/${item.productId}`)
}

async function fetchSearchResults() {
  loading.value = true
  try {
    const res = await axios.get('/products/search', {
      params: { keyword: keyword.value }
    })
    results.value = res.data

    // 🔍 抓每個商品的平均星等
    await Promise.all(
      results.value.map(async (item) => {
        try {
          const reviewRes = await axios.get(`/reviews/product/${item.productId}`);
          console.log("???"+reviewRes.data.reviews);
          item.rating = reviewRes.data.averageRating || 0;
          item.reviewCount = reviewRes.data.reviews.length || 0
        } catch (err) {
          console.error(`取得商品 ${item.productId} 的評價失敗`, err);
          item.rating = 0;
          item.reviewCount = 0;
        }
      })
    );

  } catch (error) {
    console.error('搜尋錯誤', error)
    results.value = []
  } finally {
    loading.value = false
  }
}


watch(pagedResults, (newVal) => {
  console.log('目前分頁的資料：', newVal)
})


onMounted(() => {
  if (keyword.value.trim()) {
    fetchSearchResults()
  } else {
    loading.value = false
  }
})

// **這裡是關鍵，監聽路由變化**
watch(
  () => route.query.keyword,
  (newKeyword) => {
    keyword.value = newKeyword || ''
    if (keyword.value.trim()) {
      fetchSearchResults()
      page.value = 1
    } else {
      results.value = []
      loading.value = false
    }
  }
)

//_______________________這裡是Nav___________________________
const isNavVisible = ref(false)

function handleScroll() {
  // 只要不在頂部就顯示
  isNavVisible.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// const product = ref(null);

const quantity = ref(1)

// __________加入購物車_____________
async function addToCart(item) {
  const token = localStorage.getItem('jwt')
  const params = new URLSearchParams()
  params.append('productId', item.productId)
  params.append('quantity', quantity.value) // 注意這裡要加 .value
  // console.log(userStore.token);
  if (!userStore.token) {
    alert('請先登入會員')
    return
  }
  // console.log("商品數量:" + product.value.stockQuantity);
  // if (product.value.stockQuantity <= 0) {
  //     console.log("沒有了!!!");
  //     toast.error('商品已售罄')
  //     return
  // }

  try {
    // console.log(token);
    const res = await axios.post(
      '/cart/add',
      params,
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )


    cartStore.fetchCart()
    console.log(res.data)
    toast.success('加入購物車成功！')
    // alert(`已加入購物車：${product.value.productName} x${quantity.value}`)
  } catch (err) {
    console.error('加入購物車失敗：', err)
  }
}

// ______________加入收藏________________
async function addFavorite(item) {
  // console.log(item);
  console.log(favoriteStore.isFavorite);
  favoriteStore.fetchFavorites()
  favoriteStore.addFavorite(item.productId)
  favoriteStore.fetchFavorites()
  // toast.success('已加入收藏！')
}
</script>

<style scoped>
.bg-pinky {
  --tw-bg-opacity: 1;
  background-color: rgba(244, 114, 182, var(--tw-bg-opacity));
}



.card-hover-glow {
  transition: background 0.5s ease, filter 0.5s ease;
}

.card-hover-glow:hover {
  background: linear-gradient(90deg, #ffe9e9, #feffeb, #e7fcff);
  animation: glowAnim 3s ease-in-out infinite;
  box-shadow: 0 0 5px rgb(231, 176, 184);
  color: white;
}

@keyframes glowAnim {
  0% {
    filter: brightness(1);
  }

  50% {
    filter: brightness(1.05);
  }

  100% {
    filter: brightness(1);
  }
}
</style>