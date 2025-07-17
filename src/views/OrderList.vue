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
        @click="toggleExpand(order.id)">
        <div class="text-sm text-pink-700 font-bold">訂單編號：{{ order.orderId }}</div>
        <div class="text-sm text-pink-500">狀態：{{ order.orderStatus }}</div>
      </div>

      <!-- 展開內容 -->
      <transition name="fade">
        <div v-if="expandedOrderId === order.id" class="p-6 space-y-4">
          <div class="text-right text-sm text-pink-400 mb-3">訂單日期：{{ order.orderDate }}</div>
          <div v-for="item in order.items" :key="item.id"
            class="flex items-center gap-4 border-b pb-4 last:border-none">
            <img :src="`http://localhost:7010/youbike/images/${item.productId}`" class="w-20 h-20 rounded-lg object-cover shadow" />
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

const orders = ref([])
const expandedOrderId = ref(null)

function toggleExpand(id) {
  expandedOrderId.value = expandedOrderId.value === id ? null : id
}

function totalAmount(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// 假資料，可用實際 API 替換
onMounted(async() => {
  try{
    const res = await axios.get('/orders/user/7')
    orders.value = res.data
  }catch(error){
    console.log(error)
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