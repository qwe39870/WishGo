<template>
  <div class="bg-gradient-to-r from-purple-950 to-pink-900 text-white h-9 w-full">
    <div class="max-w-6xl mx-auto h-full flex justify-between items-center px-4">
      <!-- 左邊 -->
      <div class="flex items-center space-x-2">
        <span class="text-base font-semibold">綜合服務</span>
      </div>

      <!-- 右邊 -->
      <div class="flex items-center space-x-4">
        <button  class="shimmer-text text-lg font-bold hover:text-pink-300" @click="goHome()"><HomeIcon class="w-6 h-6 text-pink-400" /></button>
        <button class="shimmer-text text-lg font-bold hover:text-pink-300" @click="openOrder()">訂單查詢</button>
        <button class="shimmer-text text-lg font-bold hover:text-pink-300" @click="openFavorite()">收藏</button>

        <button class="shimmer-text text-lg font-bold hover:text-pink-300 relative" @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave" @click="handleClick">
          購物車
          <span v-if="useStore.isLogin && cartStore.cartItemCount > 0"
            class="absolute -right-3 bg-red-500 text-white text-xs font-bold px-1 rounded-full shadow-lg">
            {{ cartStore.cartItemCount }}
          </span>
        </button>


        <div v-if="!useStore.isLogin" class="flex items-center space-x-2">
          <button class="shimmer-text text-lg font-bold hover:text-pink-300" @click="openModal()">會員登入</button>
          <button class="shimmer-text text-lg font-bold hover:text-pink-300" @click="goRegister()">註冊</button>
        </div>
        <div v-else class="flex items-center space-x-2">
          <button @click="goMember" class="text-lg font-bold shimmer-text">{{ useStore.nickName }}</button>
          <button @click="logout" class="text-lg font-bold shimmer-text hover:text-pink-400">登出</button>
        </div>



      </div>
    </div>
  </div>



  <div
    class="relative z-30 starry-bg bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200/70 shadow-[0_4px_15px_rgba(200,182,220,0.3)] px-6 animate-fade-in-down backdrop-blur-sm">
    <div class="max-w-screen-xl mx-auto flex items-center justify-center">

      <!-- Logo -->
      <!-- <div class="flex items-center space-x-4 min-w-[220px]">
        <img src="/image/Logo.png" alt="Logo"
          class="h-16 w-16 rounded-full shadow-[0_0_15px_rgba(255,192,203,0.6)] ring-4 ring-pink-300/70" />
        <div class="flex flex-col">
          <span class="text-3xl font-light text-pink-500 tracking-wide drop-shadow-[0_0_5px_rgba(255,182,193,0.7)]">
            WishGo
            
          </span>
          <small class="text-xs text-pink-300 tracking-wide italic select-none">
            夢幻般的購物體驗
          </small>
        </div>
      </div> -->
      <div class="flex items-center space-x-4 max-h-[150px] max-w-[320px]">
        <div class="flex flex-col">
          <img src="/image/Logo.gif" alt="Logo">
        </div>
      </div>



      <!-- 搜尋欄 -->
      <div class="relative flex-1 max-w-xl ml-4">
        <div
          class="flex border border-pink-300/50 bg-white/40 rounded-full overflow-hidden shadow-md shadow-pink-200/40 focus-within:ring-4 ring-pink-400 transition backdrop-blur-sm">
          <input type="text" v-model="keyword" @input="handleInput" @keydown.down.prevent="moveSelection(1)"
            @keydown.up.prevent="moveSelection(-1)" @keydown.enter.prevent="confirmSelection"
            placeholder="搜尋商品、品牌、分類..."
            class="w-full px-4 py-2 outline-none bg-white placeholder-pink-300 text-pink-600" autocomplete="off" />
          <button @click="goSearch"
            class="bg-pink-500/60 text-white px-6 hover:bg-pink-500/80 hover:scale-110 transition transform backdrop-blur">
            🔍
          </button>
        </div>

        <!-- 建議清單改成絕對定位 -->

        <ul v-if="showSuggestions && suggestions.length > 0"
          class="absolute z-50 left-0 right-0 bg-white border border-pink-300 rounded-md mt-1 max-h-48 overflow-auto shadow-md text-pink-600"
          ref="containerRef" @mouseleave="() => { console.log('離開'); showSuggestions = false }">
          <li v-for="(item, index) in suggestions" :key="index" @mousedown.prevent="selectSuggestion(item)" :class="[
            'px-4 py-2 cursor-pointer',
            index === selectedIndex ? 'bg-pink-100 font-bold text-pink-700' : 'hover:bg-pink-100'
          ]">
            {{ item }}
          </li>

        </ul>

        <div class="mt-2 overflow-x-auto z-10">
          <Swiper :slides-per-view="'auto'" :space-between="12" :grab-cursor="true" :simulate-touch="true"
            :touch-ratio="1.5" :observer="true" :observe-parents="true" class="w-full cursor-grab">

            <SwiperSlide v-for="(keyword, i) in ['氣炸鍋', '防曬乳', 'Switch', '行李箱', '手搖飲', '電風扇', '蘋果耳機', '吸塵器']" :key="i"
              class="!w-auto">
              <button
                class="px-3 py-1 bg-gray-100/60 rounded-full hover:bg-pink-300/60 text-pink-600 text-sm whitespace-nowrap shadow-sm transition backdrop-blur-sm">
                🔥 {{ keyword }}
              </button>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <!-- 廣告圖 -->
      <div class="w-44 h-28 shrink-0 md:block">
        <img src="/image/cat.png" alt="促銷圖"
          class="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform" />
      </div>

    </div>
  </div>

  <CartSidebar ref="cartSidebarRef" @close="handleCartClose" />
  <FavoriteModal ref="favModal" />
  <PinkModal :show="showModal" @close="closeModal" @login-success="onLoginSuccess" />
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, inject } from 'vue'
import axios from '@/plugins/axios.js'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useFavoriteStore } from '@/stores/favorite'
import FavoriteModal from '../FavoriteModal.vue'
import CartSidebar from '@/components/CartPage/CartSidebar.vue';
import PinkModal from '@/components/HomePage/PinkModal.vue';
import { HomeIcon } from '@heroicons/vue/24/solid'


const showModal = ref(false)

function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

const cartSidebarRef = ref(null)


const openCart = inject('openCart')
const closeCart = inject('closeCart')
const pinCart = inject('pinCart')
const unpinCart = inject('unpinCart')


function handleMouseEnter() {
  if (!useStore.isLogin) return
  openCart()
}

function handleMouseLeave() {
  if (!useStore.isLogin) return
  closeCart() // 如果沒 pin 才會關
}

function handleClick() {
  if (!useStore.isLogin) {
    showModal.value = true
    return
  }

  openCart()
  pinCart() // 點擊後鎖定購物車不再自動關閉
}

const useStore = useUserStore()
const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()
// console.log(cartStore);


const showSwiper = ref(false)

const router = new useRouter()
const keyword = ref('');
const suggestions = ref([])
const showSuggestions = ref(true)

const containerRef = ref(null)


const selectedIndex = ref(-1)


const favModal = inject('favModal')


function goMember() {
    router.push('/member')
}

async function logout() {
    try {
        console.log("登出中");
        localStorage.removeItem("jwt"); // 如果有用 localStorage 儲存 token
        useStore.logout()
        const response = await axios.post("/logout", {}, {
            withCredentials: true, // 如果用 cookie session 要加這個
        });
        console.log("登出成功", response.data);

        // 清除登入狀態
        

        router.push("/"); // 回首頁或其他頁面
    } catch (error) {
        console.error("登出失敗", error);
    }
}

function openOrder(){
  router.push('/orderList')
}


function goHome() {
  console.log("Go Home");
  router.push('/')
}


function openFavorite() {
  if (!useStore.isLogin) {
    showModal.value = true // 彈出登入視窗
    return
  }

  if (favModal?.value?.isMinimized) {
    favModal.value.restore() // 👈 自動還原彈窗
  } else if (favModal?.value?.isOpen) {
    favModal.value.triggerShake() // 👈 已打開就晃動提示
  } else {
    favModal.value.open() // 👈 正常打開
  }
}


onMounted(() => {
  // 稍微延遲一下再顯示 Swiper
  setTimeout(() => {
    showSwiper.value = true
  }, 100) // 延遲 100ms 可解 Swiper 初始化尺寸錯誤
})

function handleInput(e) {
  selectedIndex.value = -1
  fetchSuggestions()
}

function moveSelection(step) {
  const total = suggestions.value.length
  if (total === 0) return

  selectedIndex.value += step

  if (selectedIndex.value < 0) selectedIndex.value = total - 1
  if (selectedIndex.value >= total) selectedIndex.value = 0

  keyword.value = suggestions.value[selectedIndex.value]
}

function confirmSelection() {
  if (selectedIndex.value >= 0) {
    selectSuggestion(suggestions.value[selectedIndex.value])
  } else {
    goSearch()
  }
}


async function fetchSuggestions() {
  if (keyword.value.trim() === '') {
    suggestions.value = []
    return
  }
  try {
    const res = await axios.get('/products/suggest', {
      params: { keyword: keyword.value }
    })
    suggestions.value = res.data
    showSuggestions.value = true
  } catch (error) {
    console.error(error)
  }
}

function selectSuggestion(item) {
  keyword.value = item
  suggestions.value = []
  goSearch()
}

// function goSearch() {
//   if (!keyword.value.trim()) return
//   router.push({ path: '/search', query: { keyword: keyword.value } })
// }

async function goSearch() {
  if (!keyword.value.trim()) return; // 關鍵字空字串時不動作

  try {
    // 先跳頁，帶 keyword 當 query 參數
    await router.push({ path: '/search', query: { keyword: keyword.value } });

    // 不用在這邊呼叫 API，讓 /search 頁自己用 keyword 呼叫
  } catch (error) {
    console.error(error);
  }
}



function openTest() {
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

function closeTest() {
  open.value = false
}

function goRegister() {
  router.push('/register') // 或 router.push({ name: 'Register' }) 若有設定 name
}

// 外面點一下搜尋清單關掉
function handleClickOutside(event) {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    showSuggestions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})


</script>

<style scoped>
@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.6s ease-out;
}


.starry-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0%;
  background-image:
    radial-gradient(rgb(255, 210, 8) 3px, transparent 0),
    /* 小星星 */
    radial-gradient(rgb(255, 204, 0) 4px, transparent 0),
    /* 中星星 */
    radial-gradient(rgb(255, 207, 13) 6px, transparent 0);
  /* 大星星 */
  background-size:
    100px 100px,
    150px 150px,
    200px 200px;
  background-position:
    0 0,
    30px 60px,
    70px 20px;
  opacity: 0.2;
  animation: starScroll 90s linear infinite;
  z-index: 0;
}

@keyframes starScroll {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(-200px, -200px);
  }
}

/* 讓內容不被蓋住 */
.starry-bg>* {
  position: relative;
  z-index: 1;
}

.hovering {
  transform: scale(1.05);
  filter: brightness(1.2);
}

/* 閃亮發光文字動畫 */
.shimmer-text {
  background: linear-gradient(90deg, #f058d9, #a4c4ff, #ffffff);
  background-size: 200% auto;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  animation: shimmerText 3s ease-in-out infinite;

  text-shadow:
    0 0 5px rgba(246, 254, 255, 0.5);
  /* 水藍光暈 */
  /* 0 0 1px rgba(255, 255, 255, 0.8); */
  /* 白色立體光 */
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

.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 5px rgb(253, 255, 143);
  }

  50% {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgb(255, 240, 242);
  }
}
</style>
