<template>
    <nav :class="[
        'shiny-nav fixed top-0 left-0 right-0 z-30 transition-transform duration-500',
        'px-6 py-2 w-screen',
        isVisible ? 'translate-y-0' : '-translate-y-full'
    ]">
        <div class="max-w-7xl mx-auto flex justify-between items-center">

            <!-- 區塊 1：Logo -->
            <router-link to="/" class="flex items-center space-x-2 no-underline">
                <img src="/image/Logo.png" alt="logo" class="w-10 h-10 rounded-full shadow-md" />
                <h1
                    class="shimmer-text text-xl font-bold transition-all duration-300 cursor-pointer hover:!text-pink-300">
                    WishGo星願購</h1>
            </router-link>


            <!-- 區塊 2：搜尋欄 -->
            <div class="relative">
                <input type="text" placeholder="搜尋商品..."
                    class="px-4 py-2 rounded-full border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white shadow-md placeholder-pink-300 text-pink-800 transition w-44 sm:w-64" />
                <svg xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-pink-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 16l-4-4m0 0l4-4m-4 4h12" />
                </svg>
            </div>

            <!-- 區塊 3：導覽列 + 登入按鈕 -->
            <div class="flex items-center space-x-4">
                <!-- 導覽列 -->
                <ul class="hidden md:flex space-x-4 font-semibold text-pink-900">
                    <li>
                        <a href="#" @click.prevent="openOrder" class="hover:text-white transition">訂單</a>
                    </li>
                    <li>
                        <a href="#" @click.prevent="openFavoriteModal" class="hover:text-white transition">
                            收藏
                        </a>
                    </li>
                    <li @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @click="handleClick">
                        <a href="#" class="hover:text-white transition" @click.prevent="handleClick">購物車</a>
                        <span v-if="userStore.isLogin && cartStore.cartItemCount > 0"
                            class="absolute bg-red-500 text-white text-xs font-bold px-1 rounded-full shadow-lg">
                            {{ cartStore.cartItemCount }}
                        </span>
                    </li>

                    <!-- <CartSidebar ref="cartSidebarRef" /> -->



                </ul>

                <!-- 登入 / 註冊按鈕 -->
                <div v-if="!userStore.isLogin" class="flex space-x-2">
                    <button @click="showModal = true"
                        class="bg-white text-pink-600 font-semibold px-4 py-1 rounded-full hover:bg-pink-100 transition">登入</button>
                    <button @click="goRegister"
                        class="bg-pink-600 text-white px-4 py-1 rounded-full shadow hover:bg-pink-700 transition">註冊</button>
                </div>

                <!-- 已登入狀態 -->
                <div v-else class="flex space-x-2">
                    <button @click="goMember"
                        class="bg-pink-600 text-white px-4 py-1 rounded-full shadow hover:bg-pink-700 transition">
                        {{ userStore.nickName }}</button>
                    <button @click="logout"
                        class="bg-white text-pink-600 font-semibold px-4 py-1 rounded-full hover:bg-pink-100 transition">登出</button>
                </div>

            </div>

        </div>
    </nav>

    <PinkModal :show="showModal" @close="closeModal" @login-success="onLoginSuccess" />
    <FavoriteModal ref="favModal" />
</template>

<script setup>
import { ref, defineProps, onMounted, inject } from 'vue'
import PinkModal from '@/components/HomePage/PinkModal.vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios.js'
import { useUserStore } from "@/stores/user.js";
import { useCartStore } from '@/stores/cart';
import { useFavoriteStore } from '@/stores/favorite.js';
import CartSidebar from '@/components/CartPage/CartSidebar.vue';
import Swal from 'sweetalert2';
import FavoriteModal from '@/components/FavoriteModal.vue'


const favModal = inject('favModal')

function openFavoriteModal() {
    if (!userStore.isLogin) {
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



const userStore = useUserStore();
const cartStore = useCartStore();
const favoriteStore = useFavoriteStore();

function handleCartClose() {
    // cartVisible.value = false
    // isPinned.value = false  // 🔧 關閉時同步重設 isPinned

}

// const cartSidebarRef = ref(null)

// const cartVisible = ref(false)
// const isPinned = ref(false)

const openCart = inject('openCart')
const closeCart = inject('closeCart')
const pinCart = inject('pinCart')
const unpinCart = inject('unpinCart')

function handleMouseEnter() {
    if (!userStore.isLogin) return
    openCart()
}

function handleMouseLeave() {
    if (!userStore.isLogin) return
    closeCart() // 如果沒 pin 才會關
}

function handleClick() {
    if (!userStore.isLogin) {
        showModal.value = true
        return
    }

    openCart()
    pinCart() // 點擊後鎖定購物車不再自動關閉
}


const router = useRouter()

function openOrder() {
  router.push('/orderList')
}

const token = localStorage.getItem('jwt'); // 你的 jwt 存的位置
const payload = parseJwt(token);
// console.log('JWT payload:', payload);
console.log('用戶名:', userStore.token.username);
console.log('email:', userStore?.token?.sub);
console.log(userStore.token.sub);

function parseJwt(token) {

    userStore.setToken(userStore.token);
    userStore.setEmail(userStore.email);
    userStore.setLogin(userStore.isLogin);
    userStore.setNickName(userStore.nickName);
    // console.log("Token = " + token);

    if (!token) return null;
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    try {
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        userStore.setToken(JSON.parse(jsonPayload));
        userStore.setLogin(true)
        if (JSON.parse(jsonPayload).sub) {
            console.log("paload.sub有東西！");
            userStore.setEmail(JSON.parse(jsonPayload).sub);
            userStore.setNickName(JSON.parse(jsonPayload).username);

        }
        console.log(JSON.parse(jsonPayload));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}


defineProps({
    isVisible: Boolean
})


const showModal = ref(false)

function openModal() {
    showModal.value = true
}

function closeModal() {
    showModal.value = false
}


function goRegister() {
    router.push('/register') // 或 router.push({ name: 'Register' }) 若有設定 name
}

async function logout() {
    try {

        localStorage.removeItem("jwt"); // 如果有用 localStorage 儲存 token
        userStore.logout()
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


function onLoginSuccess() {
    showModal.value = false
}

function goMember() {
    router.push('/member')
}

</script>

<style scoped>
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

.shiny-nav {
    background: linear-gradient(120deg, #ffaab3, #ffbddb, #f0abfc, #ff80ab);
    background-size: 300% 300%;
    animation: shimmer-background 10s ease infinite;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2),
        0 0 30px rgba(255, 182, 193, 0.3),
        inset 0 0 10px rgba(255, 255, 255, 0.3);
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(4px);
    /* border-radius: 0 0 1rem 1rem; */
}

@keyframes shimmer-background {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>