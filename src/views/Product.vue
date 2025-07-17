<template>
    <Header />
    <Nav :isVisible="isNavVisible" />
    <Categories />
  
    <div v-if="product" class="flex justify-center items-center w-full">
      <div class="max-w-6xl min-h-screen py-10 px-4">
        <div
    class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 bg-gradient-to-br from-pink-100 via-white to-purple-100 rounded-2xl shadow-xl p-6 border-2 border-pink-200"
  >
    <!-- 🖼 商品圖片 -->
    <div
      class="relative w-full h-[400px] overflow-hidden group rounded-xl bg-white"
      @mousemove="handleMouseMove"
      @mouseleave="zoomVisible = false"
      ref="zoomBox"
    >
      <img :src="imageUrl" class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" />
      <div
        v-if="zoomVisible"
        class="absolute w-48 h-48 border-2 border-pink-400 rounded-lg pointer-events-none z-50"
        :style="lensStyle"
      ></div>
    </div>

    <!-- 📦 商品資訊 -->
    <div class="space-y-5 flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-center">
          <h2 class="text-3xl font-bold text-pink-600 drop-shadow">🌟 {{ product.productName }}</h2>
          <button @click="toggleFavorite" class="text-pink-400 hover:text-pink-600 text-2xl transition">
            <span v-if="isFavorite">❤️</span>
            <span v-else>🤍</span>
          </button>
        </div>

        <p class="text-xl font-semibold text-purple-700 mt-1">NT$ {{ product.price }}</p>
        <p
          :class="product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'"
          class="text-sm font-medium"
        >
          {{ product.stockQuantity > 0 ? '尚有庫存 ✨' : '已售完 😢' }}
        </p>

        <!-- 數量選擇 -->
        <div class="flex items-center gap-3 mt-4">
          <span class="text-sm font-medium text-gray-600">數量</span>
          <div class="flex items-center border rounded-md overflow-hidden">
            <button
              @click="quantity = Math.max(1, quantity - 1)"
              class="w-8 h-8 bg-pink-200 text-pink-700 hover:bg-pink-300"
            >-</button>
            <input
              type="number"
              v-model.number="quantity"
              min="1"
              :max="product.stockQuantity"
              class="w-12 text-center focus:outline-none"
            />
            <button
              @click="quantity = Math.min(product.stockQuantity, quantity + 1)"
              class="w-8 h-8 bg-pink-200 text-pink-700 hover:bg-pink-300"
            >+</button>
          </div>
        </div>
      </div>

      <!-- ✨ 操作按鈕 -->
      <div class="grid grid-cols-2 gap-4 mt-6">
        <button
          class="bg-gradient-to-tr from-pink-400 to-pink-600 hover:brightness-110 text-white py-2 rounded-xl font-semibold transition shadow-lg"
          @click="addToCart"
        >
          加入購物車
        </button>
        <button
          class="bg-gradient-to-tr from-purple-400 to-purple-600 hover:brightness-110 text-white py-2 rounded-xl font-semibold transition shadow-lg"
          @click="buyNow"
        >
          立即購買
        </button>
      </div>
    </div>
  </div>
  
        <!-- 推薦商品 -->
        <div class="max-w-6xl mx-auto mt-10">
          <h3 class="text-2xl font-bold text-pink-600 mb-2">推薦商品</h3>
          <Swiper
            :slides-per-view="1.5"
            :space-between="16"
            grab-cursor
            :breakpoints="{
              640: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 4.5 }
            }"
            class="px-1"
          >
            <SwiperSlide
              v-for="item in recommended"
              :key="item.productId"
              class="!w-60"
            >
              <div
                @click="goToProduct(item.productId)"
                class="cursor-pointer bg-white left-2 p-4 my-2 rounded-2xl shadow-md shadow-pink-100 border border-pink-200 hover:shadow-pink-300/60 hover:shadow-md transition duration-300 hover:scale-105 relative group"
              >
                <div
                  class="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-200 via-pink-100 to-violet-200 opacity-0 group-hover:opacity-100 transition duration-300 z-0 ring-1 ring-pink-300/50 group-hover:ring-4"
                ></div>
  
                <div class="relative z-10">
                  <img
                    :src="`http://localhost:7010/youbike/images/${item.productId}`"
                    alt="推薦商品"
                    class="rounded-xl h-36 w-full object-cover mb-3"
                  />
                  <p class="text-sm font-semibold text-gray-700 truncate">
                    {{ item.productName }}
                  </p>
                  <p class="text-pink-500 font-bold">NT$ {{ item.price }}</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  
    <Rate />
    <Top />
    <supportChat />
  </template>
  
  <script setup>
  import {
    ref,
    computed,
    onMounted,
    onUnmounted,
    watch,
  } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from '@/plugins/axios.js'
  import Header from '@/components/HomePage/Header.vue'
  import Nav from './Nav.vue'
  import Categories from '@/components/Categories.vue'
  import Rate from '@/components/ProductPage/Rate.vue'
  import Top from '@/components/Top.vue'
  import supportChat from '@/components/support-chat.vue'
  import { useUserStore } from '@/stores/user.js'
  import { useCartStore } from '@/stores/cart.js'
  import { useToast } from 'vue-toastification'
  
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/css'
  import 'swiper/css/free-mode'
  
  const route = useRoute()
  const router = useRouter()
  const toast = useToast()
  
  const product = ref(null)
  const recommended = ref([])
  const quantity = ref(1)
  const userStore = useUserStore()
  const cartStore = useCartStore()
  
  // 放大鏡
  const zoomBox = ref(null)
  const zoomVisible = ref(false)
  const lensStyle = ref({})

  const apiUrl = import.meta.env.VITE_API_URL
  const imageUrl = computed(() =>
    product.value?.productId
      ?  `${apiUrl}/images/${product.value.productId}`
      : ''
  )
  
  function handleMouseMove(e) {
    const box = zoomBox.value.getBoundingClientRect()
    const x = e.clientX - box.left
    const y = e.clientY - box.top
    zoomVisible.value = true
  
    const lensSize = 192
    const zoomScale = 2
  
    const posX = Math.max(0, Math.min(x, box.width))
    const posY = Math.max(0, Math.min(y, box.height))
  
    lensStyle.value = {
      left: `${posX - lensSize / 2}px`,
      top: `${posY - lensSize / 2}px`,
      backgroundImage: `url(${imageUrl.value})`,
      backgroundSize: `${box.width * zoomScale}px ${box.height * zoomScale}px`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: `-${(posX * zoomScale) - lensSize / 2}px -${(posY * zoomScale) - lensSize / 2}px`,
    }
  }
  
  const loadProduct = async (id) => {
    try {
      const res = await axios.get(`/products/${id}`)

      product.value = res.data
      console.log("Product="+product.value.productId);
  
      const recRes = await axios.get(`/products/${id}/recommendations`)
      recommended.value = recRes.data
  
      const key = 'recentlyViewed'
      const viewed = JSON.parse(localStorage.getItem(key)) || []
      const current = {
        productId: id,
        productName: res.data.productName,
        price: res.data.price,
        image: res.data.imageIds?.[0] || 'no-image.jpg'
      }
      const filtered = viewed.filter(v => v.productId !== current.productId)
      const updated = [current, ...filtered].slice(0, 10)
      localStorage.setItem(key, JSON.stringify(updated))
    } catch (error) {
      console.error('載入商品失敗', error)
    }
  }
  
  onMounted(() => {
    loadProduct(route.params.id)
  })
  
  watch(() => route.params.id, (newId) => {
    loadProduct(newId)
  })
  
  const goToProduct = (id) => {
    router.push(`/products/${id}`)
  }
  
  const addToCart = async () => {
    if (!userStore.token) {
      alert('請先登入會員')
      return
    }
    if (product.value.stockQuantity <= 0) {
      toast.error('商品已售罄')
      return
    }
  
    try {
      const params = new URLSearchParams()
      params.append('productId', product.value.productId)
      params.append('quantity', quantity.value)
  
      const res = await axios.post('/cart/add', params, {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
  
      cartStore.fetchCart()
      toast.success('加入購物車成功！')
    } catch (err) {
      console.error('加入購物車失敗：', err)
    }
  }
  
  const buyNow = () => {
    alert('跳轉到結帳流程...')
  }
  
  const isNavVisible = ref(false)
  function handleScroll() {
    isNavVisible.value = window.scrollY > 10
  }
  onMounted(() => window.addEventListener('scroll', handleScroll))
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
  </script>
  
  <style scoped></style>
  