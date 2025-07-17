<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Nav from './Nav.vue'
import Swal from 'sweetalert2'
import ImageCarousel from '@/components/ImageCarousel.vue'
import Top from '@/components/Top.vue'
import Header from '@/components/HomePage/Header.vue'
import Categories from '@/components/Categories.vue'
import CreditCard from '@/components/HomePage/CreditCard.vue'
import Discount from '@/components/HomePage/Discount.vue'
import Card from '@/components/HomePage/Card.vue'
import Client from '@/components/Client.vue'
import Test from '@/components/Test/Test.vue'
import supportChat from '@/components/support-chat.vue'
import CategorySelector from '@/components/CategorySelector.vue'
import Footer from '@/components/Footer.vue'
import ProductCard from '@/components/ProductCard.vue'
import Sale from '@/components/Sale.vue'

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





// 彈出玻璃感通知
function showMagicGlassAlert() {
  Swal.fire({
    title: '🔮 魔法提醒',
    html: '<p style="font-weight:bold;">你的魔法值已回復！</p>',
    icon: 'info',
    background: '#fff0f0',
    showConfirmButton: true,
    confirmButtonText: '好耶！',
    // confirmButtonColor: '#a78bfa', // 紫色系
    iconColor: '#f9a8d4', // 粉紅 icon

    // 自訂 class，加上玻璃特效
    customClass: {
      popup: 'glass-alert',
    }
  })
}

</script>

<template>

  <Header />
  <Nav :isVisible="isNavVisible" />
  <Top />
  <Categories />
  <CreditCard />


  <!-- <Sale /> -->
  <ImageCarousel />
  <!-- <ImageCarousel />
  <ImageCarousel />
  <ImageCarousel /> -->


  <Sale />
  <ProductCard />
  <CategorySelector />
  <Card />
  <Discount />



  <!-- <Client /> -->
  <supportChat />

  <Footer />

  <!-- <Test />
   -->

  <!-- 這是網頁一載入的廣告 -->
  <!-- <Cute /> -->

  <!-- <button class="px-4 py-2 bg-purple-300 text-white rounded-xl shadow-md" @click="showMagicGlassAlert">
    打開魔法通知 ✨
  </button> -->

  <!-- <button @click="openLogin">會員中心</button>
  <button @click="openLogin">購物車</button>
  <button @click="openLogin">收藏</button>
  <a @click="mem()">收藏</a>

  <button @click="openModal()" class="bg-pinky hover:bg-pink-500 text-white px-4 py-2 rounded shadow">
        開啟夢幻 Modal
  </button>
  <PinkModal :show="showModal" @close="closeModal" /> -->

  <!-- 
  <LoginModal :show="showLogin" @close="closeLogin" /> -->
</template>

<style>
body {
  /* background-color: #fff0f0; */
  background: linear-gradient(to bottom, #fff0f0, #e8f7ff, #fce7f3);

}
</style>
