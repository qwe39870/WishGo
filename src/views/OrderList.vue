<template>
  <Header />
  <categories />
  <div class="max-w-4xl mx-auto py-10 px-4 min-h-screen">
    <h2 class="text-2xl font-bold text-pink-600 mb-6">🧁 我的訂單</h2>

    <div v-if="orders.length === 0" class="text-center text-gray-500">目前沒有訂單喔～</div>

    <div v-for="order in orders" :key="order.id"
      class="mb-4 border rounded-xl shadow bg-white/70 backdrop-blur-md transition-all duration-300">
      <!-- 摘要區 -->
      <div class="flex justify-between items-center bg-pink-100 px-6 py-4 rounded-xl cursor-pointer"
        @click="toggleExpand(order.orderId)">
        <div class="text-sm text-pink-700 font-bold">訂單編號：{{ order.orderId }}</div>
        <div class="text-sm"
          :class="order.orderStatus === 'COMPLETED' ? 'text-green-600 font-semibold' : 'text-pink-500'">
          {{ order.orderStatus === 'COMPLETED' ? '已付款' : order.orderStatus }}
        </div>
      </div>

      <!-- 展開內容 -->
      <transition name="fade">
        <div v-if="expandedOrderId === order.orderId" class="p-6 space-y-4">
          <div class="text-right text-sm text-pink-400 mb-3">訂單日期：{{ order.formattedDate }}</div>
          <div v-for="item in order.items" :key="item.id"
            class="flex items-center gap-4 border-b pb-4 last:border-none">
            <img :src="`${apiUrl}/images/${item.productId}`" class="w-20 h-20 rounded-lg object-cover shadow" />
            <div class="flex-1">
              <h3 class="font-semibold text-pink-700">{{ item.productName }}</h3>
              <p class="text-sm text-gray-600">單價：NT$ {{ item.price }} × {{ item.quantity }}</p>
            </div>
            <div class="text-pink-600 font-bold">NT$ {{ item.price * item.quantity }}</div>
          </div>

          <div class="text-right font-bold text-pink-800 mt-4">
            總金額：NT$ {{ totalAmount(order.items) }}
          </div>
        </div>
      </transition>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '@/components/HomePage/Header.vue'
import Categories from '@/components/Categories.vue'
import Footer from '@/components/Footer.vue'
import axios from '@/plugins/axios.js'
import { useUserStore } from '@/stores/user'
import { jwtDecode } from 'jwt-decode'

const apiUrl = import.meta.env.VITE_API_URL

const userStore = useUserStore()
let decoded = null
if (userStore.token) {
  try {
    decoded = jwtDecode(userStore.token)
  } catch (err) {
    console.error("JWT 解碼失敗：", err)
  }
}

const orders = ref([])
const expandedOrderId = ref(null)

function toggleExpand(id) {
  expandedOrderId.value = expandedOrderId.value === id ? null : id
}

function totalAmount(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}


// 假資料，可用實際 API 替換
const formatted = ref([])

onMounted(async () => {
  try {
    const res = await axios.get(`/orders/user/${decoded.userId}`)

    // 對每一筆訂單加入格式化日期欄位
    orders.value = res.data.map(orderList => {
      const date = new Date(orderList.orderDate)
      const formattedDate = date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
      return {
        ...orderList,
        formattedDate // ✅ 新增欄位
      }
    })

    console.log(orders.value)
  } catch (error) {
    console.log('取得訂單失敗：', error)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0.95);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: 1000px;
  transform: scaleY(1);
}
</style>